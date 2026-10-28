import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { FermentType, FermentMethod, SaltCrystal, FermentResults, FermentHistoryEntry, LactoDayPoint, PrepSize, WaterHardness } from '@sourdough/calc/models/types';
import { FERMENT_PRESETS, VEG_COMBOS, VegCombo } from '@sourdough/calc/data/fermentPresets';
import { VegEntry } from '@sourdough/calc/data/vegetables';
import {
  computeFermentTemp,
  acidBalanceVerdict,
  AcidBalanceVerdict,
  DailyTempSummary,
  FermentTempResult,
  FermentTiming,
} from '@sourdough/calc/lib/lactoCalculations';
import {
  DEFAULT_LACTO_FORM,
  applyCombo as applyComboTo,
  clearMix as clearMixIn,
  comboOf,
  historyDraft,
  methodOf,
  planFromForm,
  resolveVeg,
  restoreFrom as restoreFormFrom,
  selectPreset as selectPresetIn,
  selectVeg as selectVegIn,
  toggleVegInMix as toggleVegIn,
  updateMixGrams as updateMixGramsIn,
  type LactoForm,
} from '@sourdough/calc/lib/lactoForm';
import { useLocation } from './useLocation';
import { isValidDecimalInput } from '@sourdough/calc/lib/inputValidation';
import { getSettings } from '../store/settingsCache';
import { recordFerment } from '../store/fermentHistoryStore';
import { generateFermentHistoryId } from '@sourdough/calc/lib/fermentHistory';
import { classifyHardness } from '@sourdough/calc/data/ukWaterHardness';
import { FALLBACK_HARDNESS } from '@sourdough/calc/lib/hardnessUtils';
import { useAppTheme } from '../theme';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';
import type { LocationData } from '../lib/location';

export interface LactoCalculatorState {
  // Inputs
  fermentType: FermentType;
  method: FermentMethod;
  vegId: string;
  veg: VegEntry;
  vegWeight: string;
  waterAmount: string;
  saltPct: string;
  saltType: SaltCrystal;
  /** Cut size — drives the prep timing factor. */
  prepSize: PrepSize;
  /** Whether this vegetable's own sugar can reach full sourness. */
  acidBalance: AcidBalanceVerdict;
  /** True when a starter culture is being modelled. */
  useStarter: boolean;

  // Temperature (auto-detected from weather)
  effectiveTemp: number;
  tempResult: FermentTempResult | null;
  /** Human-readable source of the temperature actually being used. */
  tempSummary: string;
  /** Where that temperature came from — 'manual' when overridden in Settings. */
  tempSource: FermentTempResult['source'];
  dailyTemps: DailyTempSummary[];

  // Preset
  presetName: string;
  presetEmoji: string;
  tips: string[];
  presetHealthNote?: string;

  // Multi-veg mix
  vegMix: { vegId: string; grams: string }[];
  vegMixEntries: { vegId: string; grams: string; veg: VegEntry }[];
  isMultiVeg: boolean;
  totalMixGrams: number;
  VEG_COMBOS: typeof VEG_COMBOS;

  // Location & water
  locationData: LocationData | null;
  locLoading: boolean;
  locError: string | null;
  onRefreshLocation: () => void;
  onPostcodeSubmit: (postcode: string) => void;
  hardness: WaterHardness | null;
  /** Manual hardness override from Settings (mg/L CaCO₃, 0 = auto-detect). */
  waterHardnessOverride: number;
  /** Manual fermentation temperature in °C, or 0 when following the forecast. */
  fermTempOverride: number;

  // Results
  results: FermentResults | null;
  /** What moved the duration: recipe anchor + each applied adjustment. */
  timing: FermentTiming | null;
  timeline: LactoDayPoint[];
  advice: string[];
  waterAdvice: string[];
  /** True when there is a result to show; results are recalculated live. */
  showResults: boolean;
  /** Inline validation message (e.g. missing veg weight). */
  validationError: string | null;

  // Actions
  selectPreset: (type: FermentType) => void;
  selectVeg: (id: string) => void;
  toggleVegInMix: (id: string) => void;
  clearMix: () => void;
  updateMixGrams: (id: string, grams: string) => void;
  applyCombo: (combo: VegCombo) => void;
  setVegWeight: (v: string) => void;
  setWaterAmount: (v: string) => void;
  setSaltPct: (v: string) => void;
  setSaltType: (t: SaltCrystal) => void;
  setPrepSize: (p: PrepSize) => void;
  setUseStarter: (v: boolean) => void;
  /** Load a history entry back into the calculator. */
  restoreFrom: (entry: FermentHistoryEntry) => void;
}

