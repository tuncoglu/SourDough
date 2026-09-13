import { useState, useMemo, useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { FermentType, FermentMethod, SaltCrystal, FermentInputs, FermentResults, LactoDayPoint, PrepSize, WaterHardness } from '../models/types';
import { FERMENT_PRESETS, PRESET_DEFAULT_VEG, VEG_COMBOS, VegCombo } from '../data/fermentPresets';
import { VEGETABLES, findVeg, VEG_RELEASE_FACTOR, VegEntry } from '../data/vegetables';
import {
  runLactoCalculations,
  buildLactoTimeline,
  lactoAdvice,
  estimateFermentTiming,
  waterHardnessFermentAdvice,
  computeFermentTemp,
  acidBalanceVerdict,
  AcidBalanceVerdict,
  DailyTempSummary,
  FermentTempResult,
  FermentTiming,
  FermentTimingInput,
} from '../lib/lactoCalculations';
import { useLocation } from './useLocation';
import { useStaleResults, dirtySetter } from './useStaleResults';
import { isValidDecimalInput } from '../lib/inputValidation';
import { buildComboSetup, comboReferenceSpeed, presetReferenceSpeed, recommendedSaltPct, relativeVegSpeed, DEFAULT_BRINE_WATER_G } from '../lib/fermentSetup';
import { getSettings } from '../store/settingsCache';
import { classifyHardness } from '../data/ukWaterHardness';
import { FALLBACK_HARDNESS } from '../lib/hardnessUtils';
import { useAppTheme } from '../theme';
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

  // Results
  results: FermentResults | null;
  /** What moved the duration: recipe anchor + each applied adjustment. */
  timing: FermentTiming | null;
  timeline: LactoDayPoint[];
  advice: string[];
  waterAdvice: string[];
  showResults: boolean;
  /** Inline validation message (e.g. missing veg weight) — shown above Calculate. */
  validationError: string | null;
  /** True when inputs changed after the last calculation (stale-results banner). */
  inputsDirty: boolean;

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
  calculate: () => void;
}

