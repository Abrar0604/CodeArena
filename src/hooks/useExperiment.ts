'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from './useUser';
import { assignVariant, setManualOverride, getManualOverride } from '@/lib/experiments/engine';
import { logExperimentEvent } from '@/lib/experiments/analytics';
import { getExperiment } from '@/lib/experiments/definitions';
import { ExperimentVariant } from '@/lib/experiments/types';

export function useExperiment<T = any>(experimentId: string) {
  const { user } = useUser();
  const userId = user?.id || 'guest_user';

  // Start with deterministic control variant on both server and client for 100% hydration consistency
  const [variant, setVariant] = useState<ExperimentVariant<T>>(() => {
    const exp = getExperiment(experimentId);
    return exp ? (exp.variants[0] as ExperimentVariant<T>) : (null as any);
  });
  const [mounted, setMounted] = useState<boolean>(false);

  const impressionLoggedRef = useRef<boolean>(false);

  // Re-evaluate on mount, user change or override event
  useEffect(() => {
    setMounted(true);

    const updateVariant = () => {
      const v = assignVariant<T>(experimentId, userId);
      setVariant(v);
    };

    updateVariant();

    const handleOverride = (e: any) => {
      if (!e.detail || e.detail.experimentId === experimentId) {
        updateVariant();
      }
    };

    window.addEventListener('ab_experiment_override', handleOverride);
    return () => window.removeEventListener('ab_experiment_override', handleOverride);
  }, [experimentId, userId]);

  // Log impression once per mount
  useEffect(() => {
    if (!impressionLoggedRef.current && variant) {
      impressionLoggedRef.current = true;
      logExperimentEvent({
        experimentId,
        variantId: variant.id,
        userId,
        eventName: 'impression',
      });
    }
  }, [experimentId, variant, userId]);

  const trackMetric = useCallback(
    (eventName: string, value?: number, metadata?: Record<string, any>) => {
      if (!variant) return;
      logExperimentEvent({
        experimentId,
        variantId: variant.id,
        userId,
        eventName,
        value,
        metadata,
      });
    },
    [experimentId, variant, userId]
  );

  const setOverride = useCallback(
    (variantId: string | null) => {
      setManualOverride(experimentId, variantId);
    },
    [experimentId]
  );

  return {
    experiment: getExperiment(experimentId),
    variant,
    config: variant?.config as T,
    trackMetric,
    setOverride,
    currentOverride: getManualOverride(experimentId),
    mounted,
  };
}
