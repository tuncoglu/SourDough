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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyle, sectionTitleStyle } from '../../src/theme';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { buildSummary } from '../../src/lib/location';
import { PROOF_FRACTION } from '../../src/lib/calculations';
import { buildManualHardness } from '../../src/lib/hardnessUtils';
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
import { KeyboardScreen } from '../../src/components/KeyboardScreen';

import { useCalculatorInputs } from '../../src/hooks/useCalculatorInputs';
import { useRecipePreset } from '../../src/hooks/useRecipePreset';
import { useStarterTracker } from '../../src/hooks/useStarterTracker';
import { useRecipeCalculation } from '../../src/hooks/useRecipeCalculation';
import { useRecipeActions } from '../../src/hooks/useRecipeActions';
import { useDailyRecommendation } from '../../src/hooks/useDailyRecommendation';


export default function CalculatorScreen() {
  const { isDesktop } = useBreakpoint();
  const { colors, unitSystem } = useAppTheme();
  const { editRecipeId } = useLocalSearchParams<{ editRecipeId?: string }>();
  const router = useRouter();

  // ── Hooks ──────────────────────────────────────────────────────────────
  const inputs = useCalculatorInputs();
  const preset = useRecipePreset();
  const starter = useStarterTracker();
  const calc = useRecipeCalculation();
  const actions = useRecipeActions();

  // ── H1: Location fallback → Settings (water hardness override) ───────
  const rawPrefermentType = preset.selectedPreset?.dough.preferment?.type;
  const prefermentType: 'poolish' | 'biga' | undefined =
    rawPrefermentType === 'none' ? undefined : rawPrefermentType;

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
        if (p) preset.setPreset(p);
      }
      // Restore cold-proof state
      if (ri.coldProofHours && ri.coldProofHours > 0) {
        setColdProofEnabled(true);
        setColdProofHours(String(ri.coldProofHours));
        if (ri.coldProofTemp) setColdProofTemp(String(ri.coldProofTemp));
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

  // ── D2: Stale-results detection (derived, no extra render) ──────────────
  const calculatedSignature = React.useRef<string | null>(null);
  const inputSignature = [
    inputs.hydration, inputs.starterWeight, inputs.saltPct,
    inputs.ambientTemp, inputs.flourTemp, inputs.waterTemp, inputs.starterTemp,
    preset.oilPct, preset.prefermentFlourPct, preset.prefermentEnabled,
    inputs.mixRows.map((r) => `${r.flour.label}:${r.grams}`).join(','),
    coldProofEnabled, coldProofHours, coldProofTemp,
    inputs.locationData?.summary,
  ].join('|');
  const inputsDirty = calculatedSignature.current !== null && inputSignature !== calculatedSignature.current;

  // ── Derived ───────────────────────────────────────────────────────────
  const displaySummary = !inputs.locationData ? null
    : inputs.settings.waterHardnessOverride > 0
      ? buildSummary(inputs.locationData.location, inputs.locationData.ambientTemp, inputs.locationData.waterTemp, buildManualHardness(inputs.settings.waterHardnessOverride))
      : inputs.locationData.summary;

  // ── Calculate ─────────────────────────────────────────────────────────
  const doCalculate = useCallback(() => {
    calculatedSignature.current = inputSignature;
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
      prefermentType: prefermentType,
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
      prefermentType: prefermentType,
      breadType: preset.breadType,
      results: calc.results,
      locationSummary: inputs.locationData?.summary ?? '📍 Unknown location',
      coldProofEnabled,
      coldProofHours,
      coldProofTemp,
    });
  }, [inputs, preset, starter.starterFlourLabel, calc.results, actions, coldProofEnabled, coldProofHours, coldProofTemp]);

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
      prefermentType: prefermentType,
      results: calc.results,
      locationSummary: inputs.locationData?.summary ?? '📍 Unknown location',
      bakeInfo,
      unitSystem,
      coldProofEnabled,
      coldProofHours,
    });
  }, [inputs, preset, calc.results, actions, unitSystem, coldProofEnabled, coldProofHours]);

  // ── Ready-by result ───────────────────────────────────────────────────
  const readyByResult = React.useMemo(() => {
    if (!planByReadyEnabled || !calc.results) return null;
    const h = parseInt(readyByHour, 10);
    const m = parseInt(readyByMinute, 10);
    if (isNaN(h) || isNaN(m)) return null;

    const fermentHours = calc.results.dynamicFerment?.bulkHours ?? calc.results.staticFermentHours;
    let totalMinutes = fermentHours * 60;

    // Pre-ferment lead time (poolish ~12h, biga ~16h)
    if (preset.prefermentEnabled) {
      const prefermentHours = prefermentType === 'biga' ? 16 : 12;
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

    // Cold proof: replace room-temp proof with longer fridge hold
    const cpHours = parseFloat(coldProofHours);
    const cpValid = coldProofEnabled && !isNaN(cpHours) && cpHours > 0;
    if (cpValid) {
      totalMinutes -= fermentHours * PROOF_FRACTION * 60;
      totalMinutes += cpHours * 60;
    }
    const totalHours = totalMinutes / 60;

    const readyDate = new Date();
    readyDate.setHours(h, m, 0, 0);
    if (readyDate <= new Date()) readyDate.setDate(readyDate.getDate() + 1);
    const startDate = new Date(readyDate.getTime() - totalMinutes * 60000);

    const breakdownParts: string[] = [];
    // Pre-ferment first in the breakdown
    if (preset.prefermentEnabled) {
      const prefH = prefermentType === 'biga' ? 16 : 12;
      breakdownParts.push(`pre-ferment ~${prefH}h`);
    }
    breakdownParts.push(`bulk ferment ~${fermentHours.toFixed(1)}h`);
    if (preset.selectedPreset) {
      const { process, bake } = preset.selectedPreset;
      if (process.autolyseMinutes > 0) breakdownParts.push(`autolyse ${process.autolyseMinutes}min`);
      const foldTime = process.folds * process.foldIntervalMinutes;
      if (foldTime > 0) breakdownParts.push(`folds ${foldTime}min`);
      if (process.benchRestMinutes > 0) breakdownParts.push(`bench rest ${process.benchRestMinutes}min`);
      breakdownParts.push(cpValid
        ? `cold proof ~${cpHours}h in fridge`
        : `proof ~${(fermentHours * PROOF_FRACTION).toFixed(1)}h`);
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
  }, [planByReadyEnabled, calc.results, readyByHour, readyByMinute, preset.selectedPreset, coldProofEnabled, coldProofHours]);

  // ═══════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════
  const inputPanels = React.useMemo(() => (
    <>
      {/* Daily Recommendation */}
      {recommendation && (
        <View style={[recStyles.card, { backgroundColor: colors.tipBg, borderColor: colors.border }]}>
          <View style={recStyles.row}>
            <Text style={recStyles.icon}>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={[recStyles.title, { color: colors.muted }]}>Today's suggestion</Text>
              <Text style={[recStyles.body, { color: colors.espresso }]}>
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
                hitSlop={{ top: 8, bottom: 8 }}
                accessibilityRole="button"
              >
                <Text style={[recStyles.applyBtn, { color: colors.terracotta }]}>Use this preset →</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={dismissRec}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Dismiss recommendation"
              accessibilityRole="button"
            >
              <Text style={[recStyles.dismiss, { color: colors.muted }]}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Recipe Type */}
      <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[sectionTitleStyle, { color: colors.muted }]}>RECIPE TYPE</Text>
        <RecipeTypePicker
          selected={preset.breadType}
          onSelect={(p) => preset.handlePresetSelect(
            p, inputs.mixRows, inputs.setMixRows,
            inputs.hydration, inputs.starterWeight, inputs.saltPct, preset.oilPct,
            inputs.setHydration, inputs.setStarterWeight, inputs.setSaltPct,
          )}
        />
        {preset.selectedPreset && (
          <Text style={[styles.cardHint, { color: colors.muted }]}>{preset.selectedPreset.emoji} {preset.selectedPreset.description}</Text>
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
        <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[sectionTitleStyle, { color: colors.muted }]}>PRE-FERMENT</Text>
          <Text style={[styles.cardHint, { color: colors.muted }]}>
            Pre-ferment flour is subtracted from the bowl flour. Its water is accounted for in total hydration.
          </Text>
          <View style={prefStyles.row}>
            <Text style={[prefStyles.label, { color: colors.espresso }]}>Flour in pre-ferment</Text>
            <View style={{ flex: 1 }}>
              <TextInput
                style={[prefStyles.input, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
                value={preset.prefermentFlourPct}
                onChangeText={preset.setPrefermentFlourPct}
                keyboardType="decimal-pad"
                placeholderTextColor={colors.muted}
              />
            </View>
            <Text style={[prefStyles.unit, { color: colors.muted }]}>% of total flour</Text>
          </View>
          <Text style={[styles.cardHint, { color: colors.muted }]}>
            Poolish: 100% hydration · Mix equal weights flour and water{'\n'}
            Pre-ferment ripeness: look for a domed surface that just begins to sink in the centre.
          </Text>
          <TouchableOpacity
            style={prefStyles.removeBtn}
            onPress={() => preset.setPrefermentEnabled(false)}
            activeOpacity={0.6}
            hitSlop={{ top: 8, bottom: 8 }}
            accessibilityLabel="Remove pre-ferment"
            accessibilityRole="button"
          >
            <Text style={[prefStyles.removeBtnText, { color: colors.terracotta }]}>Remove Pre-ferment</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Ready-By Planner */}
      {!planByReadyEnabled ? (
        <TouchableOpacity
          style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setPlanByReadyEnabled(true)}
          activeOpacity={0.7}
          accessibilityLabel="Plan by ready time. Tell us when you want your bread ready."
          accessibilityRole="button"
        >
          <View style={readyStyles.promptRow}>
            <Text style={readyStyles.promptIcon}>🕐</Text>
            <View style={{ flex: 1 }}>
              <Text style={[readyStyles.promptTitle, { color: colors.espresso }]}>Plan by ready time</Text>
              <Text style={[readyStyles.promptHint, { color: colors.muted }]}>Tell us when you want your bread ready — we'll tell you when to start</Text>
            </View>
            <Text style={[readyStyles.promptChevron, { color: colors.muted }]}>›</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={readyStyles.headerRow}>
            <Text style={[sectionTitleStyle, { color: colors.muted }]}>🕐  READY-BY PLANNER</Text>
            <TouchableOpacity
              onPress={() => setPlanByReadyEnabled(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Remove ready-by planner"
              accessibilityRole="button"
            >
              <Text style={[readyStyles.removeText, { color: colors.terracotta }]}>Remove</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.cardHint, { color: colors.muted }]}>Set the time you want your bread to come out of the oven.</Text>
          <View style={readyStyles.timeRow}>
            <Text style={[readyStyles.timeLabel, { color: colors.espresso }]}>Ready by</Text>
            <View style={readyStyles.timeInputGroup}>
              <TextInput
                style={[readyStyles.timeInput, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
                value={readyByHour}
                onChangeText={(t) => {
                  const n = parseInt(t, 10);
                  if (t === '' || (!isNaN(n) && n >= 0 && n <= 23)) setReadyByHour(t);
                }}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="HH"
                placeholderTextColor={colors.lightText}
              />
              <Text style={[readyStyles.timeColon, { color: colors.espresso }]}>:</Text>
              <TextInput
                style={[readyStyles.timeInput, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
                value={readyByMinute}
                onChangeText={(t) => {
                  const n = parseInt(t, 10);
                  if (t === '' || (!isNaN(n) && n >= 0 && n <= 59)) setReadyByMinute(t);
                }}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="MM"
                placeholderTextColor={colors.lightText}
              />
            </View>
          </View>
        </View>
      )}

      {/* Cold Proof (collapsible) */}
      {!coldProofEnabled ? (
        <TouchableOpacity
          style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setColdProofEnabled(true)}
          activeOpacity={0.7}
          accessibilityLabel="Cold proof. Add a fridge proofing phase."
          accessibilityRole="button"
        >
          <View style={readyStyles.promptRow}>
            <Text style={readyStyles.promptIcon}>❄️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[readyStyles.promptTitle, { color: colors.espresso }]}>Cold proof / retard</Text>
              <Text style={[readyStyles.promptHint, { color: colors.muted }]}>
                Proof in the fridge overnight for deeper flavour and tangier crumb
              </Text>
            </View>
            <Text style={[readyStyles.promptChevron, { color: colors.muted }]}>›</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={readyStyles.headerRow}>
            <Text style={[sectionTitleStyle, { color: colors.muted }]}>❄️  COLD PROOF</Text>
            <TouchableOpacity
              onPress={() => setColdProofEnabled(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Remove cold proof"
              accessibilityRole="button"
            >
              <Text style={[readyStyles.removeText, { color: colors.terracotta }]}>Remove</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.cardHint, { color: colors.muted }]}>
            After bulk fermentation, shape and place in the fridge. Cold temperatures favour acetic acid production for a tangier crumb.
          </Text>
          <View style={coldStyles.row}>
            <Text style={[coldStyles.label, { color: colors.espresso }]}>Duration</Text>
            <TextInput
              style={[coldStyles.input, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
              value={coldProofHours}
              onChangeText={setColdProofHours}
              keyboardType="decimal-pad"
              placeholder="12"
              placeholderTextColor={colors.lightText}
            />
            <Text style={[coldStyles.unit, { color: colors.muted }]}>hours</Text>
          </View>
          <View style={coldStyles.row}>
            <Text style={[coldStyles.label, { color: colors.espresso }]}>Fridge temp</Text>
            <TextInput
              style={[coldStyles.input, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
              value={coldProofTemp}
              onChangeText={setColdProofTemp}
              keyboardType="decimal-pad"
              placeholder="4"
              placeholderTextColor={colors.lightText}
            />
            <Text style={[coldStyles.unit, { color: colors.muted }]}>°C</Text>
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
      <TouchableOpacity style={[styles.calcBtn, { backgroundColor: colors.terracotta }]} onPress={doCalculate} disabled={calc.calculating} activeOpacity={0.8}>
        {calc.calculating ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={[styles.calcBtnText, { color: colors.white }]}>Calculate</Text>
        )}
      </TouchableOpacity>
    </>
  ), [
    recommendation, dismissRec,
    preset.breadType, preset.selectedPreset, preset.oilPct, preset.showOil,
    preset.prefermentEnabled, preset.prefermentFlourPct, preset.handlePresetSelect,
    preset.setPrefermentEnabled, preset.setPrefermentFlourPct,
    inputs.mixRows, inputs.totalFlourWeight, inputs.hydration, inputs.starterWeight,
    inputs.saltPct, inputs.handleAddFlour, inputs.handleRemoveFlour,
    inputs.handleUpdateFlour, inputs.handleUpdateFlourGrams,
    inputs.setHydration, inputs.setStarterWeight, inputs.setSaltPct,
    inputs.ambientTemp, inputs.flourTemp, inputs.waterTemp, inputs.starterTemp,
    inputs.locationData, inputs.setAmbientTemp, inputs.setFlourTemp,
    inputs.setWaterTemp, inputs.setStarterTemp,
    starter.starterFlourLabel, starter.feedFlourGrams, starter.feedWaterGrams,
    starter.feedLogging, starter.expanded, starter.lastFed, starter.hoursSince,
    starter.recentFeedings, starter.status, starter.setStarterFlourLabel,
    starter.setFeedFlourGrams, starter.setFeedWaterGrams, starter.setExpanded,
    starter.handleFeedNow, starter.handleFridgeIn, starter.handleFridgeOut,
    starter.refresh,
    planByReadyEnabled, readyByHour, readyByMinute,
    coldProofEnabled, coldProofHours, coldProofTemp,
    doCalculate, calc.calculating,
    colors,
  ]);

  const resultsPanel = React.useMemo(() => calc.results && (
    <>
      {inputsDirty && (
        <TouchableOpacity
          style={[bannerStyles.banner, { backgroundColor: colors.warningBg, borderColor: colors.hot }]}
          onPress={doCalculate}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Text style={[bannerStyles.bannerText, { color: colors.espresso }]}>
            ⚠️  Inputs changed since you calculated — tap to recalculate
          </Text>
        </TouchableOpacity>
      )}
      <ResultsSection
        results={calc.results}
        blend={inputs.blend}
        totalFlourWeight={inputs.totalFlourWeight}
        starterFlourLabel={starter.starterFlourLabel}
        preferredType={prefermentType}
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
    </>
  ), [
    calc.results, inputs.blend, inputs.totalFlourWeight, starter.starterFlourLabel,
    preset.selectedPreset,
    inputs.flourTemp, inputs.ambientTemp, inputs.waterTemp, inputs.starterTemp,
    actions.saving, handleSave, handleShare, readyByResult,
    inputsDirty, doCalculate, colors,
  ]);

  // ═══════════════════════════════════════════════════════════════════════
  //  LAYOUT
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={[layoutStyles.container, { backgroundColor: colors.cream }]} edges={['top']}>
      {isDesktop && (
        <>
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
            <Text style={[layoutStyles.header, { color: colors.espresso }]}>🥖  Just Dough It</Text>
          </TouchableOpacity>
          <Text style={[layoutStyles.tagline, { color: colors.muted }]}>
            Perfect bread, less guesswork
          </Text>
        </>
      )}

      {isDesktop && (
        <LocationBar
          summary={displaySummary}
          loading={inputs.locLoading}
          error={inputs.locError}
          onRefresh={inputs.onRefreshLocation}
          showFallbackWarning={!inputs.locLoading && !inputs.locationData}
          onTapFallback={() => router.push('/settings')}
          onPostcodeSubmit={inputs.onPostcodeSubmit}
        />
      )}

      <KeyboardScreen>
        <View style={isDesktop ? desktopStyles.twoCol : layoutStyles.mobileCol}>
          <ScrollView
            ref={calc.scrollRef}
            style={isDesktop ? desktopStyles.leftCol : layoutStyles.scroll}
            contentContainerStyle={isDesktop ? desktopStyles.leftContent : layoutStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {!isDesktop && (
              <>
                <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
                  <Text style={[layoutStyles.header, { color: colors.espresso }]}>🥖  Just Dough It</Text>
                </TouchableOpacity>
                <Text style={[layoutStyles.tagline, { color: colors.muted }]}>
                  Perfect bread, less guesswork
                </Text>
              </>
            )}

            {!isDesktop && (
              <LocationBar
                summary={displaySummary}
                loading={inputs.locLoading}
                error={inputs.locError}
                onRefresh={inputs.onRefreshLocation}
                showFallbackWarning={!inputs.locLoading && !inputs.locationData}
                onTapFallback={() => router.push('/settings')}
                onPostcodeSubmit={inputs.onPostcodeSubmit}
              />
            )}

            {inputPanels}

            {!isDesktop && resultsPanel}

            {!isDesktop && <View style={layoutStyles.bottomPad} />}
          </ScrollView>

          {isDesktop && (
            <ScrollView
              ref={calc.rightScrollRef}
              style={desktopStyles.rightCol}
              contentContainerStyle={desktopStyles.rightContent}
              showsVerticalScrollIndicator={false}
            >
              {resultsPanel}
            </ScrollView>
          )}
        </View>
      </KeyboardScreen>
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
  header: { fontSize: FontSize.xl, fontWeight: '800', textAlign: 'center', marginBottom: Spacing.xs, marginTop: Spacing.md },
  tagline: { fontSize: FontSize.sm, textAlign: 'center', marginBottom: Spacing.md, paddingHorizontal: Spacing.lg, lineHeight: 20 },
  bottomPad: { height: 40 },
});

const styles = StyleSheet.create({
  cardHint: { fontSize: FontSize.xs, marginBottom: Spacing.sm, lineHeight: 16 },
  calcBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 4, alignItems: 'center', marginBottom: Spacing.lg,
  },
  calcBtnText: { fontSize: FontSize.lg, fontWeight: '700' },
});

const prefStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, gap: Spacing.sm },
  label: { fontSize: FontSize.sm },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
    fontSize: FontSize.sm, textAlign: 'right', minWidth: 60,
  },
  unit: { fontSize: FontSize.xs },
  removeBtn: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, marginTop: Spacing.xs },
  removeBtnText: { fontSize: FontSize.xs, fontWeight: '600' },
});

const recStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  icon: { fontSize: 20, marginTop: 1 },
  title: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  body: { fontSize: FontSize.sm, lineHeight: 19 },
  presetName: { fontWeight: '700' },
  applyBtn: { fontSize: FontSize.xs, fontWeight: '700', marginTop: Spacing.sm },
  dismiss: { fontSize: FontSize.lg, fontWeight: '300', paddingLeft: Spacing.sm },
});

const readyStyles = StyleSheet.create({
  promptRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  promptIcon: { fontSize: 22 },
  promptTitle: { fontSize: FontSize.sm, fontWeight: '600' },
  promptHint: { fontSize: FontSize.xs, marginTop: 2 },
  promptChevron: { fontSize: FontSize.xl, fontWeight: '300' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  removeText: { fontSize: FontSize.xs, fontWeight: '600' },
  timeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  timeLabel: { width: 90, fontSize: FontSize.sm },
  timeInputGroup: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeInput: {
    width: 52, minHeight: 44, borderWidth: 1,
    borderRadius: BorderRadius.sm, textAlign: 'center', fontSize: FontSize.lg, fontWeight: '700',
  },
  timeColon: { fontSize: FontSize.xl, fontWeight: '700' },
});

const coldStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, gap: Spacing.sm },
  label: { fontSize: FontSize.sm, width: 90 },
  input: {
    width: 60, minHeight: 44, borderWidth: 1,
    borderRadius: BorderRadius.sm, textAlign: 'center', fontSize: FontSize.sm, fontWeight: '600',
  },
  unit: { fontSize: FontSize.xs },
});

const bannerStyles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    marginBottom: Spacing.md,
  },
  bannerText: { fontSize: FontSize.sm, fontWeight: '600', lineHeight: 19 },
});

const desktopStyles = StyleSheet.create({
  twoCol: { flex: 1, flexDirection: 'row', gap: Spacing.lg, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  leftCol: { flex: 1, maxWidth: 420 },
  leftContent: { paddingBottom: 40 },
  rightCol: { flex: 1.3 },
  rightContent: { paddingBottom: 40 },
});
