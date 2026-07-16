import { useState, useCallback, useEffect } from 'react';
import { AppState, Alert } from 'react-native';
import {
  getStarterFlour,
  setStarterFlour as persistStarterFlour,
  logFeeding,
  generateFeedingId,
  getLastFeeding,
  loadFeedings,
} from '../store/starterStore';
import { StarterFeeding } from '../models/types';

export interface StarterTrackerState {
  /** Current starter flour label. */
  starterFlourLabel: string;
  /** Number input: grams of flour used to feed. */
  feedFlourGrams: string;
  /** Number input: grams of water used to feed. */
  feedWaterGrams: string;
  /** Whether a feed is being persisted. */
  feedLogging: boolean;
  /** Whether the starter card is expanded. */
  expanded: boolean;
  /** Last feeding record (or null). */
  lastFed: StarterFeeding | null;
  /** Hours since last feeding. */
  hoursSince: string;
  /** Most recent 3 feedings. */
  recentFeedings: StarterFeeding[];
}

export interface StarterTrackerActions {
  setStarterFlourLabel: (label: string) => void;
  setFeedFlourGrams: (v: string) => void;
  setFeedWaterGrams: (v: string) => void;
  setExpanded: (v: boolean) => void;
  handleFeedNow: () => Promise<void>;
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

  // Load persisted preferences on mount
  useEffect(() => {
    getStarterFlour().then(setStarterFlourLabelState);
    refresh();
  }, [refresh]);

  // Refresh when expanded
  useEffect(() => {
    if (expanded) refresh();
  }, [expanded, refresh]);

  // Track app state to pause timer when backgrounded
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
    setStarterFlourLabel,
    setFeedFlourGrams,
    setFeedWaterGrams,
    setExpanded,
    handleFeedNow,
    refresh,
  };
}
