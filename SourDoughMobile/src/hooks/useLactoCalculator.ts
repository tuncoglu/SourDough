import { useState, useMemo, useCallback, useEffect } from 'react';
import { FermentType, FermentMethod, SaltCrystal, FermentInputs, FermentResults, LactoDayPoint, WaterHardness } from '../models/types';
import { FERMENT_PRESETS } from '../data/fermentPresets';
import { VEGETABLES, findVeg, VegEntry } from '../data/vegetables';
import {
  runLactoCalculations,
  buildLactoTimeline,
  lactoAdvice,
  estimateFermentDuration,
  waterHardnessFermentAdvice,
  computeFermentTemp,
  DailyTempSummary,
  FermentTempResult,
} from '../lib/lactoCalculations';
import { useLocation } from './useLocation';
import { getSettings } from '../store/settingsCache';
import { classifyHardness } from '../data/ukWaterHardness';

/** Which vegetable each preset defaults to. */
const PRESET_DEFAULT_VEG: Record<string, string> = {
  sauerkraut: 'green-cabbage',
  kimchi: 'napa-cabbage',
  'dill-pickles': 'pickling-cucumber',
  'carrot-sticks': 'carrot',
  'hot-sauce': 'jalapeno',
  'beet-kvass': 'beetroot',
  'radish-cauliflower': 'cauliflower',
  custom: 'green-cabbage',
};

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

  // Temperature (auto-detected from weather)
  effectiveTemp: number;
  tempResult: FermentTempResult | null;
  dailyTemps: DailyTempSummary[];

  // Preset
  presetName: string;
  presetEmoji: string;
  tips: string[];
  presetHealthNote?: string;

  // Location & water
  locationData: ReturnType<typeof useLocation>['data'];
  locLoading: boolean;
  locError: string | null;
  onRefreshLocation: () => void;
  onPostcodeSubmit: (postcode: string) => void;
  hardness: WaterHardness | null;

  // Results
  results: FermentResults | null;
  timeline: LactoDayPoint[];
  advice: string[];
  waterAdvice: string[];
  showResults: boolean;

  // Actions
  selectPreset: (type: FermentType) => void;
  selectVeg: (id: string) => void;
  setVegWeight: (v: string) => void;
  setWaterAmount: (v: string) => void;
  setSaltPct: (v: string) => void;
  setSaltType: (t: SaltCrystal) => void;
  calculate: () => void;
}

