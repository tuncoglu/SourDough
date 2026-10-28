/**
 * The Starter screen's pure helpers: turning the form into a feeding record,
 * reading a feeding's ratio, and working out when it peaks.
 */
import {
  amountsForRatio,
  buildFeeding,
  fedForThisLoaf,
  peakForecast,
  ratioLabel,
} from '../src/lib/starterLog';
import type { StarterFeeding } from '../src/models/types';

const H = 3_600_000;
const NOW = new Date('2026-10-30T12:08:00Z');

const draft = (over: Partial<Parameters<typeof buildFeeding>[0]> = {}) => ({
  id: 'f1',
  now: NOW,
  flours: [{ label: 'Generic: Bread Flour', grams: '50' }],
  waterGrams: '50',
  keptGrams: '50',
  ...over,
});

describe('buildFeeding', () => {
  it('records a single flour the way older versions did', () => {
    const f = buildFeeding(draft({ roomTempC: 20, notes: ' for Saturday ' }))!;
    expect(f).toEqual({
      id: 'f1',
      timestamp: NOW.toISOString(),
      flourUsed: 'Generic: Bread Flour',
      flourGrams: 50,
      waterGrams: 50,
      starterKeptGrams: 50,
      roomTempC: 20,
      notes: 'for Saturday',
    });
  });

  it('keeps several flours as a list, with a readable summary', () => {
    const f = buildFeeding(draft({
      flours: [{ label: 'White', grams: '30' }, { label: 'Rye', grams: '20' }, { label: 'Spelt', grams: '' }],
    }))!;
    expect(f.flourGrams).toBe(50);
    expect(f.flourUsed).toBe('White + Rye');
    expect(f.flours).toEqual([{ label: 'White', grams: 30 }, { label: 'Rye', grams: 20 }]);
  });

  it('records nothing without flour and water', () => {
    expect(buildFeeding(draft({ flours: [{ label: 'White', grams: '' }] }))).toBeNull();
    expect(buildFeeding(draft({ waterGrams: '0' }))).toBeNull();
    expect(buildFeeding(draft({ flours: [] }))).toBeNull();
  });

  it('leaves out what it does not know, and notes the fridge when the jar goes straight in', () => {
    const f = buildFeeding(draft({ keptGrams: '', roomTempC: NaN, intoFridge: true }))!;
    expect(f.starterKeptGrams).toBeUndefined();
    expect(f.roomTempC).toBeUndefined();
    expect(f.notes).toBeUndefined();
    expect(f.fridgeAt).toBe(NOW.toISOString());
  });
});

describe('ratios', () => {
  it('reads a ratio from the amounts, and an older record as 1 : 1 : 1', () => {
    expect(ratioLabel({ starterKeptGrams: 50, flourGrams: 50, waterGrams: 50 })).toBe('1 : 1 : 1');
    expect(ratioLabel({ starterKeptGrams: 30, flourGrams: 60, waterGrams: 60 })).toBe('1 : 2 : 2');
    expect(ratioLabel({ starterKeptGrams: 20, flourGrams: 50, waterGrams: 40 })).toBe('1 : 2.5 : 2');
    expect(ratioLabel({ flourGrams: 50, waterGrams: 50 })).toBe('1 : 1 : 1');
  });

  it('works out flour and water for a ratio, following the starter’s hydration', () => {
    expect(amountsForRatio({ keptGrams: 30, ratio: 2 })).toEqual({ flourGrams: 60, waterGrams: 60 });
    expect(amountsForRatio({ keptGrams: 50, ratio: 1, hydration: 80 })).toEqual({ flourGrams: 50, waterGrams: 40 });
    expect(amountsForRatio({ keptGrams: 0, ratio: 5 })).toEqual({ flourGrams: 0, waterGrams: 0 });
  });
});

describe('peakForecast', () => {
  const fed = (over: Partial<StarterFeeding> = {}): StarterFeeding => ({
    id: 'f',
    timestamp: new Date('2026-10-30T04:56:00Z').toISOString(),
    flourUsed: 'x',
    flourGrams: 50,
    waterGrams: 50,
    roomTempC: 20,
    ...over,
  });

  it('is the design’s peak: fed at 04:56 in a 20 °C kitchen peaks around 12:08, window 09:44 to 14:32', () => {
    const p = peakForecast(fed())!;
    expect(p.hours).toBeCloseTo(7.2, 1);
    const hhmm = (d: Date) => d.toISOString().slice(11, 16);
    expect(hhmm(p.peakAt)).toBe('12:08');
    expect(hhmm(p.window.from)).toBe('09:44');
    expect(hhmm(p.window.to)).toBe('14:32');
  });

  it('takes longer for a bigger feed and a slower starter', () => {
    const big = peakForecast(fed({ starterKeptGrams: 10 }))!; // 1 : 5 : 5
    expect(big.hours).toBeGreaterThan(15);
    expect(peakForecast(fed(), { peakEffectiveHours: 7 })!.hours).toBeCloseTo(8.4, 1);
  });

  it('falls back to today’s kitchen, and gives up with no temperature at all', () => {
    expect(peakForecast(fed({ roomTempC: undefined }), { roomTempC: 24 })!.hours).toBeCloseTo(5, 1);
    expect(peakForecast(fed({ roomTempC: undefined }))).toBeNull();
  });

  it('is null once the jar is in the fridge', () => {
    expect(peakForecast(fed({ fridgeAt: NOW.toISOString() }))).toBeNull();
    expect(peakForecast(fed({ fridgeAt: NOW.toISOString(), outOfFridgeAt: new Date(NOW.getTime() + H).toISOString() }))).not.toBeNull();
  });
});

describe('fedForThisLoaf', () => {
  const at = (hoursAgo: number, over: Partial<StarterFeeding> = {}): StarterFeeding => ({
    id: 'f',
    timestamp: new Date(NOW.getTime() - hoursAgo * H).toISOString(),
    flourUsed: 'x',
    flourGrams: 50,
    waterGrams: 50,
    ...over,
  });
  it('is true for a recent feeding that is still on the counter', () => {
    expect(fedForThisLoaf(at(3), NOW)).toBe(true);
    expect(fedForThisLoaf(at(30), NOW)).toBe(false);
    expect(fedForThisLoaf(at(3, { fridgeAt: NOW.toISOString() }), NOW)).toBe(false);
    expect(fedForThisLoaf(null, NOW)).toBe(false);
  });
});
