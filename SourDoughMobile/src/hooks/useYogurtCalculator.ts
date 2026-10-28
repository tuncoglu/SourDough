import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  YogurtType,
  YogurtCultureType,
  YogurtCulturePreset,
  YogurtResults,
  YogurtStepPoint,
  YogurtThickness,
  MilkEntry,
  StarterSource,
} from '@sourdough/calc/models/types';
import { YOGURT_CULTURES, YOGURT_TYPE_ORDER, findMilk, DEFAULT_MILK_ID } from '@sourdough/calc/data/yogurtCultures';
import { calculateSachets } from '@sourdough/calc/lib/yogurtCalculations';
import { planYogurt } from '@sourdough/calc/lib/yogurtPlan';
import { computeFermentTemp, DailyTempSummary, FermentTempResult } from '@sourdough/calc/lib/lactoCalculations';
import { useLocation } from './useLocation';
import { getSettings } from '../store/settingsCache';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';
import type { LocationData } from '../lib/location';
import { useAppTheme } from '../theme';

export interface YogurtCalculatorState {
  // Inputs
  yogurtType: YogurtType;
  cultureType: YogurtCultureType;
  milkId: string;
  milk: MilkEntry;
  milkLitres: string;
  starterSource: StarterSource;
  sachetCount: string;
  previousBatchGrams: string;
  preHeatEnabled: boolean;

  // Temperature
  effectiveTemp: number;
  tempResult: FermentTempResult | null;
  /** What the temperature card should say, including a temperature the user set. */
  tempSummary: string;
  /** Where the room temperature came from — 'manual' when set in Settings. */
  tempSource: FermentTempResult['source'];
  dailyTemps: DailyTempSummary[];

  // Preset
  presetName: string;
  presetEmoji: string;
  tips: string[];
  presetHealthNote?: string;
  presetStrainInfo?: string;
  thickness: YogurtThickness;
  cultureDescription: string;

  // Location
  locationData: LocationData | null;
  locLoading: boolean;
  locError: string | null;
  onRefreshLocation: () => void;
  onPostcodeSubmit: (postcode: string) => void;
  /** Manual hardness override from Settings (mg/L CaCO₃, 0 = auto-detect). */
  waterHardnessOverride: number;

  // Results — recalculated live from the inputs, so they are never stale.
  results: YogurtResults | null;
  timeline: YogurtStepPoint[];
  advice: string[];
  nutrition: { fatPct: number; proteinPct: number } | null;
  showResults: boolean;
  /** Inline validation message (e.g. missing milk volume). */
  validationError: string | null;

  // Culture order for UI
  thermophilicCultures: Array<{ id: string; preset: YogurtCulturePreset }>;
  mesophilicCultures: Array<{ id: string; preset: YogurtCulturePreset }>;

  // Actions
  selectPreset: (type: YogurtType) => void;
  selectMilk: (id: string) => void;
  setMilkLitres: (v: string) => void;
  setSachetCount: (v: string) => void;
  setStarterSource: (v: StarterSource) => void;
  setPreviousBatchGrams: (v: string) => void;
  setPreHeatEnabled: (v: boolean) => void;
}

