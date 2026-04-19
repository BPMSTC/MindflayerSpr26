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
  // Auth service is used to persist CatDex discoveries for the signed-in player.
  private auth = inject(AuthService);

  // Central state machine for the KirMon adventure.
  // The template uses *ngIf blocks keyed off this number.
  // 1 = Training in Katze Town
  // 2 = First fight in the endless winter
  // 3 = Choose rival destination (no wrong answer)
  // 4 = Train or not before rival duel
  // 5 = Rival duel decision
  // 6 = Final evolution (AmaterosaMon)
  // 7 = Defeat from first fight
  // 8 = Defeat from skipping final training
  // 9 = Defeat from wrong rival-duel choice
  stage = 1;

  // Randomly flips visible card ordering so the "good" choice is not always
  // in the same left/right position. The choose() method compensates for this.
  swapped = Math.random() < 0.5;

  // Selected in story 3 and reused by stories 4, 5, and defeat messaging.
  selectedRival: 'RutoMon' | 'MaruMon' = 'RutoMon';

  // Stores story 1 flavor text and is surfaced in story 2's hero subtitle.
  trainingRoute = 'the Frost Ridge drills';

  // Stage 1: KirMon data
  kirMon = {
    name: 'KirMon',
    image: 'Catmon/KirMon/KirMon.png',
    description: 'KirMon is Katze Town\'s steadfast partner CatMon. Built for mountain winds and deep snow, KirMon trains to protect the town from the endless winter threatening Puridian.'
  };

  // Used from story 3 onward after evolution.
  ineMon = {
    name: 'IneMon',
    image: 'Catmon/KirMon/IneMon.png',
    description: 'IneMon is KirMon evolved, a faster and sharper storm-feline whose power was awakened in battle while defending Katze Town from the unnatural cold.'
  };

  // Final evolution shown after winning story 5.
  ameratosaMon = {
    name: 'AmaterosaMon',
    image: 'Catmon/KirMon/AmaterosaMon.png',
    description: 'AmaterosaMon is the final ascended form, born when IneMon masters discipline, balance, and purpose in Puridian\'s harsh trials.'
  };

  // Computed display text so the template does not need conditional strings.
  get rivalRegion(): string {
    return this.selectedRival === 'RutoMon' ? 'Neko Village in Cattail Forest' : 'Kedikure in the Southern Reaches';
  }

  // Kept as a getter to stay aligned with selectedRival state.
  get rivalImage(): string {
    return this.selectedRival === 'RutoMon' ? 'Catmon/NarMon/RutoMon.png' : 'Catmon/ShikaMon/MaruMon.png';
  }

  // Narrative sentence fragment for story 5 victory text.
  get rivalGoal(): string {
    return this.selectedRival === 'RutoMon'
      ? 'test your resolve in the emotional wilds of Neko Village'
      : 'prove your discipline against resistance-hardened strength from Kedikure';
  }

  // Rival-specific guidance used in stage 5 and the stage 9 defeat recap.
  get rivalDuelHint(): string {
    return this.selectedRival === 'RutoMon'
      ? 'Bait an emotional rush, then counter with discipline.'
      : 'Do not plant in place; keep moving and strike before they set.';
  }

  // Rival card flavor for stage 5, describing the duel plan against IneMon.
  get rivalDuelPlan(): string {
    return this.selectedRival === 'RutoMon'
      ? 'RutoMon is about to unleash fast, emotion-charged bursts from the Cattail Forest style, pressing IneMon into a frantic pace and baiting it to swing early from the heart instead of waiting for a clean counter window.'
      : 'MaruMon is about to anchor its footing, absorb IneMon\'s opening exchanges, and drag the fight into a long resistance duel shaped by Kedikure\'s hard survival.';
  }

  // After progressing to the next stage, bring the hero image back into view
  // so players start each scene at the top rather than at the old navigation.
  private scrollToStageTop() {
    // Wait until Angular finishes rendering the next stage in the DOM.
    requestAnimationFrame(() => {
      // Find the first hero image for the active story stage.
      const hero = document.querySelector('.hero-image');
      // Guard for type safety so we can call HTMLElement methods.
      if (hero instanceof HTMLElement) {
        // Jump viewport to the hero banner at the top of the new stage.
        hero.scrollIntoView({ behavior: 'auto', block: 'start' });
        // Stop here because the primary scroll target was found.
        return;
      }

      // Fallback: if no hero is found, scroll to the top of the page.
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  // Handles all branching decisions.
  // option is always 1 or 2 from clicked choice cards.
  choose(option: number) {
    // If cards were swapped visually, invert the selected option so business
    // logic still treats "effective === 1" as the intended path.
    const effective = this.swapped ? (option === 1 ? 2 : 1) : option;

    // STORY 1 -> STORY 2
    // Both choices continue the story; they only change flavor text.
    if (this.stage === 1) {
      this.trainingRoute = effective === 1 ? 'the Frost Ridge drills' : 'the Ice Cavern endurance course';
      this.stage = 2;

      // STORY 2 -> STORY 3 or DEFEAT (stage 7)
      // Winning this fight evolves KirMon into IneMon and unlocks it in CatDex.
    } else if (this.stage === 2) {
      if (effective === 1) {
        this.stage = 3;
        this.auth.discoverCatmon('IneMon');
      } else {
        this.stage = 7;
      }

      // STORY 3 -> STORY 4
      // No wrong answer here; both rivals are valid progression paths.
    } else if (this.stage === 3) {
      this.selectedRival = effective === 1 ? 'RutoMon' : 'MaruMon';
      this.stage = 4;

      // STORY 4 -> STORY 5 or DEFEAT (stage 8)
      // Training is the correct choice
    } else if (this.stage === 4) {
      if (effective === 1) {
        this.stage = 5;
      } else {
        this.stage = 8;
      }

      // STORY 5 -> STORY 6 (stage 6) or DEFEAT (stage 9)
      // The winning option depends on which rival was chosen in story 3.
    } else if (this.stage === 5) {
      const isWinningChoice = this.selectedRival === 'RutoMon' ? effective === 1 : effective === 2;
      if (isWinningChoice) {
        this.stage = 6;
        this.auth.discoverCatmon('AmaterosaMon');
      } else {
        this.stage = 9;
      }
    }

    // Re-randomize ordering for the next decision screen.
    this.swapped = Math.random() < 0.5;

    // Jump to the top of the newly rendered stage.
    this.scrollToStageTop();
  }

  // Resets all dynamic state so a replay starts from a clean baseline.
  restart() {
    this.stage = 1;
    this.selectedRival = 'RutoMon';
    this.trainingRoute = 'the Frost Ridge drills';
    this.swapped = Math.random() < 0.5;
  }
}
