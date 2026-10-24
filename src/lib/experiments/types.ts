export type ExperimentStatus = 'active' | 'paused' | 'concluded';

export interface ExperimentVariant<T = any> {
  id: string;             // e.g. 'control', 'speed_demon'
  name: string;           // e.g. 'Balanced (50/25/25)'
  description: string;
  weight: number;         // Percentage weight (e.g. 50)
  config: T;              // Specific variant variables
}

export interface Experiment<T = any> {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  status: ExperimentStatus;
  variants: ExperimentVariant<T>[];
  targetMetric: string;   // e.g. 'submission_rate' or 'solve_speed'
  createdAt: string;
}

export interface ExperimentEvent {
  id: string;
  experimentId: string;
  variantId: string;
  userId: string;
  eventName: string;      // 'impression', 'battle_started', 'submission_completed', etc.
  value?: number;         // e.g. solve time or score
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface VariantStats {
  variantId: string;
  variantName: string;
  impressions: number;
  conversions: number;
  conversionRate: number; // 0 to 1
  avgMetricValue?: number;
  upliftVsControl?: number; // percentage uplift (e.g. +14.2%)
  isControl: boolean;
}

export interface ExperimentAnalysis {
  experimentId: string;
  experimentName: string;
  totalParticipants: number;
  variants: VariantStats[];
  controlVariantId: string;
  leadingVariantId: string;
  zScore: number;
  pValue: number;
  confidencePercent: number; // e.g. 96.5%
  isStatisticallySignificant: boolean; // confidence >= 95%
  recommendedAction: string;
}
