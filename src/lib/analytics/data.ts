import { CompetitiveStats, PracticeStats, CompetitiveMatchRecord, PracticeDrillRecord } from './types';
import { Profile, Problem } from '@/types';

export function getCompetitiveStats(user: Profile | null): CompetitiveStats {
  const rating = user?.rating ?? 1200;
  const matchesWon = user?.matches_won ?? 0;
  const matchesPlayed = user?.matches_played ?? 0;
  const matchesLost = Math.max(0, matchesPlayed - matchesWon);
  const winRate = matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;

  // Retrieve only real locally recorded battle matches
  let recentMatches: CompetitiveMatchRecord[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('codearena_battle_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          recentMatches = parsed.slice(0, 50);
        }
      }
    } catch {}
  }

  // Calculate actual current streak from real matches
  let currentStreak = 0;
  for (const m of recentMatches) {
    if (m.verdict === 'VICTORY') {
      currentStreak++;
    } else {
      break;
    }
  }

  // If no matches recorded
  if (recentMatches.length === 0 && matchesPlayed === 0) {
    return {
      rating,
      peakRating: rating,
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
      winRate: 0,
      currentStreak: 0,
      avgSolveTimeSecs: 0,
      avgCorrectness: 0,
      avgSpeed: 0,
      avgEfficiency: 0,
      avgTotalScore: 0,
      ratingHistory: [
        { match: 1, rating, date: 'Baseline' },
      ],
      languageDistribution: [],
      recentMatches: [],
    };
  }

  // Real match statistics
  const totalCorrectness = recentMatches.reduce((acc, m) => acc + (m.correctnessScore || 0), 0);
  const totalSpeed = recentMatches.reduce((acc, m) => acc + (m.speedScore || 0), 0);
  const totalEfficiency = recentMatches.reduce((acc, m) => acc + (m.efficiencyScore || 0), 0);
  const totalScore = recentMatches.reduce((acc, m) => acc + (m.totalScore || 0), 0);
  const totalTime = recentMatches.reduce((acc, m) => acc + (m.elapsedSeconds || 0), 0);
  const count = recentMatches.length || 1;

  // Language breakdown from real matches
  const langMap: Record<string, { matches: number; wins: number }> = {};
  for (const m of recentMatches) {
    const l = m.language || 'Unknown';
    if (!langMap[l]) langMap[l] = { matches: 0, wins: 0 };
    langMap[l].matches++;
    if (m.verdict === 'VICTORY') langMap[l].wins++;
  }

  const languageDistribution = Object.entries(langMap).map(([language, data]) => ({
    language,
    matches: data.matches,
    winRate: Math.round((data.wins / data.matches) * 100),
  }));

  // Build rating history from real matches (oldest to newest)
  const ratingHistory = [...recentMatches].reverse().map((m, idx) => ({
    match: idx + 1,
    rating: rating,
    date: `Match #${idx + 1}`,
  }));

  if (ratingHistory.length === 0) {
    ratingHistory.push({ match: 1, rating, date: 'Current' });
  }

  return {
    rating,
    peakRating: Math.max(rating, ...recentMatches.map((m) => m.opponentRating || rating)),
    matchesPlayed: Math.max(matchesPlayed, recentMatches.length),
    matchesWon: Math.max(matchesWon, recentMatches.filter((m) => m.verdict === 'VICTORY').length),
    matchesLost: Math.max(matchesLost, recentMatches.filter((m) => m.verdict === 'DEFEAT').length),
    winRate: recentMatches.length > 0 ? Math.round((recentMatches.filter((m) => m.verdict === 'VICTORY').length / recentMatches.length) * 100) : winRate,
    currentStreak,
    avgSolveTimeSecs: Math.round(totalTime / count),
    avgCorrectness: Math.round((totalCorrectness / count) * 10) / 10,
    avgSpeed: Math.round((totalSpeed / count) * 10) / 10,
    avgEfficiency: Math.round((totalEfficiency / count) * 10) / 10,
    avgTotalScore: Math.round((totalScore / count) * 10) / 10,
    ratingHistory,
    languageDistribution,
    recentMatches,
  };
}

