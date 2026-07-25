import { useState, useMemo, useCallback } from 'react';
import { FermentType, FermentMethod, SaltCrystal, FermentInputs, FermentResults, LactoDayPoint } from '../models/types';
import { FERMENT_PRESETS } from '../data/fermentPresets';
import { VEGETABLES, findVeg, VegEntry } from '../data/vegetables';
import { runLactoCalculations, buildLactoTimeline, lactoAdvice, estimateFermentDuration } from '../lib/lactoCalculations';

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
  ambientTemp: string;

  // Preset
  presetName: string;
  presetEmoji: string;
  tips: string[];

  // Results (null until calculated)
  results: FermentResults | null;
  timeline: LactoDayPoint[];
  advice: string[];
  showResults: boolean;

  // Actions
  selectPreset: (type: FermentType) => void;
  selectVeg: (id: string) => void;
  setVegWeight: (v: string) => void;
  setWaterAmount: (v: string) => void;
  setSaltPct: (v: string) => void;
  setSaltType: (t: SaltCrystal) => void;
  setAmbientTemp: (v: string) => void;
  calculate: () => void;
}

export function useLactoCalculator(): LactoCalculatorState {
  const [fermentType, setFermentType] = useState<FermentType>('sauerkraut');
  const [vegId, setVegId] = useState('green-cabbage');
  const [vegWeight, setVegWeight] = useState('1000');
  const [waterAmount, setWaterAmount] = useState('500');
  const [saltPct, setSaltPct] = useState('2.0');
  const [saltType, setSaltType] = useState<SaltCrystal>('fine-sea');
  const [ambientTemp, setAmbientTemp] = useState('22');
  const [showResults, setShowResults] = useState(false);

  const [results, setResults] = useState<FermentResults | null>(null);
  const [timeline, setTimeline] = useState<LactoDayPoint[]>([]);
  const [advice, setAdvice] = useState<string[]>([]);

  // Derived
  const veg = useMemo(() => findVeg(vegId), [vegId]);
  const preset = FERMENT_PRESETS[fermentType]!;
  const method = preset.method;

  // When preset changes, update method + default veg + salt%
  const selectPreset = useCallback((type: FermentType) => {
    const p = FERMENT_PRESETS[type]!;
    setFermentType(type);
    setShowResults(false);

    const defaultVegId = PRESET_DEFAULT_VEG[type] ?? 'green-cabbage';
    const defaultVeg = findVeg(defaultVegId);
    setVegId(defaultVegId);

    // Use the preset's typical salt, or the veg's recommendation
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
    const temp = parseFloat(ambientTemp) || 22;

    if (vegW <= 0) return;
    if (method === 'brine' && waterW <= 0) return;

    const inputs: FermentInputs = {
      fermentType,
      method,
      vegWeight: vegW,
      waterAmount: waterW,
      saltPct: salt,
      saltType,
      ambientTemp: temp,
    };

    const baseResults = runLactoCalculations(inputs);

    // Override duration with the veg-specific speed factor
    const duration = estimateFermentDuration(temp, veg.speedFactor);
    const finalResults: FermentResults = {
      ...baseResults,
      estimatedDays: duration.days,
      estimatedDaysMin: duration.daysMin,
      estimatedDaysMax: duration.daysMax,
      // Recalculate effective salinity with veg water content
      effectiveSalinity: (() => {
        const saltG = baseResults.saltGrams;
        if (method === 'brine') return salt;
        const releasedWater = vegW * (veg.waterContentPct / 100) * (method === 'mash' ? 1.0 : 0.7);
        const total = releasedWater + saltG;
        return total > 0 ? Math.round((saltG / total) * 1000) / 10 : salt;
      })(),
    };

    setResults(finalResults);
    setTimeline(buildLactoTimeline(finalResults.estimatedDays, method));
    setAdvice(lactoAdvice(method, salt, temp, finalResults.estimatedDays));
    setShowResults(true);
  }, [vegWeight, waterAmount, saltPct, ambientTemp, saltType, fermentType, method, veg]);

  return {
    fermentType,
    method,
    vegId,
    veg,
    vegWeight,
    waterAmount,
    saltPct,
    saltType,
    ambientTemp,
    presetName: preset.name,
    presetEmoji: preset.emoji,
    tips: preset.tips ?? [],
    results,
    timeline,
    advice,
    showResults,
    selectPreset,
    selectVeg,
    setVegWeight,
    setWaterAmount,
    setSaltPct,
    setSaltType,
    setAmbientTemp,
    calculate,
  };
}
