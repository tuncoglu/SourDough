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
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { useLocation } from '../../src/hooks/useLocation';
import { getAutoTemps } from '../../src/lib/location';
import { runAllCalculations } from '../../src/lib/calculations';
import { saveRecipe, generateRecipeId } from '../../src/store/recipeStore';
import { loadSettings } from '../../src/store/settingsStore';
import {
  CalculationResults,
  SavedRecipe,
  UserSettings,
  DEFAULT_SETTINGS,
  getTempZoneInfo,
  FlourBlendEntry,
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

const fallbackHardness: WaterHardness = {
  mgL: 120,
  classification: 'moderately soft',
  note: 'Unknown — assuming moderate',
  key: 'fallback',
};

interface MixRow {
  key: string;
  flour: FlourEntry;
  percentage: string;
}

let _mixKeyCounter = 0;
function nextMixKey(): string {
  return `flour_${_mixKeyCounter++}`;
}

export default function CalculatorScreen() {
  const { data: locationData, loading: locLoading, error: locError, detect } = useLocation();
  const { isDesktop } = useBreakpoint();

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [mixRows, setMixRows] = useState<MixRow[]>([
    { key: nextMixKey(), flour: findFlour(DEFAULT_SETTINGS.defaultFlourType), percentage: '100' },
  ]);
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
  const rightScrollRef = useRef<ScrollView>(null);

  // ── Flour mix handlers ───────────────────────────────────────────────
  const handleAddFlour = useCallback(() => {
    setMixRows((prev) => {
      if (prev.length >= 3) return prev;
      const count = prev.length + 1;
      const pct = (100 / count).toFixed(1);
      return [
        ...prev.map((r) => ({ ...r, percentage: pct })),
        {
          key: nextMixKey(),
          flour: findFlour('Generic: Bread Flour'),
          percentage: pct,
        },
      ];
    });
  }, []);

  const handleRemoveFlour = useCallback((key: string) => {
    setMixRows((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((r) => r.key !== key);
      const pct = (100 / next.length).toFixed(1);
      return next.map((r) => ({ ...r, percentage: pct }));
    });
  }, []);

  const handleUpdateFlour = useCallback((key: string, flour: FlourEntry) => {
    setMixRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, flour } : r)),
    );
  }, []);

  const handleUpdatePercentage = useCallback((key: string, pct: string) => {
    setMixRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, percentage: pct } : r)),
    );
  }, []);

  // Load settings
  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setMixRows([{ key: nextMixKey(), flour: findFlour(s.defaultFlourType), percentage: '100' }]);
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

  const doCalculate = useCallback(() => {
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

    // Build blend from mix rows
    const blend: FlourBlendEntry[] = mixRows.map((row) => ({
      label: row.flour.label,
      protein: row.flour.protein,
      productNumber: row.flour.productNumber,
      category: row.flour.category,
      percentage: parseFloat(row.percentage),
    }));

    const blendError = validateBlend(blend);
    if (blendError) {
      Alert.alert('Invalid flour mix', blendError);
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

    // Scroll results into view
    if (isDesktop) {
      setTimeout(() => rightScrollRef.current?.scrollTo({ y: 0, animated: true }), 100);
    } else {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [
    flourWeight, hydration, starterWeight, saltPct, starterHyd,
    ambientTemp, flourTemp, waterTemp, starterTemp,
    mixRows, locationData, isDesktop,
  ]);

  const handleSave = useCallback(async () => {
    if (!results) return;
    setSaving(true);

    const fw = parseFloat(flourWeight);
    const blend: FlourBlendEntry[] = mixRows.map((row) => ({
      label: row.flour.label,
      protein: row.flour.protein,
      productNumber: row.flour.productNumber,
      category: row.flour.category,
      percentage: parseFloat(row.percentage),
    }));

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
  }, [results, mixRows, flourWeight, hydration, starterWeight, saltPct,
      starterHyd, ambientTemp, flourTemp, waterTemp, starterTemp, locationData]);

  const zoneInfo = results ? getTempZoneInfo(results.tempZone) : null;

  // ── Shared input sections ────────────────────────────────────────────
  const inputPanels = (
    <>
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

        {/* Flour mix rows */}
        {mixRows.map((row, i) => {
          const computedWeight =
            (parseFloat(row.percentage) / 100) * parseFloat(flourWeight || '0');
          return (
            <View key={row.key} style={mixStyles.mixRow}>
              <View style={mixStyles.pickerWrap}>
                <FlourPicker
                  value={row.flour.label}
                  onSelect={(f) => handleUpdateFlour(row.key, f)}
                />
              </View>
              <NumberInput
                label=""
                value={row.percentage}
                onChangeText={(t) => handleUpdatePercentage(row.key, t)}
                unit="%"
              />
              <Text style={mixStyles.computedWeight}>
                = {isNaN(computedWeight) ? '0.0' : computedWeight.toFixed(1)}g
              </Text>
              {mixRows.length > 1 && i > 0 && (
                <TouchableOpacity
                  style={mixStyles.removeBtn}
                  onPress={() => handleRemoveFlour(row.key)}
                  activeOpacity={0.6}
                >
                  <Text style={mixStyles.removeBtnText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

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
        blend={mixRows.map((r) => ({
          label: r.flour.label,
          protein: r.flour.protein,
          productNumber: r.flour.productNumber,
          category: r.flour.category,
          percentage: parseFloat(r.percentage),
        }))}
        totalFlourWeight={parseFloat(flourWeight)}
      />

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
  computedWeight: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    width: 70,
    textAlign: 'right',
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
