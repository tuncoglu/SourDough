/**
 * Google Calendar event links for lacto-fermentation.
 *
 * Builds "Add to Google Calendar" URLs (the same `action=TEMPLATE` link
 * format Google publishes for web pages) so a ferment can be dropped into
 * the user's calendar without any native module, account, or permission:
 * the link opens calendar.google.com (or the Google Calendar app) with the
 * event pre-filled and the user presses Save.
 *
 * All functions here are pure — no React, no native modules — so the date
 * math and URL encoding stay unit-testable (see __tests__/calendar.test.ts).
 *
 * Dates are all-day events encoded as local YYYYMMDD (never UTC via
 * toISOString, which would shift the day for users east/west of UTC — the
 * same UTC-day trap documented in lactoCalculations' forecast bucketing).
 */

import { FermentMethod, LactoDayPoint, UnitSystem } from '../models/types';
import { FermentTiming, readinessPH } from './lactoCalculations';
import { formatTemp, formatWeight } from './unitConversion';
import { SITE_URL } from './site';

/** Google Calendar "add event" template endpoint. */
export const GOOGLE_CALENDAR_RENDER_URL =
  'https://calendar.google.com/calendar/render';

export interface GoogleCalendarEvent {
  title: string;
  /** Free-text body. Rendered as plain text by Google Calendar. */
  details?: string;
  location?: string;
  /** All-day event (the default): `end` is exclusive, so a single-day
   *  event ends on the following day. */
  allDay?: boolean;
  /** First day of the event (local time). */
  start: Date;
  /** Last day of the event (local time). */
  end: Date;
  /** Timed events only — start hour/minute (24h, local, floating). */
  startHour?: number;
  startMinute?: number;
  /** Timed events only — end hour/minute (24h, local, floating). */
  endHour?: number;
  endMinute?: number;
}

// ── Date helpers ────────────────────────────────────────────────────────

/** Local midnight for the given date (drops any time component). */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Add whole days to a date.
 *
 * Uses calendar components rather than `+ n * 86400000` so the result stays
 * on the same wall-clock day across DST transitions (a 23- or 25-hour day
 * would otherwise land on the previous/next date).
 */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Whole days between two dates, ignoring time of day and DST. */
export function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / 86400000);
}

/** Google Calendar all-day date stamp: YYYYMMDD in local time. */
export function toGoogleDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

