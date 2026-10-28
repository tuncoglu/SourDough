/**
 * The lazy bread page as one pure function: the form (flours, percentages,
 * starter choice, when) and what the page knows (the clock, the kitchen, the
 * starter's log) in; weights, the rise estimate, the steps with their clock
 * times, and the feed amounts out.
 *
 * This is the page's orchestration lifted out of the Expo screen so the web
 * app runs the same rules. No React, storage or network.
 */
import type { FlourEntry, StarterFeeding, UnitSystem, WaterHardness } from '../models/types';
import { findFlour } from './flourSearch';
import { buildBlendFromRows } from './blendUtils';
import { buildFeedStep, buildLazySteps, LAZY_DEFAULTS, type LazyStep, type LazyVessel } from './lazyMethod';
import { estimateLazyLoaf, FRIDGE_HOURS, LAZY_PLAN_MINUTES, LAZY_STARTER_TEMP_C, type LazyLoafEstimate, type LazyPlan, type ProofMode } from './lazyPlan';
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
} from './lazySchedule';
import { DEFAULT_PEAK_EFFECTIVE_HOURS, starterFeedAmounts, starterPeakWindowHours, starterTempFor, starterTimeToPeakHours } from './starterStatus';
import { clockTime, shortDay } from './starterFormat';
import { fedForThisLoaf, peakForecast, type PeakForecast, type StarterState } from './starterLog';

export type StarterMode = 'fridge' | 'fed';
export type PlanMode = 'now' | 'readyBy';

export interface FlourRow {
  key: string;
  label: string;
  /** Grams as typed. */
  grams: string;
}

export interface BreadForm {
  flours: FlourRow[];
  waterPct: string;
  starterPct: string;
  saltPct: string;
  starterHydration: string;
  /** Water temperature typed by the baker (°C); empty means the same as the room. */
  waterTempOverride: string;
  vessel: LazyVessel;
  starterMode: StarterMode;
  /** True once the person chose, so a recent feeding no longer switches the mode for them. */
  modeChosen: boolean;
  /** The r in a 1 : r : r feed. */
  feedRatio: number;
  planMode: PlanMode;
  /** Days from today for "ready to slice by" (0 = today). */
  readyDay: number;
  readyTime: string;
  proofMode: ProofMode;
  fridgeHours: string;
}

export const MAX_FLOURS = 3;
export const DEFAULT_FLOUR_LABEL = 'Generic: Bread Flour';

export const DEFAULT_BREAD_FORM: BreadForm = {
  flours: [{ key: 'flour_0', label: DEFAULT_FLOUR_LABEL, grams: '500' }],
  waterPct: String(LAZY_DEFAULTS.waterPct),
  starterPct: String(LAZY_DEFAULTS.starterPct),
  saltPct: '2',
  starterHydration: '100',
  waterTempOverride: '',
  vessel: 'cocotte',
  starterMode: 'fridge',
  modeChosen: false,
  feedRatio: 1,
  planMode: 'now',
  readyDay: 1,
  readyTime: '09:00',
  proofMode: 'counter',
  fridgeHours: String(FRIDGE_HOURS.default),
};

// ── Flour rows ──────────────────────────────────────────────────────────

const nextKey = (rows: FlourRow[]): string => {
  let n = rows.length;
  while (rows.some((r) => r.key === `flour_${n}`)) n++;
  return `flour_${n}`;
};

/** Up to three flours. A second flour takes half of the first's weight. */
export function addFlour(form: BreadForm): BreadForm {
  if (form.flours.length >= MAX_FLOURS) return form;
  const rows = [...form.flours];
  let grams = '0';
  if (rows.length === 1) {
    const existing = parseFloat(rows[0]!.grams) || 0;
    if (existing > 0) {
      const half = Math.round(existing / 2);
      grams = String(half);
      rows[0] = { ...rows[0]!, grams: String(existing - half) };
    }
  }
  return { ...form, flours: [...rows, { key: nextKey(rows), label: DEFAULT_FLOUR_LABEL, grams }] };
}

export const removeFlour = (form: BreadForm, key: string): BreadForm =>
  form.flours.length <= 1 ? form : { ...form, flours: form.flours.filter((r) => r.key !== key) };

export const setFlourLabel = (form: BreadForm, key: string, label: string): BreadForm =>
  ({ ...form, flours: form.flours.map((r) => (r.key === key ? { ...r, label } : r)) });

export const setFlourGrams = (form: BreadForm, key: string, grams: string): BreadForm =>
  ({ ...form, flours: form.flours.map((r) => (r.key === key ? { ...r, grams } : r)) });

// ── Times ───────────────────────────────────────────────────────────────

/** When a moment falls, with the day only if it is not today. */
export function whenLabel(d: Date, now: Date): string {
  return d.toDateString() === now.toDateString() ? clockTime(d) : `${shortDay(d)}, ${clockTime(d)}`;
}

