import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, EVOLUTION_LINES } from '../auth/auth.service';

interface CatdexEntry {
  name: string;
  image: string;
  discovered: boolean;
}

interface CatdexLine {
  starter: string;
  entries: CatdexEntry[];
}

const IMAGE_PATHS: Record<string, string> = {
  NarMon: 'Catmon/NarMon/NarMon.png',
  RutoMon: 'Catmon/NarMon/RutoMon.png',
  KuramaMon: 'Catmon/NarMon/KuramaMon.png',
  KirMon: 'Catmon/KirMon/KirMon.png',
  IneMon: 'Catmon/KirMon/IneMon.png',
  AmaterosaMon: 'Catmon/KirMon/AmaterosaMon.png',
  ShikaMon: 'Catmon/ShikaMon/ShikaMon.png',
  MaruMon: 'Catmon/ShikaMon/MaruMon.png',
  MatatabiMon: 'Catmon/ShikaMon/MatatabiMon.png',
};

@Component({
  selector: 'app-catdex',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catdex.html',
  styleUrl: './catdex.css',
})
export class CatdexComponent {
  readonly auth = inject(AuthService);

  readonly lines = computed<CatdexLine[]>(() => {
    const user = this.auth.currentUser();
    const owned = new Set(user?.catdex ?? []);
    return Object.entries(EVOLUTION_LINES).map(([starter, line]) => ({
      starter,
      entries: line.map((name) => ({
        name,
        image: IMAGE_PATHS[name],
        discovered: owned.has(name),
      })),
    }));
  });
}
