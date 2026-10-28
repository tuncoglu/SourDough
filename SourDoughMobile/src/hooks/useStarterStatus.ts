import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import type { StarterFeeding, StarterStatus } from '../models/types';
import { getLastFeeding } from '../store/starterStore';
import {
  computeStarterStatus,
  starterFlourBlendFromFeeding,
  usableStarterStatus,
} from '../lib/starterStatus';

/** How often the starter's age is recomputed while the screen is open. */
const REFRESH_MS = 60_000;

/**
 * The starter's current state, read from the feeding log, for recipe estimates.
 *
 * `status` is null when there is no log, or when the last feeding is too old
 * to trust (see `usableStarterStatus`); callers then assume a fridge-cold
 * starter at full strength, exactly as before the starter was tracked.
 */
export function useStarterStatus(): {
  feeding: StarterFeeding | null;
  status: StarterStatus | null;
  /** The flours the last feeding used, as shares of its flour. */
  flourBlend: { label: string; share: number }[] | undefined;
} {
  const [feeding, setFeeding] = useState<StarterFeeding | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useFocusEffect(useCallback(() => {
    let alive = true;
    getLastFeeding()
      .then((f) => { if (alive) setFeeding(f); })
      .catch(() => { /* an unreadable log just means "no starter data" */ });
    return () => { alive = false; };
  }, []));

  // The starter ages while the screen is open.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const status = useMemo(
    () => usableStarterStatus(computeStarterStatus(feeding)),
    // `now` is the refresh trigger: computeStarterStatus reads the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [feeding, now],
  );
  const flourBlend = useMemo(() => starterFlourBlendFromFeeding(feeding), [feeding]);

  return { feeding, status, flourBlend };
}
