import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  AppState,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/theme';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { useLocation } from '../../src/hooks/useLocation';
import { classifyHardness } from '../../src/data/ukWaterHardness';
import { getAutoTemps, buildSummary } from '../../src/lib/location';
import { runAllCalculations } from '../../src/lib/calculations';
import { saveRecipe, generateRecipeId, loadRecipes } from '../../src/store/recipeStore';
import { loadSettings } from '../../src/store/settingsStore';
import {
  getStarterFlour,
  setStarterFlour as persistStarterFlour,
  logFeeding,
  generateFeedingId,
  getLastFeeding,
  loadFeedings,
} from '../../src/store/starterStore';
import {
  CalculationResults,
  SavedRecipe,
  UserSettings,
  DEFAULT_SETTINGS,
  getTempZoneInfo,
  FlourBlendEntry,
  StarterFeeding,
  RecipePreset,
  BreadType,
} from '../../src/models/types';
import type { WaterHardness, FlourEntry } from '../../src/models/types';

import { LocationBar } from '../../src/components/LocationBar';
import { NumberInput } from '../../src/components/NumberInput';
import { FlourPicker } from '../../src/components/FlourPicker';
import { TempRow } from '../../src/components/TempRow';
import { IngredientResults } from '../../src/components/IngredientResults';
import { FermentationTimeline } from '../../src/components/FermentationTimeline';
import { AdviceCards } from '../../src/components/FermentAdvice';
import { RecipeTypePicker } from '../../src/components/RecipeTypePicker';
import { MethodTimeline } from '../../src/components/MethodTimeline';
import { validateBlend, findFlour } from '../../src/lib/flourSearch';
import { getBlendProtein } from '../../src/lib/calculations';
import { RECIPE_PRESETS, getPreset } from '../../src/data/recipePresets';

const SAVE_COUNT_KEY = 'sourdough_save_count';
const REVIEW_REQUESTED_KEY = 'sourdough_review_requested';

const fallbackHardness: WaterHardness = {
  mgL: 120,
  classification: 'moderately soft',
  note: 'Unknown — assuming moderate',
  key: 'fallback',
};

/** Generate a plain-text recipe summary for sharing. */
function generateShareText(recipe: SavedRecipe): string {
  const { inputs, results, locationSummary } = recipe;
  const lines: string[] = [
    '🥖 Just Dough It Recipe — Just Dough It',
    '',
    `📍 ${locationSummary}`,
    '',
    '📋 Ingredients',
  ];

  // Flour
  if (inputs.flourBlend && inputs.flourBlend.length > 1) {
    for (const entry of inputs.flourBlend) {
      const grams = inputs.flourWeight * entry.percentage / 100;
      const shortName = entry.label.replace(/\s*\([^)]*\)$/, '');
      lines.push(`  ${shortName}: ${grams.toFixed(0)}g (${Math.round(entry.percentage)}%)`);
    }
  } else {
    lines.push(`  Flour: ${inputs.flourWeight.toFixed(0)}g ${inputs.flourType.replace(/\s*\([^)]*\)$/, '')}`);
  }
  lines.push(`  Hydration: ${inputs.hydration.toFixed(0)}%`);
  lines.push(`  Starter: ${inputs.starterWeight.toFixed(0)}g (${inputs.starterHydration.toFixed(0)}% hydration)`);
  lines.push(`  Salt: ${inputs.saltPct.toFixed(1)}%`);
  if (inputs.oilPct && inputs.oilPct > 0) {
    lines.push(`  Oil/Fat: ${inputs.oilPct.toFixed(1)}%`);
  }
  if (inputs.preferment) {
    lines.push(`  Pre-ferment: ${inputs.preferment.type} (${inputs.preferment.flourPct.toFixed(0)}% of flour)`);
  }

  lines.push('');
  lines.push('⚖️  Weights');
  lines.push(`  Water: ${results.ingredients.addedWater.toFixed(1)}g`);
  lines.push(`  Starter: ${results.ingredients.starterTotal.toFixed(1)}g`);
  lines.push(`  Salt: ${results.ingredients.salt.toFixed(1)}g`);
  lines.push(`  Total dough: ${results.ingredients.totalDoughWeight.toFixed(1)}g`);

  lines.push('');
  lines.push('🌡  Temperatures');
  lines.push(`  FDT: ${results.fdt.toFixed(1)}°C (${results.tempZone})`);
  lines.push(`  Ambient: ${inputs.ambientTemp.toFixed(1)}°C`);
  lines.push(`  Water: ${inputs.waterTemp.toFixed(1)}°C`);

  lines.push('');
  lines.push('⏱️  Fermentation');
  lines.push(`  Bulk ferment: ~${results.staticFermentHours.toFixed(1)} hours`);
  if (results.dynamicFerment) {
    lines.push(`  Dynamic estimate: ~${results.dynamicFerment.totalHours.toFixed(1)} hours`);
  }

  if (results.hardness) {
    lines.push('');
    lines.push('🧪 Water');
    lines.push(`  Hardness: ${results.hardness.classification} (${results.hardness.mgL} mg/L)`);
  }

  lines.push('');
  lines.push('Made with Just Dough It 🥖');
  lines.push('https://github.com/tuncoglu/SourDough');

  return lines.join('\n');
}

