import { Injectable, signal, computed } from '@angular/core';

// Catmon evolution lines (see CLAUDE.md)
export const EVOLUTION_LINES: Record<string, string[]> = {
  NarMon: ['NarMon', 'RutoMon', 'KuramaMon'],
  KirMon: ['KirMon', 'IneMon', 'AmaterosaMon'],
  ShikaMon: ['ShikaMon', 'MaruMon', 'MatatabiMon'],
};

const STARTERS = ['NarMon', 'KirMon', 'ShikaMon'];

export interface StoredUser {
  username: string;
  email: string;
  // Random per-user salt (hex). Mixed into the password before hashing so
  // two users with the same password produce different hashes, and so an
  // attacker can't precompute a rainbow table for the whole user store.
  salt: string;
  passwordHash: string;
  catdex: string[]; // names of catmon the user has discovered
}

export interface AuthUser {
  username: string;
  email: string;
  catdex: string[];
}

const USERS_KEY = 'catmon.users';
const SESSION_KEY = 'catmon.session';

// PBKDF2 work factor. Higher = slower to hash = slower to brute force.
// 100k SHA-256 iterations is a common browser-friendly baseline.
const PBKDF2_ITERATIONS = 100_000;
// 16 random bytes (128 bits) is the standard salt size — enough entropy
// that collisions between users are vanishingly unlikely.
const SALT_BYTES = 16;
// 32 bytes (256 bits) of derived key material — matches SHA-256's output.
const HASH_BYTES = 32;

/**
 * Generate a cryptographically random salt and return it as a hex string.
 *
 * `crypto.getRandomValues` is the browser's CSPRNG; unlike Math.random it's
 * suitable for security-sensitive values. We store the salt as hex so it
 * round-trips cleanly through JSON in localStorage.
 */
function generateSalt(): string {
  const bytes = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

/**
 * Hash a password with PBKDF2-HMAC-SHA256.
 *
 * Why PBKDF2 instead of a plain SHA-256?
 *   - Plain hashes are *fast*, which is great for checksums but bad for
 *     passwords: an attacker with a stolen user store can try billions of
 *     guesses per second on a GPU.
 *   - PBKDF2 deliberately repeats the hash thousands of times (the
 *     "iterations" parameter), making each guess proportionally slower.
 *   - The salt is mixed in so the same password hashes differently for
 *     each user, defeating precomputed rainbow tables.
 *
 * Steps:
 *   1. Encode the password as UTF-8 bytes and import it as raw key material.
 *   2. Run PBKDF2 over (password, salt, iterations) using SHA-256 as the PRF.
 *   3. Return the derived bits as a hex string for easy storage/comparison.
 *
 * Note: this still runs in the browser, so the user's machine is doing the
 * work. It's not a substitute for a real server-side auth system, but it's
 * far better than storing plaintext or a single-pass hash in localStorage.
 */
async function hashPassword(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();

  // Step 1: import the password bytes as a non-extractable PBKDF2 base key.
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );

  // Step 2: stretch it with PBKDF2 using the user's salt and our iteration count.
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToBytes(saltHex),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    HASH_BYTES * 8, // deriveBits takes bit length, not byte length
  );

  // Step 3: serialize for storage.
  return bytesToHex(new Uint8Array(derived));
}

/**
 * Constant-time string comparison.
 *
 * Comparing hashes with `===` would short-circuit on the first mismatching
 * character, leaking timing information that — in theory — lets an attacker
 * recover the hash byte by byte. XOR-and-OR every character so the loop
 * always runs to completion regardless of where the difference is.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (const b of bytes) {
    hex += b.toString(16).padStart(2, '0');
  }
  return hex;
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  // Allocate a real ArrayBuffer (not SharedArrayBuffer) so the result
  // satisfies the BufferSource type expected by crypto.subtle APIs.
  const buf = new ArrayBuffer(hex.length / 2);
  const out = new Uint8Array(buf);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<AuthUser | null>(this.loadSession());

  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  async signup(
    username: string,
    email: string,
    password: string,
  ): Promise<{ ok: true } | { ok: false; message: string }> {
    username = username.trim();
    email = email.trim().toLowerCase();
    if (!username || !email || !password) {
      return { ok: false, message: 'All fields are required' };
    }
    const users = this.loadUsers();
    if (users.some((u) => u.email === email)) {
      return { ok: false, message: 'An account with that email already exists' };
    }
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, message: 'That username is taken' };
    }

    // Generate a fresh salt for this user, then derive the hash from
    // (password, salt). The plaintext password is never stored.
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    const newUser: StoredUser = {
      username,
      email,
      salt,
      passwordHash,
      catdex: [...STARTERS],
    };
    users.push(newUser);
    this.saveUsers(users);
    this.setSession(newUser);
    return { ok: true };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ ok: true } | { ok: false; message: string }> {
    email = email.trim().toLowerCase();
    const users = this.loadUsers();
    const user = users.find((u) => u.email === email);

    // Even if the user doesn't exist, we still hash a dummy value so the
    // response time is roughly the same — otherwise an attacker can probe
    // which emails are registered just by timing the login endpoint.
    const saltToUse = user?.salt ?? generateSalt();
    const candidateHash = await hashPassword(password, saltToUse);

    if (!user || !timingSafeEqual(user.passwordHash, candidateHash)) {
      return { ok: false, message: 'Invalid email or password' };
    }
    this.setSession(user);
    return { ok: true };
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.currentUser.set(null);
  }

  /** Add a catmon (and any earlier evolutions) to the current user's catdex. */
  discoverCatmon(name: string): void {
    const user = this.currentUser();
    if (!user) return;

    // Find which evolution line this catmon belongs to and include all prior stages
    const toAdd: string[] = [];
    for (const line of Object.values(EVOLUTION_LINES)) {
      const idx = line.indexOf(name);
      if (idx >= 0) {
        toAdd.push(...line.slice(0, idx + 1));
        break;
      }
    }
    if (toAdd.length === 0) toAdd.push(name);

    const merged = Array.from(new Set([...user.catdex, ...toAdd]));
    if (merged.length === user.catdex.length) return;

    const updated: AuthUser = { ...user, catdex: merged };
    this.currentUser.set(updated);

    // Persist to the users store and session
    const users = this.loadUsers();
    const stored = users.find((u) => u.email === user.email);
    if (stored) {
      stored.catdex = merged;
      this.saveUsers(users);
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }

  private setSession(user: StoredUser): void {
    const session: AuthUser = {
      username: user.username,
      email: user.email,
      catdex: user.catdex,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.currentUser.set(session);
  }

  private loadSession(): AuthUser | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  private loadUsers(): StoredUser[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as StoredUser[];
    } catch {
      return [];
    }
  }

  private saveUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}
