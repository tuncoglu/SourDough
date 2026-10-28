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
import { buildBlendFromRows } from '../../src/lib/blendUtils';
import { resolveHardness } from '../../src/lib/hardnessUtils';
import { formatTemp, formatWeight } from '../../src/lib/unitConversion';
import { isValidDecimalInput } from '../../src/lib/inputValidation';
import { findFlour } from '../../src/lib/flourSearch';
import {
  buildFeedStep,
  buildLazySteps,
  lazyBakeSummary,
  LAZY_DEFAULTS,
  STARTER_FEED_GRAMS,
  type LazyVessel,
} from '../../src/lib/lazyMethod';
import { estimateLazyLoaf, FRIDGE_HOURS, LAZY_PLAN_MINUTES, LAZY_STARTER_TEMP_C, type ProofMode } from '../../src/lib/lazyPlan';
import {
  atClockTime,
  dayFromNow,
  earliestReadyAt,
  ovenOnAt,
  parseClockTime,
  scheduleBackward,
  scheduleFromMix,
  startsBefore,
  type ScheduleInput,
} from '../../src/lib/lazySchedule';
import {
  DEFAULT_PEAK_EFFECTIVE_HOURS,
  starterFeedAmounts,
  starterPeakWindowHours,
  starterTempFor,
  starterTimeToPeakHours,
} from '../../src/lib/starterStatus';
import { clockTime } from '../../src/lib/starterFormat';
import { computeVitalityFactor } from '../../src/lib/calculations';
import { fedForThisLoaf, peakForecast } from '../../src/lib/starterLog';
import { isoWithOffset } from '../../src/lib/assist';
import { getRecipe } from '../../src/store/recipeStore';
import type { CalculationResults } from '../../src/models/types';

