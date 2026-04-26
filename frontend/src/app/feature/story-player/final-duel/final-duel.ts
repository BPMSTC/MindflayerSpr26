// The three command labels that can appear in any final duel.
// Using a union type keeps command usage strict and typo-safe.
export type DuelCommand =
  | 'Hold steady and counter'
  | 'Stay mobile and strike first'
  | 'Use Tempo Feint and Burst';

// Pair of commands rendered in stage 5 as option 1 and option 2.
export interface FinalDuelChoices {
  optionOne: DuelCommand;
  optionTwo: DuelCommand;
}

// Identifier for each story component that consumes this module.
export type StoryId = 'kirmon' | 'narmon' | 'shikamon';

// Centralized rival metadata used by stage-5 text and win logic.
export interface RivalInfo {
  // Victory sentence fragment shown in the success card.
  goal: string;
  // Tactical hint shown to the player before making the duel choice.
  duelHint: string;
  // Rival flavor paragraph describing expected battle behavior.
  duelPlan: string;
  // The single command that should win against this rival.
  correctCommand: DuelCommand;
}

// Canonical command list used when selecting random wrong answers.
const ALL_DUEL_COMMANDS: DuelCommand[] = [
  'Hold steady and counter',
  'Stay mobile and strike first',
  'Use Tempo Feint and Burst'
];

// Source-of-truth rival registry keyed by story, then rival name.
// Each entry defines all final-duel data in one place.
const RIVAL_INFO_BY_STORY: Record<StoryId, Record<string, RivalInfo>> = {
  kirmon: {
    // KirMon route rival from Neko Village.
    RutoMon: {
      goal: 'test your resolve in the emotional wilds of Neko Village',
      duelHint: 'Bait an emotional rush, then counter with discipline.',
      duelPlan:
        'RutoMon is about to unleash fast, emotion-charged bursts from the Cattail Forest style, pressing IneMon into a frantic pace and baiting it to swing early from the heart instead of waiting for a clean counter window.',
      correctCommand: 'Hold steady and counter'
    },
    // KirMon route rival from Kedikure.
    MaruMon: {
      goal: 'prove your discipline against resistance-hardened strength from Kedikure',
      duelHint: 'Do not plant in place; keep moving and strike before they set.',
      duelPlan:
        'MaruMon is about to anchor its footing, absorb IneMon\'s opening exchanges, and drag the fight into a long resistance duel shaped by Kedikure\'s hard survival.',
      correctCommand: 'Stay mobile and strike first'
    }
  },
  narmon: {
    // NarMon route rival from Kedikure.
    MaruMon: {
      goal: 'prove your discipline against resistance-hardened strength from Kedikure',
      duelHint: 'Do not plant in place; keep moving and strike before they set.',
      duelPlan:
        'MaruMon is about to anchor its footing, absorb IneMon\'s opening exchanges, and drag the fight into a long resistance duel shaped by Kedikure\'s hard survival.',
      correctCommand: 'Stay mobile and strike first'
    },
    // NarMon route rival from Katze Town.
    IneMon: {
      goal: 'show discipline strong enough to stand beside Katze Town\'s storm-trained defenders',
      duelHint: 'Break their rhythm with a tempo-feint burst before they can settle into counters.',
      duelPlan:
        'IneMon plans to hold disciplined spacing from Katze Town and punish predictable counters, forcing RutoMon to change rhythm to create a true opening.',
      correctCommand: 'Use Tempo Feint and Burst'
    }
  },
  shikamon: {
    // ShikaMon route rival from Katze Town.
    IneMon: {
      goal: 'break northern discipline with resistance-forged timing from Kedikure',
      duelHint: 'Use a tempo-feint burst to break their rhythm before the counter window opens.',
      duelPlan:
        'IneMon plans to hold disciplined spacing and punish predictable counters, forcing MaruMon to reveal its timing first.',
      correctCommand: 'Use Tempo Feint and Burst'
    },
    // ShikaMon route rival from Neko Village.
    RutoMon: {
      goal: 'outlast emotion-charged bursts with calm pressure and clean counters',
      duelHint: 'Hold steady, absorb the rush, and counter once their pace overextends.',
      duelPlan:
        'RutoMon plans to chain fast emotional bursts from the Cattail style, trying to pull MaruMon into rushed exchanges.',
      correctCommand: 'Hold steady and counter'
    }
  }
};

// Builds final duel options with exactly one correct command and one random wrong command.
export function buildFinalDuelChoices(correct: DuelCommand): FinalDuelChoices {
  // Keep only commands that are not correct so we always pick a wrong alternative.
  const wrongPool = ALL_DUEL_COMMANDS.filter((command) => command !== correct);
  // Randomly pick one wrong command from the remaining two.
  const randomWrong = wrongPool[Math.floor(Math.random() * wrongPool.length)];

  // Randomly assign whether the correct answer lands in slot 1 or slot 2.
  if (Math.random() < 0.5) {
    return { optionOne: correct, optionTwo: randomWrong };
  }

  return { optionOne: randomWrong, optionTwo: correct };
}

// Centralized rival metadata accessor for each story's final duel.
export function getRivalInfo(storyId: StoryId, rivalName: string): RivalInfo {
  // Get all rivals configured for the requested story.
  const storyRivals = RIVAL_INFO_BY_STORY[storyId];
  // Pull the rival entry by exact rival name key.
  const info = storyRivals[rivalName];

  // Return configured metadata when found.
  if (info) {
    return info;
  }

  // Safe fallback if a rival key is ever misconfigured or missing.
  // This prevents runtime crashes while still making the issue visible in text.
  return {
    goal: 'overcome your rival with disciplined tactics',
    duelHint: 'Read your rival and strike only after they commit.',
    duelPlan: `${rivalName} is preparing a matchup-specific duel plan.`,
    correctCommand: 'Hold steady and counter'
  };
}

// Shared command flavor text used by all story-player final duel cards.
export function getDuelCommandDescription(command: DuelCommand, rivalName: string): string {
  // Description block for the defense-first command.
  if (command === 'Hold steady and counter') {
    return `Let ${rivalName} commit first, then punish the opening with precise timing.`;
  }

  // Description block for the mobility-pressure command.
  if (command === 'Stay mobile and strike first') {
    return `Keep moving constantly and force short exchanges before ${rivalName} settles in.`;
  }

  // Description block for the tempo-break command.
  return `Stutter your timing with a feint step, then burst through before ${rivalName} can read and counter.`;
}
