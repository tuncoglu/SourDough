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
  setBreadType: (t: BreadType) => void;
  handlePresetSelect: (
    preset: RecipePreset,
    mixRows: MixRow[],
    setMixRows: (updater: (prev: MixRow[]) => MixRow[]) => void,
    currentHydration: string,
    currentStarterWeight: string,
    currentSaltPct: string,
    currentOilPct: string,
    setHydration: (v: string) => void,
    setStarterWeight: (v: string) => void,
    setSaltPct: (v: string) => void,
  ) => void;
  setOilPct: (v: string) => void;
  setPrefermentEnabled: (v: boolean) => void;
  setPrefermentFlourPct: (v: string) => void;
  /** Update preset values when total flour weight changes (recompute starter). */
  syncStarterFromPreset: (totalFlourWeight: number, setStarterWeight: (v: string) => void) => void;
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
    currentHydration: string,
    currentStarterWeight: string,
    currentSaltPct: string,
    currentOilPct: string,
    setHydration: (v: string) => void,
    setStarterWeight: (v: string) => void,
    setSaltPct: (v: string) => void,
  ) => {
    // Detect if user has modified fields away from the PREVIOUS preset's defaults
    const prevPreset = selectedPreset;
    const userCustomizedHydration = !prevPreset ||
      parseFloat(currentHydration) !== prevPreset.dough.typicalHydration;
    const userCustomizedStarter = !prevPreset ||
      parseFloat(currentStarterWeight) !== Math.round(parseFloat(currentStarterWeight) / prevPreset.dough.typicalInoculation * 100) / 100;
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
      setHydration(String(preset.dough.typicalHydration));
    }
    if (!userCustomizedStarter) {
      const totalFlour = mixRows.reduce((sum, r) => sum + (parseFloat(r.grams) || 0), 0);
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

  const syncStarterFromPreset = useCallback((totalFlourWeight: number, setStarterWeight: (v: string) => void) => {
    if (selectedPreset) {
      const starterG = Math.round(totalFlourWeight * selectedPreset.dough.typicalInoculation / 100);
      setStarterWeight(String(starterG));
    }
  }, [selectedPreset]);

  return {
    breadType,
    selectedPreset,
    oilPct,
    prefermentEnabled,
    prefermentFlourPct,
    showOil,
    setBreadType,
    handlePresetSelect,
    setOilPct,
    setPrefermentEnabled,
    setPrefermentFlourPct,
    syncStarterFromPreset,
  };
}
