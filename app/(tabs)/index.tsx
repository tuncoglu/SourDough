import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/theme';
import { useLocation } from '../../src/hooks/useLocation';
import { getAutoTemps } from '../../src/lib/location';
import { findFlour } from '../../src/lib/flourSearch';
import { runAllCalculations } from '../../src/lib/calculations';
import { saveRecipe, generateRecipeId } from '../../src/store/recipeStore';
import { loadSettings } from '../../src/store/settingsStore';
import {
  CalculationResults,
  SavedRecipe,
  UserSettings,
  DEFAULT_SETTINGS,
  getTempZoneInfo,
} from '../../src/models/types';
import type { WaterHardness } from '../../src/models/types';

import { LocationBar } from '../../src/components/LocationBar';
import { NumberInput } from '../../src/components/NumberInput';
import { FlourPicker } from '../../src/components/FlourPicker';
import { TempRow } from '../../src/components/TempRow';
import { IngredientResults } from '../../src/components/IngredientResults';
import { FermentationTimeline } from '../../src/components/FermentationTimeline';
import { AdviceCards } from '../../src/components/FermentAdvice';

const fallbackHardness: WaterHardness = {
  mgL: 120,
  classification: 'moderately soft',
  note: 'Unknown — assuming moderate',
  key: 'fallback',
};

export default function CalculatorScreen() {
  const { data: locationData, loading: locLoading, error: locError, detect } = useLocation();

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [flourLabel, setFlourLabel] = useState(DEFAULT_SETTINGS.defaultFlourType);
  const [flourWeight, setFlourWeight] = useState(String(DEFAULT_SETTINGS.defaultFlourWeight));
  const [hydration, setHydration] = useState(String(DEFAULT_SETTINGS.defaultHydration));
  const [starterWeight, setStarterWeight] = useState('100');
  const [saltPct, setSaltPct] = useState(String(DEFAULT_SETTINGS.defaultSaltPct));
  const [starterHyd, setStarterHyd] = useState(String(DEFAULT_SETTINGS.defaultStarterHydration));
  const [ambientTemp, setAmbientTemp] = useState('22');
  const [flourTemp, setFlourTemp] = useState('22');
  const [waterTemp, setWaterTemp] = useState('18');
  const [starterTemp, setStarterTemp] = useState('22');

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  // Load settings
  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setFlourLabel(s.defaultFlourType);
      setFlourWeight(String(s.defaultFlourWeight));
      setHydration(String(s.defaultHydration));
      setSaltPct(String(s.defaultSaltPct));
      setStarterHyd(String(s.defaultStarterHydration));
    });
  }, []);

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

  const handleCalculate = useCallback(() => {
    const fw = parseFloat(flourWeight);
    const hyd = parseFloat(hydration);
    const sw = parseFloat(starterWeight);
    const slt = parseFloat(saltPct);
    const sh = parseFloat(starterHyd);
    const amb = parseFloat(ambientTemp);
    const flr = parseFloat(flourTemp);
    const wat = parseFloat(waterTemp);
    const sta = parseFloat(starterTemp);

    if ([fw, hyd, sw, slt, sh, amb, flr, wat, sta].some(isNaN)) {
      Alert.alert('Invalid input', 'All fields must be numbers.');
      return;
    }

    setCalculating(true);

    const flour = findFlour(flourLabel);
    const hardness = locationData?.hardness ?? fallbackHardness;

    const warnings: string[] = [];
    if (wat <= 0) warnings.push('Water is near freezing. Dough will be very cold.');
    if (wat >= 65) warnings.push('Water is very hot. Risk of damaging starter.');

    const res = runAllCalculations(
      {
        flourWeight: fw,
        flourType: flour.label,
        flourProtein: flour.protein,
        flourProductNo: flour.productNumber,
        hydration: hyd,
        starterWeight: sw,
        starterHydration: sh,
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

    // Scroll to results
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [
    flourWeight, hydration, starterWeight, saltPct, starterHyd,
    ambientTemp, flourTemp, waterTemp, starterTemp,
    flourLabel, locationData,
  ]);

  const handleSave = useCallback(async () => {
    if (!results) return;
    setSaving(true);

    const flour = findFlour(flourLabel);
    const recipe: SavedRecipe = {
      id: generateRecipeId(),
      createdAt: new Date().toISOString(),
      inputs: {
        flourWeight: parseFloat(flourWeight),
        flourType: flour.label,
        flourProtein: flour.protein,
        flourProductNo: flour.productNumber,
        hydration: parseFloat(hydration),
        starterWeight: parseFloat(starterWeight),
        starterHydration: parseFloat(starterHyd),
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
      Alert.alert('Saved', 'Recipe saved to your history.');
    } catch (e) {
      Alert.alert('Error', 'Could not save recipe.');
    } finally {
      setSaving(false);
    }
  }, [results, flourLabel, flourWeight, hydration, starterWeight, saltPct,
      starterHyd, ambientTemp, flourTemp, waterTemp, starterTemp, locationData]);

  const zoneInfo = results ? getTempZoneInfo(results.tempZone) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.header}>🍞  Sourdough Optimizer</Text>

        {/* Location Bar */}
        <LocationBar
          summary={locationData?.summary ?? null}
          loading={locLoading}
          error={locError}
          onRefresh={detect}
        />

        {/* ── Flour & Ingredients ─────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>FLOUR & INGREDIENTS</Text>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Flour</Text>
            <NumberInput
              label=""
              value={flourWeight}
              onChangeText={setFlourWeight}
              unit="g"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Type</Text>
            <FlourPicker
              value={flourLabel}
              onSelect={(f) => setFlourLabel(f.label)}
            />
          </View>

          <NumberInput label="Hydration" value={hydration} onChangeText={setHydration} unit="%" />
          <NumberInput label="Starter" value={starterWeight} onChangeText={setStarterWeight} unit="g" />
          <NumberInput label="Salt" value={saltPct} onChangeText={setSaltPct} unit="%" />
          <NumberInput label="Starter hyd." value={starterHyd} onChangeText={setStarterHyd} unit="%" />
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
          onPress={handleCalculate}
          disabled={calculating}
          activeOpacity={0.8}
        >
          {calculating ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.calcBtnText}>Calculate</Text>
          )}
        </TouchableOpacity>

        {/* ── Results ──────────────────────────────────────────── */}
        {results && (
          <View style={styles.resultsContainer}>
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
            <IngredientResults ingredients={results.ingredients} />

            {/* Advice */}
            <AdviceCards
              fermentAdvice={results.fermentAdvice}
              waterHardnessAdvice={results.waterHardnessAdvice}
              warnings={results.warnings}
            />

            {/* Save */}
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
          </View>
        )}

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
  resultsContainer: {
    marginTop: Spacing.sm,
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
    marginBottom: Spacing.lg,
  },
  saveBtnText: {
    color: Colors.terracotta,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  bottomPad: {
    height: 40,
  },
});
