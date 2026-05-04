import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { DuelCommand, StoryId, buildFinalDuelChoices, getDuelCommandDescription, getRivalInfo } from '../final-duel/final-duel';

@Component({
  selector: 'app-kirmon-adventure',
  imports: [RouterLink, CommonModule],
  templateUrl: './kirmon-adventure.html',
  styleUrl: './kirmon-adventure.css'
})
export class KirmonAdventureComponent {
  // Tells shared final-duel helpers which story configuration to use.
  // This key maps to the `kirmon` section in `RIVAL_INFO_BY_STORY`.
  private readonly storyId: StoryId = 'kirmon';

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
  trainingRoute = 'the Purrmafrost Proving Grounds';

  // Stores the command assigned to option button 1 in stage 5.
  // Value is generated when entering the final duel.
  duelOptionOne: DuelCommand = 'Hold steady and counter';
  // Stores the command assigned to option button 2 in stage 5.
  // Value is generated when entering the final duel.
  duelOptionTwo: DuelCommand = 'Stay mobile and strike first';

  // Stage 1: KirMon data
  kirMon = {
    name: 'KirMon',
    image: 'Catmon/KirMon/KirMon.png',
    alt: 'Image of KirMon. The brave starter Catmon with bright blue eyes, in detailed silver armor.',
    description: 'KirMon is Katze Town\'s steadfast partner CatMon. Built for mountain winds and deep snow, KirMon trains to protect the town from the endless winter threatening Puridian.'
  };

  // Used from story 3 onward after evolution.
  ineMon = {
    name: 'IneMon',
    image: 'Catmon/KirMon/IneMon.png',
    alt: 'Image of IneMon. The evolution in the KirMon line. It is a fearless guardian with sparkling silver armor decorated with blue gems.',
    description: 'IneMon is KirMon evolved, a faster and sharper storm-feline whose power was awakened in battle while defending Katze Town from the unnatural cold.'
  };

  // Final evolution shown after winning story 5.
  ameratosaMon = {
    name: 'AmaterosaMon',
    image: 'Catmon/KirMon/AmaterosaMon.png',
    alt: 'Image of AmaterosaMon. The majestic final evolution in the KirMon line. It is a regal cat with radiant silver armor adorned with blue gems, standing proudly with a flowing pair of tails and a serene expression.',
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
    // Pulled from centralized rival metadata (single source of truth).
    return getRivalInfo(this.storyId, this.selectedRival).goal;
  }

  // Rival-specific guidance used in stage 5 and the stage 9 defeat recap.
  get rivalDuelHint(): string {
    // Pulled from centralized rival metadata (single source of truth).
    return getRivalInfo(this.storyId, this.selectedRival).duelHint;
  }

  // Rival card flavor for stage 5, describing the duel plan against IneMon.
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
      this.trainingRoute = effective === 1 ? 'the Purrmafrost Proving Grounds' : 'the Whiskerwind Chasm Course';
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
        // Enter final duel stage.
        this.stage = 5;
        // Build fresh command options each time we reach stage 5.
        this.setupFinalDuelChoices();
      } else {
        this.stage = 8;
      }

      // STORY 5 -> STORY 6 (stage 6) or DEFEAT (stage 9)
      // The winning option depends on which rival was chosen in story 3.
    } else if (this.stage === 5) {
      // Convert clicked slot into the actual command shown in that slot.
      const selectedCommand = effective === 1 ? this.duelOptionOne : this.duelOptionTwo;
      // Win only when selected command matches the matchup's true counter.
      const isWinningChoice = selectedCommand === this.correctDuelCommand;
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
    this.trainingRoute = 'the Purrmafrost Proving Grounds';
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
