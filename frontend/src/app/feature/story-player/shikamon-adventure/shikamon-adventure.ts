import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shikamon-adventure',
  imports: [RouterLink, CommonModule],
  templateUrl: './shikamon-adventure.html',
  styleUrl: './shikamon-adventure.css'
})
export class ShikamonAdventureComponent {
  // Tracks which stage of the adventure the player is on
  // 1 = ShikaMon intro with two choices
  // 2 = ShikaMon defeated (wrong choice)
  // 3 = MaruMon evolution (correct choice from stage 1)
  // 4 = MaruMon defeated (wrong choice from stage 3)
  // 5 = MatatabiMon final evolution (correct choice from stage 3)
  stage = 1;

  // Randomly determines if the correct choice appears on the right instead of the left
  swapped = Math.random() < 0.5;

  // Stage 1: ShikaMon data
  shikamon = {
    name: 'ShikaMon',
    image: 'Catmon/ShikaMon/ShikaMon.png',
    description: 'ShikaMon is a mysterious and graceful cat with ancient wisdom. Its shadow stretches unnaturally long, and its emerald eyes see truths hidden from others. ShikaMon prefers strategy over strength, but even the sharpest mind must choose its battles carefully...'
  };

  // Stage 3: MaruMon data
  marumon = {
    name: 'MaruMon',
    image: 'Catmon/ShikaMon/MaruMon.png',
    description: 'MaruMon is the evolved form of ShikaMon, having unlocked the power of shadow manipulation. Darkness coils around its paws like living smoke, and it can step between shadows at will. But an ancient sealed power stirs deep within, waiting to be unleashed...'
  };

  // Stage 5: MatatabiMon data
  matatabimon = {
    name: 'MatatabiMon',
    image: 'Catmon/ShikaMon/MatatabiMon.png',
    description: 'MatatabiMon is the ultimate evolution — a phantom feline that exists between dimensions. Two spectral tails flicker with ghostly fire, and reality bends in its presence. MatatabiMon has transcended the physical world, becoming a keeper of forgotten knowledge and a bridge between the living and the spirit realm.'
  };

  // Handle the player's choice at each stage
  choose(option: number) {
    const effective = this.swapped ? (option === 1 ? 2 : 1) : option;

    if (this.stage === 1) {
      if (effective === 1) {
        this.stage = 3;
      } else {
        this.stage = 2;
      }
    } else if (this.stage === 3) {
      if (effective === 1) {
        this.stage = 5;
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
