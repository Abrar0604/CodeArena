import { Experiment } from './types';

// Scoring Formula Experiment Config
export interface ScoringFormulaConfig {
  correctnessWeight: number; // e.g. 50
  speedWeight: number;       // e.g. 25
  efficiencyWeight: number;  // e.g. 25
  minSpeedBonus: number;     // e.g. 5
  description: string;
}

// Arena Layout Experiment Config
export interface ArenaLayoutConfig {
  layoutMode: 'split' | 'focus';
  editorWidthPercent: number; // e.g. 66 or 100
  showProblemDrawer: boolean;
  themeStyle: 'standard_cyber' | 'neon_high_contrast';
}

// Lobby CTA Experiment Config
export interface LobbyCTAConfig {
  buttonText: string;
  badgeText: string;
  glowColor: string;
  showUrgencyTimer: boolean;
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'scoring_formula_v1',
    name: 'Scoring Formula: Balanced vs Speed-Demon',
    description:
      'Tests whether increasing the speed bonus weight from 25% to 40% increases match pacing and user submission velocity without degrading code efficiency.',
    hypothesis:
      'Rewarding speed more heavily (40% vs 25%) will reduce average time-to-first-submission by 20% and increase user battle completion rate.',
    status: 'active',
    targetMetric: 'submission_completed',
    createdAt: '2026-10-20T00:00:00.000Z',
    variants: [
      {
        id: 'control',
        name: 'Control (50/25/25 Balanced)',
        description: '50% Correctness, 25% Speed Bonus, 25% Time/Memory Efficiency',
        weight: 50,
        config: {
          correctnessWeight: 50,
          speedWeight: 25,
          efficiencyWeight: 25,
          minSpeedBonus: 5,
          description: '50% Correctness, 25% Speed, 25% Efficiency',
        } as ScoringFormulaConfig,
      },
      {
        id: 'speed_demon',
        name: 'Variant B (40/40/20 Speed-Demon)',
        description: '40% Correctness, 40% Speed Bonus, 20% Time/Memory Efficiency',
        weight: 50,
        config: {
          correctnessWeight: 40,
          speedWeight: 40,
          efficiencyWeight: 20,
          minSpeedBonus: 8,
          description: '40% Correctness, 40% Speed, 20% Efficiency',
        } as ScoringFormulaConfig,
      },
    ],
  },
  {
    id: 'arena_layout_v1',
    name: 'Arena Layout: Split Columns vs Focused Editor',
    description:
      'Evaluates whether a full-width focused Monaco code editor with a collapsible problem sheet leads to higher user test executions and fewer coding syntax errors.',
    hypothesis:
      'Providing an expansive code editor with collapsible documentation reduces mental friction and results in +15% more test runs per battle.',
    status: 'active',
    targetMetric: 'run_tests_clicked',
    createdAt: '2026-10-21T00:00:00.000Z',
    variants: [
      {
        id: 'control',
        name: 'Control (Split Columns)',
        description: 'Left 4-col problem statement, right 8-col code editor & terminal.',
        weight: 50,
        config: {
          layoutMode: 'split',
          editorWidthPercent: 66,
          showProblemDrawer: false,
          themeStyle: 'standard_cyber',
        } as ArenaLayoutConfig,
      },
      {
        id: 'focus_mode',
        name: 'Variant B (Maximized Focus Mode)',
        description: 'Full-width code editor with togglable floating problem panel.',
        weight: 50,
        config: {
          layoutMode: 'focus',
          editorWidthPercent: 100,
          showProblemDrawer: true,
          themeStyle: 'neon_high_contrast',
        } as ArenaLayoutConfig,
      },
    ],
  },
  {
    id: 'lobby_cta_v1',
    name: 'Lobby CTA: Standard vs High-Urgency Speedrun',
    description:
      'Tests conversion rate of the primary lobby matchmaking CTA button using competitive urgency framing.',
    hypothesis:
      'High-urgency gaming framing ("SPEEDRUN DUEL") will increase queue entry click-through rate by 25%.',
    status: 'active',
    targetMetric: 'battle_started',
    createdAt: '2026-10-22T00:00:00.000Z',
    variants: [
      {
        id: 'control',
        name: 'Control (Standard 1v1 Match)',
        description: 'Standard "FIND 1V1 MATCH" monolithic white block.',
        weight: 50,
        config: {
          buttonText: 'FIND 1V1 MATCH',
          badgeText: 'Ranked 1v1 Competitive Arena',
          glowColor: 'border-zinc-500',
          showUrgencyTimer: false,
        } as LobbyCTAConfig,
      },
      {
        id: 'urgency_speedrun',
        name: 'Variant B (Speedrun Duel + 2X Streak)',
        description: 'Glowing "START SPEEDRUN DUEL" with hot flame & streak multiplier.',
        weight: 50,
        config: {
          buttonText: '⚡ START SPEEDRUN DUEL (2X ELO)',
          badgeText: '🔥 Double Streak Window Active',
          glowColor: 'shadow-amber-500/50',
          showUrgencyTimer: true,
        } as LobbyCTAConfig,
      },
    ],
  },
];

export function getExperiment(id: string): Experiment | undefined {
  return EXPERIMENTS.find((e) => e.id === id);
}
