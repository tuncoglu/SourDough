import { describe, expect, it } from 'vitest';
import { DEFAULT_BREAD_FORM } from '@sourdough/calc/lib/breadPlan';
import { DEFAULT_DEFAULTS, DEFAULT_STATE, formFromDefaults, normalizeDefaults, normalizeForm, normalizeState } from './state';

describe('normalizeForm', () => {
  it('accepts a valid stored form', () => {
    const f = normalizeForm({ ...DEFAULT_BREAD_FORM, waterPct: '80', vessel: 'tin', starterMode: 'fed', modeChosen: true, feedRatio: 2, planMode: 'readyBy', readyDay: 3, proofMode: 'fridge', fridgeHours: '14' });
    expect(f).toMatchObject({ waterPct: '80', vessel: 'tin', starterMode: 'fed', modeChosen: true, feedRatio: 2, planMode: 'readyBy', readyDay: 3, proofMode: 'fridge', fridgeHours: '14' });
  });

  it('defaults anything unknown or malformed', () => {
    const f = normalizeForm({ waterPct: 'wet', vessel: 'wok', starterMode: 'maybe', feedRatio: 7, readyDay: 99, fridgeHours: '40', flours: [{ key: 'a', label: 'Not a flour', grams: '1' }] });
    expect(f).toEqual(DEFAULT_BREAD_FORM);
    expect(normalizeForm(null)).toEqual(DEFAULT_BREAD_FORM);
  });

  it('keeps at most three flours and drops bad rows', () => {
    const row = (i: number, label: string) => ({ key: `flour_${i}`, label, grams: '100' });
    const f = normalizeForm({ flours: [row(0, 'Generic: Bread Flour'), row(1, 'nope'), row(2, 'Generic: Bread Flour'), row(3, 'Generic: Bread Flour'), row(4, 'Generic: Bread Flour')] });
    expect(f.flours.length).toBeLessThanOrEqual(3);
    expect(f.flours.every((r) => r.label !== 'nope')).toBe(true);
  });
});

describe('defaults and state', () => {
  it('builds a form from the defaults', () => {
    const f = formFromDefaults({ ...DEFAULT_DEFAULTS, flourWeight: '800', waterPct: '70' });
    expect(f.flours[0]!.grams).toBe('800');
    expect(f.waterPct).toBe('70');
  });
  it('ignores bad defaults', () => {
    expect(normalizeDefaults({ flourWeight: '0', waterPct: 'x', flourLabel: 'nope' })).toEqual(DEFAULT_DEFAULTS);
  });
  it('survives garbage, and keeps a good mix time and weather', () => {
    expect(normalizeState(undefined)).toEqual(DEFAULT_STATE);
    const s = normalizeState({ mixedAt: '2026-10-28T10:00:00.000Z', weather: { tempC: 12, at: 1, hourly: [{ datetime: '2026-10-28T00:00', tempC: 9 }, 5] }, autoDetect: true });
    expect(s.mixedAt).toBe('2026-10-28T10:00:00.000Z');
    expect(s.weather?.hourly).toHaveLength(1);
    expect(normalizeState({ mixedAt: 'yesterday' }).mixedAt).toBeNull();
  });
});
