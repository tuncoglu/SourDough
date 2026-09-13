/**
 * Curated-combo setup tests.
 *
 * Regression guard: a combo's own method used to be dropped (everything ran
 * as the custom preset's brine), so mash combos were salted and timed like a
 * brine ferment, and a brine combo applied after a mash preset inherited 0 g
 * of water and failed validation.
 */
import {
  buildComboSetup,
  comboReferenceSpeed,
  relativeVegSpeed,
  DEFAULT_BRINE_WATER_G,
} from '../src/lib/fermentSetup';
import { VEG_COMBOS, FERMENT_PRESETS } from '../src/data/fermentPresets';
import { findVeg } from '../src/data/vegetables';
import { estimateFermentTiming } from '../src/lib/lactoCalculations';

const COMBO_BY_ID = Object.fromEntries(VEG_COMBOS.map((c) => [c.id, c]));

describe('buildComboSetup', () => {
  it('carries the combo method, not the custom preset method', () => {
    // The custom preset is a brine ferment; this combo is a mash.
    expect(FERMENT_PRESETS.custom!.method).toBe('brine');

    const mash = COMBO_BY_ID['pineapple-habanero']!;
    expect(mash.method).toBe('mash');
    expect(buildComboSetup(mash).method).toBe('mash');
  });

  it('keeps every combo on the method its data declares', () => {
    VEG_COMBOS.forEach((combo) => {
      expect(`${combo.id}: ${buildComboSetup(combo).method}`).toBe(`${combo.id}: ${combo.method}`);
    });
  });

  it('sends no water for dry and mash combos, and a default for brine', () => {
    VEG_COMBOS.forEach((combo) => {
      const setup = buildComboSetup(combo);
      if (combo.method === 'brine') {
        expect(`${combo.id}: ${setup.waterAmount}`).toBe(`${combo.id}: ${DEFAULT_BRINE_WATER_G}`);
      } else {
        expect(`${combo.id}: ${setup.waterAmount}`).toBe(`${combo.id}: 0`);
      }
    });
  });

  it('scales the mix to the combo total, in the declared proportions', () => {
    VEG_COMBOS.forEach((combo) => {
      const setup = buildComboSetup(combo);
      expect(setup.vegMix).toHaveLength(combo.vegetables.length);
      expect(setup.vegMix.map((m) => m.vegId)).toEqual(combo.vegetables.map((v) => v.vegId));

      const total = setup.vegMix.reduce((sum, m) => sum + Number(m.grams), 0);
      expect(Math.abs(total - combo.typicalTotalGrams)).toBeLessThanOrEqual(combo.vegetables.length);

      setup.vegMix.forEach((m, i) => {
        const proportion = combo.vegetables[i].proportion;
        if (proportion >= 0.5) {
          // Only the dominant vegetable is large enough that rounding is negligible
          expect(Math.abs(Number(m.grams) - combo.typicalTotalGrams * proportion)).toBeLessThanOrEqual(1);
        }
      });
    });
  });

  it('selects the combo ferment type, primary veg and salt level', () => {
    const setup = buildComboSetup(COMBO_BY_ID['dill-pickles-classic']!);
    expect(setup.fermentType).toBe('custom');
    expect(setup.vegId).toBe('pickling-cucumber');
    expect(setup.saltPct).toBe('3.5');
  });
});

describe('combo timing comes from the combo itself', () => {
  /**
   * The old model derived a combo's duration from its vegetables alone, so
   * a mash combo was computed as if it were a brine ferment (~5 days for a
   * pepper mash whose own tip promises 7–14).
   */
  it('uses the combo\'s own documented days, not a borrowed preset rate', () => {
    const combo = COMBO_BY_ID['pineapple-habanero']!;
    expect(combo.method).toBe('mash');
    expect(estimateFermentTiming(22, { typicalDays: combo.typicalDays }).days).toBe(10);
  });

  it('keeps every combo on the days its tips promise', () => {
    VEG_COMBOS.forEach((combo) => {
      const days = estimateFermentTiming(22, { typicalDays: combo.typicalDays }).days;
      expect(`${combo.id}: ${days}`).toBe(`${combo.id}: ${combo.typicalDays}`);
    });
  });

  it('still lets a swapped vegetable scale the estimate', () => {
    const combo = COMBO_BY_ID['dill-pickles-classic']!;
    const reference = comboReferenceSpeed(combo); // its own cucumbers + garlic
    const slower = estimateFermentTiming(22, {
      typicalDays: combo.typicalDays,
      vegSpeedRatio: relativeVegSpeed(findVeg('green-beans').speedFactor, reference),
    }).days;
    expect(slower).toBeGreaterThan(combo.typicalDays);
  });
});
