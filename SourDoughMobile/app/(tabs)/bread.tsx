import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyle, sectionTitleStyle } from '../../src/theme';
import { summaryWithHardnessOverride } from '../../src/lib/location';
import { resolveHardness } from '@sourdough/calc/lib/hardnessUtils';
import { earliestChoice, planBread, type BreadForm } from '@sourdough/calc/lib/breadPlan';
import { formatTemp, formatWeight } from '@sourdough/calc/lib/unitConversion';
import { isValidDecimalInput } from '@sourdough/calc/lib/inputValidation';
import { findFlour } from '@sourdough/calc/lib/flourSearch';
import { lazyBakeSummary, LAZY_DEFAULTS, STARTER_FEED_GRAMS, type LazyVessel } from '@sourdough/calc/lib/lazyMethod';
import { FRIDGE_HOURS, LAZY_STARTER_TEMP_C, type ProofMode } from '@sourdough/calc/lib/lazyPlan';
import { clockTime } from '@sourdough/calc/lib/starterFormat';
import { computeVitalityFactor } from '@sourdough/calc/lib/calculations';
import { isoWithOffset } from '../../src/lib/assist';
import { getRecipe } from '../../src/store/recipeStore';
import type { CalculationResults } from '@sourdough/calc/models/types';

import { LocationBar } from '../../src/components/LocationBar';
import { FlourMix } from '../../src/components/FlourMix';
import { TempRow } from '../../src/components/TempRow';
import { Seo } from '../../src/components/Seo';
import { Icon } from '../../src/components/Icon';
import { AskCard } from '../../src/components/AskCard';
import { StarterChoiceCard, type StarterMode } from '../../src/components/StarterChoiceCard';
import { ReadyByCard, type PlanMode } from '../../src/components/ReadyByCard';

import { useCalculatorInputs } from '../../src/hooks/useCalculatorInputs';
import { useRecipeActions } from '../../src/hooks/useRecipeActions';
import { useStarterStatus } from '../../src/hooks/useStarterStatus';

/** When the dough was mixed — persisted so the clock survives closing the app. */
const MIXED_AT_KEY = 'sourdough_lazy_mixed_at';

const VESSELS: { key: LazyVessel; title: string; hint: string }[] = [
  { key: 'cocotte', title: 'Cocotte', hint: 'Lidded pot' },
  { key: 'tin', title: 'Loaf tin', hint: 'No shaping skill' },
];

function PercentField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.pctBox, { borderColor: colors.border, backgroundColor: colors.white }]}>
      <TextInput
        value={value}
        onChangeText={(t) => { if (isValidDecimalInput(t)) onChange(t); }}
        keyboardType="decimal-pad"
        selectTextOnFocus
        accessibilityLabel={`${label}, percent`}
        style={[styles.pctInput, { color: colors.espresso }]}
      />
      <Text style={[styles.pctUnit, { color: colors.muted }]}>%</Text>
    </View>
  );
}