/** Generate share text from the current input state (before saving). */
function generateShareTextFromState(
  blend: FlourBlendEntry[],
  totalFlourWeight: number,
  hydration: string,
  starterWeight: string,
  saltPct: string,
  ambientTemp: string,
  waterTemp: string,
  results: CalculationResults,
  locationSummary: string,
  breadType?: string,
  oilPct?: string,
  prefermentEnabled?: boolean,
  prefermentFlourPct?: string,
  bakeInfo?: string,
): string {
  const lines: string[] = [
    '🥖 Just Dough It Recipe — Just Dough It',
    '',
    `📍 ${locationSummary}`,
    '',
    '📋 Ingredients',
  ];

  if (blend.length > 1) {
    for (const entry of blend) {
      const grams = totalFlourWeight * entry.percentage / 100;
      const shortName = entry.label.replace(/\s*\([^)]*\)$/, '');
      lines.push(`  ${shortName}: ${grams.toFixed(0)}g (${Math.round(entry.percentage)}%)`);
    }
  } else if (blend.length === 1) {
    lines.push(`  Flour: ${totalFlourWeight.toFixed(0)}g ${blend[0].label.replace(/\s*\([^)]*\)$/, '')}`);
  }
  lines.push(`  Hydration: ${parseFloat(hydration).toFixed(0)}%`);
  lines.push(`  Starter: ${parseFloat(starterWeight).toFixed(0)}g`);
  lines.push(`  Salt: ${parseFloat(saltPct).toFixed(1)}%`);
  if (oilPct && parseFloat(oilPct) > 0) {
    lines.push(`  Oil/Fat: ${parseFloat(oilPct).toFixed(1)}%`);
  }
  if (prefermentEnabled && prefermentFlourPct) {
    lines.push(`  Pre-ferment: poolish (${parseFloat(prefermentFlourPct).toFixed(0)}% of flour)`);
  }

  lines.push('');
  lines.push('⚖️  Weights');
  lines.push(`  Water: ${results.ingredients.addedWater.toFixed(1)}g`);
  lines.push(`  Starter: ${results.ingredients.starterTotal.toFixed(1)}g`);
  if (results.ingredients.oil > 0) {
    lines.push(`  Oil: ${results.ingredients.oil.toFixed(1)}g`);
  }
  lines.push(`  Salt: ${results.ingredients.salt.toFixed(1)}g`);
  lines.push(`  Total dough: ${results.ingredients.totalDoughWeight.toFixed(1)}g`);

  lines.push('');
  lines.push('🌡  Temperatures');
  lines.push(`  FDT: ${results.fdt.toFixed(1)}°C (${results.tempZone})`);
  lines.push(`  Ambient: ${parseFloat(ambientTemp).toFixed(1)}°C`);
  lines.push(`  Water: ${parseFloat(waterTemp).toFixed(1)}°C`);

  lines.push('');
  lines.push('⏱️  Fermentation');
  lines.push(`  Bulk ferment: ~${results.staticFermentHours.toFixed(1)} hours`);
  if (results.dynamicFerment) {
    lines.push(`  Dynamic estimate: ~${results.dynamicFerment.totalHours.toFixed(1)} hours`);
  }

  if (bakeInfo) {
    lines.push('');
    lines.push('🔥 Bake');
    lines.push(`  ${bakeInfo}`);
  }

  lines.push('');
  lines.push('Made with Just Dough It 🥖');
  lines.push('https://github.com/tuncoglu/SourDough');

  return lines.join('\n');
}

interface MixRow {
  key: string;
  flour: FlourEntry;
  grams: string;
}

let _mixKeyCounter = 0;
function nextMixKey(): string {
  return `flour_${_mixKeyCounter++}`;
}

/** Build a FlourBlendEntry array from the current mix rows. */
function buildBlend(rows: MixRow[], totalFlourWeight: number): FlourBlendEntry[] {
  return rows.map((row) => {
    const grams = parseFloat(row.grams) || 0;
    return {
      label: row.flour.label,
      protein: row.flour.protein,
      productNumber: row.flour.productNumber,
      category: row.flour.category,
      percentage: totalFlourWeight > 0 ? (grams / totalFlourWeight) * 100 : 0,
    };
  });
}

function buildManualHardness(mgL: number): WaterHardness {
  return {
    mgL,
    classification: classifyHardness(mgL),
    note: 'Manual override — user-supplied value',
    key: 'manual',
  };
}

