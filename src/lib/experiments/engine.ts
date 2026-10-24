import { EXPERIMENTS, getExperiment } from './definitions';
import { ExperimentVariant } from './types';

// Simple deterministic string hashing (DJB2 algorithm)
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

// Client-side / local storage key for manual overrides
const OVERRIDE_STORAGE_PREFIX = 'codearena_ab_override_';

export function getManualOverride(experimentId: string): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Check URL query params if in browser (e.g. ?ab_scoring_formula_v1=speed_demon)
  try {
    const params = new URLSearchParams(window.location.search);
    const urlOverride = params.get(`ab_${experimentId}`);
    if (urlOverride) return urlOverride;
  } catch {}

  // 2. Check localStorage
  try {
    return localStorage.getItem(`${OVERRIDE_STORAGE_PREFIX}${experimentId}`);
  } catch {}

  return null;
}

export function setManualOverride(experimentId: string, variantId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (variantId === null) {
      localStorage.removeItem(`${OVERRIDE_STORAGE_PREFIX}${experimentId}`);
    } else {
      localStorage.setItem(`${OVERRIDE_STORAGE_PREFIX}${experimentId}`, variantId);
    }
    // Dispatch custom event for real-time reactivity
    window.dispatchEvent(new CustomEvent('ab_experiment_override', { detail: { experimentId, variantId } }));
  } catch {}
}

export function assignVariant<T = any>(
  experimentId: string,
  userId: string
): ExperimentVariant<T> {
  const experiment = getExperiment(experimentId);
  if (!experiment || experiment.variants.length === 0) {
    throw new Error(`Experiment ${experimentId} not found`);
  }

  // Check for manual override first
  const overrideVariantId = getManualOverride(experimentId);
  if (overrideVariantId) {
    const overridden = experiment.variants.find((v) => v.id === overrideVariantId);
    if (overridden) return overridden as ExperimentVariant<T>;
  }

  // If experiment is paused or concluded, default to control (first variant)
  if (experiment.status !== 'active') {
    return experiment.variants[0] as ExperimentVariant<T>;
  }

  // Deterministic bucket assignment using user ID and experiment ID
  const hash = hashString(`${userId}:${experimentId}`);
  const bucket = hash % 100; // 0 to 99

  let accumulatedWeight = 0;
  for (const variant of experiment.variants) {
    accumulatedWeight += variant.weight;
    if (bucket < accumulatedWeight) {
      return variant as ExperimentVariant<T>;
    }
  }

  return experiment.variants[0] as ExperimentVariant<T>;
}