/** Day offset and clock time to fill in for an earliest-possible moment, rounded up to 5 minutes. */
export function earliestChoice(earliest: Date, now: Date): { day: number; time: string } {
  const rounded = new Date(Math.ceil(earliest.getTime() / 300_000) * 300_000);
  const start = dayFromNow(now, 0).getTime();
  const day = Math.round((dayFromNow(rounded, 0).getTime() - start) / 86_400_000);
  return {
    day: Math.min(4, Math.max(0, day)),
    time: `${String(rounded.getHours()).padStart(2, '0')}:${String(rounded.getMinutes()).padStart(2, '0')}`,
  };
}

// ── The plan ────────────────────────────────────────────────────────────

export interface BreadEnv {
  now: Date;
  /** The kitchen (°C). */
  roomTempC: number;
  /** The water hardness to use (see hardnessFor). */
  hardness: WaterHardness;
  /** Estimated tap-water temperature (°C), if known: the water is at this unless the person typed one. */
  tapTempC?: number | null;
  unitSystem: UnitSystem;
  starter: StarterState;
  /** When the dough was mixed, if the person has said so. */
  mixedAt: Date | null;
}

export interface CaseEstimate {
  starterTempC: number;
  starterHoursSinceFed: number | undefined;
  estimate: LazyLoafEstimate | null;
}

export interface Schedule {
  plan: LazyPlan | null;
  tooEarly: boolean;
  earliest: Date | null;
  note: string | null;
}

export interface BreadPlan {
  flourRows: { flour: FlourEntry; grams: number }[];
  flourGrams: number;
  waterGrams: number;
  starterGrams: number;
  blend: ReturnType<typeof buildBlendFromRows>;
  waterTempC: number;
  /** The starter choice in force: the person's, or fed-first when a recent feeding was made for this loaf. */
  mode: StarterMode;
  fed: boolean;
  /** The feeding made for this loaf (recent, not in the fridge), or null. */
  loafFeeding: StarterFeeding | null;
  loafPeak: PeakForecast | null;
  fridgeCase: CaseEstimate | null;
  fedCase: CaseEstimate | null;
  chosen: CaseEstimate | null;
  feedAmounts: ReturnType<typeof starterFeedAmounts>;
  timeToPeak: number | null;
  peakWindow: { from: number; to: number } | null;
  steps: LazyStep[];
  schedule: Schedule | null;
  ovenOn: Date | null;
  /** The clock time of each step, for the method list. */
  stepWhen: Record<string, string>;
  /** Where the readyBy time typed parses to, or null if it does not. */
  wantedReadyAt: Date | null;
  readyTimeValid: boolean;
  /** When to start checking the dough, once it is mixed. */
  checkAt: Date | null;
}

const HOUR = 3_600_000;
const num = (s: string): number => parseFloat(s);