export function getPracticeStats(problems: Problem[]): PracticeStats {
  const totalCatalog = problems.length > 0 ? problems.length : 17;

  // Read only real completed slugs from localStorage (zero dummy data)
  let completedSlugs: string[] = [];
  let recentDrills: PracticeDrillRecord[] = [];

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('codearena_practice_completed');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          completedSlugs = parsed;
        }
      }

      const logsStored = localStorage.getItem('codearena_practice_logs');
      if (logsStored) {
        const parsedLogs = JSON.parse(logsStored);
        if (Array.isArray(parsedLogs)) {
          recentDrills = parsedLogs.slice(0, 50);
        }
      }
    } catch {}
  }

  const easyTotal = problems.filter((p) => p.difficulty.toLowerCase() === 'easy').length || 7;
  const mediumTotal = problems.filter((p) => p.difficulty.toLowerCase() === 'medium').length || 8;
  const hardTotal = problems.filter((p) => p.difficulty.toLowerCase() === 'hard').length || 2;

  const easySolved = completedSlugs.filter((s) => {
    const prob = problems.find((p) => p.slug === s);
    return prob?.difficulty.toLowerCase() === 'easy';
  }).length;

  const mediumSolved = completedSlugs.filter((s) => {
    const prob = problems.find((p) => p.slug === s);
    return prob?.difficulty.toLowerCase() === 'medium';
  }).length;

  const hardSolved = completedSlugs.filter((s) => {
    const prob = problems.find((p) => p.slug === s);
    return prob?.difficulty.toLowerCase() === 'hard';
  }).length;

  const totalSolved = completedSlugs.length;
  const catalogMasteryRate = totalCatalog > 0 ? Math.round((totalSolved / totalCatalog) * 100) : 0;

  // Real average time from practice logs
  const totalTime = recentDrills.reduce((acc, d) => acc + (d.elapsedSeconds || 0), 0);
  const avgSolveTimeSecs = recentDrills.length > 0 ? Math.round(totalTime / recentDrills.length) : 0;
  const firstTryPassRate = recentDrills.length > 0 ? Math.round((recentDrills.filter((d) => d.correctnessScore >= 50).length / recentDrills.length) * 100) : 0;
  const avgTotalScore = recentDrills.length > 0 ? Math.round(recentDrills.reduce((acc, d) => acc + (d.totalScore || 0), 0) / recentDrills.length) : 0;

  // Topic classification map
  const topicMap: Record<string, { solved: number; total: number }> = {
    'Arrays & Hashing': { solved: 0, total: 5 },
    'Two Pointers & Sliding Window': { solved: 0, total: 4 },
    'Dynamic Programming': { solved: 0, total: 3 },
    'Binary Search': { solved: 0, total: 2 },
    'Stack & Strings': { solved: 0, total: 3 },
  };

  for (const slug of completedSlugs) {
    if (['two-sum', 'contains-duplicate', 'product-of-array-except-self', 'maximum-subarray'].includes(slug)) {
      topicMap['Arrays & Hashing'].solved++;
    } else if (['valid-palindrome', '3sum', 'trapping-rain-water', 'longest-substring-without-repeating-characters'].includes(slug)) {
      topicMap['Two Pointers & Sliding Window'].solved++;
    } else if (['climbing-stairs', 'coin-change', 'house-robber'].includes(slug)) {
      topicMap['Dynamic Programming'].solved++;
    } else if (['binary-search'].includes(slug)) {
      topicMap['Binary Search'].solved++;
    } else if (['valid-parentheses', 'valid-anagram'].includes(slug)) {
      topicMap['Stack & Strings'].solved++;
    }
  }

  const topicBreakdown = Object.entries(topicMap).map(([topic, counts]) => ({
    topic,
    solved: counts.solved,
    total: counts.total,
  }));

  return {
    totalAttempted: recentDrills.length,
    totalSolved,
    totalCatalogProblems: totalCatalog,
    catalogMasteryRate,
    easySolved,
    easyTotal,
    mediumSolved,
    mediumTotal,
    hardSolved,
    hardTotal,
    avgSolveTimeSecs,
    firstTryPassRate,
    benchmarkEfficiencyRatio: avgTotalScore,
    topicBreakdown,
    recentDrills,
  };
}
