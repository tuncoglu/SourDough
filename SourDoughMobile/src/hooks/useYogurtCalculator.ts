import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  YogurtType,
  YogurtCultureType,
  YogurtCulturePreset,
  YogurtInputs,
  YogurtResults,
  YogurtStepPoint,
  YogurtThickness,
  MilkEntry,
  StarterSource,
} from '../models/types';
import { YOGURT_CULTURES, YOGURT_TYPE_ORDER, MILK_TYPES, findMilk, DEFAULT_MILK_ID } from '../data/yogurtCultures';
import {
  runYogurtCalculations,
  buildYogurtTimeline,
  yogurtAdvice,
  estimateIncubation,
  estimateYield,
  calculateSachets,
  calculateYogurtNutrition,
} from '../lib/yogurtCalculations';
import { computeFermentTemp, DailyTempSummary, FermentTempResult } from '../lib/lactoCalculations';
import { useLocation } from './useLocation';
import { useStaleResults, dirtySetter } from './useStaleResults';
import { getSettings } from '../store/settingsCache';
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

  // Results
  results: YogurtResults | null;
  timeline: YogurtStepPoint[];
  advice: string[];
  nutrition: { fatPct: number; proteinPct: number } | null;
  showResults: boolean;
  /** Inline validation message (e.g. missing milk volume) — shown above Calculate. */
  validationError: string | null;
  /** True when inputs changed after the last calculation (stale-results banner). */
  inputsDirty: boolean;

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
  calculate: () => void;
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
  const [showResults, setShowResults] = useState(false);
  const [waterHardnessOverride, setWaterHardnessOverride] = useState(0);

  // Track manual edits so auto-derived starter amounts don't overwrite
  // values the user deliberately set (milk-volume changes would otherwise
  // silently rewrite them).
  const sachetTouchedRef = useRef(false);
  const prevBatchTouchedRef = useRef(false);

  const [results, setResults] = useState<YogurtResults | null>(null);
  const [timeline, setTimeline] = useState<YogurtStepPoint[]>([]);
  const [advice, setAdvice] = useState<string[]>([]);
  const [nutrition, setNutrition] = useState<{ fatPct: number; proteinPct: number } | null>(null);
  const { validationError, setValidationError, inputsDirty, markInputsChanged, markCalculated } = useStaleResults();

  const wrappedSetSachetCount = useCallback((v: string) => {
    sachetTouchedRef.current = true;
    markInputsChanged();
    setSachetCount(v);
  }, [markInputsChanged]);
  const wrappedSetPreviousBatchGrams = useCallback((v: string) => {
    prevBatchTouchedRef.current = true;
    markInputsChanged();
    setPreviousBatchGrams(v);
  }, [markInputsChanged]);

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

  const effectiveTemp = tempResult.effectiveTemp;
  const dailyTemps = tempResult.dailyTemps;

  // When preset changes, update defaults
  const selectPreset = useCallback((type: YogurtType) => {
    const p = YOGURT_CULTURES[type]!;
    setYogurtType(type);
    setShowResults(false);
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
    setShowResults(false);
  }, []);

  // Load water hardness override from settings
  useFocusEffect(useCallback(() => {
    getSettings().then((s) => {
      setWaterHardnessOverride(s.waterHardnessOverride ?? 0);
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

  const calculate = useCallback(() => {
    const litres = parseFloat(milkLitres) || 0;
    const sachets = parseInt(sachetCount) || 0;
    const temp = cultureType === 'thermophilic'
      ? preset.typicalTempC
      : effectiveTemp; // mesophilic uses ambient temp

    if (litres <= 0) {
      setValidationError('Enter the amount of milk before calculating.');
      return;
    }
    if (starterSource === 'sachet' && sachets <= 0) {
      setValidationError('Enter the number of starter sachets before calculating.');
      return;
    }

    const inputs: YogurtInputs = {
      yogurtType,
      cultureType,
      milkId,
      milkLitres: litres,
      incubationTempC: temp,
      starterSource,
      sachetCount: sachets,
      previousBatchGrams: parseFloat(previousBatchGrams) || undefined,
      preHeatEnabled,
    };

    // First pass with preset temp
    const baseResults = runYogurtCalculations(inputs, preset, milk);

    // Refine with accurate temperature for mesophilic (from weather forecast)
    let finalTemp = temp;
    if (cultureType === 'mesophilic') {
      const accurateTemp = computeFermentTemp(
        locationData?.hourlyForecast ?? null,
        locationData?.ambientTemp ?? null,
        baseResults.incubationHours / 24,
      );
      finalTemp = accurateTemp.effectiveTemp;

      // Recalculate with accurate temp
      const incubation = estimateIncubation(finalTemp, cultureType, preset.typicalHours, preset.tempMaxC);
      const yield_ = estimateYield(litres, preset.thickness);

      const finalResults: YogurtResults = {
        ...baseResults,
        starterSource: baseResults.starterSource,
        sachetCount: baseResults.sachetCount,
        previousBatchGrams: baseResults.previousBatchGrams,
        incubationHours: incubation.hours,
        incubationHoursMin: incubation.hoursMin,
        incubationHoursMax: incubation.hoursMax,
        estimatedYieldGrams: yield_.estimatedYieldGrams,
        estimatedYieldLitres: yield_.estimatedYieldLitres,
        estimatedServings: yield_.estimatedServings,
      };

      setResults(finalResults);
      setTimeline(buildYogurtTimeline(finalResults.incubationHours, cultureType, preset.thickness, preHeatEnabled, starterSource, finalResults.previousBatchGrams, unitSystem));
      setAdvice(yogurtAdvice(cultureType, finalTemp, milk.fatLevel, preHeatEnabled, preset.thickness, finalResults.incubationHours, unitSystem));
      setNutrition(calculateYogurtNutrition(milk, preset.thickness));
    } else {
      // Thermophilic — use preset temp directly
      setResults(baseResults);
      setTimeline(buildYogurtTimeline(baseResults.incubationHours, cultureType, preset.thickness, preHeatEnabled, starterSource, baseResults.previousBatchGrams, unitSystem));
      setAdvice(yogurtAdvice(cultureType, temp, milk.fatLevel, preHeatEnabled, preset.thickness, baseResults.incubationHours, unitSystem));
      setNutrition(calculateYogurtNutrition(milk, preset.thickness));
    }

    setShowResults(true);
    markCalculated();
  }, [yogurtType, cultureType, milkId, milkLitres, sachetCount, starterSource, previousBatchGrams, preHeatEnabled, milk, preset, effectiveTemp, locationData, markCalculated]);

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
    results,
    timeline,
    advice,
    nutrition,
    showResults,
    validationError,
    inputsDirty,
    thermophilicCultures,
    mesophilicCultures,
    selectPreset,
    selectMilk,
    // Manual input setters: invalidate previous results so the stale banner
    // appears (preset/milk selection already resets showResults directly).
    setMilkLitres: dirtySetter(markInputsChanged, setMilkLitres),
    setSachetCount: wrappedSetSachetCount,
    setStarterSource: dirtySetter(markInputsChanged, setStarterSource),
    setPreviousBatchGrams: wrappedSetPreviousBatchGrams,
    setPreHeatEnabled: dirtySetter(markInputsChanged, setPreHeatEnabled),
    calculate,
  };
}