export function planBread(form: BreadForm, env: BreadEnv): BreadPlan {
  const { now, roomTempC, unitSystem, starter, mixedAt } = env;
  const flourRows = form.flours
    .map((r) => ({ flour: findFlour(r.label), grams: parseFloat(r.grams) || 0 }))
    .filter((r) => r.grams > 0);
  const flourRow = flourRows[0];
  const flourGrams = flourRows.reduce((s, r) => s + r.grams, 0);
  const waterGrams = (flourGrams * num(form.waterPct)) / 100;
  const starterGrams = (flourGrams * num(form.starterPct)) / 100;
  const blend = buildBlendFromRows(flourRows);

  const overrideC = form.waterTempOverride.trim() === '' ? NaN : num(form.waterTempOverride);
  const waterTempC = Number.isFinite(overrideC) ? overrideC : env.tapTempC != null && Number.isFinite(env.tapTempC) ? env.tapTempC : roomTempC;

  const loafFeeding = fedForThisLoaf(starter.feeding, now) ? starter.feeding : null;
  const mode: StarterMode = form.modeChosen ? form.starterMode : loafFeeding ? 'fed' : form.starterMode;
  const fed = mode === 'fed';

  const hardness = env.hardness;
  const estimateFor = (m: StarterMode): CaseEstimate | null => {
    if (!flourRow) return null;
    const isFed = m === 'fed';
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
          waterPct: num(form.waterPct),
          starterPct: num(form.starterPct),
          saltPct: num(form.saltPct),
          starterHydration: num(form.starterHydration),
          roomTempC,
          waterTempC,
          starterTempC: tempC,
          starterHoursSinceFed: hours,
          starterFlourBlend: starter.flourBlend,
          flour: flourRow.flour,
          flours: flourRows,
        },
        null,
        hardness,
        unitSystem,
      ),
    };
  };
  const fridgeCase = estimateFor('fridge');
  const fedCase = estimateFor('fed');
  const chosen = fed ? fedCase : fridgeCase;
  const bulkHours = chosen?.estimate?.bulkHours ?? null;

  const hydration = num(form.starterHydration) || 100;
  const feedAmounts = starterFeedAmounts({ neededGrams: starterGrams, ratio: form.feedRatio, hydration });
  const timeToPeak = Number.isFinite(roomTempC)
    ? starterTimeToPeakHours({ roomTempC, dilution: feedAmounts.dilution, peakEffectiveHours: starter.peakEffectiveHours })
    : null;
  const peakWindow = timeToPeak !== null ? starterPeakWindowHours(timeToPeak) : null;
  const loafPeak = loafFeeding ? peakForecast(loafFeeding, { roomTempC, peakEffectiveHours: starter.peakEffectiveHours }) : null;

  let steps = buildLazySteps(form.vessel, bulkHours, unitSystem, { starterFed: fed });
  if (fed && timeToPeak !== null) {
    steps = [
      buildFeedStep({
        leadHours: timeToPeak,
        roomTempC,
        keptGrams: feedAmounts.keptGrams,
        flourGrams: feedAmounts.flourGrams,
        waterGrams: feedAmounts.waterGrams,
        neededGrams: starterGrams,
        unitSystem,
      }),
      ...steps,
    ];
  }

  // ── The schedule: clock times for every step ──
  const parsedTime = parseClockTime(form.readyTime);
  const wantedReadyAt = form.planMode === 'readyBy' && parsedTime ? atClockTime(dayFromNow(now, form.readyDay), parsedTime) : null;
  const readyOf = (plan: LazyPlan) => new Date(plan.steps.find((x) => x.key === 'cool')!.at.getTime() + LAZY_PLAN_MINUTES.cool * 60_000);

  let schedule: Schedule | null = null;
  if (bulkHours != null) {
    const fridgeHours = num(form.fridgeHours);
    const base: ScheduleInput = {
      vessel: form.vessel,
      bulkHours,
      proofMode: form.proofMode,
      fridgeHours: Number.isFinite(fridgeHours) ? fridgeHours : undefined,
    };
    const feed = fed && timeToPeak !== null ? { leadHours: timeToPeak, windowHours: peakWindow ?? undefined } : undefined;
    const none = { tooEarly: false, earliest: null as Date | null, note: null as string | null };

    if (mixedAt) {
      // Once mixed, the day runs forward from the moment it really was.
      schedule = { plan: scheduleFromMix({ ...base, mixAt: mixedAt }), ...none };
    } else if (fed && loafFeeding && loafPeak) {
      // Already fed for this loaf: mix at the peak, whatever was planned.
      const plan = scheduleFromMix({ ...base, mixAt: loafPeak.peakAt });
      let note: string | null = null;
      if (wantedReadyAt) {
        const ready = readyOf(plan);
        if (ready.getTime() > wantedReadyAt.getTime() + 5 * 60_000) {
          const earliestReady = readyOf(scheduleFromMix({ ...base, mixAt: loafPeak.window.from }));
          note = `Mixing at the peak means ready about ${whenLabel(ready, now)}, later than ${whenLabel(wantedReadyAt, now)}. Mixing as early as ${whenLabel(loafPeak.window.from, now)} gets it to ${whenLabel(earliestReady, now)}.`;
        } else {
          note = `On track: mixing at the peak has it ready about ${whenLabel(ready, now)}.`;
        }
      }
      schedule = { plan, ...none, note };
    } else if (form.planMode === 'readyBy') {
      if (!wantedReadyAt) schedule = { plan: null, ...none };
      else {
        const plan = scheduleBackward({ ...base, feed, readyAt: wantedReadyAt });
        schedule = { plan, tooEarly: startsBefore(plan, now), earliest: earliestReadyAt(now, { ...base, feed }), note: null };
      }
    } else {
      // Start now: feed now and mix at the peak, or just mix.
      const mixAt = feed ? new Date(now.getTime() + feed.leadHours * HOUR) : now;
      schedule = { plan: scheduleFromMix({ ...base, feed, mixAt }), ...none };
    }
  }

  const ovenOn = schedule?.plan ? ovenOnAt(schedule.plan, form.vessel) : null;
  const stepWhen: Record<string, string> = {};
  if (schedule?.plan && !schedule.tooEarly) {
    for (const st of schedule.plan.steps) stepWhen[st.key] = whenLabel(st.at, now);
    if (ovenOn && stepWhen.bake) stepWhen.bake = `${stepWhen.bake} · heat the oven at ${whenLabel(ovenOn, now)}`;
  }
  const checkAt = mixedAt && bulkHours != null ? new Date(mixedAt.getTime() + bulkHours * HOUR) : null;

  return {
    flourRows,
    flourGrams,
    waterGrams,
    starterGrams,
    blend,
    waterTempC,
    mode,
    fed,
    loafFeeding,
    loafPeak,
    fridgeCase,
    fedCase,
    chosen,
    feedAmounts,
    timeToPeak,
    peakWindow,
    steps,
    schedule,
    ovenOn,
    stepWhen,
    wantedReadyAt,
    readyTimeValid: form.planMode !== 'readyBy' || !!parsedTime,
    checkAt,
  };
}
