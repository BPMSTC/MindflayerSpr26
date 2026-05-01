import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { DuelCommand, StoryId, buildFinalDuelChoices, getDuelCommandDescription, getRivalInfo } from '../final-duel/final-duel';

@Component({
  selector: 'app-narmon-adventure',
  imports: [RouterLink, CommonModule],
  templateUrl: './narmon-adventure.html',
  styleUrl: './narmon-adventure.css'
})
export class NarmonAdventureComponent {
  // Tells shared final-duel helpers which story configuration to use.
  // This key maps to the `narmon` section in `RIVAL_INFO_BY_STORY`.
  private readonly storyId: StoryId = 'narmon';

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
  approachRoute = 'the Purrlane Canopy Run';

  // Stores the command assigned to option button 1 in stage 5.
  // Value is generated when entering the final duel.
  duelOptionOne: DuelCommand = 'Hold steady and counter';
  // Stores the command assigned to option button 2 in stage 5.
  // Value is generated when entering the final duel.
  duelOptionTwo: DuelCommand = 'Stay mobile and strike first';

  // Stage 1: NarMon data
  narmon = {
    name: 'NarMon',
    image: 'Catmon/NarMon/NarMon.png',
    alt: 'A fiery, striped cat with bright red eyes, adorned with a golden ankh on its forehead. It is breaking golden chains with determination.', // For accessibility and in case the image fails to load.
    description: 'NarMon is Neko Village\'s quick-hearted partner CatMon. In the living maze of Cattail Forest, NarMon helps guide villagers back toward balance as Velkhar, the Hollow Purr, spreads fear through their shared emotions.'
  };

  // Used from story 3 onward after evolution.
  rutomon = {
    name: 'RutoMon',
    image: 'Catmon/NarMon/RutoMon.png',
    alt: 'A fierce warrior cat clad in ornate golden armor with a glowing ankh symbol. It has fiery eyes, bared teeth, and a dynamic, powerful stance amidst swirling sparks.', // For accessibility and in case the image fails to load.
    description: 'RutoMon is NarMon evolved, a sharper and faster spirit-feline awakened when NarMon steadied the frenzy at Neko Village and faced Velkhar without losing heart.'
  };

  // Final evolution shown after winning story 5.
  kuramamon = {
    name: 'KuramaMon',
    image: 'Catmon/NarMon/KuramaMon.png',
    alt: 'A ferocious black cat adorned in ornate golden armor stands with eight swirling tails, glowing red eyes, and an open mouth, set against a fiery, dramatic background.', // For accessibility and in case the image fails to load.
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
    // Pulled from centralized rival metadata (single source of truth).
    return getRivalInfo(this.storyId, this.selectedRival).goal;
  }

  // Rival-specific guidance used in stage 5 and the stage 9 defeat recap.
  get rivalDuelHint(): string {
    // Pulled from centralized rival metadata (single source of truth).
    return getRivalInfo(this.storyId, this.selectedRival).duelHint;
  }

  // Rival card flavor for stage 5, describing the duel plan against RutoMon.
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
      this.approachRoute = effective === 1 ? 'the Purrlane Canopy Run' : 'the Whiskerwillow Whisper Trail';
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
    this.approachRoute = 'the Purrlane Canopy Run';
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
