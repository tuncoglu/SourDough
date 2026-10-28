/**
 * Scheduling the lazy loaf for the bread page: the clock times for each step,
 * backwards from when it should be ready to slice, or forwards from when it is
 * mixed (or from now). Pure; builds on `planLazyBake`, which does the
 * arithmetic on absolute time.
 */
import { LAZY_BAKE, type LazyVessel } from './lazyMethod';
import { planLazyBake, type LazyPlan, type ProofMode } from './lazyPlan';

export interface ScheduleInput {
  vessel: LazyVessel;
  /** The rise, from `estimateLazyLoaf`. */
  bulkHours: number;
  proofMode: ProofMode;
  /** Fridge proof only; clamped to 8–16 h (default 12). */
  fridgeHours?: number;
  /** Feed the starter first: lead time to its peak and the window it stays there. */
  feed?: { leadHours: number; windowHours?: { from: number; to: number } };
}

const HOUR = 3_600_000;

/** Hours from the mix to ready to slice: 5 min mix, the rise, shape, proof, bake and an hour to cool. */
export function hoursFromMix(input: ScheduleInput): number {
  const { feed: _feed, ...rest } = input;
  return planLazyBake({ ...rest, readyAt: new Date(0) }).totalHours;
}

/** Work backwards from when it should be ready to slice. */
export function scheduleBackward(input: ScheduleInput & { readyAt: Date }): LazyPlan {
  return planLazyBake(input);
}

/**
 * Work forwards from a known mix time (when mixed, or when to mix). A feed
 * step, if there is one, lands its lead time before that.
 */
export function scheduleFromMix(input: ScheduleInput & { mixAt: Date }): LazyPlan {
  const readyAt = new Date(input.mixAt.getTime() + hoursFromMix(input) * HOUR);
  return planLazyBake({ ...input, readyAt });
}

/**
 * The earliest it can be ready to slice if the person starts now: feeding the
 * starter now and mixing at its peak, or mixing now.
 */
export function earliestReadyAt(now: Date, input: ScheduleInput): Date {
  const lead = input.feed && Number.isFinite(input.feed.leadHours) && input.feed.leadHours > 0 ? input.feed.leadHours : 0;
  return new Date(now.getTime() + (lead + hoursFromMix(input)) * HOUR);
}

/** Whether a plan asks for something that has already passed (a feed or mix before `now`). */
export function startsBefore(plan: LazyPlan, now: Date, graceMinutes = 1): boolean {
  const first = (plan.feedAt ?? plan.mixAt).getTime();
  return first < now.getTime() - graceMinutes * 60_000;
}

/** When to start heating the oven: the cocotte preheats with the oven; a tin does not need a head start. */
export function ovenOnAt(plan: LazyPlan, vessel: LazyVessel): Date | null {
  if (vessel !== 'cocotte') return null;
  const bake = plan.steps.find((s) => s.key === 'bake');
  return bake ? new Date(bake.at.getTime() - LAZY_BAKE.cocotte.preheatMinutes * 60_000) : null;
}

/**
 * Read a time of day: "9", "9:30", "09:30", "0930", "9pm", "9:30 am".
 * Returns null for anything that is not a real time.
 */
export function parseClockTime(text: string): { hours: number; minutes: number } | null {
  const m = /^\s*(\d{1,2})(?::?(\d{2}))?\s*(am|pm)?\s*$/i.exec(text);
  if (!m) return null;
  let hours = parseInt(m[1], 10);
  const minutes = m[2] !== undefined ? parseInt(m[2], 10) : 0;
  const meridiem = m[3]?.toLowerCase();
  if (minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
  } else if (hours > 23) {
    return null;
  }
  return { hours, minutes };
}

/** A date at a time of day, in the local zone. */
export function atClockTime(day: Date, time: { hours: number; minutes: number }): Date {
  const d = new Date(day);
  d.setHours(time.hours, time.minutes, 0, 0);
  return d;
}

/** The start of the local day `offset` days from `now`. */
export function dayFromNow(now: Date, offset: number): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}
