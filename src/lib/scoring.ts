export interface ScoreWeights {
  correctnessWeight?: number; // default 50
  speedWeight?: number;       // default 25
  efficiencyWeight?: number;  // default 25
  minSpeedBonus?: number;     // default 5
}

export interface ScoreBreakdown {
  correctness: number;  // e.g. 0 - 50
  speed: number;        // e.g. 0 - 25
  efficiency: number;   // e.g. 0 - 25
  total: number;        // 0 - 100
  allPassed: boolean;
  weightsUsed?: ScoreWeights;
}

export function calculateSubmissionScore(params: {
  passedCount: number;
  totalCount: number;
  timeElapsedSeconds: number;
  totalBattleSeconds: number;
  executionTimeMs: number;
  memoryUsedKb: number;
  optimalTimeMs?: number;
  optimalMemoryKb?: number;
  weights?: ScoreWeights;
}): ScoreBreakdown {
  const {
    passedCount,
    totalCount,
    timeElapsedSeconds,
    totalBattleSeconds,
    executionTimeMs,
    memoryUsedKb,
    optimalTimeMs = 50,
    optimalMemoryKb = 4096,
    weights = {},
  } = params;

  const correctnessWeight = weights.correctnessWeight ?? 50;
  const speedWeight = weights.speedWeight ?? 25;
  const efficiencyWeight = weights.efficiencyWeight ?? 25;
  const minSpeedBonus = weights.minSpeedBonus ?? 5;

  if (totalCount === 0) {
    return { correctness: 0, speed: 0, efficiency: 0, total: 0, allPassed: false };
  }

  const allPassed = passedCount === totalCount;

  // 1. Correctness
  let correctness = 0;
  if (allPassed) {
    correctness = correctnessWeight;
  } else {
    // Partial score for partial tests passed (half of correctness weight)
    correctness = Math.round((passedCount / totalCount) * (correctnessWeight * 0.5) * 10) / 10;
  }

  // Speed and Efficiency are awarded if all tests pass
  let speed = 0;
  let efficiency = 0;

  if (allPassed) {
    // 2. Speed
    const clampedElapsed = Math.min(Math.max(timeElapsedSeconds, 1), totalBattleSeconds);
    const timeRemainingFraction = Math.max(0, 1 - clampedElapsed / totalBattleSeconds);
    const variableSpeedPool = Math.max(0, speedWeight - minSpeedBonus);
    speed = Math.round((minSpeedBonus + timeRemainingFraction * variableSpeedPool) * 10) / 10;

    // 3. Efficiency
    const halfEfficiencyPool = efficiencyWeight * 0.5;
    const safeExecTime = Math.max(executionTimeMs, 1);
    const timeRatio = Math.min(optimalTimeMs / safeExecTime, 1.0);
    const timeEfficiencyPoints = Math.max(efficiencyWeight * 0.1, timeRatio * halfEfficiencyPool);

    const safeMemory = Math.max(memoryUsedKb, 1);
    const memoryRatio = Math.min(optimalMemoryKb / safeMemory, 1.0);
    const memoryEfficiencyPoints = Math.max(efficiencyWeight * 0.1, memoryRatio * halfEfficiencyPool);

    efficiency = Math.round((timeEfficiencyPoints + memoryEfficiencyPoints) * 10) / 10;
  }

  const total = Math.round((correctness + speed + efficiency) * 10) / 10;

  return {
    correctness,
    speed,
    efficiency,
    total,
    allPassed,
    weightsUsed: {
      correctnessWeight,
      speedWeight,
      efficiencyWeight,
      minSpeedBonus,
    },
  };
}
