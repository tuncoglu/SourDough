import { describe, expect, it } from 'vitest';
import { DEFAULT_FORM, normalizeState, recommendedSachets, selectCulture, setBatchGrams, setLitres, setSachets } from './form';

describe('culture defaults', () => {
  it('starts as Bulgarian: 2 L, one sachet, pre-heated', () => {
    expect(DEFAULT_FORM).toMatchObject({ yogurtType: 'bulgarian', milkLitres: '2', sachetCount: '1', previousBatchGrams: '60', preHeat: true });
  });

  it('a mesophilic culture is not pre-heated and takes 1 L', () => {
    const f = selectCulture(DEFAULT_FORM, 'filmjolk');
    expect(f.preHeat).toBe(false);
    expect(f.milkLitres).toBe('1');
  });

  it('vegan soya puts soya milk in, and leaving it puts cow back', () => {
    const vegan = selectCulture(DEFAULT_FORM, 'vegan-soya');
    expect(vegan.milkId).toBe('soya');
    expect(selectCulture(vegan, 'bulgarian').milkId).toBe('cow-whole');
    expect(selectCulture({ ...DEFAULT_FORM, milkId: 'goat-whole' }, 'greek').milkId).toBe('goat-whole');
  });
});

describe('starter amounts follow the milk, until typed', () => {
  it('re-derives sachets and previous-batch grams from the volume', () => {
    const f = setLitres(DEFAULT_FORM, '4');
    expect(f.sachetCount).toBe('2');
    expect(f.previousBatchGrams).toBe('120');
  });

  it('leaves an amount the person typed alone', () => {
    const typed = setSachets(DEFAULT_FORM, '3');
    expect(setLitres(typed, '4').sachetCount).toBe('3');
    const grams = setBatchGrams(DEFAULT_FORM, '45');
    expect(setLitres(grams, '4').previousBatchGrams).toBe('45');
  });

  it('does not rewrite anything while the volume is empty or zero', () => {
    const f = setLitres(DEFAULT_FORM, '');
    expect(f.milkLitres).toBe('');
    expect(f.sachetCount).toBe(DEFAULT_FORM.sachetCount);
  });

  it('recommends at least one sachet', () => {
    expect(recommendedSachets({ ...DEFAULT_FORM, milkLitres: '0.5' })).toBe(1);
  });
});

describe('normalizeState', () => {
  it('accepts a stored state', () => {
    const stored = { form: { ...selectCulture(DEFAULT_FORM, 'viili'), milkLitres: '1.5' }, weather: { tempC: 10, at: 1, hourly: [{ datetime: '2026-10-28T00:00', tempC: 9 }] } };
    const s = normalizeState(JSON.parse(JSON.stringify(stored)));
    expect(s.form.yogurtType).toBe('viili');
    expect(s.form.milkLitres).toBe('1.5');
    expect(s.weather?.hourly).toHaveLength(1);
  });

  it('survives garbage', () => {
    expect(normalizeState(null).form).toEqual(DEFAULT_FORM);
    const s = normalizeState({ form: { yogurtType: 'nope', milkId: 'nope', milkLitres: 'abc', preHeat: 'yes' }, weather: { tempC: 'hot' } });
    expect(s.form.yogurtType).toBe('bulgarian');
    expect(s.form.milkId).toBe('cow-whole');
    expect(s.form.milkLitres).toBe('2');
    expect(s.form.preHeat).toBe(true);
    expect(s.weather).toBeNull();
  });
});
