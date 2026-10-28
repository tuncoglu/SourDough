/**
 * The bread page's schedule: backwards from ready-to-slice, forwards from a
 * mix, and the checks around the two. The numbers are the ones the design
 * shows, so they are pinned here.
 */
import {
  atClockTime,
  dayFromNow,
  earliestReadyAt,
  hoursFromMix,
  ovenOnAt,
  parseClockTime,
  scheduleBackward,
  scheduleFromMix,
  startsBefore,
  type ScheduleInput,
} from '../src/lib/lazySchedule';

const H = 3_600_000;
const M = 60_000;
const hhmm = (d: Date) => d.toISOString().slice(11, 16);

const FED: ScheduleInput = {
  vessel: 'cocotte',
  bulkHours: 7,
  proofMode: 'fridge',
  fridgeHours: 12,
  feed: { leadHours: 7.2, windowHours: { from: 4.8, to: 9.6 } },
};
const READY = new Date('2026-10-31T09:00:00Z');

describe('hoursFromMix', () => {
  it('is mix 5 min, rise, shape 2 min, proof, bake 45 min and an hour to cool', () => {
    // 7 h rise + 12 h fridge + (5 + 2 + 45 + 60) min
    expect(hoursFromMix(FED)).toBeCloseTo(7 + 12 + 112 / 60, 6);
    expect(hoursFromMix({ ...FED, proofMode: 'counter' })).toBeCloseTo(7 + 4 + 112 / 60, 6);
  });
  it('does not include the feed', () => {
    expect(hoursFromMix(FED)).toBe(hoursFromMix({ ...FED, feed: undefined }));
  });
});

describe('scheduleBackward', () => {
  it('is the design’s Saturday: feed 04:56, mix 12:08, bake 07:15, ready 09:00', () => {
    const plan = scheduleBackward({ ...FED, readyAt: READY });
    const at = Object.fromEntries(plan.steps.map((s) => [s.key, hhmm(s.at)]));
    expect(at).toEqual({ feed: '04:56', mix: '12:08', rise: '12:13', shape: '19:13', proof: '19:15', bake: '07:15', cool: '08:00' });
    expect(hhmm(plan.mixWindow!.from)).toBe('09:44');
    expect(hhmm(plan.mixWindow!.to)).toBe('14:32');
  });
  it('heats the cocotte oven half an hour before baking, and a tin needs no head start', () => {
    const plan = scheduleBackward({ ...FED, readyAt: READY });
    expect(hhmm(ovenOnAt(plan, 'cocotte')!)).toBe('06:45');
    expect(ovenOnAt(plan, 'tin')).toBeNull();
  });
});

describe('scheduleFromMix', () => {
  it('puts the mix where it is told, and everything after it', () => {
    const mixAt = new Date('2026-10-30T12:08:00Z');
    const plan = scheduleFromMix({ ...FED, mixAt });
    expect(plan.mixAt.getTime()).toBe(mixAt.getTime());
    expect(plan.feedAt!.getTime()).toBe(mixAt.getTime() - 7.2 * H);
    // It lands where the backward plan put it.
    const back = scheduleBackward({ ...FED, readyAt: READY });
    expect(Math.abs(plan.steps.find((s) => s.key === 'cool')!.at.getTime() - back.steps.find((s) => s.key === 'cool')!.at.getTime())).toBeLessThan(M);
  });
  it('has no feed step when the starter comes from the fridge', () => {
    const plan = scheduleFromMix({ ...FED, feed: undefined, mixAt: new Date('2026-10-30T10:38:00Z'), bulkHours: 8.5 });
    expect(plan.feedAt).toBeUndefined();
    expect(plan.steps.map((s) => s.key)).toEqual(['mix', 'rise', 'shape', 'proof', 'bake', 'cool']);
  });
});

describe('earliest ready time and plans that start in the past', () => {
  const now = new Date('2026-10-30T09:00:00Z');
  it('starts with the feed when feeding first, and with the mix when not', () => {
    const fed = earliestReadyAt(now, FED);
    const lazy = earliestReadyAt(now, { ...FED, feed: undefined });
    expect(fed.getTime() - lazy.getTime()).toBeCloseTo(7.2 * H, -2);
    expect(lazy.getTime()).toBeCloseTo(now.getTime() + hoursFromMix(FED) * H, -2);
  });
  it('spots a plan that would have had to start already', () => {
    // The Saturday plan needs the feed at 04:56 on Friday: fine at 03:00, too late at 09:00.
    const plan = scheduleBackward({ ...FED, readyAt: READY });
    expect(startsBefore(plan, new Date('2026-10-30T03:00:00Z'))).toBe(false);
    expect(startsBefore(plan, now)).toBe(true);
    expect(startsBefore(scheduleBackward({ ...FED, readyAt: new Date('2026-10-30T20:00:00Z') }), now)).toBe(true);
    // The planned mix of a plan made for exactly the earliest time is not "in the past".
    expect(startsBefore(scheduleBackward({ ...FED, readyAt: earliestReadyAt(now, FED) }), now)).toBe(false);
  });
});

describe('reading a time of day', () => {
  it('accepts the ways people write it', () => {
    expect(parseClockTime('9')).toEqual({ hours: 9, minutes: 0 });
    expect(parseClockTime('9:30')).toEqual({ hours: 9, minutes: 30 });
    expect(parseClockTime('09:05')).toEqual({ hours: 9, minutes: 5 });
    expect(parseClockTime('0930')).toEqual({ hours: 9, minutes: 30 });
    expect(parseClockTime(' 21:45 ')).toEqual({ hours: 21, minutes: 45 });
    expect(parseClockTime('9pm')).toEqual({ hours: 21, minutes: 0 });
    expect(parseClockTime('12am')).toEqual({ hours: 0, minutes: 0 });
    expect(parseClockTime('12:15 pm')).toEqual({ hours: 12, minutes: 15 });
  });
  it('refuses what is not a time', () => {
    for (const bad of ['', 'noon', '24:00', '9:60', '13pm', '0pm', '9:3', '99']) {
      expect(parseClockTime(bad)).toBeNull();
    }
  });
  it('builds a date from a day and a time', () => {
    const day = dayFromNow(new Date('2026-10-30T15:20:00'), 1);
    const d = atClockTime(day, { hours: 9, minutes: 30 });
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()]).toEqual([2026, 9, 31, 9, 30]);
  });
});
