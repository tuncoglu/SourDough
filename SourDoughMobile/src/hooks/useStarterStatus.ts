import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import type { StarterFeeding, StarterStatus } from '../models/types';
import { loadFeedings } from '../store/starterStore';
import {
  DEFAULT_PEAK_EFFECTIVE_HOURS,
  computeStarterStatus,
  learnedPeakEffectiveHours,
  starterFlourBlendFromFeeding,
  usableStarterStatus,
} from '../lib/starterStatus';

/** How often the starter's age is recomputed while the screen is open. */
const REFRESH_MS = 60_000;

/**
 * The starter's current state, read from the feeding log, for recipe estimates.
 *
 * `roomTempC` is the kitchen now: a starter works faster when it is warm, so
 * the status runs the counter clock at that pace.
 *
 * `status` is null when there is no log, or when the last feeding is too old
 * to trust (see `usableStarterStatus`); callers then assume a fridge-cold
 * starter at full strength, exactly as before the starter was tracked.
 */
export function useStarterStatus(roomTempC?: number): {
  feeding: StarterFeeding | null;
  status: StarterStatus | null;
  /** The flours the last feeding used, as shares of its flour. */
  flourBlend: { label: string; share: number }[] | undefined;
  /** This starter's peak in effective hours: its own median once learned, else the default. */
  peakEffectiveHours: number;
  /** How many marked peaks the learned figure rests on, or null while using the default. */
  learnedFromPeaks: number | null;
} {
  const [feedings, setFeedings] = useState<StarterFeeding[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useFocusEffect(useCallback(() => {
    let alive = true;
    loadFeedings()
      .then((list) => { if (alive) setFeedings(list); })
      .catch(() => { /* an unreadable log just means "no starter data" */ });
    return () => { alive = false; };
  }, []));

  // The starter ages while the screen is open.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const feeding = feedings[0] ?? null;
  const temp = roomTempC !== undefined && Number.isFinite(roomTempC) ? roomTempC : undefined;

  const learned = useMemo(() => learnedPeakEffectiveHours(feedings, temp), [feedings, temp]);
  const peakEffectiveHours = learned?.effectiveHours ?? DEFAULT_PEAK_EFFECTIVE_HOURS;

  const status = useMemo(
    () => usableStarterStatus(computeStarterStatus(feeding, { roomTempC: temp, peakEffectiveHours, now })),
    [feeding, temp, peakEffectiveHours, now],
  );
  const flourBlend = useMemo(() => starterFlourBlendFromFeeding(feeding), [feeding]);

  return { feeding, status, flourBlend, peakEffectiveHours, learnedFromPeaks: learned?.count ?? null };
}
