import { CompetitiveStats, PracticeStats, CompetitiveMatchRecord, PracticeDrillRecord } from './types';
import { Profile, Problem } from '@/types';
import { getAllAvailableProblems } from '@/lib/problems/catalog';

const DEFAULT_COMPETITIVE_MATCHES: CompetitiveMatchRecord[] = [
  {
    id: 'm-1',
    opponentName: 'ByteVanguard',
    opponentRating: 1240,
    opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ByteVanguard',
    problemTitle: 'Two Sum',
    problemSlug: 'two-sum',
    difficulty: 'easy',
    language: 'Python 3',
    elapsedSeconds: 218,
    verdict: 'VICTORY',
    ratingDelta: 28,
    correctnessScore: 50.0,
    speedScore: 23.5,
    efficiencyScore: 22.0,
    totalScore: 95.5,
    playedAt: '12 minutes ago',
  },
  {
    id: 'm-2',
    opponentName: 'AlgoGod',
    opponentRating: 1410,
    opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlgoGod',
    problemTitle: 'Valid Parentheses',
    problemSlug: 'valid-parentheses',
    difficulty: 'easy',
    language: 'JavaScript',
    elapsedSeconds: 310,
    verdict: 'DEFEAT',
    ratingDelta: -16,
    correctnessScore: 35.0,
    speedScore: 18.0,
    efficiencyScore: 19.5,
    totalScore: 72.5,
    playedAt: '1 hour ago',
  },
  {
    id: 'm-3',
    opponentName: 'RecursionQueen',
    opponentRating: 1285,
    opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Recursion',
    problemTitle: 'Best Time to Buy and Sell Stock',
    problemSlug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'easy',
    language: 'Python 3',
    elapsedSeconds: 184,
    verdict: 'VICTORY',
    ratingDelta: 22,
    correctnessScore: 50.0,
    speedScore: 24.2,
    efficiencyScore: 23.1,
    totalScore: 97.3,
    playedAt: '3 hours ago',
  },
  {
    id: 'm-4',
    opponentName: 'BitwiseHero',
    opponentRating: 1320,
    opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bitwise',
    problemTitle: 'Maximum Subarray',
    problemSlug: 'maximum-subarray',
    difficulty: 'medium',
    language: 'C++',
    elapsedSeconds: 490,
    verdict: 'VICTORY',
    ratingDelta: 31,
    correctnessScore: 50.0,
    speedScore: 21.0,
    efficiencyScore: 24.5,
    totalScore: 95.5,
    playedAt: '1 day ago',
  },
  {
    id: 'm-5',
    opponentName: 'Tourist_Alpha',
    opponentRating: 1510,
    opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tourist',
    problemTitle: '3Sum',
    problemSlug: '3sum',
    difficulty: 'medium',
    language: 'Python 3',
    elapsedSeconds: 620,
    verdict: 'DEFEAT',
    ratingDelta: -12,
    correctnessScore: 40.0,
    speedScore: 16.5,
    efficiencyScore: 18.0,
    totalScore: 74.5,
    playedAt: '2 days ago',
  },
];

const DEFAULT_PRACTICE_DRILLS: PracticeDrillRecord[] = [
  {
    id: 'd-1',
    problemSlug: 'two-sum',
    problemTitle: 'Two Sum',
    difficulty: 'easy',
    language: 'Python 3',
    elapsedSeconds: 165,
    correctnessScore: 50.0,
    speedScore: 24.0,
    efficiencyScore: 24.5,
    totalScore: 98.5,
    botPaceBeaten: true,
    completedAt: 'Just now',
  },
  {
    id: 'd-2',
    problemSlug: 'valid-parentheses',
    problemTitle: 'Valid Parentheses',
    difficulty: 'easy',
    language: 'JavaScript',
    elapsedSeconds: 240,
    correctnessScore: 50.0,
    speedScore: 21.5,
    efficiencyScore: 22.0,
    totalScore: 93.5,
    botPaceBeaten: true,
    completedAt: '45 mins ago',
  },
  {
    id: 'd-3',
    problemSlug: 'binary-search',
    problemTitle: 'Binary Search',
    difficulty: 'easy',
    language: 'Python 3',
    elapsedSeconds: 112,
    correctnessScore: 50.0,
    speedScore: 24.8,
    efficiencyScore: 25.0,
    totalScore: 99.8,
    botPaceBeaten: true,
    completedAt: '2 hours ago',
  },
  {
    id: 'd-4',
    problemSlug: 'climbing-stairs',
    problemTitle: 'Climbing Stairs',
    difficulty: 'easy',
    language: 'Python 3',
    elapsedSeconds: 195,
    correctnessScore: 50.0,
    speedScore: 23.0,
    efficiencyScore: 24.0,
    totalScore: 97.0,
    botPaceBeaten: false,
    completedAt: '1 day ago',
  },
  {
    id: 'd-5',
    problemSlug: 'contains-duplicate',
    problemTitle: 'Contains Duplicate',
    difficulty: 'easy',
    language: 'Python 3',
    elapsedSeconds: 140,
    correctnessScore: 50.0,
    speedScore: 24.1,
    efficiencyScore: 23.8,
    totalScore: 97.9,
    botPaceBeaten: true,
    completedAt: '2 days ago',
  },
];

