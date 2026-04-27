import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { DuelCommand, StoryId, buildFinalDuelChoices, getDuelCommandDescription, getRivalInfo } from '../final-duel/final-duel';

@Component({
  selector: 'app-shikamon-adventure',
  imports: [RouterLink, CommonModule],
  templateUrl: './shikamon-adventure.html',
  styleUrl: './shikamon-adventure.css'
})
export class ShikamonAdventureComponent {
  // Tells shared final-duel helpers which story configuration to use.
  // This key maps to the `shikamon` section in `RIVAL_INFO_BY_STORY`.
  private readonly storyId: StoryId = 'shikamon';

  // Auth service is used to persist CatDex discoveries for the signed-in player.
  private auth = inject(AuthService);

  // Central state machine for the ShikaMon adventure.
  // The template uses *ngIf blocks keyed off this number.
  // 1 = Recon through Kedikure
  // 2 = First clash against the overlord's enforcers
  // 3 = Choose rival destination (no wrong answer)
  // 4 = Train or skip before rival duel
  // 5 = Rival duel decision
  // 6 = Final evolution (MatatabiMon)
  // 7 = Defeat from first fight
  // 8 = Defeat from skipping final training
  // 9 = Defeat from wrong rival-duel choice
  stage = 1;

  // Randomly flips visible card ordering so the "good" choice is not always
  // in the same left/right position. The choose() method compensates for this.
  swapped = Math.random() < 0.5;

  // Selected in story 3 and reused by stories 4, 5, and defeat messaging.
  selectedRival: 'IneMon' | 'RutoMon' = 'IneMon';

  // Stores story 1 flavor text and is surfaced in story 2's hero subtitle.
  resistanceRoute = 'the Clawmand Post Yard';

  // Stores the command assigned to option button 1 in stage 5.
  // Value is generated when entering the final duel.
  duelOptionOne: DuelCommand = 'Hold steady and counter';
  // Stores the command assigned to option button 2 in stage 5.
  // Value is generated when entering the final duel.
  duelOptionTwo: DuelCommand = 'Stay mobile and strike first';

  // Stage 1: ShikaMon data
  shikamon = {
    name: 'ShikaMon',
    image: 'Catmon/ShikaMon/ShikaMon.png',
    description: 'ShikaMon is Kedikure\'s watchful partner CatMon. In a village drained by a distant overlord, ShikaMon helps organize quiet resistance cells and keep hope alive under heavy skies.'
  };

  // Used from story 3 onward after evolution.
  marumon = {
    name: 'MaruMon',
    image: 'Catmon/ShikaMon/MaruMon.png',
    description: 'MaruMon is ShikaMon evolved, a grounded tactician forged by Kedikure\'s struggle. It turns patience and timing into pressure that can crack even elite enforcer lines.'
  };

  // Final evolution shown after winning story 5.
  matatabimon = {
    name: 'MatatabiMon',
    image: 'Catmon/ShikaMon/MatatabiMon.png',
    description: 'MatatabiMon is the final ascended form, born when MaruMon unites resistance, resolve, and strategy to reclaim Kedikure\'s future.'
  };

  // Computed display text so the template does not need conditional strings.
  get rivalRegion(): string {
    return this.selectedRival === 'IneMon' ? 'Katze Town in the Northern Peaks' : 'Neko Village in Cattail Forest';
  }

  // Kept as a getter to stay aligned with selectedRival state.
  get rivalImage(): string {
    return this.selectedRival === 'IneMon' ? 'Catmon/KirMon/IneMon.png' : 'Catmon/NarMon/RutoMon.png';
  }

  // Narrative sentence fragment for story 5 victory text.
  get rivalGoal(): string {
    // Pulled from centralized rival metadata (single source of truth).
    return getRivalInfo(this.storyId, this.selectedRival).goal;
  }

  // Rival-specific guidance used in stage 5 and the stage 9 defeat recap.
  get rivalDuelHint(): string {
    // Pulled from centralized rival metadata (single source of truth).
    return getRivalInfo(this.storyId, this.selectedRival).duelHint;
  }

