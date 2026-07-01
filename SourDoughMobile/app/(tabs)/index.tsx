import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
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
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/theme';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { useLocation } from '../../src/hooks/useLocation';
import { getAutoTemps } from '../../src/lib/location';
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
} from '../../src/models/types';
import type { WaterHardness, FlourEntry } from '../../src/models/types';

import { LocationBar } from '../../src/components/LocationBar';
import { NumberInput } from '../../src/components/NumberInput';
import { FlourPicker } from '../../src/components/FlourPicker';
import { TempRow } from '../../src/components/TempRow';
import { IngredientResults } from '../../src/components/IngredientResults';
import { FermentationTimeline } from '../../src/components/FermentationTimeline';
import { AdviceCards } from '../../src/components/FermentAdvice';
import { validateBlend, findFlour } from '../../src/lib/flourSearch';
import { getBlendProtein } from '../../src/lib/calculations';

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
    '🥖 Sourdough Recipe — Sourdough Optimizer',
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

  lines.push('');
  lines.push('Made with Sourdough Optimizer 🍞');
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
): string {
  const lines: string[] = [
    '🥖 Sourdough Recipe — Sourdough Optimizer',
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

  lines.push('');
  lines.push('⚖️  Weights');
  lines.push(`  Water: ${results.ingredients.addedWater.toFixed(1)}g`);
  lines.push(`  Starter: ${results.ingredients.starterTotal.toFixed(1)}g`);
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

  lines.push('');
  lines.push('Made with Sourdough Optimizer 🍞');
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
  const [ambientTemp, setAmbientTemp] = useState('22');
  const [flourTemp, setFlourTemp] = useState('22');
  const [waterTemp, setWaterTemp] = useState('18');
  const [starterTemp, setStarterTemp] = useState('22');

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
  const [starterRatio, setStarterRatio] = useState('1:1:1');
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
    });
    getStarterFlour().then(setStarterFlourLabel);
    refreshStarterData();
  }, [refreshStarterData]);

  // Update "hours since" every minute
  useEffect(() => {
    const t = setInterval(() => {
      if (lastFed) {
        const diff = Date.now() - new Date(lastFed.timestamp).getTime();
        setHoursSince((diff / 3600000).toFixed(1));
      }
    }, 60000);
    return () => clearInterval(t);
  }, [lastFed]);

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

  const doCalculate = useCallback(() => {
    const fw = totalFlourWeight;
    const hyd = parseFloat(hydration);
    const sw = parseFloat(starterWeight);
    const slt = parseFloat(saltPct);
    const amb = parseFloat(ambientTemp);
    const flr = parseFloat(flourTemp);
    const wat = parseFloat(waterTemp);
    const sta = parseFloat(starterTemp);

    if (fw <= 0) {
      Alert.alert('Invalid input', 'Total flour weight must be greater than 0. Enter grams for each flour.');
      return;
    }
    if ([hyd, sw, slt, amb, flr, wat, sta].some(isNaN)) {
      Alert.alert('Invalid input', 'All fields must be numbers.');
      return;
    }

    // Build blend from mix rows — convert gram weights to percentages
    const blend: FlourBlendEntry[] = mixRows.map((row) => {
      const grams = parseFloat(row.grams) || 0;
      return {
        label: row.flour.label,
        protein: row.flour.protein,
        productNumber: row.flour.productNumber,
        category: row.flour.category,
        percentage: fw > 0 ? (grams / fw) * 100 : 0,
      };
    });

    if (blend.every((e) => e.percentage === 0)) {
      Alert.alert('Invalid flour mix', 'Enter grams for at least one flour.');
      return;
    }

    setCalculating(true);

    const flour = findFlour(mixRows[0].flour.label);
    const hardness = locationData?.hardness ?? fallbackHardness;

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
        starterHydration: 100,
        starterFlourType: starterFlourLabel,
        saltPct: slt,
        ambientTemp: amb,
        flourTemp: flr,
        waterTemp: wat,
        starterTemp: sta,
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
    ambientTemp, flourTemp, waterTemp, starterTemp,
    mixRows, starterFlourLabel, locationData, isDesktop,
  ]);

  const handleSave = useCallback(async () => {
    if (!results) return;
    setSaving(true);

    const fw = totalFlourWeight;
    const blend: FlourBlendEntry[] = mixRows.map((row) => {
      const grams = parseFloat(row.grams) || 0;
      return {
        label: row.flour.label,
        protein: row.flour.protein,
        productNumber: row.flour.productNumber,
        category: row.flour.category,
        percentage: fw > 0 ? (grams / fw) * 100 : 0,
      };
    });

    const flourType =
      blend.length === 1
        ? blend[0].label
        : blend
            .map((e) => `${Math.round(e.percentage)}% ${e.label.replace(/\s*\([^)]*\)$/, '')}`)
            .join(' + ');
    const flourProtein = blend.length > 1 ? getBlendProtein(blend) : blend[0].protein;

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
        starterHydration: 100,
        starterFlourType: starterFlourLabel,
        saltPct: parseFloat(saltPct),
        ambientTemp: parseFloat(ambientTemp),
        flourTemp: parseFloat(flourTemp),
        waterTemp: parseFloat(waterTemp),
        starterTemp: parseFloat(starterTemp),
      },
      results,
      locationSummary: locationData?.summary ?? '📍 Unknown location',
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
      starterFlourLabel, ambientTemp, flourTemp, waterTemp, starterTemp, locationData]);

  const zoneInfo = results ? getTempZoneInfo(results.tempZone) : null;

  const handleFeedNow = useCallback(async () => {
    const feeding: StarterFeeding = {
      id: generateFeedingId(),
      timestamp: new Date().toISOString(),
      flourUsed: starterFlourLabel,
      ratio: starterRatio,
    };
    await logFeeding(feeding);
    setLastFed(feeding);
    setHoursSince('0.0');
    setRecentFeedings((prev) => [feeding, ...prev].slice(0, 3));
  }, [starterFlourLabel, starterRatio]);

  // ── Shared input sections ────────────────────────────────────────────
  const inputPanels = (
    <>
      {/* ── Starter (compact) ────────────────────────────────── */}
      <TouchableOpacity
        style={starterStyles.card}
        onPress={() => setStarterExpanded(!starterExpanded)}
        activeOpacity={0.8}
      >
        <View style={starterStyles.collapsedRow}>
          <Text style={starterStyles.icon}>🫙</Text>
          <Text style={starterStyles.summary} numberOfLines={1}>
            {lastFed
              ? `${starterFlourLabel.replace(/\s*\([^)]*\)$/, '')} · fed ${hoursSince}h ago`
              : 'Tap to set up your starter'}
          </Text>
          <TouchableOpacity
            style={starterStyles.feedBtn}
            onPress={(e) => {
              e.stopPropagation?.();
              handleFeedNow();
            }}
            activeOpacity={0.7}
          >
            <Text style={starterStyles.feedBtnText}>Feed</Text>
          </TouchableOpacity>
          <Text style={starterStyles.chevron}>{starterExpanded ? '▲' : '▼'}</Text>
        </View>

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
            <View style={starterStyles.ratioRow}>
              <Text style={starterStyles.expandedLabel}>Ratio</Text>
              {['1:1:1', '1:2:2', '1:5:5'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    starterStyles.ratioBtn,
                    starterRatio === r && starterStyles.ratioBtnSelected,
                  ]}
                  onPress={() => setStarterRatio(r)}
                >
                  <Text
                    style={[
                      starterStyles.ratioBtnText,
                      starterRatio === r && starterStyles.ratioBtnTextSelected,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
                    {f.ratio} · {f.flourUsed.replace(/\s*\([^)]*\)$/, '')}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

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
      </View>

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
        blend={mixRows.map((r) => {
          const grams = parseFloat(r.grams) || 0;
          return {
            label: r.flour.label,
            protein: r.flour.protein,
            productNumber: r.flour.productNumber,
            category: r.flour.category,
            percentage: totalFlourWeight > 0 ? (grams / totalFlourWeight) * 100 : 0,
          };
        })}
        totalFlourWeight={totalFlourWeight}
        starterFlourType={starterFlourLabel}
      />

      {/* Advice */}
      <AdviceCards
        fermentAdvice={results.fermentAdvice}
        waterHardnessAdvice={results.waterHardnessAdvice}
        warnings={results.warnings}
      />

      {/* Save + Share */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator color={Colors.terracotta} />
        ) : (
          <Text style={styles.saveBtnText}>💾  Save Recipe</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shareBtn}
        onPress={async () => {
          const blend: FlourBlendEntry[] = mixRows.map((row) => {
            const grams = parseFloat(row.grams) || 0;
            return {
              label: row.flour.label,
              protein: row.flour.protein,
              productNumber: row.flour.productNumber,
              category: row.flour.category,
              percentage: totalFlourWeight > 0 ? (grams / totalFlourWeight) * 100 : 0,
            };
          });
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

  // ── Desktop Layout ───────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.header}>🍞  Sourdough Optimizer</Text>
        <LocationBar
          summary={locationData?.summary ?? null}
          loading={locLoading}
          error={locError}
          onRefresh={detect}
          showFallbackWarning={!locLoading && !locationData}
          onTapFallback={() => {
            // Scroll to temperature section for manual entry
          }}
          onPostcodeSubmit={(postcode) => {
            refineWithPostcode(postcode);
          }}
        />
        <View style={desktopStyles.twoCol}>
          {/* Left: Inputs */}
          <ScrollView
            style={desktopStyles.leftCol}
            contentContainerStyle={desktopStyles.leftContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {inputPanels}
          </ScrollView>

          {/* Right: Results */}
          <ScrollView
            ref={rightScrollRef}
            style={desktopStyles.rightCol}
            contentContainerStyle={desktopStyles.rightContent}
            showsVerticalScrollIndicator={false}
          >
            {resultsPanel || (
              <View style={styles.emptyResult}>
                <Text style={styles.emptyResultIcon}>👆</Text>
                <Text style={styles.emptyResultText}>
                  Fill in your ingredients and temperatures, then click Calculate.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ── Mobile Layout ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>🍞  Sourdough Optimizer</Text>

        <LocationBar
          summary={locationData?.summary ?? null}
          loading={locLoading}
          error={locError}
          onRefresh={detect}
          showFallbackWarning={!locLoading && !locationData}
          onTapFallback={() => {
            // Scroll to temperature section for manual entry
          }}
          onPostcodeSubmit={(postcode) => {
            refineWithPostcode(postcode);
          }}
        />

        {inputPanels}

        {resultsPanel}

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
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
  saveBtn: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.terracotta,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  saveBtnText: {
    color: Colors.terracotta,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  shareBtn: {
    backgroundColor: Colors.olive,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  shareBtnText: {
    color: Colors.white,
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
    fontSize: 48,
    marginBottom: Spacing.md,
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
    padding: Spacing.md,
    marginBottom: Spacing.md,
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
  ratioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratioBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F0EBE5',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ratioBtnSelected: {
    backgroundColor: Colors.terracotta,
    borderColor: Colors.terracotta,
  },
  ratioBtnText: {
    fontSize: FontSize.xs,
    color: Colors.espresso,
    fontWeight: '500',
  },
  ratioBtnTextSelected: {
    color: Colors.white,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnSpacer: {
    width: 28,
    height: 28,
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
