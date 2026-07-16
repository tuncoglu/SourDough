import { useState, useCallback, useEffect, useRef, useMemo, useDeferredValue } from 'react';
import { useFocusEffect } from 'expo-router';
import { UserSettings, DEFAULT_SETTINGS, FlourEntry, FlourBlendEntry } from '../models/types';
import { getSettings } from '../store/settingsCache';
import { findFlour } from '../lib/flourSearch';
import { buildBlendFromRows } from '../lib/blendUtils';
import { useLocation } from './useLocation';
import { getAutoTemps } from '../lib/location';

export interface MixRow {
  key: string;
  flour: FlourEntry;
  grams: string;
}

let _mixKeyCounter = 0;
function nextMixKey(): string {
  return `flour_${_mixKeyCounter++}`;
}

export interface CalculatorInputs {
  // Flour mix
  mixRows: MixRow[];
  totalFlourWeight: number;
  blend: FlourBlendEntry[];

  // Ingredient inputs
  hydration: string;
  starterWeight: string;
  saltPct: string;
  starterHydrationStr: string;
  oilPct: string;

  // Temperature inputs
  ambientTemp: string;
  flourTemp: string;
  waterTemp: string;
  starterTemp: string;

  // Settings
  settings: UserSettings;

  // Location
  locationData: ReturnType<typeof useLocation>['data'];
  locLoading: boolean;
  locError: string | null;
  onRefreshLocation: () => void;
  onPostcodeSubmit: (postcode: string) => void;

  // Actions
  setMixRows: (updater: (prev: MixRow[]) => MixRow[]) => void;
  handleAddFlour: () => void;
  handleRemoveFlour: (key: string) => void;
  handleUpdateFlour: (key: string, flour: FlourEntry) => void;
  handleUpdateFlourGrams: (key: string, grams: string) => void;
  setHydration: (v: string) => void;
  setStarterWeight: (v: string) => void;
  setSaltPct: (v: string) => void;
  setStarterHydrationStr: (v: string) => void;
  setOilPct: (v: string) => void;
  setAmbientTemp: (v: string) => void;
  setFlourTemp: (v: string) => void;
  setWaterTemp: (v: string) => void;
  setStarterTemp: (v: string) => void;
}

export function useCalculatorInputs(): CalculatorInputs {
  const { data: locationData, loading: locLoading, error: locError, detect, refineWithPostcode } = useLocation();

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [mixRows, setMixRows] = useState<MixRow[]>([
    { key: nextMixKey(), flour: findFlour(DEFAULT_SETTINGS.defaultFlourType), grams: String(DEFAULT_SETTINGS.defaultFlourWeight) },
  ]);
  const [hydration, setHydration] = useState(String(DEFAULT_SETTINGS.defaultHydration));
  const [starterWeight, setStarterWeight] = useState('100');
  const [saltPct, setSaltPct] = useState(String(DEFAULT_SETTINGS.defaultSaltPct));
  const [starterHydrationStr, setStarterHydrationStr] = useState('100');
  const [ambientTemp, setAmbientTemp] = useState('22');
  const [flourTemp, setFlourTemp] = useState('22');
  const [waterTemp, setWaterTemp] = useState('18');
  const [starterTemp, setStarterTemp] = useState('22');
  const [oilPct, setOilPct] = useState('0');

  // Deferred values for smooth typing
  const deferredMixRows = useDeferredValue(mixRows);

  // Derived
  const totalFlourWeight = useMemo(
    () => deferredMixRows.reduce((sum, r) => sum + (parseFloat(r.grams) || 0), 0),
    [deferredMixRows],
  );

  const blend = useMemo(
    () => buildBlendFromRows(mixRows.map((r) => ({ flour: r.flour, grams: parseFloat(r.grams) || 0 }))),
    [mixRows],
  );

  // Flour mix handlers
  const handleAddFlour = useCallback(() => {
    setMixRows((prev) => {
      if (prev.length >= 3) return prev;
      let newGrams = '0';
      const updated = [...prev];
      if (updated.length === 1) {
        const existing = parseFloat(updated[0].grams) || 0;
        if (existing > 0) {
          const half = Math.round(existing / 2);
          newGrams = String(half);
          updated[0] = { ...updated[0], grams: String(existing - half) };
        }
      }
      return [...updated, { key: nextMixKey(), flour: findFlour('Generic: Bread Flour'), grams: newGrams }];
    });
  }, []);

  const handleRemoveFlour = useCallback((key: string) => {
    setMixRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((r) => r.key !== key);
    });
  }, []);

  const handleUpdateFlour = useCallback((key: string, flour: FlourEntry) => {
    setMixRows((prev) => prev.map((r) => (r.key === key ? { ...r, flour } : r)));
  }, []);

  const handleUpdateFlourGrams = useCallback((key: string, grams: string) => {
    setMixRows((prev) => prev.map((r) => (r.key === key ? { ...r, grams } : r)));
  }, []);

  // Load settings on mount
  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setMixRows([{ key: nextMixKey(), flour: findFlour(s.defaultFlourType), grams: String(s.defaultFlourWeight) }]);
      setHydration(String(s.defaultHydration));
      setSaltPct(String(s.defaultSaltPct));
      setStarterHydrationStr(String(s.defaultStarterHydration));
    });
  }, []);

  // Reload settings on focus (for water hardness override)
  const didMountRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!didMountRef.current) {
        didMountRef.current = true;
        return;
      }
      getSettings().then((s) => {
        if (s.waterHardnessOverride !== settings.waterHardnessOverride) {
          setSettings(s);
        }
      });
    }, [settings.waterHardnessOverride]),
  );

  // Pre-fill temps when location detected
  useEffect(() => {
    if (locationData) {
      const auto = getAutoTemps(locationData.ambientTemp, locationData.waterTemp);
      setAmbientTemp(String(auto.ambientTemp));
      setFlourTemp(String(auto.flourTemp));
      setWaterTemp(String(auto.waterTemp));
      setStarterTemp(String(auto.starterTemp));
    }
  }, [locationData]);

  return {
    mixRows,
    setMixRows,
    totalFlourWeight,
    blend,
    hydration,
    starterWeight,
    saltPct,
    starterHydrationStr,
    oilPct,
    ambientTemp,
    flourTemp,
    waterTemp,
    starterTemp,
    settings,
    locationData,
    locLoading,
    locError,
    onRefreshLocation: detect,
    onPostcodeSubmit: refineWithPostcode,
    handleAddFlour,
    handleRemoveFlour,
    handleUpdateFlour,
    handleUpdateFlourGrams,
    setHydration,
    setStarterWeight,
    setSaltPct,
    setStarterHydrationStr,
    setOilPct,
    setAmbientTemp,
    setFlourTemp,
    setWaterTemp,
    setStarterTemp,
  };
}