  // Rival card flavor for stage 5, describing the duel plan against MaruMon.
  get rivalDuelPlan(): string {
    // Pulled from centralized rival metadata (single source of truth).
    return getRivalInfo(this.storyId, this.selectedRival).duelPlan;
  }

  // Returns the single correct counter for the current rival matchup.
  // This is the source of truth used when validating the selected answer.
  get correctDuelCommand(): DuelCommand {
    // Pulled from centralized rival metadata (single source of truth).
    return getRivalInfo(this.storyId, this.selectedRival).correctCommand;
  }

  // Generates option-1 body text from whichever command is currently assigned.
  get duelOptionOneDescription(): string {
    return getDuelCommandDescription(this.duelOptionOne, this.selectedRival);
  }

  // Generates option-2 body text from whichever command is currently assigned.
  get duelOptionTwoDescription(): string {
    return getDuelCommandDescription(this.duelOptionTwo, this.selectedRival);
  }

  // Generates stage-5 options as:
  // 1) the true counter command
  // 2) one random incorrect command from the remaining two
  private setupFinalDuelChoices() {
    // Ask centralized rival metadata for the correct command.
    const correct = this.correctDuelCommand;
    // Delegate option generation to shared helper for consistent behavior.
    const choices = buildFinalDuelChoices(correct);
    // Save generated commands into stage-5 option slots.
    this.duelOptionOne = choices.optionOne;
    this.duelOptionTwo = choices.optionTwo;
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
      this.resistanceRoute = effective === 1 ? 'the Clawmand Post Yard' : 'the Prowler\'s Parapet Run';
      this.stage = 2;

      // STORY 2 -> STORY 3 or DEFEAT (stage 7)
      // Winning this fight evolves ShikaMon into MaruMon and unlocks it in CatDex.
    } else if (this.stage === 2) {
      if (effective === 1) {
        this.stage = 3;
        this.auth.discoverCatmon('MaruMon');
      } else {
        this.stage = 7;
      }

      // STORY 3 -> STORY 4
      // No wrong answer here; both rivals are valid progression paths.
    } else if (this.stage === 3) {
      this.selectedRival = effective === 1 ? 'IneMon' : 'RutoMon';
      this.stage = 4;

      // STORY 4 -> STORY 5 or DEFEAT (stage 8)
      // Training is the correct choice.
    } else if (this.stage === 4) {
      if (effective === 1) {
        // Enter final duel stage.
        this.stage = 5;
        // Build fresh command options each time we reach stage 5.
        this.setupFinalDuelChoices();
      } else {
        this.stage = 8;
      }

      // STORY 5 -> STORY 6 (stage 6) or DEFEAT (stage 9)
      // Winning option depends on selected rival matchup.
    } else if (this.stage === 5) {
      // Convert clicked slot into the actual command shown in that slot.
      const selectedCommand = effective === 1 ? this.duelOptionOne : this.duelOptionTwo;
      // Win only when selected command matches the matchup's true counter.
      const isWinningChoice = selectedCommand === this.correctDuelCommand;
      if (isWinningChoice) {
        this.stage = 6;
        this.auth.discoverCatmon('MatatabiMon');
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
    this.selectedRival = 'IneMon';
    this.resistanceRoute = 'the Clawmand Post Yard';
    // Reset duel slots to deterministic defaults before next run.
    // setupFinalDuelChoices() will overwrite these when stage 5 is entered.
    this.duelOptionOne = 'Hold steady and counter';
    this.duelOptionTwo = 'Stay mobile and strike first';
    this.swapped = Math.random() < 0.5;
  }

  // Retry from the nearest checkpoint before evolution stages.
  // Stage 7 (first defeat) -> stage 2 checkpoint.
  // Stage 8 (training skip defeat) -> stage 4 checkpoint.
  // Stage 9 (final duel defeat) -> stage 5 checkpoint.
  retryFromCheckpoint() {
    if (this.stage === 7) {
      this.stage = 2;
    } else if (this.stage === 8) {
      this.stage = 4;
    } else if (this.stage === 9) {
      this.stage = 5;
      this.setupFinalDuelChoices();
    } else {
      this.restart();
      return;
    }

    this.swapped = Math.random() < 0.5;
    this.scrollToStageTop();
  }
}
