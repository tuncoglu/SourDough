import { useState, useMemo, useCallback, useEffect } from 'react';
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
  calculateSachets,
  calculateYogurtNutrition,
} from '../lib/yogurtCalculations';
import { computeFermentTemp, DailyTempSummary, FermentTempResult } from '../lib/lactoCalculations';
import { useLocation } from './useLocation';

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
  locationData: ReturnType<typeof useLocation>['data'];
  locLoading: boolean;
  locError: string | null;
  onRefreshLocation: () => void;
  onPostcodeSubmit: (postcode: string) => void;

  // Results
  results: YogurtResults | null;
  timeline: YogurtStepPoint[];
  advice: string[];
  nutrition: { fatPct: number; proteinPct: number } | null;
  showResults: boolean;

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
  const { data: locationData, loading: locLoading, error: locError, detect, refineWithPostcode } = useLocation();

  const [yogurtType, setYogurtType] = useState<YogurtType>('bulgarian');
  const [milkId, setMilkId] = useState(DEFAULT_MILK_ID);
  const [milkLitres, setMilkLitres] = useState('2');
  const [starterSource, setStarterSource] = useState<StarterSource>('sachet');
  const [sachetCount, setSachetCount] = useState('1');
  const [previousBatchGrams, setPreviousBatchGrams] = useState('60'); // 30g/L × 2L default
  const [preHeatEnabled, setPreHeatEnabled] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const [results, setResults] = useState<YogurtResults | null>(null);
  const [timeline, setTimeline] = useState<YogurtStepPoint[]>([]);
  const [advice, setAdvice] = useState<string[]>([]);
  const [nutrition, setNutrition] = useState<{ fatPct: number; proteinPct: number } | null>(null);

  // Derived
  const milk = useMemo(() => findMilk(milkId), [milkId]);
  const preset = YOGURT_CULTURES[yogurtType]!;
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
    );
  }, [locationData]);

  const effectiveTemp = tempResult.effectiveTemp;
  const dailyTemps = tempResult.dailyTemps;

  // When preset changes, update defaults
  const selectPreset = useCallback((type: YogurtType) => {
    const p = YOGURT_CULTURES[type]!;
    setYogurtType(type);
    setShowResults(false);
    setStarterSource('sachet');
    setSachetCount(String(calculateSachets(p.typicalMilkLitres, p.starterRatio)));
    setPreviousBatchGrams(String(p.typicalMilkLitres * 30)); // 30g per litre
    setMilkLitres(String(p.typicalMilkLitres));
    // Enable pre-heat by default for thermophilic, disable for mesophilic
    setPreHeatEnabled(p.type === 'thermophilic');
  }, []);

  // When milk changes
  const selectMilk = useCallback((id: string) => {
    setMilkId(id);
    setShowResults(false);
  }, []);

  // Auto-update sachet count / previous-batch grams when milk volume changes
  useEffect(() => {
    const litres = parseFloat(milkLitres) || 0;
    if (litres > 0 && preset) {
      setSachetCount(String(calculateSachets(litres, preset.starterRatio)));
      setPreviousBatchGrams(String(litres * 30)); // 30g per litre (≈2 tbsp/L)
    }
  }, [milkLitres, preset]);

  const calculate = useCallback(() => {
    const litres = parseFloat(milkLitres) || 0;
    const sachets = parseInt(sachetCount) || 1;
    const temp = cultureType === 'thermophilic'
      ? preset.typicalTempC
      : effectiveTemp; // mesophilic uses ambient temp

    if (litres <= 0) return;

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
      const incubation = estimateIncubation(finalTemp, cultureType, preset.typicalHours);
      const yield_ = (() => {
        const milkGrams = litres * 1000 * 1.03;
        const afterIncubation = milkGrams * 0.97;
        const factors: Record<string, number> = { thin: 1, medium: 1, thick: 0.75, 'very-thick': 0.60 };
        const sf = factors[preset.thickness] ?? 1;
        const fg = Math.round(afterIncubation * sf);
        return {
          estimatedYieldGrams: fg,
          estimatedYieldLitres: Math.round(fg / 1000 * 10) / 10,
          estimatedServings: Math.round(fg / 150),
        };
      })();

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
      setTimeline(buildYogurtTimeline(finalResults.incubationHours, cultureType, preset.thickness, preHeatEnabled, starterSource, finalResults.previousBatchGrams));
      setAdvice(yogurtAdvice(cultureType, finalTemp, milk.fatLevel, preHeatEnabled, preset.thickness, finalResults.incubationHours));
      setNutrition(calculateYogurtNutrition(milk, preset.thickness));
    } else {
      // Thermophilic — use preset temp directly
      setResults(baseResults);
      setTimeline(buildYogurtTimeline(baseResults.incubationHours, cultureType, preset.thickness, preHeatEnabled, starterSource, baseResults.previousBatchGrams));
      setAdvice(yogurtAdvice(cultureType, temp, milk.fatLevel, preHeatEnabled, preset.thickness, baseResults.incubationHours));
      setNutrition(calculateYogurtNutrition(milk, preset.thickness));
    }

    setShowResults(true);
  }, [yogurtType, cultureType, milkId, milkLitres, sachetCount, starterSource, previousBatchGrams, preHeatEnabled, milk, preset, effectiveTemp, locationData]);

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
    onRefreshLocation: detect,
    onPostcodeSubmit: refineWithPostcode,
    results,
    timeline,
    advice,
    nutrition,
    showResults,
    thermophilicCultures,
    mesophilicCultures,
    selectPreset,
    selectMilk,
    setMilkLitres,
    setSachetCount,
    setStarterSource,
    setPreviousBatchGrams,
    setPreHeatEnabled,
    calculate,
  };
}