export function useLactoCalculator(): LactoCalculatorState {
  const { data: locationData, loading: locLoading, error: locError, detect, refineWithPostcode } = useLocation();

  const [fermentType, setFermentType] = useState<FermentType>('sauerkraut');
  const [vegId, setVegId] = useState('green-cabbage');
  const [vegWeight, setVegWeight] = useState('1000');
  const [waterAmount, setWaterAmount] = useState('500');
  const [saltPct, setSaltPct] = useState('2.0');
  const [saltType, setSaltType] = useState<SaltCrystal>('maldon-flake');
  const [showResults, setShowResults] = useState(false);
  const [waterHardnessOverride, setWaterHardnessOverride] = useState(0);

  const [results, setResults] = useState<FermentResults | null>(null);
  const [timeline, setTimeline] = useState<LactoDayPoint[]>([]);
  const [advice, setAdvice] = useState<string[]>([]);
  const [waterAdvice, setWaterAdvice] = useState<string[]>([]);

  // Derived
  const veg = useMemo(() => findVeg(vegId), [vegId]);
  const preset = FERMENT_PRESETS[fermentType]!;
  const method = preset.method;

  // Load water hardness override from settings
  useEffect(() => {
    getSettings().then((s) => {
      setWaterHardnessOverride(s.waterHardnessOverride ?? 0);
    });
  }, []);

  const getHardness = useCallback((): WaterHardness => {
    if (waterHardnessOverride > 0) {
      return { mgL: waterHardnessOverride, classification: classifyHardness(waterHardnessOverride), note: 'Manual override', key: 'manual' };
    }
    if (locationData?.hardness) return locationData.hardness;
    return { mgL: 120, classification: 'moderately soft', note: 'Unknown — assuming moderate', key: 'fallback' };
  }, [waterHardnessOverride, locationData]);

  // Compute temperature from forecast in real time
  const tempResult = useMemo(() => {
    // First pass: rough estimate to know how many days to forecast for
    const roughDays = 7; // default rough estimate
    return computeFermentTemp(
      locationData?.hourlyForecast ?? null,
      locationData?.ambientTemp ?? null,
      roughDays,
    );
  }, [locationData]);

  const effectiveTemp = tempResult.effectiveTemp;
  const dailyTemps = tempResult.dailyTemps;

  // When preset changes, update method + default veg + salt%
  const selectPreset = useCallback((type: FermentType) => {
    const p = FERMENT_PRESETS[type]!;
    setFermentType(type);
    setShowResults(false);

    const defaultVegId = PRESET_DEFAULT_VEG[type] ?? 'green-cabbage';
    const defaultVeg = findVeg(defaultVegId);
    setVegId(defaultVegId);

    const recommendedSalt = p.method === 'brine'
      ? defaultVeg.typicalBrineSaltPct
      : defaultVeg.typicalDrySaltPct;
    setSaltPct(String(recommendedSalt));
    setVegWeight(String(defaultVeg.typicalWeight));

    if (p.method === 'brine') {
      setWaterAmount('500');
    } else {
      setWaterAmount('0');
    }
  }, []);

  // When veg changes, auto-update salt % recommendation
  const selectVeg = useCallback((id: string) => {
    const v = findVeg(id);
    setVegId(id);
    setShowResults(false);
    setVegWeight(String(v.typicalWeight));

    const recommendedSalt = method === 'brine'
      ? v.typicalBrineSaltPct
      : v.typicalDrySaltPct;
    setSaltPct(String(recommendedSalt));
    setWaterAmount(method === 'brine' ? '500' : '0');
  }, [method]);

  const calculate = useCallback(() => {
    const vegW = parseFloat(vegWeight) || 0;
    const waterW = parseFloat(waterAmount) || 0;
    const salt = parseFloat(saltPct) || 2.0;

    if (vegW <= 0) return;
    if (method === 'brine' && waterW <= 0) return;

    // Recompute temp with the actual estimated days (first pass with rough)
    const baseInputs: FermentInputs = {
      fermentType,
      method,
      vegWeight: vegW,
      waterAmount: waterW,
      saltPct: salt,
      saltType,
      ambientTemp: effectiveTemp,
    };

    const baseResults = runLactoCalculations(baseInputs, veg.waterContentPct, veg.speedFactor);

    // Now compute accurate temp based on the actual estimated duration
    const accurateTemp = computeFermentTemp(
      locationData?.hourlyForecast ?? null,
      locationData?.ambientTemp ?? null,
      baseResults.estimatedDays,
    );
    const temp = accurateTemp.effectiveTemp;

    // Recalculate with accurate temp (salinity unchanged — already correct from baseResults)
    const duration = estimateFermentDuration(temp, veg.speedFactor);
    const finalResults: FermentResults = {
      ...baseResults,
      estimatedDays: duration.days,
      estimatedDaysMin: duration.daysMin,
      estimatedDaysMax: duration.daysMax,
    };

    const h = getHardness();

    setResults(finalResults);
    setTimeline(buildLactoTimeline(finalResults.estimatedDays, method));
    setAdvice(lactoAdvice(method, salt, temp, finalResults.estimatedDays));
    setWaterAdvice(waterHardnessFermentAdvice(h));
    setShowResults(true);
  }, [vegWeight, waterAmount, saltPct, saltType, fermentType, method, veg, effectiveTemp, locationData, getHardness]);

  return {
    fermentType,
    method,
    vegId,
    veg,
    vegWeight,
    waterAmount,
    saltPct,
    saltType,
    effectiveTemp,
    tempResult,
    dailyTemps,
    presetName: preset.name,
    presetEmoji: preset.emoji,
    tips: preset.tips ?? [],
    presetHealthNote: preset.healthNote,
    locationData,
    locLoading,
    locError,
    onRefreshLocation: detect,
    onPostcodeSubmit: refineWithPostcode,
    hardness: getHardness(),
    results,
    timeline,
    advice,
    waterAdvice,
    showResults,
    selectPreset,
    selectVeg,
    setVegWeight,
    setWaterAmount,
    setSaltPct,
    setSaltType,
    calculate,
  };
}
