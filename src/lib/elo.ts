export interface EloResult {
  winnerNewRating: number;
  loserNewRating: number;
  winnerDelta: number;
  loserDelta: number;
}

export function getKFactor(rating: number): number {
  if (rating < 1400) return 32;
  if (rating < 1800) return 24;
  if (rating < 2200) return 16;
  return 12;
}

export function calculateElo(
  ratingA: number,
  ratingB: number,
  scoreA: number // 1 for A win, 0.5 for draw, 0 for B win
): {
  newRatingA: number;
  newRatingB: number;
  deltaA: number;
  deltaB: number;
} {
  const expectedA = 1.0 / (1.0 + Math.pow(10.0, (ratingB - ratingA) / 400.0));
  const expectedB = 1.0 / (1.0 + Math.pow(10.0, (ratingA - ratingB) / 400.0));

  const kA = getKFactor(ratingA);
  const kB = getKFactor(ratingB);

  const deltaA = Math.round(kA * (scoreA - expectedA));
  const deltaB = Math.round(kB * ((1.0 - scoreA) - expectedB));

  const newRatingA = Math.max(100, ratingA + deltaA);
  const newRatingB = Math.max(100, ratingB + deltaB);

  return {
    newRatingA,
    newRatingB,
    deltaA,
    deltaB,
  };
}
