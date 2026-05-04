import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, EVOLUTION_LINES } from '../auth/auth.service';

// Defines a single entry in the Catdex list.
// Each entry contains the Catmon's name, the image path to display,
// and whether the current user has discovered that Catmon.
interface CatdexEntry {
  name: string;
  image: string;
  alt: string; // For accessibility and in case the image fails to load.
  discovered: boolean;
}

// Defines one evolution line in the Catdex.
// Each line starts from a starter Catmon and contains a list of entries.
interface CatdexLine {
  starter: string;
  entries: CatdexEntry[];
}

// Maps Catmon names to the image file path used by the Catdex UI.
// The component uses these paths when rendering each Catmon entry.
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

// Maps Catmon names to descriptive alt text for accessibility.
const ALT_TEXTS: Record<string, string> = {
  NarMon: 'Image of NarMon. the starter fiery, striped CatMon with bright red eyes, adorned with a golden ankh on its forehead. It is breaking golden chains with determination.',
  RutoMon: 'Image of RutoMon. the second evolution in the NarMon line. It is a fierce warrior cat clad in ornate golden armor with a glowing ankh symbol. It has fiery eyes and bared teeth.',
  KuramaMon: 'Image of KuramaMon. the final NarMon evolution. It is a ferocious black cat adorned in ornate golden armor stands with eight swirling tails, glowing red eyes, and an open mouth.',

  KirMon: 'Image of KirMon. The brave starter Catmon with bright blue eyes, in detailed silver armor.',
  IneMon: 'Image of IneMon. The evolution in the KirMon line. It is a fearless guardian with sparkling silver armor decorated with blue gems.',
  AmaterosaMon: 'Image of AmaterosaMon. The majestic final evolution in the KirMon line. It is a regal cat with radiant silver armor adorned with blue gems, standing proudly with a flowing pair of tails and a serene expression.',  

  ShikaMon: 'Image of ShikaMon. a sly purple kitten with glowing gold eyes, wrapped in black chains, lunging forward.',
  MaruMon: 'Image of MaruMon, a powerful evolved ShikaMon. A crafty purple cat in black armor crouches on a cracked surface, with yellow eyes and bared fangs.',
  MatatabiMon: 'Image of MatatabiMon, the ultimate ShikaMon evolution. A cunning purple feline clad in dark armor crouches with its claws extended.',
};

// The CatdexComponent is responsible for displaying the user's Catdex,
// which is a collection of Catmon species the user has discovered.
// It uses the AuthService to access the current user's Catdex data
// and builds a structured list of Catmon entries for the UI.
@Component({
  selector: 'app-catdex',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catdex.html',
  styleUrl: './catdex.css',
})

// The CatdexComponent class contains the logic for preparing the data
// that will be displayed in the Catdex UI. It computes the list of
// Catmon entries based on the evolution lines and the user's discovered
// Catmon, marking each entry as discovered or not for display purposes.
export class CatdexComponent {
  // Injects the authentication service so we can access the current user
  // and the Catdex information stored on that user.
  readonly auth = inject(AuthService);

  // Computed property that returns the Catdex lines for the UI.
  // It builds the data structure from the evolution lines and the
  // current user's discovered Catmon list.
  readonly lines = computed<CatdexLine[]>(() => {
    // Get the currently authenticated user.
    const user = this.auth.currentUser();

    // The user's discovered Catmon names are stored in `user.catdex`.
    // Use a Set for fast lookup when marking entries as discovered.
    const owned = new Set(user?.catdex ?? []);

    // Convert EVOLUTION_LINES into an array of CatdexLine objects.
    // `EVOLUTION_LINES` is expected to be something like:
    // { NarMon: ['NarMon', 'RutoMon', 'KuramaMon'], ... }
    return Object.entries(EVOLUTION_LINES).map(([starter, line]) => ({
      starter,
      entries: line.map((name) => ({
        name,
        image: IMAGE_PATHS[name],
        alt: ALT_TEXTS[name] ?? `Image of ${name}`, // Unique alt text for each Catmon.
        discovered: owned.has(name),
      })),
    }));
  });
}