export default function CalculatorScreen() {
  const { data: locationData, loading: locLoading, error: locError, detect, refineWithPostcode } = useLocation();
  const { isDesktop } = useBreakpoint();

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [mixRows, setMixRows] = useState<MixRow[]>([
    { key: nextMixKey(), flour: findFlour(DEFAULT_SETTINGS.defaultFlourType), grams: String(DEFAULT_SETTINGS.defaultFlourWeight) },
  ]);
  const [hydration, setHydration] = useState(String(DEFAULT_SETTINGS.defaultHydration));
  const [starterWeight, setStarterWeight] = useState('100');
  const [saltPct, setSaltPct] = useState(String(DEFAULT_SETTINGS.defaultSaltPct));
  const [starterFlourLabel, setStarterFlourLabel] = useState('Generic: Bread Flour');
  const [starterHydrationStr, setStarterHydrationStr] = useState('100');
  const [ambientTemp, setAmbientTemp] = useState('22');
  const [flourTemp, setFlourTemp] = useState('22');
  const [waterTemp, setWaterTemp] = useState('18');
  const [starterTemp, setStarterTemp] = useState('22');


  // Recipe preset state
  const [breadType, setBreadType] = useState<BreadType>('custom');
  const [selectedPreset, setSelectedPreset] = useState<RecipePreset | null>(null);
  const [oilPct, setOilPct] = useState('0');
  const [prefermentEnabled, setPrefermentEnabled] = useState(false);
  const [prefermentFlourPct, setPrefermentFlourPct] = useState('30');

  // Starter feeding state
  const [feedFlourGrams, setFeedFlourGrams] = useState('50');
  const [feedWaterGrams, setFeedWaterGrams] = useState('50');
  const [feedLogging, setFeedLogging] = useState(false);

  // Derived: total fresh flour weight from sum of mix row grams
  const totalFlourWeight = mixRows.reduce((sum, r) => sum + (parseFloat(r.grams) || 0), 0);
  const flourWeightStr = String(totalFlourWeight);

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const rightScrollRef = useRef<ScrollView>(null);

  // Starter section state
  const [starterExpanded, setStarterExpanded] = useState(false);
  const [lastFed, setLastFed] = useState<StarterFeeding | null>(null);
  const [hoursSince, setHoursSince] = useState<string>('');
  const [recentFeedings, setRecentFeedings] = useState<StarterFeeding[]>([]);

  // Load starter data
  const refreshStarterData = useCallback(async () => {
    const lf = await getLastFeeding();
    setLastFed(lf);
    if (lf) {
      const diff = Date.now() - new Date(lf.timestamp).getTime();
      setHoursSince((diff / 3600000).toFixed(1));
    }
    const all = await loadFeedings();
    setRecentFeedings(all.slice(0, 3));
  }, []);

  // ── Flour mix handlers ───────────────────────────────────────────────
  const handleAddFlour = useCallback(() => {
    setMixRows((prev) => {
      if (prev.length >= 3) return prev;
      return [
        ...prev,
        {
          key: nextMixKey(),
          flour: findFlour('Generic: Bread Flour'),
          grams: '0',
        },
      ];
    });
  }, []);

  const handleRemoveFlour = useCallback((key: string) => {
    setMixRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((r) => r.key !== key);
    });
  }, []);

  const handleUpdateFlour = useCallback((key: string, flour: FlourEntry) => {
    setMixRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, flour } : r)),
    );
  }, []);

  const handleUpdateFlourGrams = useCallback((key: string, grams: string) => {
    setMixRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, grams } : r)),
    );
  }, []);

  // Load settings & starter data
  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setMixRows([{ key: nextMixKey(), flour: findFlour(s.defaultFlourType), grams: String(s.defaultFlourWeight) }]);
      setHydration(String(s.defaultHydration));
      setSaltPct(String(s.defaultSaltPct));
      setStarterHydrationStr(String(s.defaultStarterHydration));
    });
    getStarterFlour().then(setStarterFlourLabel);
    refreshStarterData();
  }, [refreshStarterData]);

  // Reload settings when the calculator tab regains focus
  // (only waterHardnessOverride is read from settings in doCalculate;
  //  the other defaults initialize local inputs on mount and stay user-controlled)
  const didMountRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!didMountRef.current) {
        didMountRef.current = true;
        return; // settings already loaded by the mount useEffect
      }
      loadSettings().then((s) => {
        if (s.waterHardnessOverride !== settings.waterHardnessOverride) {
          setSettings(s);
        }
      });
    }, [settings.waterHardnessOverride]),
  );

  // Track app state to pause timer when backgrounded
  const [appState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => setAppState(nextState));
    return () => sub.remove();
  }, []);

  // Refresh starter data from storage when the card is expanded
  useEffect(() => {
    if (starterExpanded) refreshStarterData();
  }, [starterExpanded, refreshStarterData]);

  // Update "hours since" every minute (only when app is active and lastFed exists)
  useEffect(() => {
    if (appState !== 'active' || !lastFed) return;
    const t = setInterval(() => {
      const diff = Date.now() - new Date(lastFed.timestamp).getTime();
      setHoursSince((diff / 3600000).toFixed(1));
    }, 60000);
    return () => clearInterval(t);
  }, [appState, lastFed]);

  // Pre-fill temps when location detected
  useEffect(() => {
    if (locationData) {
      const auto = getAutoTemps(locationData.ambientTemp, locationData.waterTemp);
      setAmbientTemp(String(auto.ambientTemp));
      setFlourTemp(String(auto.flourTemp));
      setWaterTemp(String(auto.waterTemp));
      setStarterTemp(String(auto.starterTemp));
    }
  }, [locationData]);

  // ── Auto-scroll to results ─────────────────────────────────────────────
  useEffect(() => {
    if (results && scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [results]);

  // ── Preset selection ───────────────────────────────────────────────────
  const handlePresetSelect = useCallback((preset: RecipePreset) => {
    setBreadType(preset.id);
    if (preset.id === 'custom') {
      setSelectedPreset(null);
      setOilPct('0');
      setPrefermentEnabled(false);
      return;
    }
    setSelectedPreset(preset);

    // Pre-fill hydration
    setHydration(String(preset.dough.typicalHydration));
    // Pre-fill starter weight based on inoculation % and current flour weight
    const starterG = Math.round(totalFlourWeight * preset.dough.typicalInoculation / 100);
    setStarterWeight(String(starterG));
    // Pre-fill salt
    setSaltPct(String(preset.dough.typicalSalt));
    // Pre-fill oil if applicable
    if (preset.dough.oilPct && preset.dough.oilPct > 0) {
      setOilPct(String(preset.dough.oilPct));
    } else {
      setOilPct('0');
    }
    // Pre-fill pre-ferment if applicable
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
  }, [totalFlourWeight]);

  const doCalculate = useCallback(() => {
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
      Alert.alert('Invalid input', 'Total flour weight must be greater than 0. Enter grams for each flour.');
      return;
    }
    if ([hyd, sw, slt, amb, flr, wat, sta, shyd].some(isNaN)) {
      Alert.alert('Invalid input', 'All fields must be numbers.');
      return;
    }

    // Build blend from mix rows — convert gram weights to percentages
    const blend = buildBlend(mixRows, fw);

    if (blend.every((e) => e.percentage === 0)) {
      Alert.alert('Invalid flour mix', 'Enter grams for at least one flour.');
      return;
    }

    setCalculating(true);

    const flour = findFlour(mixRows[0].flour.label);
    // Use manual hardness override if provided, otherwise use detected
    const manualHw = settings.waterHardnessOverride || 0;
    const hardness: WaterHardness = (!isNaN(manualHw) && manualHw > 0)
      ? buildManualHardness(manualHw)
      : (locationData?.hardness ?? fallbackHardness);

    const warnings: string[] = [];
    if (wat <= 0) warnings.push('Water is near freezing. Dough will be very cold.');
    if (wat >= 65) warnings.push('Water is very hot. Risk of damaging starter.');

    // Build display label for the flour/blend
    const flourType =
      blend.length === 1
        ? blend[0].label
        : blend
            .map((e) => `${Math.round(e.percentage)}% ${e.label.replace(/\s*\([^)]*\)$/, '')}`)
            .join(' + ');
    const flourProtein = blend.length > 1 ? getBlendProtein(blend) : flour.protein;

    // Build preferment config if enabled
    const prefConfig = prefermentEnabled
      ? {
          type: 'poolish' as const,
          flourPct: parseFloat(prefermentFlourPct) || 30,
          hydration: 100,
        }
      : undefined;

    // Build inputs with both blend array and legacy scalar fields
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
      },
      locationData?.hourlyForecast ?? null,
      hardness,
      warnings,
    );

    setResults(res);
    setCalculating(false);

    // Scroll results into view
    if (isDesktop) {
      setTimeout(() => rightScrollRef.current?.scrollTo({ y: 0, animated: true }), 100);
    } else {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [
    totalFlourWeight, hydration, starterWeight, saltPct,
    ambientTemp, flourTemp, waterTemp, starterTemp, starterHydrationStr,
    oilPct, prefermentEnabled, prefermentFlourPct,
    mixRows, starterFlourLabel, locationData, isDesktop,
    breadType, settings.waterHardnessOverride,
  ]);

  const handleSave = useCallback(async () => {
    if (!results) return;
    setSaving(true);

    const fw = totalFlourWeight;
    const blend = buildBlend(mixRows, fw);

    const flourType =
      blend.length === 1
        ? blend[0].label
        : blend
            .map((e) => `${Math.round(e.percentage)}% ${e.label.replace(/\s*\([^)]*\)$/, '')}`)
            .join(' + ');
    const flourProtein = blend.length > 1 ? getBlendProtein(blend) : blend[0].protein;

    const shyd = parseFloat(starterHydrationStr);
    const oil = parseFloat(oilPct) || 0;
    const prefConfig = prefermentEnabled
      ? {
          type: 'poolish' as const,
          flourPct: parseFloat(prefermentFlourPct) || 30,
          hydration: 100,
        }
      : undefined;

    const recipe: SavedRecipe = {
      id: generateRecipeId(),
      createdAt: new Date().toISOString(),
      inputs: {
        flourWeight: fw,
        flourType,
        flourProtein,
        flourProductNo: blend[0].productNumber,
        flourBlend: blend,
        hydration: parseFloat(hydration),
        starterWeight: parseFloat(starterWeight),
        starterHydration: shyd,
        starterFlourType: starterFlourLabel,
        saltPct: parseFloat(saltPct),
        oilPct: oil,
        ambientTemp: parseFloat(ambientTemp),
        flourTemp: parseFloat(flourTemp),
        waterTemp: parseFloat(waterTemp),
        starterTemp: parseFloat(starterTemp),
        breadType: breadType !== 'custom' ? breadType : undefined,
        preferment: prefConfig,
      },
      results,
      locationSummary: locationData?.summary ?? '📍 Unknown location',
      breadType: breadType !== 'custom' ? breadType : undefined,
    };

    try {
      await saveRecipe(recipe);

      // ── Track save count for review prompt ──────────────────────────
      try {
        const raw = await AsyncStorage.getItem(SAVE_COUNT_KEY);
        const count = (raw ? parseInt(raw, 10) : 0) + 1;
        await AsyncStorage.setItem(SAVE_COUNT_KEY, String(count));

        // After 3 saves, gently ask for a review (once)
        const alreadyRequested = await AsyncStorage.getItem(REVIEW_REQUESTED_KEY);
        if (count >= 3 && !alreadyRequested) {
          const available = await StoreReview.isAvailableAsync();
          if (available) {
            await AsyncStorage.setItem(REVIEW_REQUESTED_KEY, 'true');
            await StoreReview.requestReview();
          }
        }
      } catch {
        // Silently ignore review tracking failures
      }

      Alert.alert('Saved', 'Recipe saved to your history.');
    } catch (e) {
      Alert.alert('Error', 'Could not save recipe.');
    } finally {
      setSaving(false);
    }
  }, [results, mixRows, totalFlourWeight, hydration, starterWeight, saltPct,
      starterFlourLabel, ambientTemp, flourTemp, waterTemp, starterTemp,
      starterHydrationStr, oilPct, prefermentEnabled, prefermentFlourPct,
      breadType, locationData]);

  const zoneInfo = results ? getTempZoneInfo(results.tempZone) : null;

  // Show manual override in location bar when active
  const displaySummary = !locationData ? null
    : settings.waterHardnessOverride > 0
      ? buildSummary(locationData.location, locationData.ambientTemp, locationData.waterTemp, buildManualHardness(settings.waterHardnessOverride))
      : locationData.summary;

  const handleFeedNow = useCallback(async () => {
    const flourG = parseFloat(feedFlourGrams) || 0;
    const waterG = parseFloat(feedWaterGrams) || 0;
    if (flourG <= 0 || waterG <= 0) {
      Alert.alert('Invalid input', 'Enter grams of flour and water used to feed.');
      return;
    }
    // Only show loading spinner if the operation takes > 200ms
    let didShowSpinner = false;
    const timer = setTimeout(() => {
      didShowSpinner = true;
      setFeedLogging(true);
    }, 200);
    try {
      const feeding: StarterFeeding = {
        id: generateFeedingId(),
        timestamp: new Date().toISOString(),
        flourUsed: starterFlourLabel,
        flourGrams: flourG,
        waterGrams: waterG,
      };
      await logFeeding(feeding);
      setLastFed(feeding);
      setHoursSince('0.0');
      setRecentFeedings((prev) => [feeding, ...prev].slice(0, 3));
    } catch (err) {
      console.error('[handleFeedNow]', err);
      Alert.alert('Error', 'Could not save feeding. Please try again.');
    } finally {
      clearTimeout(timer);
      if (didShowSpinner) setFeedLogging(false);
    }
  }, [starterFlourLabel, feedFlourGrams, feedWaterGrams]);

  // ── Shared input sections ────────────────────────────────────────────
  const inputPanels = (
    <>
      {/* ── Recipe Type ──────────────────────────────────────── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>RECIPE TYPE</Text>
        <RecipeTypePicker selected={breadType} onSelect={handlePresetSelect} />
        {selectedPreset && (
          <Text style={styles.cardHint}>
            {selectedPreset.emoji} {selectedPreset.description}
          </Text>
        )}
      </View>

      {/* ── Starter (compact) ────────────────────────────────── */}
      <View style={starterStyles.card}>
        <TouchableOpacity
          style={starterStyles.cardHeader}
          onPress={() => setStarterExpanded(!starterExpanded)}
          activeOpacity={0.8}
        >
          <View style={starterStyles.collapsedRow}>
            <Text style={starterStyles.icon}>🫙</Text>
            <Text style={starterStyles.summary} numberOfLines={1}>
              {lastFed
                ? `${lastFed.flourGrams ?? '?'}g flour + ${lastFed.waterGrams ?? '?'}g water · ${hoursSince}h ago`
                : 'Tap to set up your starter'}
            </Text>
            <Text style={starterStyles.chevron}>{starterExpanded ? '▲' : '▼'}</Text>
          </View>
        </TouchableOpacity>

        {starterExpanded && (
          <View style={starterStyles.expanded}>
            <View style={starterStyles.expandedRow}>
              <Text style={starterStyles.expandedLabel}>Flour</Text>
              <View style={{ flex: 1 }}>
                <FlourPicker
                  value={starterFlourLabel}
                  onSelect={(f) => {
                    setStarterFlourLabel(f.label);
                    persistStarterFlour(f.label);
                  }}
                />
              </View>
            </View>

            {/* Starter hydration */}
            <NumberInput
              label="Starter Hydration"
              value={starterHydrationStr}
              onChangeText={setStarterHydrationStr}
              unit="%"
            />

            {/* Feeding grams inputs */}
            <Text style={starterStyles.sectionTitle}>Log a Feed</Text>
            <NumberInput
              label="Flour used"
              value={feedFlourGrams}
              onChangeText={setFeedFlourGrams}
              unit="g"
            />
            <NumberInput
              label="Water used"
              value={feedWaterGrams}
              onChangeText={setFeedWaterGrams}
              unit="g"
            />
            <TouchableOpacity
              style={starterStyles.feedBtn}
              onPress={handleFeedNow}
              disabled={feedLogging}
              activeOpacity={0.7}
            >
              {feedLogging ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={starterStyles.feedBtnText}>Log Feeding</Text>
              )}
            </TouchableOpacity>

            {lastFed && (
              <Text style={starterStyles.lastFedText}>
                Last fed: {new Date(lastFed.timestamp).toLocaleString()}
              </Text>
            )}
            {recentFeedings.length > 0 && (
              <View style={starterStyles.historyList}>
                {recentFeedings.map((f) => (
                  <Text key={f.id} style={starterStyles.historyItem}>
                    {new Date(f.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' · '}
                    {f.flourGrams != null ? `${f.flourGrams}g` : '?'} flour + {f.waterGrams != null ? `${f.waterGrams}g` : '?'} water · {f.flourUsed.replace(/\s*\([^)]*\)$/, '')}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* ── Flour & Ingredients ─────────────────────────────── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>FLOUR & INGREDIENTS</Text>

        {/* Flour mix rows — each with gram input */}
        {mixRows.map((row, i) => (
          <View key={row.key} style={mixStyles.mixRow}>
            <View style={mixStyles.pickerWrap}>
              <FlourPicker
                value={row.flour.label}
                onSelect={(f) => handleUpdateFlour(row.key, f)}
              />
            </View>
            <NumberInput
              label=""
              value={row.grams}
              onChangeText={(t) => handleUpdateFlourGrams(row.key, t)}
              unit="g"
            />
            {mixRows.length > 1 && i > 0 && (
              <TouchableOpacity
                style={mixStyles.removeBtn}
                onPress={() => handleRemoveFlour(row.key)}
                activeOpacity={0.6}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={mixStyles.removeBtnText}>×</Text>
              </TouchableOpacity>
            )}
            {/* Spacer to align with remove button when not present */}
            {!(mixRows.length > 1 && i > 0) && <View style={mixStyles.removeBtnSpacer} />}
          </View>
        ))}

        {/* Summary: total + percentage breakdown */}
        <View style={mixStyles.summaryRow}>
          <Text style={mixStyles.summaryText}>
            Total: {totalFlourWeight.toFixed(0)}g
            {mixRows.length > 1 && totalFlourWeight > 0
              ? `  (${mixRows
                  .map((r) => {
                    const pct = ((parseFloat(r.grams) || 0) / totalFlourWeight) * 100;
                    return `${Math.round(pct)}% ${r.flour.label.replace(/\s*\([^)]*\)$/, '')}`;
                  })
                  .join(' · ')})`
              : ''}
          </Text>
        </View>

        {/* Add flour button */}
        {mixRows.length < 3 && (
          <TouchableOpacity
            style={mixStyles.addBtn}
            onPress={handleAddFlour}
            activeOpacity={0.6}
          >
            <Text style={mixStyles.addBtnText}>+ Add Flour</Text>
          </TouchableOpacity>
        )}

        <NumberInput label="Hydration" value={hydration} onChangeText={setHydration} unit="%" />
        <NumberInput label="Starter" value={starterWeight} onChangeText={setStarterWeight} unit="g" />
        <NumberInput label="Salt" value={saltPct} onChangeText={setSaltPct} unit="%" />

        {/* Oil / Fat (shown when preset has oil or user has set it) */}
        {(selectedPreset?.dough.oilPct !== undefined && selectedPreset.dough.oilPct > 0) || parseFloat(oilPct) > 0 ? (
          <NumberInput label="Oil / Fat" value={oilPct} onChangeText={setOilPct} unit="%" />
        ) : null}
      </View>

      {/* ── Pre-ferment (conditional) ────────────────────────── */}
      {prefermentEnabled && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PRE-FERMENT</Text>
          <Text style={styles.cardHint}>
            Pre-ferment flour is subtracted from the bowl flour. Its water is accounted for in total hydration.
          </Text>
          <NumberInput
            label="Flour in pre-ferment"
            value={prefermentFlourPct}
            onChangeText={setPrefermentFlourPct}
            unit="% of total flour"
          />
          <Text style={styles.cardHint}>
            Poolish: 100% hydration · Mix equal weights flour and water{'\n'}
            Pre-ferment ripeness: look for a domed surface that just begins to sink in the centre.
          </Text>
          <TouchableOpacity
            style={prefStyles.removeBtn}
            onPress={() => setPrefermentEnabled(false)}
            activeOpacity={0.6}
          >
            <Text style={prefStyles.removeBtnText}>Remove Pre-ferment</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Temperatures ────────────────────────────────────── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>TEMPERATURES</Text>
        <TempRow
          label="Ambient"
          value={ambientTemp}
          onChangeText={setAmbientTemp}
          isAuto={!!locationData}
        />
        <TempRow
          label="Flour"
          value={flourTemp}
          onChangeText={setFlourTemp}
        />
        <TempRow
          label="Water"
          value={waterTemp}
          onChangeText={setWaterTemp}
          isAuto={!!locationData}
        />
        <TempRow
          label="Starter"
          value={starterTemp}
          onChangeText={setStarterTemp}
        />
      </View>

      {/* ── Calculate ───────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.calcBtn}
        onPress={doCalculate}
        disabled={calculating}
        activeOpacity={0.8}
      >
        {calculating ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.calcBtnText}>Calculate</Text>
        )}
      </TouchableOpacity>
    </>
  );

  // ── Shared results section ───────────────────────────────────────────
  const resultsPanel = results && (
    <>
      {/* FDT */}
      <View style={styles.fdtCard}>
        <Text style={styles.fdtLabel}>Final Dough Temperature</Text>
        <Text style={[styles.fdtValue, { color: zoneInfo?.color }]}>
          {zoneInfo?.icon}  {results.fdt.toFixed(1)}°C
        </Text>
        <Text style={[styles.fdtZone, { color: zoneInfo?.color }]}>
          {zoneInfo?.label}
        </Text>
        {(() => {
          const label = zoneInfo?.label ?? '';
          const hint = label.includes('Ideal')
            ? 'Your dough is in the optimal fermentation range'
            : label.includes('Cold')
            ? 'Consider using warmer water to speed fermentation'
            : label.includes('Warm')
            ? 'Fermentation may be faster than expected'
            : label.includes('Hot')
            ? 'Use cold water to bring dough temp down'
            : '';
          return hint ? <Text style={styles.fdtHint}>{hint}</Text> : null;
        })()}
      </View>

      {/* Fermentation */}
      <FermentationTimeline
        dynamic={results.dynamicFerment}
        staticHours={results.staticFermentHours}
        staticNote={results.staticFermentNote}
        fdt={results.fdt}
      />

      {/* Ingredients */}
      <IngredientResults
        ingredients={results.ingredients}
        blend={buildBlend(mixRows, totalFlourWeight)}
        totalFlourWeight={totalFlourWeight}
        starterFlourType={starterFlourLabel}
        prefermentType={prefermentEnabled ? 'poolish' : undefined}
        typicalUnitGrams={selectedPreset?.typicalUnitGrams}
        unitLabel={selectedPreset?.unitLabel}
      />

      {/* Warnings */}
      <AdviceCards warnings={results.warnings} />

      {/* Method Timeline (only when a preset is selected) */}
      {selectedPreset && (
        <MethodTimeline
          preset={selectedPreset}
          staticFermentHours={results.staticFermentHours}
          fermentAdvice={results.fermentAdvice}
        />
      )}

      {/* Save + Share */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.saveBtnText}>💾  Save Recipe</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shareBtn}
        onPress={async () => {
          const blend = buildBlend(mixRows, totalFlourWeight);
          const text = generateShareTextFromState(
            blend,
            totalFlourWeight,
            hydration,
            starterWeight,
            saltPct,
            ambientTemp,
            waterTemp,
            results,
            locationData?.summary ?? '📍 Unknown location',
            breadType !== 'custom' ? breadType : undefined,
            oilPct,
            prefermentEnabled,
            prefermentFlourPct,
            selectedPreset
              ? `Bake at ${selectedPreset.bake.ovenTempC}°C${selectedPreset.bake.steamRequired ? ' with steam' : ''} in ${selectedPreset.bake.bakingVessel} for ${selectedPreset.bake.bakeTimeMinutes} min`
              : undefined,
          );
          try {
            await Share.share({ message: text });
          } catch {
            // User cancelled — no-op
          }
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.shareBtnText}>📤  Share Recipe</Text>
      </TouchableOpacity>
    </>
  );

  // ── Layout (responsive; single component tree — no remount on resize) ──
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isDesktop && <Text style={styles.header}>🥖  Just Dough It</Text>}

      {isDesktop && (
        <LocationBar
          summary={displaySummary}
          loading={locLoading}
          error={locError}
          onRefresh={detect}
          showFallbackWarning={!locLoading && !locationData}
          onTapFallback={() => {}}
          onPostcodeSubmit={(postcode) => refineWithPostcode(postcode)}
        />
      )}

      <View style={isDesktop ? desktopStyles.twoCol : styles.mobileCol}>
        {/* Left: Inputs */}
        <ScrollView
          ref={scrollRef}
          style={isDesktop ? desktopStyles.leftCol : styles.scroll}
          contentContainerStyle={isDesktop ? desktopStyles.leftContent : styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!isDesktop && <Text style={styles.header}>🥖  Just Dough It</Text>}

          {!isDesktop && (
            <LocationBar
              summary={displaySummary}
              loading={locLoading}
              error={locError}
              onRefresh={detect}
              showFallbackWarning={!locLoading && !locationData}
              onTapFallback={() => {}}
              onPostcodeSubmit={(postcode) => refineWithPostcode(postcode)}
            />
          )}

          {inputPanels}

          {!isDesktop && resultsPanel}

          {!results && !isDesktop && (
            <View style={styles.emptyResult}>
              <Text style={styles.emptyResultIcon}>🥖</Text>
              <Text style={styles.emptyResultText}>Enter your ingredients and tap Calculate to see your recipe</Text>
            </View>
          )}

          {!isDesktop && <View style={styles.bottomPad} />}
        </ScrollView>

        {/* Right: Results (desktop only) */}
        {isDesktop && (
          <ScrollView
            ref={rightScrollRef}
            style={desktopStyles.rightCol}
            contentContainerStyle={desktopStyles.rightContent}
            showsVerticalScrollIndicator={false}
          >
            {resultsPanel || (
              <View style={styles.emptyResult}>
                <Text style={styles.emptyResultIcon}>🥖</Text>
                <Text style={styles.emptyResultText}>Enter your ingredients and tap Calculate to see your recipe</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  mobileCol: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.espresso,
    textAlign: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  cardHint: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginBottom: Spacing.sm,
    lineHeight: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
  },
  inputLabel: {
    width: 90,
    fontSize: FontSize.sm,
    color: Colors.espresso,
  },
  calcBtn: {
    backgroundColor: Colors.terracotta,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 4,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  calcBtnText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  fdtCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  fdtLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  fdtValue: {
    fontSize: FontSize.title + 4,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  fdtZone: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  fdtHint: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: Colors.terracotta,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  shareBtn: {
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.olive,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  shareBtnText: {
    color: Colors.olive,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  bottomPad: {
    height: 40,
  },
  emptyResult: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: Spacing.xl,
  },
  emptyResultIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyResultText: {
    fontSize: FontSize.md,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
});

const starterStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    padding: Spacing.md,
  },
  collapsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 18,
  },
  summary: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.espresso,
    fontWeight: '500',
  },
  feedBtn: {
    backgroundColor: Colors.olive,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    alignItems: 'center',
  },
  feedBtnText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  chevron: {
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  expanded: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  expandedLabel: {
    width: 40,
    fontSize: FontSize.sm,
    color: Colors.muted,
    fontWeight: '500',
  },
  lastFedText: {
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  historyList: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  historyItem: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    paddingVertical: 1,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
});

const prefStyles = StyleSheet.create({
  removeBtn: {
    alignSelf: 'flex-end',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.xs,
  },
  removeBtnText: {
    fontSize: FontSize.xs,
    color: Colors.terracotta,
    fontWeight: '600',
  },
});

const mixStyles = StyleSheet.create({
  mixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  pickerWrap: {
    flex: 1,
  },
  summaryRow: {
    paddingVertical: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  summaryText: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    fontWeight: '500',
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnSpacer: {
    width: 36,
    height: 36,
  },
  removeBtnText: {
    fontSize: FontSize.lg,
    color: Colors.error,
    fontWeight: '700',
    lineHeight: FontSize.lg + 2,
  },
  addBtn: {
    alignSelf: 'flex-end',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  addBtnText: {
    fontSize: FontSize.sm,
    color: Colors.terracotta,
    fontWeight: '600',
  },
});

const desktopStyles = StyleSheet.create({
  twoCol: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  leftCol: {
    flex: 1,
    maxWidth: 420,
  },
  leftContent: {
    paddingBottom: 40,
  },
  rightCol: {
    flex: 1.3,
  },
  rightContent: {
    paddingBottom: 40,
  },
});
