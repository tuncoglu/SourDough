import { useState, useCallback, useRef } from 'react';
import { ScrollView } from 'react-native';
import {
  CalculationResults,
  FlourBlendEntry,
  WaterHardness,
  RecipePreset,
} from '../models/types';
import { runAllCalculations } from '../lib/calculations';
import { getBlendProtein, buildFlourTypeLabel, buildPrefermentConfig } from '../lib/blendUtils';
import { resolveHardness } from '../lib/hardnessUtils';
import { useFeedback } from '../lib/feedback';
import { useAppTheme } from '../theme';
import type { LocationData } from '../lib/location';

interface CalculateParams {
  blend: FlourBlendEntry[];
  totalFlourWeight: number;
  waterGrams: string;
  starterWeight: string;
  saltPct: string;
  starterHydrationStr: string;
  oilPct: string;
  ambientTemp: string;
  flourTemp: string;
  waterTemp: string;
  starterTemp: string;
  starterFlourLabel: string;
  prefermentEnabled: boolean;
  prefermentFlourPct: string;
  prefermentType?: 'poolish' | 'biga';
  breadType: string;
  locationData: LocationData | null;
  waterHardnessOverride: number;
  coldProofHours: string;
  coldProofTemp: string;
  coldProofEnabled: boolean;
  starterHoursSinceFed: number | undefined;
}

export function useRecipeCalculation() {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [calculating, setCalculating] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const rightScrollRef = useRef<ScrollView>(null);
  const { alert } = useFeedback();
  const { unitSystem } = useAppTheme();

  const doCalculate = useCallback((params: CalculateParams, isDesktop: boolean) => {
    const {
      blend, totalFlourWeight, waterGrams, starterWeight, saltPct,
      starterHydrationStr, oilPct, ambientTemp, flourTemp, waterTemp,
      starterTemp, starterFlourLabel, prefermentEnabled, prefermentFlourPct,
      prefermentType,
      breadType, locationData, waterHardnessOverride,
      coldProofHours, coldProofTemp, coldProofEnabled,
      starterHoursSinceFed,
    } = params;

    const fw = totalFlourWeight;
    const wg = parseFloat(waterGrams);
    const sw = parseFloat(starterWeight);
    const slt = parseFloat(saltPct);
    const shyd = parseFloat(starterHydrationStr);
    // Derive approximate hydration % for FDT/fermentation (engine computes exact value)
    const starterFlourApprox = sw * (100 / (100 + shyd));
    const totalFlourApprox = fw + starterFlourApprox;
    const hyd = totalFlourApprox > 0 ? ((wg + sw - starterFlourApprox) / totalFlourApprox) * 100 : 70;
    const amb = parseFloat(ambientTemp);
    const flr = parseFloat(flourTemp);
    const wat = parseFloat(waterTemp);
    const sta = parseFloat(starterTemp);
    const oil = parseFloat(oilPct) || 0;

    if (fw <= 0) {
      alert('Invalid input', 'Total flour weight must be greater than 0.', 'error');
      return;
    }
    if ([wg, sw, slt, amb, flr, wat, sta, shyd].some(isNaN)) {
      alert('Invalid input', 'All fields must be numbers.', 'error');
      return;
    }
    if (wg <= 0) {
      alert('Invalid input', 'Water must be greater than 0 g.', 'error');
      return;
    }
    if (sw <= 0) {
      alert('Invalid input', 'Starter weight must be greater than 0 g.', 'error');
      return;
    }

    if (blend.every((e) => e.percentage === 0)) {
      alert('Invalid flour mix', 'Enter grams for at least one flour.', 'error');
      return;
    }

    // #13: Pre-ferment percentage guard
    if (prefermentEnabled) {
      const pct = parseFloat(prefermentFlourPct) || 0;
      if (pct <= 0) {
        alert('Invalid pre-ferment', 'Pre-ferment flour percentage must be greater than 0.', 'error');
        return;
      }
      if (pct > 100) {
        alert('Invalid pre-ferment', 'Pre-ferment flour cannot exceed 100% of total flour.', 'error');
        return;
      }
    }

    setCalculating(true);

    // Use the first blend entry's product number directly (avoid re-looking up via findFlour)
    const firstEntry = blend[0];
    const productNo = firstEntry?.productNumber ?? '-';
    const firstEntryProtein = firstEntry?.protein ?? 12.5;
    const manualHw = waterHardnessOverride || 0;
    const hardness: WaterHardness = resolveHardness(
      !isNaN(manualHw) ? manualHw : 0,
      locationData?.hardness,
    );

    const warnings: string[] = [];
    if (wat <= 0) warnings.push('Water is near freezing.');
    if (wat >= 65) warnings.push('Water is very hot — risk of damaging starter.');

    const flourType = blend.length === 1
      ? blend[0].label
      : buildFlourTypeLabel(blend);
    const flourProtein = blend.length > 1 ? getBlendProtein(blend) : firstEntryProtein;

    const prefConfig = prefermentEnabled
      ? buildPrefermentConfig(prefermentType, prefermentFlourPct)
      : undefined;

    const coldH = coldProofEnabled ? (parseFloat(coldProofHours) || 0) : 0;
    const coldT = coldProofEnabled ? (parseFloat(coldProofTemp) || 4) : undefined;

    const res = runAllCalculations(
      {
        flourWeight: fw,
        flourType,
        flourProtein,
        flourProductNo: productNo,
        flourBlend: blend,
        hydration: hyd, // kept for backward compat; derived in engine when addedWaterGrams is set
        addedWaterGrams: wg > 0 ? wg : undefined,
        starterWeight: sw,
        starterHydration: shyd,
        starterFlourType: starterFlourLabel,
        saltPct: slt,
        oilPct: oil,
        ambientTemp: amb,
        flourTemp: flr,
        waterTemp: wat,
        starterTemp: sta,
        breadType: breadType !== 'custom' ? breadType : undefined,
        preferment: prefConfig,
        coldProofHours: coldH > 0 ? coldH : undefined,
        coldProofTemp: coldT,
        starterHoursSinceFed,
      },
      locationData?.hourlyForecast ?? null,
      hardness,
      warnings,
      unitSystem,
    );

    setResults(res);
    setCalculating(false);

    if (isDesktop) {
      setTimeout(() => rightScrollRef.current?.scrollTo({ y: 0, animated: true }), 100);
    } else {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, []);

  return { results, calculating, doCalculate, scrollRef, rightScrollRef };
}
