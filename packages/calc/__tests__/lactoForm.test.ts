import { FERMENT_PRESETS, VEG_COMBOS } from '../src/data/fermentPresets';
import { FALLBACK_HARDNESS } from '../src/lib/hardnessUtils';
import {
  DEFAULT_LACTO_FORM,
  applyCombo,
  clearMix,
  comboOf,
  historyDraft,
  methodOf,
  planFromForm,
  resolveVeg,
  restoreFrom,
  selectPreset,
  selectVeg,
  toggleVegInMix,
  updateMixGrams,
} from '../src/lib/lactoForm';

const env = { hourlyForecast: null, currentTemp: null, fermTempOverride: 22, hardness: FALLBACK_HARDNESS, unitSystem: 'metric' as const };

describe('selecting a style', () => {
  it('resets the vegetable, salt, cut and water to the style defaults', () => {
    const f = selectPreset(DEFAULT_LACTO_FORM, 'dill-pickles');
    expect(f.fermentType).toBe('dill-pickles');
    expect(f.vegMix).toEqual([]);
    expect(f.prepSize).toBe(FERMENT_PRESETS['dill-pickles']!.referencePrep);
    expect(methodOf(f)).toBe(FERMENT_PRESETS['dill-pickles']!.method);
    // brine styles start from 500 g of water, others from none
    expect(f.waterAmount).toBe(methodOf(f) === 'brine' ? '500' : '0');
  });

  it('leaves a combo behind', () => {
    const combo = VEG_COMBOS[0]!;
    const withCombo = applyCombo(DEFAULT_LACTO_FORM, combo);
    expect(selectPreset(withCombo, 'sauerkraut').comboId).toBeNull();
    expect(selectPreset(withCombo, 'sauerkraut').methodOverride).toBeNull();
  });
});

describe('combos', () => {
  it.each(VEG_COMBOS.map((c) => [c.id, c] as const))('%s loads with its own method and a full result', (_id, combo) => {
    const f = applyCombo(DEFAULT_LACTO_FORM, combo);
    expect(methodOf(f)).toBe(combo.method);
    expect(comboOf(f)?.id).toBe(combo.id);
    expect(f.waterAmount).toBe(combo.method === 'brine' ? '500' : '0');
    const plan = planFromForm(f, env);
    expect(plan.ok).toBe(true);
  });

  it('hand-editing the mix drops the combo identity', () => {
    const f = applyCombo(DEFAULT_LACTO_FORM, VEG_COMBOS[0]!);
    expect(clearMix(f).comboId).toBeNull();
  });
});

describe('the vegetable mix', () => {
  it('starts a mix from the chosen vegetable, and a second tap adds the next', () => {
    let f = toggleVegInMix(DEFAULT_LACTO_FORM, 'carrot');
    expect(f.vegMix.map((m) => m.vegId)).toEqual(['green-cabbage', 'carrot']);
    expect(f.vegMix[0]!.grams).toBe('1000');
    f = toggleVegInMix(f, 'beetroot');
    expect(f.vegMix).toHaveLength(3);
  });

  it('tapping the vegetable already chosen does nothing', () => {
    expect(toggleVegInMix(DEFAULT_LACTO_FORM, 'green-cabbage')).toBe(DEFAULT_LACTO_FORM);
  });

  it('going back to one vegetable returns to the single form, keeping its weight', () => {
    let f = toggleVegInMix(DEFAULT_LACTO_FORM, 'carrot');
    f = updateMixGrams(f, 'green-cabbage', '700');
    f = toggleVegInMix(f, 'carrot');
    expect(f.vegMix).toEqual([]);
    expect(f.vegId).toBe('green-cabbage');
    expect(f.vegWeight).toBe('700');
  });

  it('weights the properties by grams', () => {
    let f = toggleVegInMix(DEFAULT_LACTO_FORM, 'carrot');
    f = updateMixGrams(f, 'green-cabbage', '900');
    f = updateMixGrams(f, 'carrot', '100');
    const r = resolveVeg(f);
    expect(r.isMultiVeg).toBe(true);
    expect(r.totalMixGrams).toBe(1000);
    expect(r.veg.name).toContain('+');
    const cab = resolveVeg(DEFAULT_LACTO_FORM).veg.waterContentPct;
    expect(Math.abs(r.veg.waterContentPct - cab)).toBeLessThan(8);
  });

  it('a mix is planned by its total weight', () => {
    let f = toggleVegInMix(DEFAULT_LACTO_FORM, 'carrot');
    f = updateMixGrams(f, 'green-cabbage', '500');
    f = updateMixGrams(f, 'carrot', '500');
    expect(planFromForm({ ...f, vegWeight: '' }, env).ok).toBe(true);
  });
});

describe('selecting a vegetable', () => {
  it('re-derives weight and salt', () => {
    const f = selectVeg(DEFAULT_LACTO_FORM, 'carrot');
    expect(f.vegId).toBe('carrot');
    expect(Number(f.saltPct)).toBeGreaterThan(0);
  });
});

describe('planning and history', () => {
  it('plans the default sauerkraut and records it', () => {
    const plan = planFromForm(DEFAULT_LACTO_FORM, env);
    expect(plan.ok).toBe(true);
    const draft = historyDraft(DEFAULT_LACTO_FORM, plan)!;
    expect(draft.vegName).toBe('Green Cabbage');
    expect(draft.results.estimatedDays).toBeGreaterThan(0);
    expect(draft.signature).toContain('sauerkraut');
  });

  it('asks for what is missing instead of recording', () => {
    const plan = planFromForm({ ...DEFAULT_LACTO_FORM, vegWeight: '' }, env);
    expect(plan.ok).toBe(false);
    expect(historyDraft({ ...DEFAULT_LACTO_FORM, vegWeight: '' }, plan)).toBeNull();
  });

  it('restores a ferment together with its method and combo', () => {
    const combo = VEG_COMBOS.find((c) => c.method !== FERMENT_PRESETS['custom']!.method) ?? VEG_COMBOS[0]!;
    const f = applyCombo(DEFAULT_LACTO_FORM, combo);
    const draft = historyDraft(f, planFromForm(f, env))!;
    const back = restoreFrom(DEFAULT_LACTO_FORM, { ...draft, id: 'x', createdAt: new Date().toISOString() });
    expect(methodOf(back)).toBe(combo.method);
    expect(back.comboId).toBe(combo.id);
    expect(back.vegMix).toEqual(f.vegMix);
  });
});
