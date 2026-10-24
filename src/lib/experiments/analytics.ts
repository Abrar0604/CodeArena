import { ExperimentEvent, ExperimentAnalysis } from './types';
import { EXPERIMENTS } from './definitions';
import { calculateExperimentStats } from './stats';

const LOCAL_STORAGE_EVENTS_KEY = 'codearena_ab_events_v1';

// Seed initial baseline telemetry data for realistic dashboard reporting
const BASELINE_EVENTS: ExperimentEvent[] = [
  // Experiment 1: scoring_formula_v1
  ...generateSeedEvents('scoring_formula_v1', 'control', 124, 68, 78.4),
  ...generateSeedEvents('scoring_formula_v1', 'speed_demon', 131, 91, 84.2),

  // Experiment 2: arena_layout_v1
  ...generateSeedEvents('arena_layout_v1', 'control', 108, 62, 3.2),
  ...generateSeedEvents('arena_layout_v1', 'focus_mode', 115, 83, 5.1),

  // Experiment 3: lobby_cta_v1
  ...generateSeedEvents('lobby_cta_v1', 'control', 240, 94, 1.0),
  ...generateSeedEvents('lobby_cta_v1', 'urgency_speedrun', 255, 142, 1.0),
];

function generateSeedEvents(
  experimentId: string,
  variantId: string,
  impressions: number,
  conversions: number,
  avgMetric: number
): ExperimentEvent[] {
  const events: ExperimentEvent[] = [];
  const baseTime = Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 days ago

  for (let i = 0; i < impressions; i++) {
    const timestamp = new Date(baseTime + i * 35 * 60 * 1000).toISOString();
    const userId = `user_${experimentId}_${variantId}_${i}`;
    events.push({
      id: `evt_imp_${experimentId}_${variantId}_${i}`,
      experimentId,
      variantId,
      userId,
      eventName: 'impression',
      timestamp,
    });

    if (i < conversions) {
      events.push({
        id: `evt_conv_${experimentId}_${variantId}_${i}`,
        experimentId,
        variantId,
        userId,
        eventName: 'conversion',
        value: avgMetric + (Math.random() * 4 - 2),
        timestamp,
      });
    }
  }
  return events;
}

export function getStoredEvents(): ExperimentEvent[] {
  if (typeof window === 'undefined') {
    return BASELINE_EVENTS;
  }

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // Initialize with baseline
  try {
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(BASELINE_EVENTS));
  } catch {}

  return BASELINE_EVENTS;
}

export function logExperimentEvent(event: Omit<ExperimentEvent, 'id' | 'timestamp'>): void {
  const fullEvent: ExperimentEvent = {
    ...event,
    id: 'evt_' + Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const events = getStoredEvents();
      events.push(fullEvent);
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(events));

      // Dispatch event for UI reactivity
      window.dispatchEvent(new CustomEvent('ab_experiment_event_logged', { detail: fullEvent }));
    } catch {}
  }
}

export function resetExperimentData(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(BASELINE_EVENTS));
      window.dispatchEvent(new CustomEvent('ab_experiment_event_logged'));
    } catch {}
  }
}

export function simulateParticipants(experimentId: string, count: number = 20): void {
  const experiment = EXPERIMENTS.find((e) => e.id === experimentId);
  if (!experiment) return;

  const control = experiment.variants[0];
  const treatment = experiment.variants[1];

  for (let i = 0; i < count; i++) {
    const isTreatment = Math.random() < 0.5;
    const variant = isTreatment ? treatment : control;
    const userId = 'sim_' + Math.random().toString(36).substring(2, 9);

    // Log impression
    logExperimentEvent({
      experimentId,
      variantId: variant.id,
      userId,
      eventName: 'impression',
    });

    // Conversion probability (higher for treatment to simulate positive uplift)
    const convRate = isTreatment ? 0.65 : 0.45;
    if (Math.random() < convRate) {
      logExperimentEvent({
        experimentId,
        variantId: variant.id,
        userId,
        eventName: 'conversion',
        value: 80 + Math.random() * 20,
      });
    }
  }
}

export function getExperimentAnalyses(): ExperimentAnalysis[] {
  const events = getStoredEvents();

  return EXPERIMENTS.map((exp) => {
    const expEvents = events.filter((e) => e.experimentId === exp.id);

    const controlVariant = exp.variants[0];
    const treatmentVariant = exp.variants[1];

    const controlImpressions = expEvents.filter(
      (e) => e.variantId === controlVariant.id && e.eventName === 'impression'
    ).length;
    const controlConversions = expEvents.filter(
      (e) => e.variantId === controlVariant.id && e.eventName === 'conversion'
    ).length;

    const treatmentImpressions = expEvents.filter(
      (e) => e.variantId === treatmentVariant.id && e.eventName === 'impression'
    ).length;
    const treatmentConversions = expEvents.filter(
      (e) => e.variantId === treatmentVariant.id && e.eventName === 'conversion'
    ).length;

    return calculateExperimentStats({
      experimentId: exp.id,
      experimentName: exp.name,
      controlStats: {
        variantId: controlVariant.id,
        variantName: controlVariant.name,
        impressions: controlImpressions,
        conversions: controlConversions,
      },
      treatmentStats: {
        variantId: treatmentVariant.id,
        variantName: treatmentVariant.name,
        impressions: treatmentImpressions,
        conversions: treatmentConversions,
      },
    });
  });
}
