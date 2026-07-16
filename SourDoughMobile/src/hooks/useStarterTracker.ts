import { useState, useCallback, useEffect, useMemo } from 'react';
import { AppState, Alert } from 'react-native';
import {
  getStarterFlour,
  setStarterFlour as persistStarterFlour,
  logFeeding,
  generateFeedingId,
  getLastFeeding,
  loadFeedings,
} from '../store/starterStore';
import { StarterFeeding, StarterStatus } from '../models/types';
import { computeStarterStatus } from '../lib/starterStatus';

export interface StarterTrackerState {
  starterFlourLabel: string;
  feedFlourGrams: string;
  feedWaterGrams: string;
  feedLogging: boolean;
  expanded: boolean;
  lastFed: StarterFeeding | null;
  hoursSince: string;
  recentFeedings: StarterFeeding[];
  /** Computed starter readiness status. */
  status: StarterStatus | null;
}

export interface StarterTrackerActions {
  setStarterFlourLabel: (label: string) => void;
  setFeedFlourGrams: (v: string) => void;
  setFeedWaterGrams: (v: string) => void;
  setExpanded: (v: boolean) => void;
  handleFeedNow: () => Promise<void>;
  /** Put starter in fridge (records timestamp on last feeding). */
  handleFridgeIn: () => Promise<void>;
  /** Take starter out of fridge. */
  handleFridgeOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useStarterTracker(): StarterTrackerState & StarterTrackerActions {
  const [starterFlourLabel, setStarterFlourLabelState] = useState('Generic: Bread Flour');
  const [feedFlourGrams, setFeedFlourGrams] = useState('50');
  const [feedWaterGrams, setFeedWaterGrams] = useState('50');
  const [feedLogging, setFeedLogging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lastFed, setLastFed] = useState<StarterFeeding | null>(null);
  const [hoursSince, setHoursSince] = useState('');
  const [recentFeedings, setRecentFeedings] = useState<StarterFeeding[]>([]);

  const status = useMemo(() => computeStarterStatus(lastFed), [lastFed, hoursSince]);

  const refresh = useCallback(async () => {
    const lf = await getLastFeeding();
    setLastFed(lf);
    if (lf) {
      const diff = Date.now() - new Date(lf.timestamp).getTime();
      setHoursSince((diff / 3600000).toFixed(1));
    }
    const all = await loadFeedings();
    setRecentFeedings(all.slice(0, 3));
  }, []);

  const setStarterFlourLabel = useCallback((label: string) => {
    setStarterFlourLabelState(label);
    persistStarterFlour(label);
  }, []);

  const handleFeedNow = useCallback(async () => {
    const flourG = parseFloat(feedFlourGrams) || 0;
    const waterG = parseFloat(feedWaterGrams) || 0;
    if (flourG <= 0 || waterG <= 0) {
      Alert.alert('Invalid input', 'Enter grams of flour and water used to feed.');
      return;
    }

    let didShowSpinner = false;
    const timer = setTimeout(() => {
      didShowSpinner = true;
      setFeedLogging(true);
    }, 200);

    try {
      const feeding: StarterFeeding = {
        id: generateFeedingId(),
        timestamp: new Date().toISOString(),
        flourUsed: starterFlourLabel,
        flourGrams: flourG,
        waterGrams: waterG,
      };
      await logFeeding(feeding);
      setLastFed(feeding);
      setHoursSince('0.0');
      setRecentFeedings((prev) => [feeding, ...prev].slice(0, 3));
    } catch {
      Alert.alert('Error', 'Could not save feeding. Please try again.');
    } finally {
      clearTimeout(timer);
      if (didShowSpinner) setFeedLogging(false);
    }
  }, [starterFlourLabel, feedFlourGrams, feedWaterGrams]);

  const handleFridgeIn = useCallback(async () => {
    if (!lastFed) {
      Alert.alert('No feeding', 'Log a feeding before putting starter in the fridge.');
      return;
    }
    if (lastFed.fridgeAt) {
      Alert.alert('Already fridged', 'Starter is already in the fridge.');
      return;
    }
    const updated = { ...lastFed, fridgeAt: new Date().toISOString() };
    await logFeeding(updated);
    setLastFed(updated);
    await refresh();
  }, [lastFed, refresh]);

  const handleFridgeOut = useCallback(async () => {
    if (!lastFed) return;
    if (!lastFed.fridgeAt) {
      Alert.alert('Not in fridge', 'Starter is not in the fridge.');
      return;
    }
    if (lastFed.outOfFridgeAt) {
      Alert.alert('Already out', 'Starter is already out of the fridge.');
      return;
    }
    const updated = { ...lastFed, outOfFridgeAt: new Date().toISOString() };
    await logFeeding(updated);
    setLastFed(updated);
    await refresh();
  }, [lastFed, refresh]);

  // Load persisted preferences on mount
  useEffect(() => {
    getStarterFlour().then(setStarterFlourLabelState);
    refresh();
  }, [refresh]);

  // Refresh when expanded
  useEffect(() => {
    if (expanded) refresh();
  }, [expanded, refresh]);

  // Track app state
  const [appState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => setAppState(nextState));
    return () => sub.remove();
  }, []);

  // Update "hours since" every minute
  useEffect(() => {
    if (appState !== 'active' || !lastFed) return;
    const t = setInterval(() => {
      const diff = Date.now() - new Date(lastFed.timestamp).getTime();
      setHoursSince((diff / 3600000).toFixed(1));
    }, 60000);
    return () => clearInterval(t);
  }, [appState, lastFed]);

  return {
    starterFlourLabel,
    feedFlourGrams,
    feedWaterGrams,
    feedLogging,
    expanded,
    lastFed,
    hoursSince,
    recentFeedings,
    status,
    setStarterFlourLabel,
    setFeedFlourGrams,
    setFeedWaterGrams,
    setExpanded,
    handleFeedNow,
    handleFridgeIn,
    handleFridgeOut,
    refresh,
  };
}
