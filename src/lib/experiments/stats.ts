import { VariantStats, ExperimentAnalysis } from './types';

// Approximation of standard normal cumulative distribution function (CDF)
function normalCDF(z: number): number {
  const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2.0);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1.0 - p : p;
}

export function calculateExperimentStats(params: {
  experimentId: string;
  experimentName: string;
  controlStats: {
    variantId: string;
    variantName: string;
    impressions: number;
    conversions: number;
    avgMetricValue?: number;
  };
  treatmentStats: {
    variantId: string;
    variantName: string;
    impressions: number;
    conversions: number;
    avgMetricValue?: number;
  };
}): ExperimentAnalysis {
  const { experimentId, experimentName, controlStats, treatmentStats } = params;

  const nA = Math.max(controlStats.impressions, 1);
  const cA = controlStats.conversions;
  const pA = cA / nA;

  const nB = Math.max(treatmentStats.impressions, 1);
  const cB = treatmentStats.conversions;
  const pB = cB / nB;

  // Relative Uplift
  const upliftVsControl = pA > 0 ? ((pB - pA) / pA) * 100 : 0;

  // Pooled proportion
  const pooledP = (cA + cB) / (nA + nB);
  const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / nA + 1 / nB));

  let zScore = 0;
  if (se > 0) {
    zScore = (pB - pA) / se;
  }

  // Two-tailed p-value
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  const confidencePercent = Math.min(99.9, Math.max(0, (1 - pValue) * 100));

  const isStatisticallySignificant =
    confidencePercent >= 95.0 && controlStats.impressions >= 15 && treatmentStats.impressions >= 15;

  const controlResult: VariantStats = {
    variantId: controlStats.variantId,
    variantName: controlStats.variantName,
    impressions: controlStats.impressions,
    conversions: controlStats.conversions,
    conversionRate: Math.round(pA * 1000) / 10, // e.g. 24.5%
    avgMetricValue: controlStats.avgMetricValue,
    upliftVsControl: 0,
    isControl: true,
  };

  const treatmentResult: VariantStats = {
    variantId: treatmentStats.variantId,
    variantName: treatmentStats.variantName,
    impressions: treatmentStats.impressions,
    conversions: treatmentStats.conversions,
    conversionRate: Math.round(pB * 1000) / 10,
    avgMetricValue: treatmentStats.avgMetricValue,
    upliftVsControl: Math.round(upliftVsControl * 10) / 10,
    isControl: false,
  };

  let recommendedAction = 'Collecting data...';
  if (isStatisticallySignificant) {
    if (upliftVsControl > 0) {
      recommendedAction = `Promote ${treatmentStats.variantName} (+${Math.round(upliftVsControl)}% uplift, ${Math.round(confidencePercent)}% confidence)`;
    } else {
      recommendedAction = `Stick with Control. Treatment performed worse (${Math.round(upliftVsControl)}% drop)`;
    }
  } else {
    recommendedAction = `Keep running test. Sample size or divergence is not yet significant (${Math.round(confidencePercent)}% confidence, need ≥95%)`;
  }

  return {
    experimentId,
    experimentName,
    totalParticipants: controlStats.impressions + treatmentStats.impressions,
    variants: [controlResult, treatmentResult],
    controlVariantId: controlStats.variantId,
    leadingVariantId: pB > pA ? treatmentStats.variantId : controlStats.variantId,
    zScore: Math.round(zScore * 100) / 100,
    pValue: Math.round(pValue * 10000) / 10000,
    confidencePercent: Math.round(confidencePercent * 10) / 10,
    isStatisticallySignificant,
    recommendedAction,
  };
}