/** Google Calendar floating local date-time stamp: YYYYMMDDTHHMMSS. */
export function toGoogleDateTime(date: Date, hour: number, minute = 0): string {
  const hh = String(Math.max(0, Math.min(23, Math.round(hour)))).padStart(2, '0');
  const mm = String(Math.max(0, Math.min(59, Math.round(minute)))).padStart(2, '0');
  return `${toGoogleDate(date)}T${hh}${mm}00`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * "Sun 14 Sep" — the app is English-only, and a fixed formatter keeps the
 * same string on every device locale (and in tests).
 */
export function formatEventDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

// ── URL builder ─────────────────────────────────────────────────────────

/**
 * Build a Google Calendar "add event" URL.
 *
 * Timed events are sent as floating local times (no `ctz` parameter) so
 * Google renders them in the viewer's own calendar timezone.
 */
export function buildGoogleCalendarUrl(event: GoogleCalendarEvent): string {
  const allDay = event.allDay !== false;

  // All-day: dates only, and the end date is exclusive (a one-day event
  // ends "tomorrow"), so a 0-day span still needs at least +1.
  const start = allDay
    ? toGoogleDate(event.start)
    : toGoogleDateTime(event.start, event.startHour ?? 9, event.startMinute ?? 0);

  let end: string;
  if (allDay) {
    const endDate = daysBetween(event.start, event.end) >= 1
      ? event.end
      : addDays(event.start, 1);
    end = toGoogleDate(endDate);
  } else {
    end = toGoogleDateTime(event.end, event.endHour ?? (event.startHour ?? 9) + 1, event.endMinute ?? 0);
  }

  const params = [
    'action=TEMPLATE',
    `text=${encodeURIComponent(event.title)}`,
    `dates=${start}/${end}`,
  ];
  if (event.details) params.push(`details=${encodeURIComponent(event.details)}`);
  if (event.location) params.push(`location=${encodeURIComponent(event.location)}`);

  return `${GOOGLE_CALENDAR_RENDER_URL}?${params.join('&')}`;
}

// ── Ferment-specific events ─────────────────────────────────────────────

/**
 * Which milestone to put in the calendar:
 * - `ready` — the day the ferment should be done (taste & refrigerate).
 * - `taste` — when it is first worth tasting.
 * - `span` — one event covering the whole ferment.
 */
export type FermentEventKind = 'ready' | 'taste' | 'span';

export interface FermentCalendarInput {
  presetName: string;
  presetEmoji: string;
  /** Vegetable name (or "A + B" for a multi-veg mix). */
  vegName: string;
  method: FermentMethod;
  vegWeightG: number;
  /** Water weight in grams — brine method only (0 otherwise). */
  waterG: number;
  saltG: number;
  saltPct: number;
  saltLabel: string;
  tempC: number;
  estimatedDays: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  timeline: LactoDayPoint[];
  /**
   * Conditions the estimate was adjusted for (recipe baseline + factors).
   * Optional so the calendar link still works without a timing breakdown.
   */
  timing?: FermentTiming | null;
  unitSystem?: UnitSystem;
  /** Day 0. Defaults to today (local). */
  startDate?: Date;
}

export interface FermentScheduleEntry {
  day: number;
  /** Real calendar date for this milestone. */
  date: Date;
  label: string;
  description: string;
}

/** Map the day-numbered ferment timeline onto real calendar dates. */
export function fermentSchedule(input: FermentCalendarInput): FermentScheduleEntry[] {
  const start = startOfDay(input.startDate ?? new Date());
  return input.timeline.map((point) => ({
    day: point.day,
    date: addDays(start, point.day),
    label: point.label,
    description: point.description,
  }));
}

const METHOD_LABELS: Record<FermentMethod, string> = {
  dry: 'dry salted (self-brining)',
  brine: 'salt brine',
  mash: 'pepper mash',
};

/** Strip the "Day 3 — " prefix so a milestone can be quoted inline. */
function shortLabel(label: string): string {
  const idx = label.indexOf('—');
  return idx === -1 ? label : label.slice(idx + 1).trim();
}

function buildFermentDetails(
  kind: FermentEventKind,
  input: FermentCalendarInput,
  schedule: FermentScheduleEntry[],
): string {
  const unit = input.unitSystem ?? 'metric';
  const batch = input.waterG > 0
    ? `${formatWeight(input.vegWeightG, unit, 0)} ${input.vegName} + ${formatWeight(input.waterG, unit, 0)} water`
    : `${formatWeight(input.vegWeightG, unit, 0)} ${input.vegName}`;

  const lines: string[] = [];

  const headlines: Record<FermentEventKind, string> = {
    taste: `${input.presetEmoji} ${input.presetName} — first taste check`,
    span: `${input.presetEmoji} ${input.presetName} — fermenting`,
    ready: `${input.presetEmoji} ${input.presetName} — ready to taste`,
  };
  lines.push(headlines[kind]);
  lines.push(`${input.presetName} · ${METHOD_LABELS[input.method]}`);
  lines.push('');
  lines.push(`Batch: ${batch}`);
  lines.push(`Salt: ${formatWeight(input.saltG, unit, 1)} (${input.saltPct}%) ${input.saltLabel.toLowerCase()}`);
  lines.push(`Ferment temperature: ~${formatTemp(input.tempC, unit, 0)}`);

  // Show the arithmetic behind the date: the estimate is the recipe's own
  // baseline adjusted to the user's kitchen, not a fixed number.
  if (input.timing) {
    lines.push('');
    lines.push(
      `Timing: ${input.timing.days} days — recipe baseline ${input.timing.referenceDays} days at 22°C, adjusted for:`,
    );
    input.timing.factors.forEach((f) => {
      lines.push(`  • ${f.label} — ${f.daysDelta ? `${f.daysDelta.toFixed(1)} days` : `×${f.factor.toFixed(2)}`}`);
    });
  }

  if (schedule.length > 0) {
    lines.push('');
    lines.push('Schedule:');
    schedule.forEach((entry) => {
      lines.push(`• Day ${entry.day} (${formatEventDate(entry.date)}) — ${shortLabel(entry.label)}`);
    });
  }

  lines.push('');
  lines.push(
    `Ready to refrigerate around day ${Math.round(input.estimatedDays)}; taste from day ${Math.round(input.estimatedDaysMin)}, `
    + `leave it past day ${Math.round(input.estimatedDaysMax)} for a deeper sour.`,
  );
  lines.push(
    `Safe once pH drops below 4.6. At ${formatTemp(input.tempC, unit, 0)} this ferment tastes ready `
    + `around pH ${readinessPH(input.tempC).toFixed(1)} (the sensory optimum is less sour in the cold), `
    + 'so judge by taste rather than the clock.',
  );
  lines.push(
    'The date above is when it is safe and ready — it keeps souring after that, so leave it '
    + 'longer (or fridge it) whenever you like the taste.',
  );
  lines.push('Keep everything submerged. Skim kahm yeast (harmless); discard if fuzzy mould appears.');
  lines.push('');
  lines.push(`From Just Dough It — ${SITE_URL}/ferments`);

  return lines.join('\n');
}

/**
 * Build the Google Calendar event for a ferment milestone.
 *
 * - `ready`: all-day reminder on the day the ferment should be done.
 * - `taste`: all-day reminder when the ferment is first worth tasting.
 * - `span`: one all-day event stretched across the whole ferment (day 0 →
 *   ready day), so the jar shows up as a bar in the calendar.
 */
export function buildFermentEvent(
  kind: FermentEventKind,
  input: FermentCalendarInput,
): GoogleCalendarEvent {
  const start = startOfDay(input.startDate ?? new Date());
  const readyDay = Math.max(1, Math.ceil(input.estimatedDays));
  const tasteDay = Math.max(1, Math.round(input.estimatedDaysMin));
  const ready = addDays(start, readyDay);
  const tasteCandidate = addDays(start, tasteDay);
  // Never schedule the taste check after the "ready" reminder.
  const taste = tasteCandidate.getTime() > ready.getTime() ? ready : tasteCandidate;
  const total = Math.round(input.estimatedDays);

  const titles: Record<FermentEventKind, string> = {
    taste: `${input.presetEmoji} ${input.presetName} — taste check`,
    span: `${input.presetEmoji} ${input.presetName} fermenting (day 0–${total})`,
    ready: `${input.presetEmoji} ${input.presetName} ready — taste & refrigerate`,
  };

  const eventStart = kind === 'ready' ? ready : kind === 'taste' ? taste : start;
  // All-day end dates are exclusive — the span covers start → ready day.
  const eventEnd = kind === 'span' ? addDays(ready, 1) : addDays(eventStart, 1);

  return {
    title: titles[kind],
    details: buildFermentDetails(kind, input, fermentSchedule(input)),
    allDay: true,
    start: eventStart,
    end: eventEnd,
  };
}

/** Convenience wrapper — the URL is what the UI opens. */
export function buildFermentCalendarUrl(
  kind: FermentEventKind,
  input: FermentCalendarInput,
): string {
  return buildGoogleCalendarUrl(buildFermentEvent(kind, input));
}

/** Day the ferment is expected to be ready (all-day reminder date). */
export function fermentReadyDate(input: FermentCalendarInput): Date {
  const start = startOfDay(input.startDate ?? new Date());
  return addDays(start, Math.max(1, Math.ceil(input.estimatedDays)));
}
