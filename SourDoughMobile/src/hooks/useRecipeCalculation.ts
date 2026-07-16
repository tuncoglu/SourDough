import { useState, useCallback, useRef } from 'react';
import { Alert, ScrollView } from 'react-native';
import {
  CalculationResults,
  FlourBlendEntry,
  WaterHardness,
  RecipePreset,
} from '../models/types';
import { runAllCalculations, getBlendProtein } from '../lib/calculations';
import { classifyHardness } from '../data/ukWaterHardness';
import { findFlour } from '../lib/flourSearch';
import type { LocationData } from '../lib/location';

function buildManualHardness(mgL: number): WaterHardness {
  return {
    mgL,
    classification: classifyHardness(mgL),
    note: 'Manual override — user-supplied value',
    key: 'manual',
  };
}

const fallbackHardness: WaterHardness = {
  mgL: 120,
  classification: 'moderately soft',
  note: 'Unknown — assuming moderate',
  key: 'fallback',
};

interface CalculateParams {
  blend: FlourBlendEntry[];
  totalFlourWeight: number;
  hydration: string;
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

  const doCalculate = useCallback((params: CalculateParams, isDesktop: boolean) => {
    const {
      blend, totalFlourWeight, hydration, starterWeight, saltPct,
      starterHydrationStr, oilPct, ambientTemp, flourTemp, waterTemp,
      starterTemp, starterFlourLabel, prefermentEnabled, prefermentFlourPct,
      breadType, locationData, waterHardnessOverride,
      coldProofHours, coldProofTemp, coldProofEnabled,
      starterHoursSinceFed,
    } = params;

    const fw = totalFlourWeight;
    const hyd = parseFloat(hydration);
    const sw = parseFloat(starterWeight);
    const slt = parseFloat(saltPct);
    const amb = parseFloat(ambientTemp);
    const flr = parseFloat(flourTemp);
    const wat = parseFloat(waterTemp);
    const sta = parseFloat(starterTemp);
    const shyd = parseFloat(starterHydrationStr);
    const oil = parseFloat(oilPct) || 0;

    if (fw <= 0) {
      Alert.alert('Invalid input', 'Total flour weight must be greater than 0.');
      return;
    }
    if ([hyd, sw, slt, amb, flr, wat, sta, shyd].some(isNaN)) {
      Alert.alert('Invalid input', 'All fields must be numbers.');
      return;
    }

    if (blend.every((e) => e.percentage === 0)) {
      Alert.alert('Invalid flour mix', 'Enter grams for at least one flour.');
      return;
    }

    // #13: Pre-ferment percentage guard
    if (prefermentEnabled) {
      const pct = parseFloat(prefermentFlourPct) || 0;
      if (pct <= 0) {
        Alert.alert('Invalid pre-ferment', 'Pre-ferment flour percentage must be greater than 0.');
        return;
      }
      if (pct > 100) {
        Alert.alert('Invalid pre-ferment', 'Pre-ferment flour cannot exceed 100% of total flour.');
        return;
      }
    }

    setCalculating(true);

    const flour = findFlour(blend[0]?.label ?? 'Generic: Bread Flour');
    const manualHw = waterHardnessOverride || 0;
    const hardness: WaterHardness = (!isNaN(manualHw) && manualHw > 0)
      ? buildManualHardness(manualHw)
      : (locationData?.hardness ?? fallbackHardness);

    const warnings: string[] = [];
    if (wat <= 0) warnings.push('Water is near freezing.');
    if (wat >= 65) warnings.push('Water is very hot — risk of damaging starter.');

    const flourType = blend.length === 1
      ? blend[0].label
      : blend.map((e) => `${Math.round(e.percentage)}% ${e.label.replace(/\s*\([^)]*\)$/, '')}`).join(' + ');
    const flourProtein = blend.length > 1 ? getBlendProtein(blend) : flour.protein;

    const prefConfig = prefermentEnabled
      ? { type: 'poolish' as const, flourPct: parseFloat(prefermentFlourPct) || 30, hydration: 100 }
      : undefined;

    const coldH = coldProofEnabled ? (parseFloat(coldProofHours) || 0) : 0;
    const coldT = coldProofEnabled ? (parseFloat(coldProofTemp) || 4) : undefined;

    const res = runAllCalculations(
      {
        flourWeight: fw,
        flourType,
        flourProtein,
        flourProductNo: flour.productNumber,
        flourBlend: blend,
        hydration: hyd,
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
