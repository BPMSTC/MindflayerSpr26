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

// Tiny non-cryptographic hash so we don't store plain passwords in localStorage.
// This is NOT real security — it's a class project using browser storage.
function hashPassword(password: string): string {
  let h = 5381;
  for (let i = 0; i < password.length; i++) {
    h = (h * 33) ^ password.charCodeAt(i);
  }
  return (h >>> 0).toString(16);
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<AuthUser | null>(this.loadSession());

  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  signup(username: string, email: string, password: string): { ok: true } | { ok: false; message: string } {
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
    const newUser: StoredUser = {
      username,
      email,
      passwordHash: hashPassword(password),
      catdex: [...STARTERS],
    };
    users.push(newUser);
    this.saveUsers(users);
    this.setSession(newUser);
    return { ok: true };
  }

  login(email: string, password: string): { ok: true } | { ok: false; message: string } {
    email = email.trim().toLowerCase();
    const users = this.loadUsers();
    const user = users.find((u) => u.email === email);
    if (!user || user.passwordHash !== hashPassword(password)) {
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