export default function BreadScreen() {
  const { colors, unitSystem } = useAppTheme();
  const { editRecipeId } = useLocalSearchParams<{ editRecipeId?: string }>();
  const router = useRouter();
  const inputs = useCalculatorInputs();
  const actions = useRecipeActions();

  const [waterPct, setWaterPctState] = useState(String(LAZY_DEFAULTS.waterPct));
  const [starterPct, setStarterPctState] = useState(String(LAZY_DEFAULTS.starterPct));
  const [vessel, setVessel] = useState<LazyVessel>('cocotte');
  const [mixedAt, setMixedAt] = useState<Date | null>(null);
  // Water temperature typed by the baker (°C). Session-only: tap water changes with the season,
  // so a remembered value would go stale. Null means use the tap temperature, else room temperature.
  const [waterOverride, setWaterOverride] = useState<string | null>(null);
  const pctTouchedRef = useRef(false);
  const setWaterPct = useCallback((v: string) => { pctTouchedRef.current = true; setWaterPctState(v); }, []);
  const setStarterPct = useCallback((v: string) => { pctTouchedRef.current = true; setStarterPctState(v); }, []);

  // Settings store default water in grams for the default flour weight;
  // the formula speaks in baker's percentages.
  useEffect(() => {
    if (pctTouchedRef.current || editRecipeId) return;
    const { defaultWaterGrams, defaultFlourWeight } = inputs.settings;
    if (defaultFlourWeight > 0) {
      setWaterPctState(String(Math.round((defaultWaterGrams / defaultFlourWeight) * 100)));
    }
  }, [inputs.settings, editRecipeId]);

  // Restore the mix clock.
  useEffect(() => {
    AsyncStorage.getItem(MIXED_AT_KEY)
      .then((iso) => {
        const d = iso ? new Date(iso) : null;
        if (d && !isNaN(d.getTime())) setMixedAt(d);
      })
      .catch(() => {});
  }, []);

  const startClock = useCallback(() => {
    const now = new Date();
    setMixedAt(now);
    AsyncStorage.setItem(MIXED_AT_KEY, now.toISOString()).catch(() => {});
  }, []);

  const resetClock = useCallback(() => {
    setMixedAt(null);
    AsyncStorage.removeItem(MIXED_AT_KEY).catch(() => {});
  }, []);

  // Edit from History: load the saved loaf back into the formula.
  useEffect(() => {
    if (!editRecipeId) return;
    getRecipe(editRecipeId).then((recipe) => {
      if (!recipe) return;
      const ri = recipe.inputs;
      const water = ri.addedWaterGrams ?? (ri.hydration / 100) * ri.flourWeight;
      const saved = ri.flourBlend?.length ? ri.flourBlend : [{ label: ri.flourType, percentage: 100 }];
      inputs.setMixRows(() => saved.slice(0, 3).map((b, i) => ({
        key: `flour_edit_${i}`,
        flour: findFlour(b.label),
        grams: String(Math.round((ri.flourWeight * b.percentage) / 100)),
      })));
      if (ri.flourWeight > 0) {
        pctTouchedRef.current = true;
        setWaterPctState(String(Math.round((water / ri.flourWeight) * 100)));
        setStarterPctState(String(Math.round((ri.starterWeight / ri.flourWeight) * 100)));
      }
      setWaterOverride(Number.isFinite(ri.waterTemp) ? String(ri.waterTemp) : null);
      inputs.setStarterHydrationStr(String(ri.starterHydration));
      inputs.setSaltPct(String(ri.saltPct));
      inputs.setAmbientTemp(String(ri.ambientTemp));
    });
    // inputs setters are stable; re-run only when a different loaf is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRecipeId]);

  // ── The formula → weights, the rise, the steps and their clock times ──────
  // All of it is one pure function in @sourdough/calc, shared with the web apps
  // (the same rules run in both). Live; nothing to recalculate.
  //
  // The Room temp field drives the estimate and the flour follows it. The water is at the
  // location's tap temperature when we have one, otherwise at room temperature. No weather
  // forecast is used, so the field, the assistant's tools and this number all agree.
  const roomTempC = parseFloat(inputs.ambientTemp);
  const tapTempC = inputs.locationData?.waterTemp ?? null;
  const overrideC = waterOverride !== null ? parseFloat(waterOverride) : NaN;
  const waterIsAuto = !Number.isFinite(overrideC);

  // The starter's state, from the feeding log. With no usable log it is a
  // fridge-cold starter at full strength, as before.
  const starter = useStarterStatus(roomTempC);
  const [starterMode, setStarterMode] = useState<StarterMode>('fridge');
  // Once the person chooses, a recent feeding no longer switches the path for them.
  const [modeChosen, setModeChosen] = useState(false);
  const [feedRatio, setFeedRatio] = useState(1);
  const chooseMode = useCallback((m: StarterMode) => { setModeChosen(true); setStarterMode(m); }, []);

  const nowDate = useMemo(() => new Date(starter.now), [starter.now]);
  const [planMode, setPlanMode] = useState<PlanMode>('now');
  const [readyDay, setReadyDay] = useState(1);
  const [readyTime, setReadyTime] = useState('09:00');
  const [proofMode, setProofMode] = useState<ProofMode>('counter');
  const [fridgeHoursStr, setFridgeHoursStr] = useState(String(FRIDGE_HOURS.default));

  const form = useMemo<BreadForm>(() => ({
    flours: inputs.mixRows.map((r) => ({ key: r.key, label: r.flour.label, grams: r.grams })),
    waterPct,
    starterPct,
    saltPct: inputs.saltPct,
    starterHydration: inputs.starterHydrationStr,
    waterTempOverride: waterOverride ?? '',
    vessel,
    starterMode,
    modeChosen,
    feedRatio,
    planMode,
    readyDay,
    readyTime,
    proofMode,
    fridgeHours: fridgeHoursStr,
  }), [
    inputs.mixRows, waterPct, starterPct, inputs.saltPct, inputs.starterHydrationStr, waterOverride, vessel,
    starterMode, modeChosen, feedRatio, planMode, readyDay, readyTime, proofMode, fridgeHoursStr,
  ]);
  const plan = useMemo(() => planBread(form, {
    now: nowDate,
    roomTempC,
    hardness: resolveHardness(inputs.settings.waterHardnessOverride || 0, inputs.locationData?.hardness),
    tapTempC,
    unitSystem,
    starter,
    mixedAt,
  }), [form, nowDate, roomTempC, inputs.settings.waterHardnessOverride, inputs.locationData, tapTempC, unitSystem, starter, mixedAt]);

  const {
    flourRows, flourGrams, waterGrams, starterGrams, blend, waterTempC, fed,
    loafFeeding, loafPeak, fridgeCase, fedCase, feedAmounts, timeToPeak, peakWindow,
    steps, schedule, ovenOn, stepWhen, checkAt,
  } = plan;
  const flourRow = flourRows[0];
  const estimate = plan.chosen?.estimate ?? null;
  const starterTempC = plan.chosen?.starterTempC ?? LAZY_STARTER_TEMP_C;
  const starterHoursSinceFed = plan.chosen?.starterHoursSinceFed;
  const results: CalculationResults | null = estimate?.results ?? null;
  const bulkHours = estimate?.bulkHours ?? null;

  const feedNow = useCallback(async () => {
    const shares = starter.flourBlend ?? [{ label: 'Generic: Bread Flour', share: 100 }];
    await starter.feed({
      flours: shares.map((s) => ({ label: s.label, grams: String(Math.round((feedAmounts.flourGrams * s.share) / 100)) })),
      waterGrams: String(feedAmounts.waterGrams),
      keptGrams: String(feedAmounts.keptGrams),
    });
  }, [starter, feedAmounts]);

  /** The lazy loop: after mixing, feed what is left in the jar and put it back in the fridge. */
  const jarLogged = !!starter.feeding?.fridgeAt && Date.now() - new Date(starter.feeding.timestamp).getTime() < 12 * 3_600_000;
  const logJarAway = useCallback(async () => {
    const shares = starter.flourBlend ?? [{ label: 'Generic: Bread Flour', share: 100 }];
    await starter.feed({
      flours: shares.map((s) => ({ label: s.label, grams: String(Math.round((STARTER_FEED_GRAMS * s.share) / 100)) })),
      waterGrams: String(STARTER_FEED_GRAMS),
      keptGrams: '',
      intoFridge: true,
    });
  }, [starter]);

  /** Fill in the earliest time that works. */
  const useEarliest = useCallback(() => {
    if (!schedule?.earliest) return;
    const pick = earliestChoice(schedule.earliest, nowDate);
    setReadyDay(pick.day);
    setReadyTime(pick.time);
  }, [schedule, nowDate]);

  const weightDecimals = unitSystem === 'imperial' ? 1 : 0;
  const w = (g: number | undefined) => (g != null && Number.isFinite(g) ? formatWeight(g, unitSystem, weightDecimals) : '—');
  const ing = results?.ingredients;
  const doughWeight = estimate?.doughGrams;

  // ── Save / share ──────────────────────────────────────────────────────
  const recipeParams = useCallback(() => ({
    blend,
    totalFlourWeight: flourGrams,
    waterGrams: String(Math.round(waterGrams)),
    starterWeight: String(Math.round(starterGrams)),
    saltPct: inputs.saltPct,
    starterHydrationStr: inputs.starterHydrationStr,
    oilPct: '0',
    ambientTemp: inputs.ambientTemp,
    waterTemp: String(waterTempC),
    prefermentEnabled: false,
    prefermentFlourPct: '0',
    locationSummary: inputs.locationData?.summary ?? 'Unknown location',
    coldProofEnabled: false,
    coldProofHours: '0',
  }), [blend, flourGrams, waterGrams, starterGrams, inputs.saltPct, inputs.starterHydrationStr, inputs.ambientTemp, waterTempC, inputs.locationData]);

  const handleSave = useCallback(() => {
    if (!results || !flourRow) return;
    actions.handleSave({
      ...recipeParams(),
      flourTemp: inputs.ambientTemp,
      starterTemp: String(starterTempC),
      starterFlourLabel: flourRow.flour.label,
      breadType: 'custom',
      results,
      coldProofTemp: '4',
      editId: editRecipeId,
    }).then((ok) => {
      // Leave edit mode so a second Save creates a new loaf.
      if (ok && editRecipeId) router.setParams({ editRecipeId: undefined });
    });
  }, [results, flourRow, actions, recipeParams, inputs.ambientTemp, editRecipeId, router]);

  const handleShare = useCallback(() => {
    if (!results) return;
    actions.handleShare({ ...recipeParams(), results, bakeInfo: lazyBakeSummary(vessel, unitSystem), unitSystem });
  }, [results, actions, recipeParams, vessel, unitSystem]);

  const displaySummary = inputs.locationData
    ? summaryWithHardnessOverride(inputs.locationData, inputs.settings.waterHardnessOverride, unitSystem)
    : null;

  // ═══════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════
  const formulaRows: { label: string; value: string; onChange: (v: string) => void; grams: number | undefined }[] = [
    { label: 'Water', value: waterPct, onChange: setWaterPct, grams: ing?.addedWater },
    { label: 'Starter', value: starterPct, onChange: setStarterPct, grams: ing?.starterTotal },
    { label: 'Salt', value: inputs.saltPct, onChange: inputs.setSaltPct, grams: ing?.salt },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]} edges={['top']}>
      <Seo
        title="Lazy Sourdough — Just Dough It"
        description="A one-bowl sourdough formula with no autolyse, no kneading and no folding schedule, plus a temperature-aware estimate for when to check the rise. Free, private, open source."
        path="/bread"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7} accessibilityRole="link" accessibilityLabel="Just Dough It home">
            <Text style={[styles.brand, { color: colors.terracotta }]}>JUST DOUGH IT  /  BREAD</Text>
          </TouchableOpacity>
          <Text style={[styles.heading, { color: colors.espresso }]} accessibilityRole="header">Lazy sourdough.</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            One bowl. No autolyse, no kneading, no folding schedule. Weigh, stir, wait, bake.
          </Text>
        </View>

        <LocationBar
          summary={displaySummary}
          loading={inputs.locLoading}
          error={inputs.locError}
          onRefresh={inputs.onRefreshLocation}
          showFallbackWarning={!inputs.locLoading && !inputs.locationData}
          onTapFallback={() => router.push('/settings')}
          onPostcodeSubmit={inputs.onPostcodeSubmit}
        />

        {/* ── The formula ── */}
        <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[sectionTitleStyle, { color: colors.muted }]}>THE FORMULA</Text>
          <FlourMix
            rows={inputs.mixRows}
            onAdd={inputs.handleAddFlour}
            onRemove={inputs.handleRemoveFlour}
            onUpdateFlour={inputs.handleUpdateFlour}
            onUpdateGrams={inputs.handleUpdateFlourGrams}
          />
          <Text style={[styles.hint, { color: colors.muted }]}>
            Change the weights to scale the loaf. Up to three flours; percentages below are of the total.
          </Text>

          <View style={[styles.tableHead, { borderBottomColor: colors.border }]}>
            <Text style={[styles.th, styles.colName, { color: colors.muted }]}>Ingredient</Text>
            <Text style={[styles.th, styles.colPct, { color: colors.muted }]}>Baker's %</Text>
            <Text style={[styles.th, styles.colWeigh, { color: colors.muted }]}>Weigh</Text>
          </View>
          {formulaRows.map((row) => (
            <View key={row.label} style={styles.tableRow}>
              <Text style={[styles.colName, styles.rowLabel, { color: colors.espresso }]}>{row.label}</Text>
              <View style={styles.colPct}>
                <PercentField label={row.label} value={row.value} onChange={row.onChange} />
              </View>
              <Text style={[styles.colWeigh, styles.weigh, { color: colors.espresso }]}>{w(row.grams)}</Text>
            </View>
          ))}
          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.muted }]}>Dough weight</Text>
            <Text style={[styles.totalValue, { color: colors.espresso }]}>{w(doughWeight)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.colName, styles.rowLabel, { color: colors.espresso }]}>Starter hydration</Text>
            <View style={styles.colPct}>
              <PercentField label="Starter hydration" value={inputs.starterHydrationStr} onChange={inputs.setStarterHydrationStr} />
            </View>
            <View style={styles.colWeigh} />
          </View>
          <Text style={[styles.hint, { color: colors.muted }]}>
            Water, starter and salt are percentages of the flour weight (salt also counts the starter's flour); hydration is the starter's own water-to-flour ratio. How the starter goes in is chosen below.
            {' '}Water temperature is set in the rise step.
          </Text>
        </View>

        {/* ── The starter ── */}
        <StarterChoiceCard
          mode={plan.mode}
          onMode={chooseMode}
          ratio={feedRatio}
          onRatio={setFeedRatio}
          status={starter.status}
          riseHours={{ fridge: fridgeCase?.estimate?.bulkHours ?? null, fed: fedCase?.estimate?.bulkHours ?? null }}
          activityPct={starterHoursSinceFed !== undefined ? Math.round(computeVitalityFactor(starterHoursSinceFed) * 100) : 100}
          starterTempText={Number.isFinite(starterTempC) ? formatTemp(starterTempC, unitSystem, 0) + (fed ? ', room temperature' : starterTempC <= LAZY_STARTER_TEMP_C ? ', from the fridge' : '') : '—'}
          timeToPeakHours={timeToPeak}
          peakWindowHours={peakWindow}
          feedText={`Keep ${w(feedAmounts.keptGrams)} of starter, add ${w(feedAmounts.flourGrams)} of flour and ${w(feedAmounts.waterGrams)} of water (${w(feedAmounts.totalGrams)} in all).`}
          peakText={fed && loafPeak
            ? `Fed ${clockTime(new Date(loafFeeding!.timestamp))}. Peaks about ${clockTime(loafPeak.peakAt)}; mix between ${clockTime(loafPeak.window.from)} and ${clockTime(loafPeak.window.to)}.`
            : null}
        />

        {/* ── When ── */}
        <ReadyByCard
          mode={planMode}
          onMode={setPlanMode}
          now={nowDate}
          dayOffset={readyDay}
          onDay={setReadyDay}
          time={readyTime}
          onTime={setReadyTime}
          timeInvalid={!plan.readyTimeValid}
          proofMode={proofMode}
          onProof={setProofMode}
          fridgeHours={fridgeHoursStr}
          onFridgeHours={setFridgeHoursStr}
          plan={schedule?.plan ?? null}
          mixed={!!mixedAt}
          fed={fed}
          ovenOn={ovenOn}
          earliest={schedule?.earliest ?? null}
          tooEarly={schedule?.tooEarly ?? false}
          onUseEarliest={useEarliest}
          note={schedule?.note ?? null}
        />

        {/* ── The method ── */}
        <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[sectionTitleStyle, { color: colors.muted }]}>THE METHOD</Text>
          {steps.map((step, i) => {
            const active = mixedAt ? step.key === 'rise' : step.key === (fed && !loafFeeding ? 'feed' : 'mix');
            return (
              <View key={step.key} style={styles.step}>
                <View style={[styles.stepNum, { backgroundColor: active ? colors.terracotta : colors.badgeBg }]}>
                  <Text style={[styles.stepNumText, { color: active ? colors.white : colors.terracotta }]}>{i + 1}</Text>
                </View>
                <View style={styles.stepBody}>
                  <View style={styles.stepTitleRow}>
                    <Text style={[styles.stepTitle, { color: colors.espresso }]}>{step.title}</Text>
                    <Text style={[styles.stepDuration, { color: colors.muted }]}>{step.duration}</Text>
                  </View>
                  {stepWhen[step.key] && (
                    <Text style={[styles.stepWhen, { color: colors.terracotta }]}>{stepWhen[step.key]}</Text>
                  )}

                  {step.key === 'rise' && (
                    <>
                      <TempRow label="Room temp" value={inputs.ambientTemp} onChangeText={inputs.setAmbientTemp} isAuto={!!inputs.locationData} />
                      <TempRow
                        label="Water temp"
                        value={String(Math.round(waterTempC * 10) / 10)}
                        onChangeText={(v) => setWaterOverride(Number.isFinite(parseFloat(v)) ? v : null)}
                        isAuto={waterIsAuto && tapTempC != null}
                      />
                      {waterIsAuto && tapTempC == null && (
                        <Text style={[styles.hint, { color: colors.muted }]}>
                          No tap temperature for your location, so the water is assumed to be at room temperature. Type one to override.
                        </Text>
                      )}
                      {!waterIsAuto && (
                        <TouchableOpacity onPress={() => setWaterOverride(null)} accessibilityRole="button" style={styles.textBtn}>
                          <Text style={[styles.textBtnLabel, { color: colors.terracotta }]}>
                            {tapTempC != null ? 'Use tap temperature' : 'Use room temperature'}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {checkAt && (
                        <View style={[styles.clock, { backgroundColor: colors.successBg, borderColor: colors.border }]}>
                          <Text style={[styles.clockLabel, { color: colors.olive }]}>START CHECKING AT</Text>
                          <Text style={[styles.clockTime, { color: colors.espresso }]}>
                            {checkAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </Text>
                          <Text style={[styles.clockDate, { color: colors.espresso }]}>
                            {checkAt.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                            {' · mixed at '}
                            {mixedAt!.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </Text>
                          <TouchableOpacity onPress={resetClock} accessibilityRole="button" style={styles.textBtn}>
                            <Text style={[styles.textBtnLabel, { color: colors.terracotta }]}>Reset the clock</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}

                  {step.key === 'shape' && (
                    <View style={styles.vesselRow} accessibilityRole="radiogroup" accessibilityLabel="Baking vessel">
                      {VESSELS.map((v) => {
                        const selected = vessel === v.key;
                        return (
                          <TouchableOpacity
                            key={v.key}
                            onPress={() => setVessel(v.key)}
                            accessibilityRole="radio"
                            accessibilityState={{ selected }}
                            style={[styles.vessel, {
                              borderColor: selected ? colors.terracotta : colors.border,
                              borderWidth: selected ? 2 : 1,
                              backgroundColor: selected ? colors.tipBg : colors.white,
                            }]}
                          >
                            <Text style={[styles.vesselTitle, { color: colors.espresso }]}>{v.title}</Text>
                            <Text style={[styles.vesselHint, { color: colors.muted }]}>{v.hint}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  <Text style={[styles.stepText, { color: colors.espresso }]}>{step.body}</Text>
                  {step.aside && <Text style={[styles.stepAside, { color: colors.muted }]}>{step.aside}</Text>}

                  {step.key === 'feed' && !mixedAt && (
                    loafPeak ? (
                      <View style={[styles.clock, { backgroundColor: colors.successBg, borderColor: colors.border }]}>
                        <Text style={[styles.clockLabel, { color: colors.olive }]}>PEAKS ABOUT</Text>
                        <Text style={[styles.clockTime, { color: colors.espresso }]}>{clockTime(loafPeak.peakAt)}</Text>
                        <Text style={[styles.clockDate, { color: colors.espresso }]}>
                          Mix between {clockTime(loafPeak.window.from)} and {clockTime(loafPeak.window.to)}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={feedNow}
                        accessibilityRole="button"
                        style={[styles.primaryBtn, { backgroundColor: colors.terracotta }]}
                      >
                        <Icon name="flask-outline" size={20} color={colors.white} />
                        <Text style={[styles.primaryBtnText, { color: colors.white }]}>I've fed it</Text>
                      </TouchableOpacity>
                    )
                  )}

                  {step.key === 'mix' && mixedAt && !fed && !jarLogged && (
                    <TouchableOpacity
                      onPress={logJarAway}
                      accessibilityRole="button"
                      style={[styles.outlineBtn, { borderColor: colors.terracotta }]}
                    >
                      <Text style={[styles.outlineBtnText, { color: colors.terracotta }]}>I've fed the jar and put it away</Text>
                    </TouchableOpacity>
                  )}
                  {step.key === 'mix' && mixedAt && fed && loafFeeding && !loafFeeding.fridgeAt && (
                    <TouchableOpacity
                      onPress={() => starter.intoFridge(loafFeeding.id)}
                      accessibilityRole="button"
                      style={[styles.outlineBtn, { borderColor: colors.terracotta }]}
                    >
                      <Text style={[styles.outlineBtnText, { color: colors.terracotta }]}>The jar is back in the fridge</Text>
                    </TouchableOpacity>
                  )}

                  {step.key === 'mix' && !mixedAt && (
                    <TouchableOpacity
                      onPress={startClock}
                      disabled={!results}
                      accessibilityRole="button"
                      style={[styles.primaryBtn, { backgroundColor: colors.terracotta, opacity: results ? 1 : 0.5 }]}
                    >
                      <Icon name="timer-outline" size={20} color={colors.white} />
                      <Text style={[styles.primaryBtnText, { color: colors.white }]}>I've mixed: start the clock</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Ask the baker (hidden unless EXPO_PUBLIC_ASSISTANT_ENABLED=1) ── */}
        {estimate && (
          <AskCard
            context={{
              unitSystem,
              formula: {
                flourGrams,
                waterPct: parseFloat(waterPct),
                starterPct: parseFloat(starterPct),
                saltPct: parseFloat(inputs.saltPct),
                starterHydration: parseFloat(inputs.starterHydrationStr),
              },
              roomTempC,
              waterTempC: Number.isFinite(overrideC) ? overrideC : tapTempC ?? undefined,
              flours: flourRows.map((r) => ({ label: r.flour.label, grams: r.grams })),
              vessel,
              mixedAt: mixedAt ? isoWithOffset(mixedAt) : null,
              bulkHours,
            }}
            onSetRoomTemp={(t) => inputs.setAmbientTemp(String(t))}
            onSetFormula={(f) => {
              if (f.waterPct != null) setWaterPct(String(f.waterPct));
              if (f.starterPct != null) setStarterPct(String(f.starterPct));
              if (f.saltPct != null) inputs.setSaltPct(String(f.saltPct));
            }}
            onSetVessel={setVessel}
            onResetClock={resetClock}
          />
        )}

        {/* ── Save / share ── */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!results || actions.saving}
            accessibilityRole="button"
            style={[styles.actionBtn, { backgroundColor: colors.terracotta, opacity: results ? 1 : 0.5 }]}
          >
            {actions.saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Icon name="content-save-outline" size={20} color={colors.white} />
                <Text style={[styles.actionText, { color: colors.white }]}>{editRecipeId ? 'Update loaf' : 'Save loaf'}</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            disabled={!results}
            accessibilityRole="button"
            style={[styles.actionBtn, styles.actionBtnOutline, { borderColor: colors.terracotta, backgroundColor: colors.card, opacity: results ? 1 : 0.5 }]}
          >
            <Icon name="share-variant-outline" size={20} color={colors.terracotta} />
            <Text style={[styles.actionText, { color: colors.terracotta }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  page: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: 40 },

  header: { marginBottom: Spacing.xl },
  brand: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1.4, marginBottom: Spacing.sm },
  heading: { fontFamily: 'Georgia', fontSize: FontSize.title + 7, fontWeight: '700' },
  subtitle: { fontSize: FontSize.sm, lineHeight: 21, marginTop: Spacing.xs },

  hint: { fontSize: FontSize.xs, lineHeight: 17, marginTop: Spacing.xs },
  flourRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.sm },

  tableHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.lg, paddingBottom: Spacing.xs, borderBottomWidth: 1 },
  th: { fontSize: FontSize.xs, fontWeight: '700' },
  tableRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs + 2 },
  colName: { flex: 1 },
  colPct: { width: 92 },
  colWeigh: { width: 84, textAlign: 'right' },
  rowLabel: { fontSize: FontSize.md, fontWeight: '600' },
  weigh: { fontSize: FontSize.lg, fontWeight: '700' },
  pctBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: BorderRadius.sm, minHeight: 44, paddingHorizontal: Spacing.sm },
  pctInput: { flex: 1, minWidth: 0, fontSize: FontSize.md, fontWeight: '600', textAlign: 'right', paddingVertical: Spacing.xs },
  pctUnit: { fontSize: FontSize.sm, paddingLeft: 2 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: Spacing.sm, marginTop: Spacing.xs },
  totalLabel: { fontSize: FontSize.sm },
  totalValue: { fontSize: FontSize.sm, fontWeight: '700' },

  step: { flexDirection: 'row', gap: Spacing.md, paddingVertical: Spacing.md },
  stepNum: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: FontSize.sm, fontWeight: '800' },
  stepBody: { flex: 1, gap: Spacing.sm },
  stepTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: Spacing.sm, flexWrap: 'wrap' },
  stepTitle: { fontSize: FontSize.lg, fontWeight: '700' },
  stepDuration: { fontSize: FontSize.xs, fontWeight: '600' },
  stepWhen: { fontSize: FontSize.sm, fontWeight: '700' },
  stepText: { fontSize: FontSize.sm, lineHeight: 22 },
  stepAside: { fontSize: FontSize.xs, lineHeight: 18 },

  clock: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.lg },
  clockLabel: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1 },
  clockTime: { fontFamily: 'Georgia', fontSize: FontSize.title + 7, fontWeight: '700', marginTop: 2 },
  clockDate: { fontSize: FontSize.sm, marginTop: 2 },
  outlineBtn: { minHeight: 44, paddingHorizontal: Spacing.lg, borderWidth: 2, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  outlineBtnText: { fontSize: FontSize.sm, fontWeight: '700' },
  textBtn: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  textBtnLabel: { fontSize: FontSize.sm, fontWeight: '700' },

  vesselRow: { flexDirection: 'row', gap: Spacing.sm },
  vessel: { flex: 1, borderRadius: BorderRadius.md, padding: Spacing.md, minHeight: 64 },
  vesselTitle: { fontSize: FontSize.md, fontWeight: '700' },
  vesselHint: { fontSize: FontSize.xs, marginTop: 2 },

  primaryBtn: { flexDirection: 'row', gap: Spacing.sm, borderRadius: BorderRadius.md, minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg, marginTop: Spacing.xs },
  primaryBtnText: { fontSize: FontSize.md, fontWeight: '800' },

  actions: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  actionBtn: { flex: 1, flexDirection: 'row', gap: Spacing.sm, borderRadius: BorderRadius.md, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  actionBtnOutline: { borderWidth: 1.5 },
  actionText: { fontSize: FontSize.md, fontWeight: '800' },
});
