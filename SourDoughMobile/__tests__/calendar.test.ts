/**
 * Unit tests for the Google Calendar link builder (lacto-fermentation).
 *
 * Dates are pinned to a fixed local date so the assertions never depend on
 * when the suite runs.
 */
import {
  addDays,
  buildFermentCalendarUrl,
  buildFermentEvent,
  buildGoogleCalendarUrl,
  daysBetween,
  fermentReadyDate,
  fermentSchedule,
  formatEventDate,
  startOfDay,
  toGoogleDate,
  toGoogleDateTime,
  FermentCalendarInput,
} from '../src/lib/calendar';
import { buildLactoTimeline, estimateFermentTiming } from '../src/lib/lactoCalculations';

/** 2025-09-03 (a Wednesday) — day 0 for every test. */
const START = new Date(2025, 8, 3, 14, 30);

function baseInput(overrides: Partial<FermentCalendarInput> = {}): FermentCalendarInput {
  return {
    presetName: 'Hot Sauce / Pepper Mash',
    presetEmoji: '🌶️',
    vegName: 'Jalapeño',
    method: 'mash',
    vegWeightG: 300,
    waterG: 0,
    saltG: 9,
    saltPct: 3,
    saltLabel: 'Fine sea salt',
    tempC: 21,
    estimatedDays: 10,
    estimatedDaysMin: 7,
    estimatedDaysMax: 14,
    timeline: buildLactoTimeline(10, 'mash'),
    startDate: START,
    ...overrides,
  };
}

describe('date helpers', () => {
  it('startOfDay drops the time component', () => {
    const d = startOfDay(START);
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2025, 8, 3]);
    expect([d.getHours(), d.getMinutes()]).toEqual([0, 0]);
  });

  it('addDays crosses month and year boundaries', () => {
    expect(formatEventDate(addDays(new Date(2025, 8, 28), 5))).toBe('Fri 3 Oct');
    expect(formatEventDate(addDays(new Date(2025, 11, 30), 3))).toBe('Fri 2 Jan');
  });

  it('addDays keeps the local day across a DST spring-forward', () => {
    // 2025-03-30 is the UK/EU spring-forward (a 23-hour day). Naive
    // millisecond arithmetic would land back on 30 March.
    const d = addDays(new Date(2025, 2, 29, 12), 1);
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2025, 2, 30]);
  });

  it('daysBetween ignores time of day', () => {
    expect(daysBetween(new Date(2025, 8, 3, 23), new Date(2025, 8, 13, 1))).toBe(10);
  });

  it('formats Google date stamps in local time (no UTC shift)', () => {
    expect(toGoogleDate(new Date(2025, 8, 3))).toBe('20250903');
    expect(toGoogleDate(new Date(2025, 0, 9))).toBe('20250109');
    expect(toGoogleDateTime(new Date(2025, 8, 3), 9, 5)).toBe('20250903T090500');
  });

  it('formats human dates', () => {
    expect(formatEventDate(new Date(2025, 8, 14))).toBe('Sun 14 Sep');
  });
});

describe('buildGoogleCalendarUrl', () => {
  it('builds an all-day template link with an exclusive end date', () => {
    const url = buildGoogleCalendarUrl({
      title: 'Test event',
      start: new Date(2025, 8, 14),
      end: new Date(2025, 8, 15),
    });
    expect(url).toContain('https://calendar.google.com/calendar/render?action=TEMPLATE');
    expect(url).toContain('text=Test%20event');
    expect(url).toContain('dates=20250914/20250915');
  });

  it('encodes reserved characters in title and details', () => {
    const url = buildGoogleCalendarUrl({
      title: 'Salt & pepper — 3% brine',
      details: 'Line 1\nLine 2 & more',
      start: new Date(2025, 8, 14),
      end: new Date(2025, 8, 15),
    });
    // Raw & or newlines would truncate the details parameter entirely.
    expect(url).toContain('text=Salt%20%26%20pepper%20%E2%80%94%203%25%20brine');
    expect(url).toContain('details=Line%201%0ALine%202%20%26%20more');
    expect(url.split('&details=')).toHaveLength(2);
  });

  it('forces at least a one-day span for all-day events', () => {
    const url = buildGoogleCalendarUrl({
      title: 'Same day',
      start: new Date(2025, 8, 14),
      end: new Date(2025, 8, 14),
    });
    expect(url).toContain('dates=20250914/20250915');
  });

  it('supports timed events as floating local times', () => {
    const url = buildGoogleCalendarUrl({
      title: 'Timed',
      allDay: false,
      start: new Date(2025, 8, 14),
      end: new Date(2025, 8, 14),
      startHour: 9,
      endHour: 9,
      endMinute: 30,
    });
    expect(url).toContain('dates=20250914T090000/20250914T093000');
    // No ctz parameter — Google renders it in the viewer's own timezone.
    expect(url).not.toContain('ctz=');
  });

  it('omits optional parameters when not provided', () => {
    const url = buildGoogleCalendarUrl({
      title: 'Bare',
      start: new Date(2025, 8, 14),
      end: new Date(2025, 8, 15),
    });
    expect(url).not.toContain('details=');
    expect(url).not.toContain('location=');
  });
});

describe('fermentSchedule', () => {
  it('maps timeline days onto real dates', () => {
    const schedule = fermentSchedule(baseInput());
    expect(schedule[0].day).toBe(0);
    expect(formatEventDate(schedule[0].date)).toBe('Wed 3 Sep');

    const last = schedule[schedule.length - 1];
    expect(last.day).toBe(10);
    expect(formatEventDate(last.date)).toBe('Sat 13 Sep');
  });

  it('defaults day 0 to today', () => {
    const schedule = fermentSchedule(baseInput({ startDate: undefined }));
    const today = startOfDay(new Date());
    expect(formatEventDate(schedule[0].date)).toBe(formatEventDate(today));
  });
});

