import { useState, useCallback } from 'react';
import { BreadType, RecipePreset } from '../models/types';
import { findFlour } from '../lib/flourSearch';
import { MixRow } from './useCalculatorInputs';

export interface RecipePresetState {
  breadType: BreadType;
  selectedPreset: RecipePreset | null;
  oilPct: string;
  prefermentEnabled: boolean;
  prefermentFlourPct: string;
  showOil: boolean;
}

export interface RecipePresetActions {
  setPreset: (preset: RecipePreset | null) => void;
  handlePresetSelect: (
    preset: RecipePreset,
    mixRows: MixRow[],
    setMixRows: (updater: (prev: MixRow[]) => MixRow[]) => void,
    currentWaterGrams: string,
    currentStarterWeight: string,
    currentSaltPct: string,
    currentOilPct: string,
    setWaterGrams: (v: string) => void,
    setStarterWeight: (v: string) => void,
    setSaltPct: (v: string) => void,
  ) => void;
  setOilPct: (v: string) => void;
  setPrefermentEnabled: (v: boolean) => void;
  setPrefermentFlourPct: (v: string) => void;
}

export function useRecipePreset(): RecipePresetState & RecipePresetActions {
  const [breadType, setBreadType] = useState<BreadType>('custom');
  const [selectedPreset, setSelectedPreset] = useState<RecipePreset | null>(null);
  const [oilPct, setOilPct] = useState('0');
  const [prefermentEnabled, setPrefermentEnabled] = useState(false);
  const [prefermentFlourPct, setPrefermentFlourPct] = useState('30');

  const showOil = (selectedPreset?.dough.oilPct !== undefined && selectedPreset.dough.oilPct > 0) || parseFloat(oilPct) > 0;

  const handlePresetSelect = useCallback((
    preset: RecipePreset,
    mixRows: MixRow[],
    setMixRows: (updater: (prev: MixRow[]) => MixRow[]) => void,
    currentWaterGrams: string,
    currentStarterWeight: string,
    currentSaltPct: string,
    currentOilPct: string,
    setWaterGrams: (v: string) => void,
    setStarterWeight: (v: string) => void,
    setSaltPct: (v: string) => void,
  ) => {
    // Detect if user has modified fields away from the PREVIOUS preset's defaults.
    // Starter weight depends on total flour weight (varies per recipe), so we cannot
    // trivially reverse it — always preserve the user's starter value on preset switch.
    const prevPreset = selectedPreset;
    const totalFlour = mixRows.reduce((sum, r) => sum + (parseFloat(r.grams) || 0), 0);
    const presetWaterGrams = String(Math.round(totalFlour * preset.dough.typicalHydration / 100));
    const userCustomizedHydration = !prevPreset ||
      parseFloat(currentWaterGrams) !== parseFloat(presetWaterGrams);
    const userCustomizedStarter = prevPreset !== null; // always preserve starter edits
    const userCustomizedSalt = !prevPreset ||
      parseFloat(currentSaltPct) !== prevPreset.dough.typicalSalt;
    const userCustomizedOil = !prevPreset ||
      parseFloat(currentOilPct) !== (prevPreset.dough.oilPct ?? 0);

    setBreadType(preset.id);

    if (preset.id === 'custom') {
      setSelectedPreset(null);
      setOilPct('0');
      setPrefermentEnabled(false);
      return;
    }

    setSelectedPreset(preset);

    // Only overwrite fields the user hasn't manually customized
    if (!userCustomizedHydration) {
      setWaterGrams(presetWaterGrams);
    }
    if (!userCustomizedStarter) {
      const starterG = Math.round(totalFlour * preset.dough.typicalInoculation / 100);
      setStarterWeight(String(starterG));
    }
    if (!userCustomizedSalt) {
      setSaltPct(String(preset.dough.typicalSalt));
    }

    if (!userCustomizedOil) {
      if (preset.dough.oilPct && preset.dough.oilPct > 0) {
        setOilPct(String(preset.dough.oilPct));
      } else {
        setOilPct('0');
      }
    }

    if (preset.dough.preferment && preset.dough.preferment.type !== 'none') {
      setPrefermentEnabled(true);
      setPrefermentFlourPct(String(preset.dough.preferment.flourPct));
    } else {
      setPrefermentEnabled(false);
    }

    // Pre-fill flour type if suggested
    if (preset.dough.typicalFlourType) {
      const suggested = findFlour(preset.dough.typicalFlourType);
      setMixRows((prev) =>
        prev.map((r, i) => (i === 0 ? { ...r, flour: suggested } : r)),
      );
    }
  }, [selectedPreset]);

  /** Set the active preset directly (used when restoring from a saved recipe). */
  const setPreset = useCallback((preset: RecipePreset | null) => {
    if (preset) {
      setBreadType(preset.id);
      setSelectedPreset(preset);
    } else {
      setBreadType('custom');
      setSelectedPreset(null);
    }
  }, []);

  return {
    breadType,
    selectedPreset,
    oilPct,
    prefermentEnabled,
    prefermentFlourPct,
    showOil,
    setPreset,
    handlePresetSelect,
    setOilPct,
    setPrefermentEnabled,
    setPrefermentFlourPct,
  };
}