export function getCompetitiveStats(user: Profile | null): CompetitiveStats {
  const rating = user?.rating || 1200;
  const matchesWon = user?.matches_won || 3;
  const matchesPlayed = user?.matches_played || 5;
  const matchesLost = Math.max(0, matchesPlayed - matchesWon);
  const winRate = matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;

  // Retrieve any locally recorded battle matches
  let recentMatches = [...DEFAULT_COMPETITIVE_MATCHES];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('codearena_battle_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          recentMatches = [...parsed, ...recentMatches].slice(0, 20);
        }
      }
    } catch {}
  }

  // Calculate dynamic rating sparkline
  const ratingHistory: { match: number; rating: number; date: string }[] = [];
  let cur = rating - 50;
  for (let i = 1; i <= Math.max(7, matchesPlayed); i++) {
    cur += (i % 2 === 0 ? -12 : 24) + Math.floor(Math.random() * 8) - 4;
    ratingHistory.push({
      match: i,
      rating: Math.max(1050, cur),
      date: `Match #${i}`,
    });
  }
  // Make sure last point equals current rating
  if (ratingHistory.length > 0) {
    ratingHistory[ratingHistory.length - 1].rating = rating;
  }

  return {
    rating,
    peakRating: Math.max(rating + 65, 1285),
    matchesPlayed,
    matchesWon,
    matchesLost,
    winRate,
    currentStreak: 2,
    avgSolveTimeSecs: 364,
    avgCorrectness: 47.0,
    avgSpeed: 21.6,
    avgEfficiency: 22.4,
    avgTotalScore: 91.0,
    ratingHistory,
    languageDistribution: [
      { language: 'Python 3', matches: 12, winRate: 67 },
      { language: 'JavaScript', matches: 5, winRate: 60 },
      { language: 'C++', matches: 3, winRate: 100 },
      { language: 'Java', matches: 1, winRate: 0 },
    ],
    recentMatches,
  };
}

export function getPracticeStats(problems: Problem[]): PracticeStats {
  const totalCatalog = problems.length > 0 ? problems.length : 17;

  // Read completed slugs from localStorage
  let completedSlugs: string[] = ['two-sum', 'valid-parentheses', 'binary-search', 'contains-duplicate', 'climbing-stairs'];
  let recentDrills = [...DEFAULT_PRACTICE_DRILLS];

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('codearena_practice_completed');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          completedSlugs = parsed;
        }
      }

      const logsStored = localStorage.getItem('codearena_practice_logs');
      if (logsStored) {
        const parsedLogs = JSON.parse(logsStored);
        if (Array.isArray(parsedLogs) && parsedLogs.length > 0) {
          recentDrills = [...parsedLogs, ...recentDrills].slice(0, 20);
        }
      }
    } catch {}
  }

  const easyTotal = problems.filter((p) => p.difficulty.toLowerCase() === 'easy').length || 7;
  const mediumTotal = problems.filter((p) => p.difficulty.toLowerCase() === 'medium').length || 8;
  const hardTotal = problems.filter((p) => p.difficulty.toLowerCase() === 'hard').length || 2;

  const easySolved = Math.min(easyTotal, completedSlugs.filter((s) => {
    const prob = problems.find((p) => p.slug === s);
    return prob?.difficulty.toLowerCase() === 'easy';
  }).length || 4);

  const mediumSolved = Math.min(mediumTotal, completedSlugs.filter((s) => {
    const prob = problems.find((p) => p.slug === s);
    return prob?.difficulty.toLowerCase() === 'medium';
  }).length || 2);

  const hardSolved = Math.min(hardTotal, completedSlugs.filter((s) => {
    const prob = problems.find((p) => p.slug === s);
    return prob?.difficulty.toLowerCase() === 'hard';
  }).length || 0);

  const totalSolved = easySolved + mediumSolved + hardSolved;
  const catalogMasteryRate = Math.round((totalSolved / totalCatalog) * 100);

  return {
    totalAttempted: totalSolved + 3,
    totalSolved,
    totalCatalogProblems: totalCatalog,
    catalogMasteryRate,
    easySolved,
    easyTotal,
    mediumSolved,
    mediumTotal,
    hardSolved,
    hardTotal,
    avgSolveTimeSecs: 198, // ~3m 18s
    firstTryPassRate: 83.3,
    benchmarkEfficiencyRatio: 94.2,
    topicBreakdown: [
      { topic: 'Arrays & Hashing', solved: 4, total: 6 },
      { topic: 'Two Pointers & Sliding Window', solved: 2, total: 4 },
      { topic: 'Dynamic Programming', solved: 2, total: 3 },
      { topic: 'Binary Search', solved: 1, total: 2 },
      { topic: 'Stack & Strings', solved: 1, total: 2 },
    ],
    recentDrills,
  };
}