import { LocationBar } from '../../src/components/LocationBar';
import { FlourMix } from '../../src/components/FlourMix';
import { TempRow } from '../../src/components/TempRow';
import { Seo } from '../../src/components/Seo';
import { Icon } from '../../src/components/Icon';
import { AskCard } from '../../src/components/AskCard';
import { StarterChoiceCard, type StarterMode } from '../../src/components/StarterChoiceCard';
import { ReadyByCard, whenLabel, type PlanMode } from '../../src/components/ReadyByCard';

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

  // ── Formula → weights and rise estimate (live; nothing to recalculate) ──
  const flourRows = useMemo(
    () => inputs.mixRows
      .map((r) => ({ flour: r.flour, grams: parseFloat(r.grams) || 0 }))
      .filter((r) => r.grams > 0),
    [inputs.mixRows],
  );
  const flourRow = flourRows[0];
  const flourGrams = flourRows.reduce((sum, r) => sum + r.grams, 0);
  const waterGrams = (flourGrams * parseFloat(waterPct)) / 100;
  const starterGrams = (flourGrams * parseFloat(starterPct)) / 100;
  const blend = useMemo(() => buildBlendFromRows(flourRows), [flourRows]);

  // The Room temp field drives the estimate and the flour follows it. The water is at the
  // location's tap temperature when we have one, otherwise at room temperature. No weather
  // forecast is used, so the field, the assistant's tools and this number all agree.
  const roomTempC = parseFloat(inputs.ambientTemp);
  const tapTempC = inputs.locationData?.waterTemp ?? null;
  const autoWaterC = tapTempC ?? roomTempC;
  const overrideC = waterOverride !== null ? parseFloat(waterOverride) : NaN;
  const waterTempC = Number.isFinite(overrideC) ? overrideC : autoWaterC;
  const waterIsAuto = !Number.isFinite(overrideC);

  // The starter's state, from the feeding log. With no usable log it is a
  // fridge-cold starter at full strength, as before.
  const starter = useStarterStatus(roomTempC);
  const [starterMode, setStarterMode] = useState<StarterMode>('fridge');
  const [feedRatio, setFeedRatio] = useState(1);
  const modeChosenRef = useRef(false);
  const chooseMode = useCallback((m: StarterMode) => { modeChosenRef.current = true; setStarterMode(m); }, []);
  const fed = starterMode === 'fed';
  const loafFeeding = fedForThisLoaf(starter.feeding, new Date(starter.now)) ? starter.feeding : null;

  // A feeding made for this loaf means the person is already on the feed-first path.
  useEffect(() => {
    if (!modeChosenRef.current && loafFeeding) setStarterMode('fed');
  }, [loafFeeding]);

  // How each choice changes the estimate. Fed first assumes it is mixed at the peak;
  // from the fridge uses the starter's logged state.
  const estimateFor = useCallback((mode: StarterMode) => {
    if (!flourRow) return null;
    const isFed = mode === 'fed';
    const tempC = isFed
      ? roomTempC
      : starter.status ? starterTempFor(starter.status, roomTempC, LAZY_STARTER_TEMP_C) : LAZY_STARTER_TEMP_C;
    // Feed first means mixing at the peak, which is what the plan tells the person to do.
    const hours = isFed ? DEFAULT_PEAK_EFFECTIVE_HOURS : starter.status?.effectiveHours;
    return {
      starterTempC: tempC,
      starterHoursSinceFed: hours,
      estimate: estimateLazyLoaf(
        {
          flourGrams,
          waterPct: parseFloat(waterPct),
          starterPct: parseFloat(starterPct),
          saltPct: parseFloat(inputs.saltPct),
          starterHydration: parseFloat(inputs.starterHydrationStr),
          roomTempC,
          waterTempC,
          starterTempC: tempC,
          starterHoursSinceFed: hours,
          starterFlourBlend: starter.flourBlend,
          flour: flourRow.flour,
          flours: flourRows,
        },
        null,
        resolveHardness(inputs.settings.waterHardnessOverride || 0, inputs.locationData?.hardness),
        unitSystem,
      ),
    };
  }, [
    flourRow, flourRows, flourGrams, waterPct, starterPct,
    inputs.saltPct, inputs.starterHydrationStr, roomTempC, waterTempC,
    starter.status, starter.flourBlend,
    inputs.locationData, inputs.settings.waterHardnessOverride, unitSystem,
  ]);
  const fridgeCase = useMemo(() => estimateFor('fridge'), [estimateFor]);
  const fedCase = useMemo(() => estimateFor('fed'), [estimateFor]);
  const chosenCase = fed ? fedCase : fridgeCase;
  const estimate = chosenCase?.estimate ?? null;
  const starterTempC = chosenCase?.starterTempC ?? LAZY_STARTER_TEMP_C;
  const starterHoursSinceFed = chosenCase?.starterHoursSinceFed;

  // What to feed, and when it peaks, for this loaf's starter.
  const starterHydrationPct = parseFloat(inputs.starterHydrationStr) || 100;
  const feedAmounts = useMemo(
    () => starterFeedAmounts({ neededGrams: starterGrams, ratio: feedRatio, hydration: starterHydrationPct }),
    [starterGrams, feedRatio, starterHydrationPct],
  );
  const timeToPeak = Number.isFinite(roomTempC)
    ? starterTimeToPeakHours({ roomTempC, dilution: feedAmounts.dilution, peakEffectiveHours: starter.peakEffectiveHours })
    : null;
  const peakWindow = timeToPeak !== null ? starterPeakWindowHours(timeToPeak) : null;
  const loafPeak = loafFeeding
    ? peakForecast(loafFeeding, { roomTempC, peakEffectiveHours: starter.peakEffectiveHours })
    : null;

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

  const results: CalculationResults | null = estimate?.results ?? null;

  const bulkHours = estimate?.bulkHours ?? null;
  const steps = useMemo(() => {
    const base = buildLazySteps(vessel, bulkHours, unitSystem, { starterFed: fed });
    if (!fed || timeToPeak === null) return base;
    return [
      buildFeedStep({
        leadHours: timeToPeak,
        roomTempC,
        keptGrams: feedAmounts.keptGrams,
        flourGrams: feedAmounts.flourGrams,
        waterGrams: feedAmounts.waterGrams,
        neededGrams: starterGrams,
        unitSystem,
      }),
      ...base,
    ];
  }, [vessel, bulkHours, unitSystem, fed, timeToPeak, roomTempC, feedAmounts, starterGrams]);
  // ── The schedule: clock times for every step ─────────────────────────────
  const nowDate = useMemo(() => new Date(starter.now), [starter.now]);
  const [planMode, setPlanMode] = useState<PlanMode>('now');
  const [readyDay, setReadyDay] = useState(1);
  const [readyTime, setReadyTime] = useState('09:00');
  const [proofMode, setProofMode] = useState<ProofMode>('counter');
  const [fridgeHoursStr, setFridgeHoursStr] = useState(String(FRIDGE_HOURS.default));
  const parsedReadyTime = parseClockTime(readyTime);
  const wantedReadyAt = planMode === 'readyBy' && parsedReadyTime
    ? atClockTime(dayFromNow(nowDate, readyDay), parsedReadyTime)
    : null;

  const schedule = useMemo(() => {
    if (bulkHours == null) return null;
    const fridgeHours = parseFloat(fridgeHoursStr);
    const base: ScheduleInput = {
      vessel,
      bulkHours,
      proofMode,
      fridgeHours: Number.isFinite(fridgeHours) ? fridgeHours : undefined,
    };
    const feed = fed && timeToPeak !== null ? { leadHours: timeToPeak, windowHours: peakWindow ?? undefined } : undefined;
    const none = { tooEarly: false, earliest: null as Date | null, note: null as string | null };

    // Once mixed, the day runs forward from the moment it really was.
    if (mixedAt) return { plan: scheduleFromMix({ ...base, mixAt: mixedAt }), ...none };

    // Already fed for this loaf: mix at the peak, whatever was planned.
    if (fed && loafFeeding && loafPeak) {
      const plan = scheduleFromMix({ ...base, mixAt: loafPeak.peakAt });
      let note: string | null = null;
      if (wantedReadyAt) {
        const ready = plan.steps.find((x) => x.key === 'cool')!.at.getTime() + LAZY_PLAN_MINUTES.cool * 60_000;
        if (ready > wantedReadyAt.getTime() + 5 * 60_000) {
          const earlier = scheduleFromMix({ ...base, mixAt: loafPeak.window.from });
          const earliestReady = new Date(earlier.steps.find((x) => x.key === 'cool')!.at.getTime() + LAZY_PLAN_MINUTES.cool * 60_000);
          note = `Mixing at the peak means ready about ${whenLabel(new Date(ready), nowDate)}, later than ${whenLabel(wantedReadyAt, nowDate)}. Mixing as early as ${whenLabel(loafPeak.window.from, nowDate)} gets it to ${whenLabel(earliestReady, nowDate)}.`;
        } else {
          note = `On track: mixing at the peak has it ready about ${whenLabel(new Date(ready), nowDate)}.`;
        }
      }
      return { plan, ...none, note };
    }

    if (planMode === 'readyBy') {
      if (!wantedReadyAt) return { plan: null, ...none };
      const plan = scheduleBackward({ ...base, feed, readyAt: wantedReadyAt });
      return {
        plan,
        tooEarly: startsBefore(plan, nowDate),
        earliest: earliestReadyAt(nowDate, { ...base, feed }),
        note: null as string | null,
      };
    }

    // Start now: feed now and mix at the peak, or just mix.
    const mixAt = feed ? new Date(nowDate.getTime() + feed.leadHours * 3_600_000) : nowDate;
    return { plan: scheduleFromMix({ ...base, feed, mixAt }), ...none };
  }, [bulkHours, vessel, proofMode, fridgeHoursStr, fed, timeToPeak, peakWindow, mixedAt, loafFeeding, loafPeak, wantedReadyAt, planMode, nowDate]);

  const ovenOn = schedule?.plan ? ovenOnAt(schedule.plan, vessel) : null;
  /** The clock time of each step, for the method list. */
  const stepWhen = useMemo(() => {
    const out: Record<string, string> = {};
    if (!schedule?.plan || schedule.tooEarly) return out;
    for (const st of schedule.plan.steps) out[st.key] = whenLabel(st.at, nowDate);
    if (ovenOn && out.bake) out.bake = `${out.bake} · heat the oven at ${whenLabel(ovenOn, nowDate)}`;
    return out;
  }, [schedule, ovenOn, nowDate]);

  /** Fill in the earliest time that works. */
  const useEarliest = useCallback(() => {
    if (!schedule?.earliest) return;
    const rounded = new Date(Math.ceil(schedule.earliest.getTime() / 300_000) * 300_000);
    const start = dayFromNow(nowDate, 0).getTime();
    const day = Math.round((dayFromNow(rounded, 0).getTime() - start) / 86_400_000);
    setReadyDay(Math.min(4, Math.max(0, day)));
    setReadyTime(`${String(rounded.getHours()).padStart(2, '0')}:${String(rounded.getMinutes()).padStart(2, '0')}`);
  }, [schedule, nowDate]);

  const checkAt = mixedAt && bulkHours != null ? new Date(mixedAt.getTime() + bulkHours * 3600000) : null;
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
          mode={starterMode}
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
          timeInvalid={planMode === 'readyBy' && !parsedReadyTime}
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
