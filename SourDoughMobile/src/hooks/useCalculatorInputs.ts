import { useState, useCallback, useEffect, useRef, useMemo, useDeferredValue } from 'react';
import { useFocusEffect } from 'expo-router';
import { UserSettings, DEFAULT_SETTINGS, FlourEntry, FlourBlendEntry } from '@sourdough/calc/models/types';
import { getSettings } from '../store/settingsCache';
import { findFlour } from '@sourdough/calc/lib/flourSearch';
import { buildBlendFromRows } from '@sourdough/calc/lib/blendUtils';
import { useLocation } from './useLocation';
import type { LocationData } from '../lib/location';
import { chooseRoomTemp, type RoomTempSource } from '../lib/roomTemp';

export interface MixRow {
  key: string;
  flour: FlourEntry;
  grams: string;
}

export interface CalculatorInputs {
  // Flour mix
  mixRows: MixRow[];
  totalFlourWeight: number;
  blend: FlourBlendEntry[];

  // Ingredient inputs
  waterGrams: string;
  starterWeight: string;
  saltPct: string;
  starterHydrationStr: string;
  oilPct: string;

  // Temperature inputs
  ambientTemp: string;
  flourTemp: string;
  waterTemp: string;
  starterTemp: string;
  /** Where the room temperature came from: the user's own entry, Settings, the outdoor reading, or the default. */
  roomTempSource: RoomTempSource | 'typed';

  // Settings
  settings: UserSettings;

  // Location
  locationData: LocationData | null;
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
  setWaterGrams: (v: string) => void;
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
  const { locationData, locLoading, locError, onRefreshLocation, onPostcodeSubmit } = useLocation();

  // Instance-scoped counter survives Fast Refresh (no module-level mutable state)
  const mixKeyCounter = useRef(0);
  const nextMixKey = useCallback((): string => {
    return `flour_${mixKeyCounter.current++}`;
  }, []);

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [mixRows, setMixRows] = useState<MixRow[]>([
    { key: nextMixKey(), flour: findFlour(DEFAULT_SETTINGS.defaultFlourType), grams: String(DEFAULT_SETTINGS.defaultFlourWeight) },
  ]);
  const [waterGrams, setWaterGrams] = useState(String(DEFAULT_SETTINGS.defaultWaterGrams));
  const [starterWeight, setStarterWeight] = useState('100');
  const [saltPct, setSaltPct] = useState(String(DEFAULT_SETTINGS.defaultSaltPct));
  const [starterHydrationStr, setStarterHydrationStr] = useState('100');
  const [ambientTemp, setAmbientTemp] = useState('22');
  const [flourTemp, setFlourTemp] = useState('22');
  const [waterTemp, setWaterTemp] = useState('18');
  const [starterTemp, setStarterTemp] = useState('22');
  const [oilPct, setOilPct] = useState('0');
  // True once the user (or a loaded recipe) has set the room temperature; from then on
  // neither the location nor Settings overwrites it.
  const [ambientTyped, setAmbientTyped] = useState(false);

  // Track whether user has manually edited any field — prevents GPS/settings
  // auto-fill from overwriting user input on slow async resolution.
  const userInteractedRef = useRef(false);
  const markInteracted = useCallback(() => { userInteractedRef.current = true; }, []);

  // Deferred values for smooth typing — defer blend bar and weight recalc
  const deferredMixRows = useDeferredValue(mixRows);

  // Derived — both use deferred rows so the blend bar and total weight
  // don't recalculate on every keystroke.
  const totalFlourWeight = useMemo(
    () => deferredMixRows.reduce((sum, r) => sum + (parseFloat(r.grams) || 0), 0),
    [deferredMixRows],
  );

