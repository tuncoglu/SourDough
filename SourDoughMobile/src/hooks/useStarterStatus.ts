import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import type { StarterFeeding, StarterStatus } from '../models/types';
import { generateFeedingId, loadFeedings, logFeeding, markPeaked, setFridgeState } from '../store/starterStore';
import {
  DEFAULT_PEAK_EFFECTIVE_HOURS,
  computeStarterStatus,
  learnedPeakEffectiveHours,
  starterFlourBlendFromFeeding,
  usableStarterStatus,
} from '../lib/starterStatus';
import { buildFeeding, type FeedingDraft } from '../lib/starterLog';

/** How often the starter's age is recomputed while the screen is open. */
const REFRESH_MS = 60_000;

export interface StarterState {
  /** The feeding log, newest first. */
  feedings: StarterFeeding[];
  feeding: StarterFeeding | null;
  status: StarterStatus | null;
  /** The flours the last feeding used, as shares of its flour. */
  flourBlend: { label: string; share: number }[] | undefined;
  /** This starter's peak in effective hours: its own median once learned, else the default. */
  peakEffectiveHours: number;
  /** How many marked peaks the learned figure rests on, or null while using the default. */
  learnedFromPeaks: number | null;
  /** The clock the status was computed at. */
  now: number;
  /** Log a feeding from what the user entered; resolves to false when there was nothing to record. */
  feed: (draft: Omit<FeedingDraft, 'id' | 'now' | 'roomTempC'>) => Promise<boolean>;
  markPeaked: (id: string) => Promise<void>;
  intoFridge: (id: string) => Promise<void>;
  outOfFridge: (id: string) => Promise<void>;
}

/**
 * The starter's current state, read from the feeding log, plus the actions
 * that change it. Used by the Starter screen and by the bread page.
 *
 * `roomTempC` is the kitchen now: a starter works faster when it is warm, so
 * the status runs the counter clock at that pace, and a new feeding records it.
 *
 * `status` is null when there is no log, or when the last feeding is too old
 * to trust (see `usableStarterStatus`); callers then assume a fridge-cold
 * starter at full strength, exactly as before the starter was tracked.
 */
export function useStarterStatus(roomTempC?: number): StarterState {
  const [feedings, setFeedings] = useState<StarterFeeding[]>([]);
  const [now, setNow] = useState(() => Date.now());

  const reload = useCallback(async () => {
    try {
      setFeedings(await loadFeedings());
    } catch {
      /* an unreadable log just means "no starter data" */
    }
  }, []);

  useFocusEffect(useCallback(() => {
    let alive = true;
    loadFeedings()
      .then((list) => { if (alive) setFeedings(list); })
      .catch(() => {});
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

  const feed = useCallback(async (draft: Omit<FeedingDraft, 'id' | 'now' | 'roomTempC'>) => {
    const record = buildFeeding({ ...draft, id: generateFeedingId(), now: new Date(), roomTempC: temp });
    if (!record) return false;
    await logFeeding(record);
    setNow(Date.now());
    await reload();
    return true;
  }, [temp, reload]);

  const afterChange = useCallback(async (change: Promise<void>) => {
    await change;
    setNow(Date.now());
    await reload();
  }, [reload]);

  return {
    feedings,
    feeding,
    status,
    flourBlend,
    peakEffectiveHours,
    learnedFromPeaks: learned?.count ?? null,
    now,
    feed,
    markPeaked: useCallback((id: string) => afterChange(markPeaked(id)), [afterChange]),
    intoFridge: useCallback((id: string) => afterChange(setFridgeState(id, 'in')), [afterChange]),
    outOfFridge: useCallback((id: string) => afterChange(setFridgeState(id, 'out')), [afterChange]),
  };
}
