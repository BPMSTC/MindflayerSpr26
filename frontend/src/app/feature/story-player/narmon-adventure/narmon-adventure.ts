// Import necessary Angular modules
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

// Component decorator - defines this as an Angular component
@Component({
  selector: 'app-narmon-adventure',
  imports: [RouterLink, CommonModule],
  templateUrl: './narmon-adventure.html',
  styleUrl: './narmon-adventure.css'
})
export class NarmonAdventureComponent {
  private auth = inject(AuthService);

  // Tracks which stage of the adventure the player is on
  // 1 = NarMon intro with two choices
  // 2 = NarMon defeated (wrong choice)
  // 3 = RutoMon evolution (correct choice from stage 1)
  // 4 = RutoMon defeated (wrong choice from stage 3)
  // 5 = KuramaMon final evolution (correct choice from stage 3)
  stage = 1;

  // Randomly determines if the correct choice appears on the right instead of the left
  swapped = Math.random() < 0.5;

  // Stage 1: NarMon data
  narmon = {
    name: 'NarMon',
    image: 'Catmon/NarMon/NarMon.png',
    description: 'NarMon is a clever and agile feline companion with keen intelligence. Known for its quick reflexes and cunning strategies, NarMon never backs down from a challenge. But every great warrior must choose their path wisely...'
  };

  // Stage 3: RutoMon data
  rutomon = {
    name: 'RutoMon',
    image: 'Catmon/NarMon/RutoMon.png',
    description: 'RutoMon is the evolved form of NarMon, having unlocked a powerful inner strength. With blazing speed and fierce determination, RutoMon possesses the ability to sense danger before it strikes. But an even greater power lies dormant within...'
  };

  // Stage 5: KuramaMon data
  kuramamon = {
    name: 'KuramaMon',
    image: 'Catmon/NarMon/KuramaMon.png',
    description: 'KuramaMon is the ultimate evolution — a legendary feline of immense power. Nine spectral tails shimmer behind it, each one channeling ancient energy. KuramaMon has transcended ordinary limits, becoming a guardian of balance between worlds. Few have ever witnessed this form, and fewer still have earned its trust.'
  };

  // Handle the player's choice at each stage
  choose(option: number) {
    // If swapped, flip the option so the correct/wrong logic stays consistent
    const effective = this.swapped ? (option === 1 ? 2 : 1) : option;

    if (this.stage === 1) {
      if (effective === 1) {
        this.stage = 3;
        this.auth.discoverCatmon('RutoMon');
      } else {
        this.stage = 2;
      }
    } else if (this.stage === 3) {
      if (effective === 1) {
        this.stage = 5;
        this.auth.discoverCatmon('KuramaMon');
      } else {
        this.stage = 4;
      }
    }

    // Re-randomize for the next choice
    this.swapped = Math.random() < 0.5;
  }

  // Reset the adventure back to stage 1
  restart() {
    this.stage = 1;
    this.swapped = Math.random() < 0.5;
  }
}