  const blend = useMemo(
    () => buildBlendFromRows(deferredMixRows.map((r) => ({ flour: r.flour, grams: parseFloat(r.grams) || 0 }))),
    [deferredMixRows],
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
  }, [nextMixKey]);

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

  // Load settings on mount (skip overwrite if user has already interacted)
  const settingsLoadedRef = useRef(false);
  useEffect(() => {
    getSettings().then((s) => {
      if (settingsLoadedRef.current) return;
      settingsLoadedRef.current = true;
      setSettings(s);
      if (!userInteractedRef.current) {
        setMixRows([{ key: nextMixKey(), flour: findFlour(s.defaultFlourType), grams: String(s.defaultFlourWeight) }]);
        setWaterGrams(String(s.defaultWaterGrams));
        setSaltPct(String(s.defaultSaltPct));
        setStarterHydrationStr(String(s.defaultStarterHydration));
      }
    });
  }, [nextMixKey]);

  // Reload settings on focus. The calculator stays mounted behind the
  // settings tab, so changed defaults (flour, water, salt, starter
  // hydration, hardness override) are re-applied here — otherwise the
  // "New defaults will apply" toast would be a lie until app restart.
  const didMountRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!didMountRef.current) {
        didMountRef.current = true;
        return;
      }
      getSettings().then((s) => {
        const kitchenChanged = (s.fermTempOverride ?? 0) !== (settings.fermTempOverride ?? 0);
        const defaultsChanged =
          s.defaultFlourType !== settings.defaultFlourType ||
          s.defaultFlourWeight !== settings.defaultFlourWeight ||
          s.defaultWaterGrams !== settings.defaultWaterGrams ||
          s.defaultSaltPct !== settings.defaultSaltPct ||
          s.defaultStarterHydration !== settings.defaultStarterHydration ||
          s.waterHardnessOverride !== settings.waterHardnessOverride;
        if (!defaultsChanged && !kitchenChanged) return;
        setSettings(s);
        // Only re-apply values the user hasn't touched in this session
        if (defaultsChanged && !userInteractedRef.current) {
          setMixRows([{ key: nextMixKey(), flour: findFlour(s.defaultFlourType), grams: String(s.defaultFlourWeight) }]);
          setWaterGrams(String(s.defaultWaterGrams));
          setSaltPct(String(s.defaultSaltPct));
          setStarterHydrationStr(String(s.defaultStarterHydration));
        }
      });
    }, [settings, nextMixKey]),
  );

  // Room temperature: the Settings kitchen temperature, else the outdoor reading, else 22 °C
  // (see lib/roomTemp.ts), until the user types one. Follows a changed Settings value or a
  // late location result, so a slow lookup never overwrites what the user entered. The flour
  // and starter follow the room.
  const kitchen = chooseRoomTemp(settings.fermTempOverride, locationData?.ambientTemp);
  useEffect(() => {
    if (ambientTyped) return;
    setAmbientTemp(String(kitchen.tempC));
    setFlourTemp(String(kitchen.tempC));
    setStarterTemp(String(kitchen.tempC));
  }, [ambientTyped, kitchen.tempC]);

  // The tap temperature only when the lookup actually found one; no invented value.
  const tapTempFound = locationData?.waterTemp;
  useEffect(() => {
    if (!userInteractedRef.current && typeof tapTempFound === 'number') setWaterTemp(String(tapTempFound));
  }, [tapTempFound]);

  // Stable wrapped setters — memoized with empty deps because useState
  // setters have stable identity. Without this, wrapSet creates new closures
  // every render, defeating all useMemo/useCallback in the calculator screen.
  const wrapSet = useCallback(<T,>(setter: (v: T) => void) => (v: T) => {
    userInteractedRef.current = true;
    setter(v);
  }, []);

  const setAmbientTempByUser = useCallback((v: string) => {
    userInteractedRef.current = true;
    setAmbientTyped(true);
    setAmbientTemp(v);
  }, []);

  const wrappedSetters = useMemo(() => ({
    setWaterGrams: wrapSet(setWaterGrams),
    setStarterWeight: wrapSet(setStarterWeight),
    setSaltPct: wrapSet(setSaltPct),
    setStarterHydrationStr: wrapSet(setStarterHydrationStr),
    setOilPct: wrapSet(setOilPct),
    setFlourTemp: wrapSet(setFlourTemp),
    setWaterTemp: wrapSet(setWaterTemp),
    setStarterTemp: wrapSet(setStarterTemp),
  }), []);

  return {
    mixRows,
    setMixRows,
    totalFlourWeight,
    blend,
    waterGrams,
    starterWeight,
    saltPct,
    starterHydrationStr,
    oilPct,
    ambientTemp,
    flourTemp,
    waterTemp,
    starterTemp,
    roomTempSource: ambientTyped ? 'typed' : kitchen.source,
    settings,
    locationData,
    locLoading,
    locError,
    onRefreshLocation,
    onPostcodeSubmit,
    setAmbientTemp: setAmbientTempByUser,
    handleAddFlour,
    handleRemoveFlour,
    handleUpdateFlour,
    handleUpdateFlourGrams,
    ...wrappedSetters,
  };
}
