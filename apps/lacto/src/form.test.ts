import { describe, expect, it } from 'vitest';
import { DEFAULT_LACTO_FORM } from '@sourdough/calc/lib/lactoForm';
import { DEFAULT_STATE, normalizeForm, normalizeState } from './form';

describe('normalizeForm', () => {
  it('accepts a valid stored form', () => {
    const f = normalizeForm({ ...DEFAULT_LACTO_FORM, fermentType: 'kimchi', vegId: 'carrot', saltPct: '2.5', prepSize: 'grated', useStarter: true });
    expect(f).toMatchObject({ fermentType: 'kimchi', vegId: 'carrot', saltPct: '2.5', prepSize: 'grated', useStarter: true });
  });

  it('defaults anything unknown or malformed', () => {
    const f = normalizeForm({ fermentType: 'nope', vegId: 'nope', saltType: 'moon-dust', prepSize: 'minced', vegWeight: 'abc', saltPct: '2..5', useStarter: 'yes' });
    expect(f).toEqual(DEFAULT_LACTO_FORM);
    expect(normalizeForm(null)).toEqual(DEFAULT_LACTO_FORM);
  });

  it('only keeps a method override that belongs to a combo', () => {
    expect(normalizeForm({ methodOverride: 'mash', comboId: null }).methodOverride).toBeNull();
    expect(normalizeForm({ methodOverride: 'mash', comboId: 'nope' }).methodOverride).toBeNull();
  });

  it('drops a one-vegetable "mix" and bad rows', () => {
    expect(normalizeForm({ vegMix: [{ vegId: 'carrot', grams: '100' }] }).vegMix).toEqual([]);
    const two = [{ vegId: 'carrot', grams: '100' }, { vegId: 'green-cabbage', grams: '200' }, { vegId: 'nope', grams: '1' }, { vegId: 'carrot', grams: 'x' }];
    expect(normalizeForm({ vegMix: two }).vegMix).toHaveLength(2);
  });
});

describe('normalizeState', () => {
  it('survives garbage', () => {
    expect(normalizeState(undefined)).toEqual(DEFAULT_STATE);
    expect(normalizeState({ weather: { tempC: 'hot' }, autoDetect: 1 }).weather).toBeNull();
  });
  it('keeps a good weather reading', () => {
    const s = normalizeState({ weather: { tempC: 11, at: 5, hourly: [{ datetime: '2026-10-28T00:00', tempC: 9 }, { nope: 1 }] }, autoDetect: true });
    expect(s.weather?.hourly).toHaveLength(1);
    expect(s.autoDetect).toBe(true);
  });
});
