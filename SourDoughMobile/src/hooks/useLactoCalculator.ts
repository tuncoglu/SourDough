import { useState, useMemo, useCallback, useEffect } from 'react';
import { FermentType, FermentMethod, SaltCrystal, FermentInputs, FermentResults, LactoDayPoint, WaterHardness } from '../models/types';
import { FERMENT_PRESETS, VEG_COMBOS } from '../data/fermentPresets';
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
  const [vegMix, setVegMix] = useState<{ vegId: string; grams: string }[]>([]);
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

  // Multi-veg mix: derived array with full VegEntry data
  const vegMixEntries = useMemo(() =>
    vegMix.map(m => ({ ...m, veg: findVeg(m.vegId) })),
    [vegMix],
  );
  const isMultiVeg = vegMixEntries.length > 1;
  const totalMixGrams = useMemo(() =>
    vegMixEntries.reduce((s, m) => s + (parseFloat(m.grams) || 0), 0),
    [vegMixEntries],
  );

  // Weighted properties from the mix (or fall back to single veg)
  const effectiveVeg = useMemo(() => {
    if (!isMultiVeg) return veg;
    const total = totalMixGrams || 1;
    const waterContentPct = vegMixEntries.reduce((s, m) =>
      s + m.veg.waterContentPct * (parseFloat(m.grams) || 0), 0) / total;
    const speedFactor = vegMixEntries.reduce((s, m) =>
      s + m.veg.speedFactor * (parseFloat(m.grams) || 0), 0) / total;
    const typicalBrineSaltPct = vegMixEntries.reduce((s, m) =>
      s + m.veg.typicalBrineSaltPct * (parseFloat(m.grams) || 0), 0) / total;
    const typicalDrySaltPct = vegMixEntries.reduce((s, m) =>
      s + m.veg.typicalDrySaltPct * (parseFloat(m.grams) || 0), 0) / total;
    const firmnessCounts = { soft: 0, medium: 0, firm: 0 };
    vegMixEntries.forEach(m => { firmnessCounts[m.veg.firmness]++; });
    const firmness = firmnessCounts.firm >= firmnessCounts.soft && firmnessCounts.firm >= firmnessCounts.medium
      ? 'firm' : firmnessCounts.medium >= firmnessCounts.soft ? 'medium' : 'soft';
    return {
      ...veg,
      waterContentPct: Math.round(waterContentPct),
      speedFactor: Math.round(speedFactor * 100) / 100,
      typicalBrineSaltPct: Math.round(typicalBrineSaltPct * 10) / 10,
      typicalDrySaltPct: Math.round(typicalDrySaltPct * 10) / 10,
      firmness: firmness as VegEntry['firmness'],
      name: vegMixEntries.map(m => m.veg.name).join(' + '),
      emoji: vegMixEntries.map(m => m.veg.emoji).join(''),
    };
  }, [isMultiVeg, veg, vegMixEntries, totalMixGrams]);

  const toggleVegInMix = useCallback((id: string) => {
    setVegMix(prev => {
      const exists = prev.find(m => m.vegId === id);
      if (exists) {
        const next = prev.filter(m => m.vegId !== id);
        // If down to 1 veg, switch back to single-veg mode
        if (next.length === 1) {
          setVegId(next[0].vegId);
          setVegWeight(next[0].grams);
          return [];
        }
        return next;
      }
      const entry = findVeg(id);
      const currentSingle = vegId;
      // First veg being added — start mix with existing single veg + new veg
      if (prev.length === 0) {
        const singleGrams = vegWeight;
        return [
          { vegId: currentSingle, grams: singleGrams },
          { vegId: id, grams: String(entry.typicalWeight) },
        ];
      }
      return [...prev, { vegId: id, grams: String(entry.typicalWeight) }];
    });
    setShowResults(false);
  }, [vegId, vegWeight]);

  const updateMixGrams = useCallback((id: string, grams: string) => {
    setVegMix(prev => prev.map(m => m.vegId === id ? { ...m, grams } : m));
    setShowResults(false);
  }, []);

  const applyCombo = useCallback((combo: typeof VEG_COMBOS[number]) => {
    setFermentType('custom');
    setVegId(combo.vegetables[0].vegId); // set primary veg
    setVegMix(combo.vegetables.map(v => ({
      vegId: v.vegId,
      grams: String(Math.round(combo.typicalTotalGrams * v.proportion)),
    })));
    setSaltPct(String(combo.typicalSaltPct));
    setShowResults(false);
  }, []);

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
    setVegMix([]); // reset multi-veg mix when switching presets

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
    const vegW = isMultiVeg ? totalMixGrams : (parseFloat(vegWeight) || 0);
    const waterW = parseFloat(waterAmount) || 0;
    const salt = parseFloat(saltPct) || 2.0;

    if (vegW <= 0) return;
    if (method === 'brine' && waterW <= 0) return;

    const baseInputs: FermentInputs = {
      fermentType,
      method,
      vegWeight: vegW,
      waterAmount: waterW,
      saltPct: salt,
      saltType,
      ambientTemp: effectiveTemp,
    };

    const baseResults = runLactoCalculations(baseInputs, effectiveVeg.waterContentPct, effectiveVeg.speedFactor);

    // Now compute accurate temp based on the actual estimated duration
    const accurateTemp = computeFermentTemp(
      locationData?.hourlyForecast ?? null,
      locationData?.ambientTemp ?? null,
      baseResults.estimatedDays,
    );
    const temp = accurateTemp.effectiveTemp;

    // Recalculate with accurate temp (salinity unchanged — already correct from baseResults)
    const duration = estimateFermentDuration(temp, effectiveVeg.speedFactor);
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
  }, [vegWeight, waterAmount, saltPct, saltType, fermentType, method, effectiveVeg, effectiveTemp, locationData, getHardness, isMultiVeg, totalMixGrams]);

  return {
    fermentType,
    method,
    vegId,
    veg: effectiveVeg,
    vegWeight,
    vegMix,
    vegMixEntries,
    isMultiVeg,
    totalMixGrams,
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
    toggleVegInMix,
    updateMixGrams,
    applyCombo,
    VEG_COMBOS,
    selectVeg,
    setVegWeight,
    setWaterAmount,
    setSaltPct,
    setSaltType,
    calculate,
  };
}
