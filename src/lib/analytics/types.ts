export interface CompetitiveMatchRecord {
  id: string;
  opponentName: string;
  opponentRating: number;
  opponentAvatar: string;
  problemTitle: string;
  problemSlug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  elapsedSeconds: number;
  verdict: 'VICTORY' | 'DEFEAT' | 'DRAW';
  ratingDelta: number;
  correctnessScore: number;
  speedScore: number;
  efficiencyScore: number;
  totalScore: number;
  playedAt: string;
}

export interface PracticeDrillRecord {
  id: string;
  problemSlug: string;
  problemTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  elapsedSeconds: number;
  correctnessScore: number;
  speedScore: number;
  efficiencyScore: number;
  totalScore: number;
  botPaceBeaten?: boolean;
  completedAt: string;
}

export interface CompetitiveStats {
  rating: number;
  peakRating: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  winRate: number;
  currentStreak: number;
  avgSolveTimeSecs: number;
  avgCorrectness: number;
  avgSpeed: number;
  avgEfficiency: number;
  avgTotalScore: number;
  ratingHistory: { match: number; rating: number; date: string }[];
  languageDistribution: { language: string; matches: number; winRate: number }[];
  recentMatches: CompetitiveMatchRecord[];
}

export interface PracticeStats {
  totalAttempted: number;
  totalSolved: number;
  totalCatalogProblems: number;
  catalogMasteryRate: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  avgSolveTimeSecs: number;
  firstTryPassRate: number;
  benchmarkEfficiencyRatio: number;
  topicBreakdown: { topic: string; solved: number; total: number }[];
  recentDrills: PracticeDrillRecord[];
}