/** How long the inputs must sit still before a ferment is recorded in the history. */
export const HISTORY_SETTLE_MS = 2500;
/** Within this long, edits to the same ferment replace the last record instead of adding one. */
export const HISTORY_TUNING_WINDOW_MS = 10 * 60 * 1000;

export function useLactoCalculator(): LactoCalculatorState {
  const { locationData, locLoading, locError, onRefreshLocation, onPostcodeSubmit } = useLocation();
  const { unitSystem } = useAppTheme();

  // Everything the person has chosen, as one value. The rules for changing it (picking a
  // style resets the vegetable and salt, a combo brings its own method...) are pure
  // functions in @sourdough/calc, shared with the web app.
  const [form, setForm] = useState<LactoForm>(DEFAULT_LACTO_FORM);
  /**
   * Whether the user has touched the calculator. Results are live from the
   * first render, but a ferment is only recorded in the history once the
   * user has actually worked on it, never just for opening the screen.
   */
  const [touched, setTouched] = useState(false);
  const [waterHardnessOverride, setWaterHardnessOverride] = useState(0);
  /** Manual fermentation temperature (°C); 0 = use the local forecast. */
  const [fermTempOverride, setFermTempOverride] = useState(0);

  /** Applies a change to the form and records that the user has touched the calculator. */
  const change = useCallback((f: (prev: LactoForm) => LactoForm) => {
    setForm(f);
    setTouched(true);
  }, []);

  // Derived
  const preset = FERMENT_PRESETS[form.fermentType]!;
  const activeCombo = comboOf(form);
  /** The preset's method, unless a curated combo overrode it. */
  const method = methodOf(form);
  const { veg: effectiveVeg, isMultiVeg, totalMixGrams, mixEntries: vegMixEntries } = useMemo(() => resolveVeg(form), [form]);

  const selectPreset = useCallback((type: FermentType) => change((f) => selectPresetIn(f, type)), [change]);
  const selectVeg = useCallback((id: string) => change((f) => selectVegIn(f, id)), [change]);
  const toggleVegInMix = useCallback((id: string) => change((f) => toggleVegIn(f, id)), [change]);
  const clearMix = useCallback(() => change(clearMixIn), [change]);
  const applyCombo = useCallback((combo: VegCombo) => change((f) => applyComboTo(f, combo)), [change]);
  const updateMixGrams = useCallback((id: string, grams: string) => {
    // Sanitize: digits + at most one decimal point (same rule as NumberInput)
    if (!isValidDecimalInput(grams)) return;
    change((f) => updateMixGramsIn(f, id, grams));
  }, [change]);
  /** Load a past ferment back into the calculator, with its method and combo restored together with the numbers. */
  const restoreFrom = useCallback((entry: FermentHistoryEntry) => change((f) => restoreFormFrom(f, entry)), [change]);

  // Manual input setters: stable, so memoised children are not re-rendered on every keystroke.
  const setters = useMemo(() => ({
    setVegWeight: (v: string) => change((f) => ({ ...f, vegWeight: v })),
    setWaterAmount: (v: string) => change((f) => ({ ...f, waterAmount: v })),
    setSaltPct: (v: string) => change((f) => ({ ...f, saltPct: v })),
    setSaltType: (t: SaltCrystal) => change((f) => ({ ...f, saltType: t })),
    setPrepSize: (p: PrepSize) => change((f) => ({ ...f, prepSize: p })),
    setUseStarter: (v: boolean) => change((f) => ({ ...f, useStarter: v })),
  }), [change]);

  // Load water hardness override from settings
  useFocusEffect(useCallback(() => {
    getSettings().then((s) => {
      setWaterHardnessOverride(s.waterHardnessOverride ?? 0);
      setFermTempOverride(s.fermTempOverride ?? 0);
    });
  }, []));

  const getHardness = useCallback((): WaterHardness => {
    if (waterHardnessOverride > 0) {
      return { mgL: waterHardnessOverride, classification: classifyHardness(waterHardnessOverride), note: 'Manual override', key: 'manual' };
    }
    if (locationData?.hardness) return locationData.hardness;
    return FALLBACK_HARDNESS;
  }, [waterHardnessOverride, locationData]);

  // Compute temperature from forecast in real time
  const tempResult = useMemo(() => {
    // First pass: rough estimate to know how many days to forecast for
    const roughDays = 14; // cover long ferments (up to 14 days)
    return computeFermentTemp(
      locationData?.hourlyForecast ?? null,
      locationData?.ambientTemp ?? null,
      roughDays,
      unitSystem,
    );
  }, [locationData, unitSystem]);

  /**
   * The forecast is the OUTDOOR temperature; a jar on a kitchen counter sits
   * warmer than that, so an explicit override wins. This is the single biggest
   * error source in the estimate — a UK autumn forecast can read 16 °C while
   * the kitchen is 20 °C, which is a 1.8× difference in time.
   */
  const effectiveTemp = fermTempOverride > 0 ? fermTempOverride : tempResult.effectiveTemp;
  const dailyTemps = tempResult.dailyTemps;

  /** What the temperature card should say — the forecast is outdoor, so say so. */
  const tempSummary = fermTempOverride > 0
    ? `Using your set temperature ${formatTemp(fermTempOverride, unitSystem, 1)} — the local forecast would have been ${formatTemp(tempResult.effectiveTemp, unitSystem, 1)}`
    : `${tempResult.summary} · fermenting indoors? Set your kitchen temperature in Settings`;

  // Everything the page shows, recalculated whenever an input changes. The
  // maths lives in lib/lactoPlan.ts; nothing in here has side effects.
  const hardness = useMemo(() => getHardness(), [getHardness]);
  const plan = useMemo(() => planFromForm(form, {
    hourlyForecast: locationData?.hourlyForecast ?? null,
    currentTemp: locationData?.ambientTemp ?? null,
    fermTempOverride,
    hardness,
    unitSystem,
  }), [form, locationData, fermTempOverride, hardness, unitSystem]);

  // History has no save button: a ferment you worked out is a ferment you
  // made. The calculator is live, so this waits for the inputs to settle and
  // only then records, replacing the entry it recorded a moment ago for the
  // same ferment instead of adding one row per edit. Fire-and-forget, so
  // storage can never block or break the calculation.
  const draft = useMemo(() => historyDraft(form, plan), [form, plan]);

  const lastRecorded = useRef<{ id: string; at: number; what: string } | null>(null);
  useEffect(() => {
    if (!touched || !draft) return;
    const timer = setTimeout(() => {
      const entry: FermentHistoryEntry = {
        ...draft,
        id: generateFermentHistoryId(),
        createdAt: new Date().toISOString(),
      };
      // Same style and vegetable, shortly after the last record: the same jar
      // being tuned, so the new entry replaces the old one.
      const what = `${entry.fermentType}|${entry.comboId ?? ''}|${entry.vegId}`;
      const prev = lastRecorded.current;
      const replaceId = prev && prev.what === what && Date.now() - prev.at < HISTORY_TUNING_WINDOW_MS
        ? prev.id
        : undefined;
      lastRecorded.current = { id: entry.id, at: Date.now(), what };
      recordFerment(entry, replaceId).catch(() => {});
    }, HISTORY_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [touched, draft]);

  return {
    fermentType: form.fermentType,
    method,
    vegId: form.vegId,
    veg: effectiveVeg,
    vegWeight: form.vegWeight,
    prepSize: form.prepSize,
    useStarter: form.useStarter,
    acidBalance: acidBalanceVerdict(effectiveVeg),
    vegMix: form.vegMix,
    vegMixEntries,
    isMultiVeg,
    totalMixGrams,
    waterAmount: form.waterAmount,
    saltPct: form.saltPct,
    saltType: form.saltType,
    effectiveTemp,
    tempResult,
    tempSummary,
    tempSource: fermTempOverride > 0 ? 'manual' : tempResult.source,
    dailyTemps,
    presetName: activeCombo?.name ?? preset.name,
    presetEmoji: activeCombo?.emoji ?? preset.emoji,
    tips: preset.tips ?? [],
    presetHealthNote: preset.healthNote,
    locationData,
    locLoading,
    locError,
    onRefreshLocation,
    onPostcodeSubmit,
    hardness: getHardness(),
    waterHardnessOverride,
    fermTempOverride,
    results: plan.ok ? plan.results : null,
    timing: plan.ok ? plan.timing : null,
    timeline: plan.ok ? plan.timeline : [],
    advice: plan.ok ? plan.advice : [],
    waterAdvice: plan.ok ? plan.waterAdvice : [],
    showResults: plan.ok,
    validationError: plan.ok ? null : plan.error,
    selectPreset,
    toggleVegInMix,
    clearMix,
    updateMixGrams,
    applyCombo,
    VEG_COMBOS,
    selectVeg,
    // Each of these also marks the calculator as touched.
    ...setters,
    restoreFrom,
  };
}
