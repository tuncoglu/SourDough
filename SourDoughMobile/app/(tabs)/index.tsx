import React, { useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../../src/theme';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { buildSummary } from '../../src/lib/location';
import { classifyHardness } from '../../src/data/ukWaterHardness';
import { PROOF_FRACTION } from '../../src/lib/calculations';
import { getRecipe } from '../../src/store/recipeStore';
import { findFlour } from '../../src/lib/flourSearch';
import { getPreset } from '../../src/data/recipePresets';
import type { WaterHardness, RecipePreset, SavedRecipe } from '../../src/models/types';

import { LocationBar } from '../../src/components/LocationBar';
import { RecipeTypePicker } from '../../src/components/RecipeTypePicker';
import { StarterCard } from '../../src/components/StarterCard';
import { FlourBlendCard } from '../../src/components/FlourBlendCard';
import { TemperatureCard } from '../../src/components/TemperatureCard';
import { ResultsSection } from '../../src/components/ResultsSection';

import { useCalculatorInputs } from '../../src/hooks/useCalculatorInputs';
import { useRecipePreset } from '../../src/hooks/useRecipePreset';
import { useStarterTracker } from '../../src/hooks/useStarterTracker';
import { useRecipeCalculation } from '../../src/hooks/useRecipeCalculation';
import { useRecipeActions } from '../../src/hooks/useRecipeActions';
import { useDailyRecommendation } from '../../src/hooks/useDailyRecommendation';

function buildManualHardness(mgL: number): WaterHardness {
  return { mgL, classification: classifyHardness(mgL), note: 'Manual override', key: 'manual' };
}

export default function CalculatorScreen() {
  const { isDesktop } = useBreakpoint();
  const { colors } = useAppTheme();
  const { editRecipeId } = useLocalSearchParams<{ editRecipeId?: string }>();

  // ── Hooks ──────────────────────────────────────────────────────────────
  const inputs = useCalculatorInputs();
  const preset = useRecipePreset();
  const starter = useStarterTracker();
  const calc = useRecipeCalculation();
  const actions = useRecipeActions();

  const { recommendation, dismiss: dismissRec } = useDailyRecommendation(
    inputs.ambientTemp, preset.breadType,
  );

  // #21: Pre-fill from editRecipeId
  useEffect(() => {
    if (!editRecipeId) return;
    getRecipe(editRecipeId).then((recipe) => {
      if (!recipe) return;
      const { inputs: ri } = recipe;
      // Pre-fill flour mix
      if (ri.flourBlend && ri.flourBlend.length > 0) {
        inputs.setMixRows((_prev) =>
          ri.flourBlend!.map((entry) => ({
            key: `edit_${entry.label}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            flour: findFlour(entry.label),
            grams: String(Math.round(ri.flourWeight * entry.percentage / 100)),
          })),
        );
      }
      inputs.setHydration(String(ri.hydration));
      inputs.setStarterWeight(String(ri.starterWeight));
      inputs.setSaltPct(String(ri.saltPct));
      inputs.setStarterHydrationStr(String(ri.starterHydration));
      inputs.setAmbientTemp(String(ri.ambientTemp));
      inputs.setFlourTemp(String(ri.flourTemp));
      inputs.setWaterTemp(String(ri.waterTemp));
      inputs.setStarterTemp(String(ri.starterTemp));
      if (ri.starterFlourType) starter.setStarterFlourLabel(ri.starterFlourType);
      if (ri.oilPct && ri.oilPct > 0) preset.setOilPct(String(ri.oilPct));
      if (ri.preferment) {
        preset.setPrefermentEnabled(true);
        preset.setPrefermentFlourPct(String(ri.preferment.flourPct));
      }
      if (ri.breadType) {
        const p = getPreset(ri.breadType);
        if (p) preset.setBreadType(ri.breadType as any);
      }
    });
  }, [editRecipeId]);

  // ── Ready-by planner state ────────────────────────────────────────────
  const [planByReadyEnabled, setPlanByReadyEnabled] = React.useState(false);
  const [readyByHour, setReadyByHour] = React.useState('18');
  const [readyByMinute, setReadyByMinute] = React.useState('00');

  // ── Cold proof state ──────────────────────────────────────────────────
  const [coldProofEnabled, setColdProofEnabled] = React.useState(false);
  const [coldProofHours, setColdProofHours] = React.useState('12');
  const [coldProofTemp, setColdProofTemp] = React.useState('4');

  // ── Derived ───────────────────────────────────────────────────────────
  const displaySummary = !inputs.locationData ? null
    : inputs.settings.waterHardnessOverride > 0
      ? buildSummary(inputs.locationData.location, inputs.locationData.ambientTemp, inputs.locationData.waterTemp, buildManualHardness(inputs.settings.waterHardnessOverride))
      : inputs.locationData.summary;

  // ── Calculate ─────────────────────────────────────────────────────────
  const doCalculate = useCallback(() => {
    calc.doCalculate({
      blend: inputs.blend,
      totalFlourWeight: inputs.totalFlourWeight,
      hydration: inputs.hydration,
      starterWeight: inputs.starterWeight,
      saltPct: inputs.saltPct,
      starterHydrationStr: inputs.starterHydrationStr,
      oilPct: preset.oilPct,
      ambientTemp: inputs.ambientTemp,
      flourTemp: inputs.flourTemp,
      waterTemp: inputs.waterTemp,
      starterTemp: inputs.starterTemp,
      starterFlourLabel: starter.starterFlourLabel,
      prefermentEnabled: preset.prefermentEnabled,
      prefermentFlourPct: preset.prefermentFlourPct,
      breadType: preset.breadType,
      locationData: inputs.locationData,
      waterHardnessOverride: inputs.settings.waterHardnessOverride || 0,
      coldProofHours,
      coldProofTemp,
      coldProofEnabled,
      starterHoursSinceFed: starter.status?.effectiveHours,
    }, isDesktop);
  }, [inputs, preset, starter.starterFlourLabel, isDesktop, calc]);

  // ── Save ──────────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    if (!calc.results) return;
    actions.handleSave({
      blend: inputs.blend,
      totalFlourWeight: inputs.totalFlourWeight,
      hydration: inputs.hydration,
      starterWeight: inputs.starterWeight,
      saltPct: inputs.saltPct,
      starterHydrationStr: inputs.starterHydrationStr,
      oilPct: preset.oilPct,
      ambientTemp: inputs.ambientTemp,
      flourTemp: inputs.flourTemp,
      waterTemp: inputs.waterTemp,
      starterTemp: inputs.starterTemp,
      starterFlourLabel: starter.starterFlourLabel,
      prefermentEnabled: preset.prefermentEnabled,
      prefermentFlourPct: preset.prefermentFlourPct,
      breadType: preset.breadType,
      results: calc.results,
      locationSummary: inputs.locationData?.summary ?? '📍 Unknown location',
    });
  }, [inputs, preset, starter.starterFlourLabel, calc.results, actions]);

  // ── Share ─────────────────────────────────────────────────────────────
  const handleShare = useCallback(() => {
    if (!calc.results) return;
    const bakeInfo = preset.selectedPreset
      ? `Bake at ${preset.selectedPreset.bake.ovenTempC}°C${preset.selectedPreset.bake.steamRequired ? ' with steam' : ''} in ${preset.selectedPreset.bake.bakingVessel} for ${preset.selectedPreset.bake.bakeTimeMinutes} min`
      : undefined;
    actions.handleShare({
      blend: inputs.blend,
      totalFlourWeight: inputs.totalFlourWeight,
      hydration: inputs.hydration,
      starterWeight: inputs.starterWeight,
      saltPct: inputs.saltPct,
      starterHydrationStr: inputs.starterHydrationStr,
      oilPct: preset.oilPct,
      ambientTemp: inputs.ambientTemp,
      waterTemp: inputs.waterTemp,
      prefermentEnabled: preset.prefermentEnabled,
      prefermentFlourPct: preset.prefermentFlourPct,
      results: calc.results,
      locationSummary: inputs.locationData?.summary ?? '📍 Unknown location',
      bakeInfo,
    });
  }, [inputs, preset, calc.results, actions]);

  // ── Ready-by result ───────────────────────────────────────────────────
  const readyByResult = React.useMemo(() => {
    if (!planByReadyEnabled || !calc.results) return null;
    const h = parseInt(readyByHour, 10);
    const m = parseInt(readyByMinute, 10);
    if (isNaN(h) || isNaN(m)) return null;

    const fermentHours = calc.results.dynamicFerment?.totalHours ?? calc.results.staticFermentHours;
    let totalMinutes = fermentHours * 60;

    // Pre-ferment lead time (poolish ~12h, biga ~16h)
    if (preset.prefermentEnabled) {
      const prefermentHours = preset.selectedPreset?.dough.preferment?.type === 'biga' ? 16 : 12;
      totalMinutes += prefermentHours * 60;
    }

    if (preset.selectedPreset) {
      const { process, bake } = preset.selectedPreset;
      totalMinutes += process.autolyseMinutes;
      totalMinutes += process.folds * process.foldIntervalMinutes;
      totalMinutes += process.benchRestMinutes;
      totalMinutes += fermentHours * PROOF_FRACTION * 60;
      totalMinutes += bake.bakeTimeMinutes;
      totalMinutes += 5;
    }
    const totalHours = totalMinutes / 60;

    const readyDate = new Date();
    readyDate.setHours(h, m, 0, 0);
    if (readyDate <= new Date()) readyDate.setDate(readyDate.getDate() + 1);
    const startDate = new Date(readyDate.getTime() - totalMinutes * 60000);

    const breakdownParts: string[] = [];
    // Pre-ferment first in the breakdown
    if (preset.prefermentEnabled) {
      const prefH = preset.selectedPreset?.dough.preferment?.type === 'biga' ? 16 : 12;
      breakdownParts.push(`pre-ferment ~${prefH}h`);
    }
    breakdownParts.push(`bulk ferment ~${fermentHours.toFixed(1)}h`);
    if (preset.selectedPreset) {
      const { process, bake } = preset.selectedPreset;
      if (process.autolyseMinutes > 0) breakdownParts.push(`autolyse ${process.autolyseMinutes}min`);
      const foldTime = process.folds * process.foldIntervalMinutes;
      if (foldTime > 0) breakdownParts.push(`folds ${foldTime}min`);
      if (process.benchRestMinutes > 0) breakdownParts.push(`bench rest ${process.benchRestMinutes}min`);
      breakdownParts.push(`proof ~${(fermentHours * PROOF_FRACTION).toFixed(1)}h`);
      breakdownParts.push(`bake ${bake.bakeTimeMinutes}min`);
    }

    return {
      startTimeStr: startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
      readyTimeStr: readyDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
      isToday: startDate.toDateString() === new Date().toDateString(),
      startDate,
      totalHours,
      breakdownParts,
      fermentHours,
    };
  }, [planByReadyEnabled, calc.results, readyByHour, readyByMinute, preset.selectedPreset]);

  // ═══════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════
  const inputPanels = (
    <>
      {/* Daily Recommendation */}
      {recommendation && (
        <View style={recStyles.card}>
          <View style={recStyles.row}>
            <Text style={recStyles.icon}>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={recStyles.title}>Today's suggestion</Text>
              <Text style={recStyles.body}>
                <Text style={recStyles.presetName}>{recommendation.preset.emoji} {recommendation.preset.name}</Text>
                {' — '}{recommendation.reason}
              </Text>
              <TouchableOpacity
                onPress={() => preset.handlePresetSelect(
                  recommendation.preset, inputs.mixRows, inputs.setMixRows,
                  inputs.hydration, inputs.starterWeight, inputs.saltPct, preset.oilPct,
                  inputs.setHydration, inputs.setStarterWeight, inputs.setSaltPct,
                )}
                activeOpacity={0.7}
              >
                <Text style={recStyles.applyBtn}>Use this preset →</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={dismissRec} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={recStyles.dismiss}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Recipe Type */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>RECIPE TYPE</Text>
        <RecipeTypePicker
          selected={preset.breadType}
          onSelect={(p) => preset.handlePresetSelect(
            p, inputs.mixRows, inputs.setMixRows,
            inputs.hydration, inputs.starterWeight, inputs.saltPct, preset.oilPct,
            inputs.setHydration, inputs.setStarterWeight, inputs.setSaltPct,
          )}
        />
        {preset.selectedPreset && (
          <Text style={styles.cardHint}>{preset.selectedPreset.emoji} {preset.selectedPreset.description}</Text>
        )}
      </View>

      {/* Starter */}
      <StarterCard {...starter} />

      {/* Flour & Ingredients */}
      <FlourBlendCard
        mixRows={inputs.mixRows}
        totalFlourWeight={inputs.totalFlourWeight}
        hydration={inputs.hydration}
        starterWeight={inputs.starterWeight}
        saltPct={inputs.saltPct}
        oilPct={preset.oilPct}
        showOil={preset.showOil}
        onAddFlour={inputs.handleAddFlour}
        onRemoveFlour={inputs.handleRemoveFlour}
        onUpdateFlour={inputs.handleUpdateFlour}
        onUpdateFlourGrams={inputs.handleUpdateFlourGrams}
        setHydration={inputs.setHydration}
        setStarterWeight={inputs.setStarterWeight}
        setSaltPct={inputs.setSaltPct}
        setOilPct={preset.setOilPct}
      />

      {/* Pre-ferment */}
      {preset.prefermentEnabled && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PRE-FERMENT</Text>
          <Text style={styles.cardHint}>
            Pre-ferment flour is subtracted from the bowl flour. Its water is accounted for in total hydration.
          </Text>
          <View style={prefStyles.row}>
            <Text style={prefStyles.label}>Flour in pre-ferment</Text>
            <View style={{ flex: 1 }}>
              <TextInput
                style={prefStyles.input}
                value={preset.prefermentFlourPct}
                onChangeText={preset.setPrefermentFlourPct}
                keyboardType="numeric"
              />
            </View>
            <Text style={prefStyles.unit}>% of total flour</Text>
          </View>
          <Text style={styles.cardHint}>
            Poolish: 100% hydration · Mix equal weights flour and water{'\n'}
            Pre-ferment ripeness: look for a domed surface that just begins to sink in the centre.
          </Text>
          <TouchableOpacity style={prefStyles.removeBtn} onPress={() => preset.setPrefermentEnabled(false)} activeOpacity={0.6}>
            <Text style={prefStyles.removeBtnText}>Remove Pre-ferment</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Ready-By Planner */}
      {!planByReadyEnabled ? (
        <TouchableOpacity style={styles.card} onPress={() => setPlanByReadyEnabled(true)} activeOpacity={0.7}>
          <View style={readyStyles.promptRow}>
            <Text style={readyStyles.promptIcon}>🕐</Text>
            <View style={{ flex: 1 }}>
              <Text style={readyStyles.promptTitle}>Plan by ready time</Text>
              <Text style={readyStyles.promptHint}>Tell us when you want your bread ready — we'll tell you when to start</Text>
            </View>
            <Text style={readyStyles.promptChevron}>›</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.card}>
          <View style={readyStyles.headerRow}>
            <Text style={styles.cardTitle}>🕐  READY-BY PLANNER</Text>
            <TouchableOpacity onPress={() => setPlanByReadyEnabled(false)}>
              <Text style={readyStyles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cardHint}>Set the time you want your bread to come out of the oven.</Text>
          <View style={readyStyles.timeRow}>
            <Text style={readyStyles.timeLabel}>Ready by</Text>
            <View style={readyStyles.timeInputGroup}>
              <TextInput
                style={readyStyles.timeInput}
                value={readyByHour}
                onChangeText={(t) => {
                  const n = parseInt(t, 10);
                  if (t === '' || (!isNaN(n) && n >= 0 && n <= 23)) setReadyByHour(t);
                }}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="HH"
                placeholderTextColor={Colors.lightText}
              />
              <Text style={readyStyles.timeColon}>:</Text>
              <TextInput
                style={readyStyles.timeInput}
                value={readyByMinute}
                onChangeText={(t) => {
                  const n = parseInt(t, 10);
                  if (t === '' || (!isNaN(n) && n >= 0 && n <= 59)) setReadyByMinute(t);
                }}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="MM"
                placeholderTextColor={Colors.lightText}
              />
            </View>
          </View>
        </View>
      )}

      {/* Cold Proof (collapsible) */}
      {!coldProofEnabled ? (
        <TouchableOpacity style={styles.card} onPress={() => setColdProofEnabled(true)} activeOpacity={0.7}>
          <View style={readyStyles.promptRow}>
            <Text style={readyStyles.promptIcon}>❄️</Text>
            <View style={{ flex: 1 }}>
              <Text style={readyStyles.promptTitle}>Cold proof / retard</Text>
              <Text style={readyStyles.promptHint}>
                Proof in the fridge overnight for deeper flavour and tangier crumb
              </Text>
            </View>
            <Text style={readyStyles.promptChevron}>›</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.card}>
          <View style={readyStyles.headerRow}>
            <Text style={styles.cardTitle}>❄️  COLD PROOF</Text>
            <TouchableOpacity onPress={() => setColdProofEnabled(false)}>
              <Text style={readyStyles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cardHint}>
            After bulk fermentation, shape and place in the fridge. Cold temperatures favour acetic acid production for a tangier crumb.
          </Text>
          <View style={coldStyles.row}>
            <Text style={coldStyles.label}>Duration</Text>
            <TextInput
              style={coldStyles.input}
              value={coldProofHours}
              onChangeText={setColdProofHours}
              keyboardType="numeric"
              placeholder="12"
              placeholderTextColor={Colors.lightText}
            />
            <Text style={coldStyles.unit}>hours</Text>
          </View>
          <View style={coldStyles.row}>
            <Text style={coldStyles.label}>Fridge temp</Text>
            <TextInput
              style={coldStyles.input}
              value={coldProofTemp}
              onChangeText={setColdProofTemp}
              keyboardType="numeric"
              placeholder="4"
              placeholderTextColor={Colors.lightText}
            />
            <Text style={coldStyles.unit}>°C</Text>
          </View>
        </View>
      )}

      {/* Temperatures */}
      <TemperatureCard
        ambientTemp={inputs.ambientTemp}
        flourTemp={inputs.flourTemp}
        waterTemp={inputs.waterTemp}
        starterTemp={inputs.starterTemp}
        isLocationAuto={!!inputs.locationData}
        setAmbientTemp={inputs.setAmbientTemp}
        setFlourTemp={inputs.setFlourTemp}
        setWaterTemp={inputs.setWaterTemp}
        setStarterTemp={inputs.setStarterTemp}
      />

      {/* Calculate */}
      <TouchableOpacity style={styles.calcBtn} onPress={doCalculate} disabled={calc.calculating} activeOpacity={0.8}>
        {calc.calculating ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.calcBtnText}>Calculate</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const resultsPanel = calc.results && (
    <ResultsSection
      results={calc.results}
      blend={inputs.blend}
      totalFlourWeight={inputs.totalFlourWeight}
      starterFlourLabel={starter.starterFlourLabel}
      preferredType={preset.prefermentEnabled ? 'poolish' : undefined}
      selectedPreset={preset.selectedPreset}
      flourTemp={inputs.flourTemp}
      ambientTemp={inputs.ambientTemp}
      waterTemp={inputs.waterTemp}
      starterTemp={inputs.starterTemp}
      saving={actions.saving}
      onSave={handleSave}
      onShare={handleShare}
      readyByResult={readyByResult}
    />
  );

  // ═══════════════════════════════════════════════════════════════════════
  //  LAYOUT
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={[layoutStyles.container, { backgroundColor: colors.cream }]} edges={['top']}>
      {isDesktop && <Text style={[layoutStyles.header, { color: colors.espresso }]}>🥖  Just Dough It</Text>}

      {isDesktop && (
        <LocationBar
          summary={displaySummary}
          loading={inputs.locLoading}
          error={inputs.locError}
          onRefresh={inputs.onRefreshLocation}
          showFallbackWarning={!inputs.locLoading && !inputs.locationData}
          onTapFallback={() => {}}
          onPostcodeSubmit={inputs.onPostcodeSubmit}
        />
      )}

      <View style={isDesktop ? desktopStyles.twoCol : layoutStyles.mobileCol}>
        <ScrollView
          ref={calc.scrollRef}
          style={isDesktop ? desktopStyles.leftCol : layoutStyles.scroll}
          contentContainerStyle={isDesktop ? desktopStyles.leftContent : layoutStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!isDesktop && <Text style={[layoutStyles.header, { color: colors.espresso }]}>🥖  Just Dough It</Text>}

          {!isDesktop && (
            <LocationBar
              summary={displaySummary}
              loading={inputs.locLoading}
              error={inputs.locError}
              onRefresh={inputs.onRefreshLocation}
              showFallbackWarning={!inputs.locLoading && !inputs.locationData}
              onTapFallback={() => {}}
              onPostcodeSubmit={inputs.onPostcodeSubmit}
            />
          )}

          {inputPanels}

          {!isDesktop && resultsPanel}

          {!calc.results && !isDesktop && (
            <View style={layoutStyles.emptyResult}>
              <Text style={layoutStyles.emptyResultIcon}>🥖</Text>
              <Text style={layoutStyles.emptyResultText}>Enter your ingredients and tap Calculate to see your recipe</Text>
            </View>
          )}

          {!isDesktop && <View style={layoutStyles.bottomPad} />}
        </ScrollView>

        {isDesktop && (
          <ScrollView
            ref={calc.rightScrollRef}
            style={desktopStyles.rightCol}
            contentContainerStyle={desktopStyles.rightContent}
            showsVerticalScrollIndicator={false}
          >
            {resultsPanel || (
              <View style={layoutStyles.emptyResult}>
                <Text style={layoutStyles.emptyResultIcon}>🥖</Text>
                <Text style={layoutStyles.emptyResultText}>Enter your ingredients and tap Calculate to see your recipe</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════════════════

const layoutStyles = StyleSheet.create({
  container: { flex: 1 },
  mobileCol: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  header: { fontSize: FontSize.xl, fontWeight: '800', textAlign: 'center', marginBottom: Spacing.md, marginTop: Spacing.md },
  emptyResult: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 120, paddingHorizontal: Spacing.xl },
  emptyResultIcon: { fontSize: 40, marginBottom: Spacing.sm, textAlign: 'center' },
  emptyResultText: { fontSize: FontSize.md, color: Colors.muted, textAlign: 'center', lineHeight: 22 },
  bottomPad: { height: 40 },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.xs, fontWeight: '700', color: Colors.muted,
    letterSpacing: 0.5, marginBottom: Spacing.sm,
  },
  cardHint: { fontSize: FontSize.xs, color: Colors.muted, marginBottom: Spacing.sm, lineHeight: 16 },
  calcBtn: {
    backgroundColor: Colors.terracotta, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 4, alignItems: 'center', marginBottom: Spacing.lg,
  },
  calcBtnText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '700' },
});

const prefStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, gap: Spacing.sm },
  label: { fontSize: FontSize.sm, color: Colors.espresso },
  input: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
    fontSize: FontSize.sm, color: Colors.espresso, textAlign: 'right', minWidth: 60,
  },
  unit: { fontSize: FontSize.xs, color: Colors.muted },
  removeBtn: { alignSelf: 'flex-end', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, marginTop: Spacing.xs },
  removeBtnText: { fontSize: FontSize.xs, color: Colors.terracotta, fontWeight: '600' },
});

const recStyles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F4ED', borderWidth: 1, borderColor: '#E0D6C5',
    borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  icon: { fontSize: 20, marginTop: 1 },
  title: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  body: { fontSize: FontSize.sm, color: Colors.espresso, lineHeight: 19 },
  presetName: { fontWeight: '700' },
  applyBtn: { fontSize: FontSize.xs, color: Colors.terracotta, fontWeight: '700', marginTop: Spacing.sm },
  dismiss: { fontSize: FontSize.lg, color: Colors.muted, fontWeight: '300', paddingLeft: Spacing.sm },
});

const readyStyles = StyleSheet.create({
  promptRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  promptIcon: { fontSize: 22 },
  promptTitle: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.espresso },
  promptHint: { fontSize: FontSize.xs, color: Colors.muted, marginTop: 2 },
  promptChevron: { fontSize: FontSize.xl, color: Colors.muted, fontWeight: '300' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  removeText: { fontSize: FontSize.xs, color: Colors.terracotta, fontWeight: '600' },
  timeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  timeLabel: { width: 90, fontSize: FontSize.sm, color: Colors.espresso },
  timeInputGroup: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeInput: {
    width: 52, height: 40, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.sm, textAlign: 'center', fontSize: FontSize.lg, fontWeight: '700', color: Colors.espresso,
  },
  timeColon: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.espresso },
});

const coldStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, gap: Spacing.sm },
  label: { fontSize: FontSize.sm, color: Colors.espresso, width: 90 },
  input: {
    width: 60, height: 36, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.sm, textAlign: 'center', fontSize: FontSize.sm, fontWeight: '600', color: Colors.espresso,
  },
  unit: { fontSize: FontSize.xs, color: Colors.muted },
});

const desktopStyles = StyleSheet.create({
  twoCol: { flex: 1, flexDirection: 'row', gap: Spacing.lg, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  leftCol: { flex: 1, maxWidth: 420 },
  leftContent: { paddingBottom: 40 },
  rightCol: { flex: 1.3 },
  rightContent: { paddingBottom: 40 },
});
