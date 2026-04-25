import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-narmon-adventure',
  imports: [RouterLink, CommonModule],
  templateUrl: './narmon-adventure.html',
  styleUrl: './narmon-adventure.css'
})
export class NarmonAdventureComponent {
  // Auth service is used to persist CatDex discoveries for the signed-in player.
  private auth = inject(AuthService);

  // Central state machine for the NarMon adventure.
  // The template uses *ngIf blocks keyed off this number.
  // 1 = Approach through Cattail Forest to Neko Village
  // 2 = First fight against Velkhar's influence
  // 3 = Choose rival destination (no wrong answer)
  // 4 = Train or skip before rival duel
  // 5 = Rival duel decision
  // 6 = Final evolution (KuramaMon)
  // 7 = Defeat from first fight
  // 8 = Defeat from skipping final training
  // 9 = Defeat from wrong rival-duel choice
  stage = 1;

  // Randomly flips visible card ordering so the "good" choice is not always
  // in the same left/right position. The choose() method compensates for this.
  swapped = Math.random() < 0.5;

  // Selected in story 3 and reused by stories 4, 5, and defeat messaging.
  selectedRival: 'MaruMon' | 'IneMon' = 'MaruMon';

  // Stores story 1 flavor text and is surfaced in story 2's hero subtitle.
  approachRoute = 'the CAT-lateral rope bridges';

  // Stage 1: NarMon data
  narmon = {
    name: 'NarMon',
    image: 'Catmon/NarMon/NarMon.png',
    description: 'NarMon is Neko Village\'s quick-hearted partner CatMon. In the living maze of Cattail Forest, NarMon helps guide villagers back toward balance as Velkhar, the Hollow Purr, spreads fear through their shared emotions.'
  };

  // Used from story 3 onward after evolution.
  rutomon = {
    name: 'RutoMon',
    image: 'Catmon/NarMon/RutoMon.png',
    description: 'RutoMon is NarMon evolved, a sharper and faster spirit-feline awakened when NarMon steadied the frenzy at Neko Village and faced Velkhar without losing heart.'
  };

  // Final evolution shown after winning story 5.
  kuramamon = {
    name: 'KuramaMon',
    image: 'Catmon/NarMon/KuramaMon.png',
    description: 'KuramaMon is the final ascended form, born when RutoMon harmonizes courage and restraint to protect Puridian from emotion turned chaos.'
  };

  // Computed display text so the template does not need conditional strings.
  get rivalRegion(): string {
    return this.selectedRival === 'MaruMon' ? 'Kedikure in the Southern Reaches' : 'Katze Town in the Northern Peaks';
  }

  // Kept as a getter to stay aligned with selectedRival state.
  get rivalImage(): string {
    return this.selectedRival === 'MaruMon' ? 'Catmon/ShikaMon/MaruMon.png' : 'Catmon/KirMon/IneMon.png';
  }

  // Narrative sentence fragment for story 5 victory text.
  get rivalGoal(): string {
    return this.selectedRival === 'MaruMon'
      ? 'prove your discipline against resistance-hardened strength from Kedikure'
      : 'show discipline strong enough to stand beside Katze Town\'s storm-trained defenders';
  }

  // Rival-specific guidance used in stage 5 and the stage 9 defeat recap.
  get rivalDuelHint(): string {
    return this.selectedRival === 'MaruMon'
      ? 'Do not plant in place; keep moving and strike before they set.'
      : 'Break their rhythm with a tempo-feint burst before they can settle into counters.';
  }

  // Rival card flavor for stage 5, describing the duel plan against RutoMon.
  get rivalDuelPlan(): string {
    return this.selectedRival === 'MaruMon'
      ? 'MaruMon is about to anchor its footing, absorb IneMon\'s opening exchanges, and drag the fight into a long resistance duel shaped by Kedikure\'s hard survival.'
      : 'IneMon plans to hold disciplined spacing from Katze Town and punish predictable counters, forcing RutoMon to change rhythm to create a true opening.';
  }

  // Story 5 option labels are rival-dependent to support a strategy triangle.
  get duelOptionTwoTitle(): string {
    return this.selectedRival === 'MaruMon' ? 'Stay mobile and strike first' : 'Use Tempo Feint and Burst';
  }

  // Option 2 details shift by rival while option 1 remains "Hold steady and counter".
  get duelOptionTwoDescription(): string {
    return this.selectedRival === 'MaruMon'
      ? 'Keep moving constantly and force short exchanges before MaruMon settles in.'
      : 'Stutter your timing with a feint step, then burst through before IneMon can read and counter.';
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
      this.approachRoute = effective === 1 ? 'the CAT-lateral rope bridges' : 'the CAT-Nip lantern paths';
      this.stage = 2;

      // STORY 2 -> STORY 3 or DEFEAT (stage 7)
      // Winning this fight evolves NarMon into RutoMon and unlocks it in CatDex.
    } else if (this.stage === 2) {
      if (effective === 1) {
        this.stage = 3;
        this.auth.discoverCatmon('RutoMon');
      } else {
        this.stage = 7;
      }

      // STORY 3 -> STORY 4
      // No wrong answer here; both rivals are valid progression paths.
    } else if (this.stage === 3) {
      this.selectedRival = effective === 1 ? 'MaruMon' : 'IneMon';
      this.stage = 4;

      // STORY 4 -> STORY 5 or DEFEAT (stage 8)
      // Training is the correct choice.
    } else if (this.stage === 4) {
      if (effective === 1) {
        this.stage = 5;
      } else {
        this.stage = 8;
      }

      // STORY 5 -> STORY 6 (stage 6) or DEFEAT (stage 9)
      // The winning option depends on which rival was chosen in story 3.
    } else if (this.stage === 5) {
      // Triangle logic:
      // Hold steady/counter beats RutoMon in the IneMon story,
      // Stay mobile/strike first beats MaruMon,
      // Tempo Feint and Burst beats IneMon.
      const isWinningChoice = effective === 2;
      if (isWinningChoice) {
        this.stage = 6;
        this.auth.discoverCatmon('KuramaMon');
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
    this.selectedRival = 'MaruMon';
    this.approachRoute = 'the CAT-lateral rope bridges';
    this.swapped = Math.random() < 0.5;
  }
}