export function useYogurtCalculator(): YogurtCalculatorState {
  const { locationData, locLoading, locError, onRefreshLocation, onPostcodeSubmit } = useLocation();

  const [yogurtType, setYogurtType] = useState<YogurtType>('bulgarian');
  const [milkId, setMilkId] = useState(DEFAULT_MILK_ID);
  const [milkLitres, setMilkLitres] = useState('2');
  const [starterSource, setStarterSource] = useState<StarterSource>('sachet');
  const [sachetCount, setSachetCount] = useState('1');
  const [previousBatchGrams, setPreviousBatchGrams] = useState('60'); // 30g/L × 2L default
  const [preHeatEnabled, setPreHeatEnabled] = useState(true);
  const [waterHardnessOverride, setWaterHardnessOverride] = useState(0);
  /** Room temperature the user set (°C); 0 = use the local forecast. */
  const [fermTempOverride, setFermTempOverride] = useState(0);

  // Track manual edits so auto-derived starter amounts don't overwrite
  // values the user deliberately set (milk-volume changes would otherwise
  // silently rewrite them).
  const sachetTouchedRef = useRef(false);
  const prevBatchTouchedRef = useRef(false);

  const wrappedSetSachetCount = useCallback((v: string) => {
    sachetTouchedRef.current = true;
    setSachetCount(v);
  }, []);
  const wrappedSetPreviousBatchGrams = useCallback((v: string) => {
    prevBatchTouchedRef.current = true;
    setPreviousBatchGrams(v);
  }, []);

  // Derived
  const milk = useMemo(() => findMilk(milkId), [milkId]);
  const preset = YOGURT_CULTURES[yogurtType]!;
  const { unitSystem } = useAppTheme();
  const cultureType = preset.type;
  const thickness = preset.thickness;

  // Split cultures into thermophilic / mesophilic for grouped UI
  const thermophilicCultures = YOGURT_TYPE_ORDER.filter((c) => c.section === 'thermophilic');
  const mesophilicCultures = YOGURT_TYPE_ORDER.filter((c) => c.section === 'mesophilic');

  // Temperature from forecast
  const tempResult = useMemo(() => {
    const roughDays = 7; // show full week of ambient temps
    return computeFermentTemp(
      locationData?.hourlyForecast ?? null,
      locationData?.ambientTemp ?? null,
      roughDays,
      unitSystem,
    );
  }, [locationData, unitSystem]);

  /**
   * The forecast is the OUTDOOR temperature. A mesophilic culture ferments at
   * room temperature, and a kitchen can be several degrees warmer, so a
   * temperature the user set in Settings wins. Thermophilic cultures are held
   * at their own temperature, so for them it changes nothing.
   */
  const overrideApplies = cultureType === 'mesophilic' && fermTempOverride > 0;
  const effectiveTemp = overrideApplies ? fermTempOverride : tempResult.effectiveTemp;
  const dailyTemps = tempResult.dailyTemps;
  const tempSource: FermentTempResult['source'] = overrideApplies ? 'manual' : tempResult.source;
  const tempSummary = overrideApplies
    ? `Using your set temperature ${formatTemp(fermTempOverride, unitSystem, 1)} — the local forecast would have been ${formatTemp(tempResult.effectiveTemp, unitSystem, 1)}`
    : cultureType === 'mesophilic'
      ? `${tempResult.summary} · fermenting indoors? Set your room temperature in Settings`
      : tempResult.summary;

  // When preset changes, update defaults
  const selectPreset = useCallback((type: YogurtType) => {
    const p = YOGURT_CULTURES[type]!;
    setYogurtType(type);
    setStarterSource('sachet');
    // Preset selection is programmatic — reset the manual-edit flags
    sachetTouchedRef.current = false;
    prevBatchTouchedRef.current = false;
    setSachetCount(String(calculateSachets(p.typicalMilkLitres, p.starterRatio)));
    setPreviousBatchGrams(String(p.typicalMilkLitres * 30)); // 30g per litre
    setMilkLitres(String(p.typicalMilkLitres));
    // Enable pre-heat by default for thermophilic, disable for mesophilic
    setPreHeatEnabled(p.type === 'thermophilic');
    // Vegan culture requires plant milk; switch back to cow when leaving it
    if (type === 'vegan-soya') {
      setMilkId('soya');
    } else {
      setMilkId((prev) => (prev === 'soya' ? 'cow-whole' : prev));
    }
  }, []);

  // When milk changes
  const selectMilk = useCallback((id: string) => {
    setMilkId(id);
  }, []);

  // Load the settings that shape the estimate
  useFocusEffect(useCallback(() => {
    getSettings().then((s) => {
      setWaterHardnessOverride(s.waterHardnessOverride ?? 0);
      setFermTempOverride(s.fermTempOverride ?? 0);
    });
  }, []));

  // Auto-update sachet count / previous-batch grams when milk volume
  // changes — but only for fields the user hasn't hand-edited.
  useEffect(() => {
    const litres = parseFloat(milkLitres) || 0;
    if (litres > 0 && preset) {
      if (!sachetTouchedRef.current) {
        setSachetCount(String(calculateSachets(litres, preset.starterRatio)));
      }
      if (!prevBatchTouchedRef.current) {
        setPreviousBatchGrams(String(litres * 30)); // 30g per litre (≈2 tbsp/L)
      }
    }
  }, [milkLitres, preset]);

  // Everything the page shows, recalculated whenever an input changes.
  const plan = useMemo(() => planYogurt({
    preset,
    milk,
    milkLitres,
    sachetCount,
    starterSource,
    previousBatchGrams,
    preHeatEnabled,
    hourlyForecast: locationData?.hourlyForecast ?? null,
    currentTemp: locationData?.ambientTemp ?? null,
    fermTempOverride,
    unitSystem,
  }), [preset, milk, milkLitres, sachetCount, starterSource, previousBatchGrams, preHeatEnabled, locationData, fermTempOverride, unitSystem]);

  return {
    yogurtType,
    cultureType,
    milkId,
    milk,
    milkLitres,
    starterSource,
    sachetCount,
    previousBatchGrams,
    preHeatEnabled,
    effectiveTemp,
    tempResult,
    tempSummary,
    tempSource,
    dailyTemps,
    presetName: preset.name,
    presetEmoji: preset.emoji,
    tips: preset.tips ?? [],
    presetHealthNote: preset.healthNote,
    presetStrainInfo: preset.strainInfo,
    thickness,
    cultureDescription: preset.description,
    locationData,
    locLoading,
    locError,
    onRefreshLocation,
    onPostcodeSubmit,
    waterHardnessOverride,
    results: plan.ok ? plan.results : null,
    timeline: plan.ok ? plan.timeline : [],
    advice: plan.ok ? plan.advice : [],
    nutrition: plan.ok ? plan.nutrition : null,
    showResults: plan.ok,
    validationError: plan.ok ? null : plan.error,
    thermophilicCultures,
    mesophilicCultures,
    selectPreset,
    selectMilk,
    setMilkLitres,
    setSachetCount: wrappedSetSachetCount,
    setStarterSource,
    setPreviousBatchGrams: wrappedSetPreviousBatchGrams,
    setPreHeatEnabled,
  };
}