export function useLactoCalculator(): LactoCalculatorState {
  const { locationData, locLoading, locError, onRefreshLocation, onPostcodeSubmit } = useLocation();
  const { unitSystem } = useAppTheme();

  const [fermentType, setFermentType] = useState<FermentType>('sauerkraut');
  const [vegId, setVegId] = useState('green-cabbage');
  const [vegWeight, setVegWeight] = useState('1000');
  const [vegMix, setVegMix] = useState<{ vegId: string; grams: string }[]>([]);
  const [waterAmount, setWaterAmount] = useState('500');
  const [saltPct, setSaltPct] = useState('2.0');
  const [saltType, setSaltType] = useState<SaltCrystal>('maldon-flake');
  const [showResults, setShowResults] = useState(false);
  const [waterHardnessOverride, setWaterHardnessOverride] = useState(0);
  /**
   * Method override for curated combos, which carry their own method.
   * `null` = follow the selected preset (see `method` below).
   */
  const [methodOverride, setMethodOverride] = useState<FermentMethod | null>(null);
  /** How the user cut the vegetables; reset to the recipe's own prep on apply. */
  const [prepSize, setPrepSize] = useState<PrepSize>('shredded');
  /** Starter culture used — shortens the lag phase (additive, not a ratio). */
  const [useStarter, setUseStarter] = useState(false);
  /**
   * The curated combo currently loaded, if any. Combos run as the `custom`
   * preset, so without this they lose their identity and every label falls
   * back to "Custom" (see `presetName` / `presetEmoji` below).
   */
  const [activeCombo, setActiveCombo] = useState<VegCombo | null>(null);

  const [results, setResults] = useState<FermentResults | null>(null);
  /** Timing breakdown behind the current estimate (see the timeline card). */
  const [timing, setTiming] = useState<FermentTiming | null>(null);
  const [timeline, setTimeline] = useState<LactoDayPoint[]>([]);
  const [advice, setAdvice] = useState<string[]>([]);
  const [waterAdvice, setWaterAdvice] = useState<string[]>([]);
  const { validationError, setValidationError, inputsDirty, markInputsChanged, markCalculated } = useStaleResults();

  // Derived
  const veg = useMemo(() => findVeg(vegId), [vegId]);
  const preset = FERMENT_PRESETS[fermentType]!;
  /** The preset's method, unless a curated combo overrode it. */
  const method = methodOverride ?? preset.method;

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
    if (!isMultiVeg) {
      return { ...veg, releaseFactor: VEG_RELEASE_FACTOR[veg.category] };
    }
    const total = totalMixGrams || 1;
    const waterContentPct = vegMixEntries.reduce((s, m) =>
      s + m.veg.waterContentPct * (parseFloat(m.grams) || 0), 0) / total;
    const speedFactor = vegMixEntries.reduce((s, m) =>
      s + m.veg.speedFactor * (parseFloat(m.grams) || 0), 0) / total;
    const typicalBrineSaltPct = vegMixEntries.reduce((s, m) =>
      s + m.veg.typicalBrineSaltPct * (parseFloat(m.grams) || 0), 0) / total;
    const typicalDrySaltPct = vegMixEntries.reduce((s, m) =>
      s + m.veg.typicalDrySaltPct * (parseFloat(m.grams) || 0), 0) / total;
    const releaseFactor = vegMixEntries.reduce((s, m) =>
      s + VEG_RELEASE_FACTOR[m.veg.category] * (parseFloat(m.grams) || 0), 0) / total;
    const firmnessCounts = { soft: 0, medium: 0, firm: 0 };
    vegMixEntries.forEach(m => { firmnessCounts[m.veg.firmness]++; });
    const firmness = firmnessCounts.firm >= firmnessCounts.soft && firmnessCounts.firm >= firmnessCounts.medium
      ? 'firm' : firmnessCounts.medium >= firmnessCounts.soft ? 'medium' : 'soft';
    // Compose the acid balance across the mix, by mass. Only possible when
    // EVERY component has been titrated — otherwise the verdict stays unknown
    // rather than extrapolating from a partial picture.
    const measured = vegMixEntries.filter(m => m.veg.acidBalance);
    const acidBalance = measured.length === vegMixEntries.length && measured.length > 0
      ? {
          acidDemandMmolL: vegMixEntries.reduce((s, m) => s + m.veg.acidBalance!.acidDemandMmolL * (parseFloat(m.grams) || 0), 0) / total,
          sugarSupplyMmolL: vegMixEntries.reduce((s, m) => s + m.veg.acidBalance!.sugarSupplyMmolL * (parseFloat(m.grams) || 0), 0) / total,
          // The endpoint of a novel mix has not been measured — omit it.
          measuredEndPH: undefined,
        }
      : undefined;

    return {
      ...veg,
      acidBalance,
      bloaterProne: vegMixEntries.some(m => m.veg.bloaterProne),
      waterContentPct: Math.round(waterContentPct),
      speedFactor: Math.round(speedFactor * 100) / 100,
      typicalBrineSaltPct: Math.round(typicalBrineSaltPct * 10) / 10,
      typicalDrySaltPct: Math.round(typicalDrySaltPct * 10) / 10,
      releaseFactor: Math.round(releaseFactor * 100) / 100,
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
        // Guard: tapping the already-selected veg in single mode is a no-op
        if (id === currentSingle) return prev;
        const singleGrams = vegWeight;
        return [
          { vegId: currentSingle, grams: singleGrams },
          { vegId: id, grams: String(entry.typicalWeight) },
        ];
      }
      return [...prev, { vegId: id, grams: String(entry.typicalWeight) }];
    });
    // Hand-editing the mix means it is no longer the curated combo.
    setActiveCombo(null);
    setShowResults(false);
  }, [vegId, vegWeight]);

  const updateMixGrams = useCallback((id: string, grams: string) => {
    // Sanitize: digits + at most one decimal point (same rule as NumberInput)
    if (!isValidDecimalInput(grams)) return;
    setVegMix(prev => prev.map(m => m.vegId === id ? { ...m, grams } : m));
    markInputsChanged();
  }, [markInputsChanged]);

  /** Reset the multi-veg mix and return to the primary single-veg mode.
   *  (Previously "Clear selection" looped toggleVegInMix, whose updater had
   *  side effects and left the last veg selected.) */
  const clearMix = useCallback(() => {
    setVegMix([]);
    setActiveCombo(null);
    setShowResults(false);
  }, []);

  const applyCombo = useCallback((combo: VegCombo) => {
    // A combo brings its own method — a mash combo must not inherit the
    // custom preset's brine, and a brine combo must not inherit the 0 g
    // water left behind by a mash preset.
    const setup = buildComboSetup(combo);
    setFermentType(setup.fermentType);
    setMethodOverride(setup.method);
    setActiveCombo(combo);
    setVegId(setup.vegId);
    setVegMix(setup.vegMix);
    setSaltPct(setup.saltPct);
    setPrepSize(combo.referencePrep);
    setWaterAmount(setup.waterAmount);
    setShowResults(false);
  }, []);

  // Load water hardness override from settings
  useFocusEffect(useCallback(() => {
    getSettings().then((s) => {
      setWaterHardnessOverride(s.waterHardnessOverride ?? 0);
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

  const effectiveTemp = tempResult.effectiveTemp;
  const dailyTemps = tempResult.dailyTemps;

  // When preset changes, update method + default veg + salt%
  const selectPreset = useCallback((type: FermentType) => {
    const p = FERMENT_PRESETS[type]!;
    setFermentType(type);
    setMethodOverride(null); // back to the preset's own method
    setActiveCombo(null); // a preset is not a curated combo
    setShowResults(false);
    setVegMix([]); // reset multi-veg mix when switching presets

    const defaultVegId = PRESET_DEFAULT_VEG[type] ?? 'green-cabbage';
    const defaultVeg = findVeg(defaultVegId);
    setVegId(defaultVegId);

    setSaltPct(String(recommendedSaltPct(defaultVeg, p.method)));
    setPrepSize(p.referencePrep);
    setVegWeight(String(defaultVeg.typicalWeight));

    if (p.method === 'brine') {
      setWaterAmount(String(DEFAULT_BRINE_WATER_G));
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

    setSaltPct(String(recommendedSaltPct(v, method)));
    setWaterAmount(method === 'brine' ? String(DEFAULT_BRINE_WATER_G) : '0');
  }, [method]);

  const calculate = useCallback(() => {
    const vegW = isMultiVeg ? totalMixGrams : (parseFloat(vegWeight) || 0);
    const waterW = parseFloat(waterAmount) || 0;
    const salt = parseFloat(saltPct);

    if (vegW <= 0) {
      setValidationError(
        isMultiVeg
          ? 'Enter grams for at least one vegetable before calculating.'
          : 'Enter a weight for the vegetables before calculating.',
      );
      return;
    }
    if (method === 'brine' && waterW <= 0) {
      setValidationError('Enter the amount of water for your brine.');
      return;
    }
    if (Number.isNaN(salt) || salt <= 0) {
      setValidationError('Enter a salt percentage greater than 0 before calculating.');
      return;
    }

    const baseInputs: FermentInputs = {
      fermentType,
      method,
      vegWeight: vegW,
      waterAmount: waterW,
      saltPct: salt,
      saltType,
      ambientTemp: effectiveTemp,
    };

    // Timing: the recipe's own documented duration is the anchor; the user's
    // kitchen moves it. Temperature comes from the weather forecast, salt
    // from the input, water hardness from detection/settings (only for
    // ferments that actually use added water), vegetables from the mix.
    const h = getHardness();
    const typicalDays = activeCombo?.typicalDays ?? preset.typicalDays;
    const referenceSpeed = activeCombo
      ? comboReferenceSpeed(activeCombo)
      : presetReferenceSpeed(preset);
    const timingInput: FermentTimingInput = {
      typicalDays,
      vegSpeedRatio: relativeVegSpeed(effectiveVeg.speedFactor, referenceSpeed),
      saltPct: salt,
      // The recipe's own salt level: a combo's, or what we recommend for
      // these vegetables. Keeps "as written" exactly on its documented days.
      recipeSaltPct: activeCombo?.typicalSaltPct ?? recommendedSaltPct(effectiveVeg, method),
      prepSize,
      referencePrep: activeCombo?.referencePrep ?? preset.referencePrep,
      starter: useStarter,
      hardnessMgL: h.mgL,
      usesAddedWater: method === 'brine' && waterW > 0,
      unitSystem,
    };

    const baseResults = runLactoCalculations(
      baseInputs,
      effectiveVeg.waterContentPct,
      timingInput,
      effectiveVeg.releaseFactor,
    );

    // Now compute accurate temp based on the actual estimated duration
    const accurateTemp = computeFermentTemp(
      locationData?.hourlyForecast ?? null,
      locationData?.ambientTemp ?? null,
      baseResults.estimatedDays,
      unitSystem,
    );
    const temp = accurateTemp.effectiveTemp;

    // Recalculate with accurate temp (salinity unchanged — already correct from baseResults)
    const timing = estimateFermentTiming(temp, timingInput);
    const finalResults: FermentResults = {
      ...baseResults,
      estimatedDays: timing.days,
      estimatedDaysMin: timing.daysMin,
      estimatedDaysMax: timing.daysMax,
      tempCapped: timing.stalled,
    };

    setTiming(timing);

    setResults(finalResults);
    setTimeline(buildLactoTimeline(finalResults.estimatedDays, method));
    const style = activeCombo ?? preset;
    setAdvice(
      lactoAdvice(
        method, salt, temp, finalResults.estimatedDays, unitSystem,
        effectiveVeg.name,
        { min: style.saltPctMin, max: style.saltPctMax },
        prepSize,
        style.referencePrep,
        acidBalanceVerdict(effectiveVeg),
        useStarter,
        !!effectiveVeg.bloaterProne,
      ),
    );
    setWaterAdvice(waterHardnessFermentAdvice(h));
    setShowResults(true);
    markCalculated();
  }, [vegWeight, waterAmount, saltPct, saltType, prepSize, useStarter, fermentType, method, preset, activeCombo, effectiveVeg, effectiveTemp, locationData, getHardness, isMultiVeg, totalMixGrams, markCalculated]);

  return {
    fermentType,
    method,
    vegId,
    veg: effectiveVeg,
    vegWeight,
    prepSize,
    useStarter,
    acidBalance: acidBalanceVerdict(effectiveVeg),
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
    results,
    timing,
    timeline,
    advice,
    waterAdvice,
    showResults,
    validationError,
    inputsDirty,
    selectPreset,
    toggleVegInMix,
    clearMix,
    updateMixGrams,
    applyCombo,
    VEG_COMBOS,
    selectVeg,
    // Manual input setters: invalidate previous results so the stale banner
    // appears (preset/veg selection already resets showResults directly).
    setVegWeight: dirtySetter(markInputsChanged, setVegWeight),
    setWaterAmount: dirtySetter(markInputsChanged, setWaterAmount),
    setSaltPct: dirtySetter(markInputsChanged, setSaltPct),
    setSaltType: dirtySetter(markInputsChanged, setSaltType),
    setPrepSize: dirtySetter(markInputsChanged, setPrepSize),
    setUseStarter: dirtySetter(markInputsChanged, setUseStarter),
    calculate,
  };
}
