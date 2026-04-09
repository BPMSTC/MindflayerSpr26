import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-kirmon-adventure',
  imports: [RouterLink, CommonModule],
  templateUrl: './kirmon-adventure.html',
  styleUrl: './kirmon-adventure.css'
})
export class KirmonAdventureComponent {
  private auth = inject(AuthService);

  // Tracks which stage of the adventure the player is on
  // 1 = KirMon intro with two choices
  // 2 = KirMon defeated (wrong choice)
  // 3 = IneMon evolution (correct choice from stage 1)
  // 4 = IneMon defeated (wrong choice from stage 3)
  // 5 = AmaterosaMon final evolution (correct choice from stage 3)
  stage = 1;

  // Randomly determines if the correct choice appears on the right instead of the left
  swapped = Math.random() < 0.5;

  // Stage 1: KirMon data
  kirmon = {
    name: 'KirMon',
    image: 'Catmon/KirMon/KirMon.png',
    description: 'KirMon is a strong and loyal warrior cat with a brave heart. Its thick fur crackles with static energy, and its powerful limbs can shatter stone. KirMon fights to protect those it cares about, but raw strength alone may not be enough...'
  };

  // Stage 3: IneMon data
  inemon = {
    name: 'IneMon',
    image: 'Catmon/KirMon/IneMon.png',
    description: 'IneMon is the evolved form of KirMon, having channeled its loyalty into lightning-fast strikes. Bolts of energy arc between its whiskers, and its eyes glow with fierce determination. But a storm far greater than any it has faced is gathering on the horizon...'
  };

  // Stage 5: AmaterosaMon data
  ameratosamom = {
    name: 'AmaterosaMon',
    image: 'Catmon/KirMon/AmaterosaMon.png',
    description: 'AmaterosaMon is the ultimate evolution — a radiant feline deity wreathed in golden lightning. Sunlight bends around its form, and thunder answers its call. AmaterosaMon has ascended beyond mortal limits, becoming a guardian of the skies themselves. Legends say its roar can split the heavens.'
  };

  // Handle the player's choice at each stage
  choose(option: number) {
    const effective = this.swapped ? (option === 1 ? 2 : 1) : option;

    if (this.stage === 1) {
      if (effective === 1) {
        this.stage = 3;
        this.auth.discoverCatmon('IneMon');
      } else {
        this.stage = 2;
      }
    } else if (this.stage === 3) {
      if (effective === 1) {
        this.stage = 5;
        this.auth.discoverCatmon('AmaterosaMon');
      } else {
        this.stage = 4;
      }
    }

    this.swapped = Math.random() < 0.5;
  }

  // Reset the adventure back to stage 1
  restart() {
    this.stage = 1;
    this.swapped = Math.random() < 0.5;
  }
}