describe('buildFermentEvent', () => {
  it('puts the ready reminder on the estimated day', () => {
    const event = buildFermentEvent('ready', baseInput());
    expect(event.start.getDate()).toBe(13); // 3 Sep + 10 days
    expect(event.end.getDate()).toBe(14); // all-day end is exclusive
    expect(event.title).toContain('Hot Sauce / Pepper Mash');
    expect(event.title.toLowerCase()).toContain('ready');
  });

  it('uses the taste-check day for the taste event', () => {
    const event = buildFermentEvent('taste', baseInput());
    expect(event.start.getDate()).toBe(10); // 3 Sep + 7 days
    expect(event.title.toLowerCase()).toContain('taste');
  });

  it('never puts the taste check after the ready day', () => {
    // A ferment whose taste window opens at/after the estimated finish.
    const event = buildFermentEvent('taste', baseInput({ estimatedDays: 5, estimatedDaysMin: 6 }));
    expect(formatEventDate(event.start)).toBe(formatEventDate(addDays(START, 5)));
  });

  it('spans the whole ferment for the span event', () => {
    const event = buildFermentEvent('span', baseInput());
    expect(formatEventDate(event.start)).toBe('Wed 3 Sep');
    expect(formatEventDate(event.end)).toBe('Sun 14 Sep'); // exclusive
    expect(event.title).toContain('day 0–10');
  });

  it('rounds a fractional estimate up so the reminder is never early', () => {
    const event = buildFermentEvent('ready', baseInput({ estimatedDays: 9.2 }));
    expect(formatEventDate(event.start)).toBe('Sat 13 Sep'); // 3 Sep + ceil(9.2)
  });

  it('packs batch, salt, temperature and the schedule into the details', () => {
    const details = buildFermentEvent('ready', baseInput()).details ?? '';
    expect(details).toContain('300 g Jalapeño');
    expect(details).toContain('9.0 g (3%) fine sea salt');
    expect(details).toContain('21°C');
    expect(details).toContain('Day 0 (Wed 3 Sep)');
    expect(details).toContain('Day 10 (Sat 13 Sep)');
    expect(details).toContain('taste from day 7');
    expect(details).toContain('pH drops below 4.6');
    // The two clocks must both be stated: ready/safe vs still-souring.
    expect(details).toContain('Ready to refrigerate around day 10');
    expect(details).toContain('keeps');
    expect(details).toContain('souring after that');
    expect(details).toContain('From Just Dough It');
  });

  it('lists the water weight for brine ferments only', () => {
    const brine = buildFermentEvent('ready', baseInput({
      method: 'brine',
      vegName: 'Pickling cucumber',
      vegWeightG: 500,
      waterG: 500,
    })).details ?? '';
    expect(brine).toContain('500 g Pickling cucumber + 500 g water');

    const dry = buildFermentEvent('ready', baseInput({ method: 'dry' })).details ?? '';
    expect(dry).not.toContain('water');
  });

  it('explains the date: recipe baseline plus every adjustment', () => {
    const timing = estimateFermentTiming(14, {
      typicalDays: 10,
      saltPct: 4.5,
      recipeSaltPct: 3.0,
      hardnessMgL: 400,
      usesAddedWater: true,
    });
    const event = buildFermentEvent('ready', baseInput({
      estimatedDays: timing.days,
      estimatedDaysMin: timing.daysMin,
      estimatedDaysMax: timing.daysMax,
      timing,
    }));
    const details = event.details ?? '';

    // The event that lands in the user's calendar must not look hardcoded
    // either — it carries the same reasoning as the app.
    expect(details).toContain(`Timing: ${timing.days} days — recipe baseline 10 days at 22°C`);
    expect(details).toContain('Cool 14.0°C — ×');
    expect(details).toContain('Salt 4.5% (above the 1.5–2.75% band) — ×');
    expect(details).toContain('Hard water (400 mg/L) — ×');
  });

  it('still builds an event when no timing breakdown is supplied', () => {
    const event = buildFermentEvent('ready', baseInput());
    expect(event.details).not.toContain('Timing:');
    expect(event.details).toContain('Schedule:');
  });

  it('converts to imperial for imperial users', () => {
    const details = buildFermentEvent('ready', baseInput({ unitSystem: 'imperial' })).details ?? '';
    expect(details).toContain('oz');
    expect(details).toContain('70°F');
    expect(details).not.toContain('21°C');
  });
});

describe('buildFermentCalendarUrl', () => {
  it('produces an openable Google Calendar link', () => {
    const url = buildFermentCalendarUrl('ready', baseInput());
    expect(url.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE')).toBe(true);
    expect(url).toContain('dates=20250913/20250914');
    // The multi-line details block must survive URL encoding.
    expect(url).not.toContain('\n');
    expect(decodeURIComponent(url)).toContain('Day 10 (Sat 13 Sep)');
  });

  it('keeps the link short enough for every browser and the Android intent', () => {
    const url = buildFermentCalendarUrl('span', baseInput({ timeline: buildLactoTimeline(30, 'brine') }));
    expect(url.length).toBeLessThan(4000);
  });
});

describe('fermentReadyDate', () => {
  it('returns the day the ferment is expected to be done', () => {
    expect(formatEventDate(fermentReadyDate(baseInput()))).toBe('Sat 13 Sep');
  });
});
