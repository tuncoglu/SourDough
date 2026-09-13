/**
 * Timing consistency tests — the link between the numbers and the copy.
 *
 * The old model had two independent sources of truth: the day range written
 * in each recipe's `tips` ("Ferment 7–14 days"), and a chain of dimensionless
 * multipliers in the engine. Nothing connected them, so they drifted — a
 * pepper mash computed ~6 days while its own tip promised 7–14, and combos
 * had no timing data at all.
 *
 * These tests parse the day range back out of the user-facing copy and
 * assert the data agrees with it. Edit the prose without updating
 * `typicalDays` (or vice versa) and the suite fails.
 */
import {
  estimateFermentTiming,
  temperatureTimeFactor,
  REFERENCE_DAYS,
} from '../src/lib/lactoCalculations';
import {
  recommendedSaltPct,
  comboReferenceSpeed,
  mixSpeedFactor,
  presetReferenceSpeed,
  relativeVegSpeed,
  buildComboSetup,
} from '../src/lib/fermentSetup';
import { REFERENCE_HARDNESS_MGL } from '../src/lib/lactoCalculations';
import { FERMENT_PRESETS, VEG_COMBOS, VegCombo } from '../src/data/fermentPresets';
import { findVeg } from '../src/data/vegetables';
import { FermentPreset } from '../src/models/types';

const REFERENCE_TEMP = 22.0;

/**
 * Day range a recipe's anchor came from.
 *
 * This used to be parsed out of the user-facing `tips`; the ranges now live in
 * `documentedDays` instead, because nothing user-facing states a flat number
 * of days any more (see the copy guard below). Same protection, different
 * source: the anchor can still be held to the guidance it came from.
 */
function promisedDays(recipe: FermentPreset | VegCombo): [number, number] | null {
  return recipe.documentedDays ?? null;
}

/** Days the engine reports for a recipe exactly as written, at 22 °C. */
function daysAsWritten(recipe: FermentPreset | VegCombo): number {
  const salt = 'defaultVegId' in recipe
    ? recommendedSaltPct(findVeg((recipe as FermentPreset).defaultVegId), (recipe as FermentPreset).method)
    : (recipe as VegCombo).typicalSaltPct;
  return estimateFermentTiming(REFERENCE_TEMP, {
    typicalDays: recipe.typicalDays,
    saltPct: salt,
    recipeSaltPct: salt, // measured against the recipe's own level
    hardnessMgL: REFERENCE_HARDNESS_MGL,
    usesAddedWater: false,
  }).days;
}

/** e.g. "hot-sauce: 6 days, copy promises 7–14" — empty means consistent. */
function timingViolations(
  id: string,
  typicalDays: number,
  promised: [number, number] | null,
): string[] {
  if (!promised) return [];
  const [min, max] = promised;
  return typicalDays >= min && typicalDays <= max
    ? []
    : [`${id}: engine says ${typicalDays} days, copy promises ${min}–${max}`];
}

describe('every recipe states a duration the engine honours', () => {
  it('returns exactly typicalDays at the reference temperature and vegetables', () => {
    Object.values(FERMENT_PRESETS).forEach((preset) => {
      expect(`${preset.id}=${daysAsWritten(preset)}`).toBe(`${preset.id}=${preset.typicalDays}`);
    });
    VEG_COMBOS.forEach((combo) => {
      expect(`${combo.id}=${daysAsWritten(combo)}`).toBe(`${combo.id}=${combo.typicalDays}`);
    });
  });

  it('keeps presets on the baseline or an explicit number', () => {
    Object.values(FERMENT_PRESETS).forEach((preset) => {
      expect(preset.typicalDays).toBeGreaterThan(0);
      expect(preset.typicalDays).toBeLessThanOrEqual(60);
      expect(findVeg(preset.defaultVegId).id).toBe(preset.defaultVegId);
    });
    expect(FERMENT_PRESETS.custom!.typicalDays).toBe(REFERENCE_DAYS);
  });
});

describe('the data matches the copy the user reads', () => {
  it('presets: typicalDays sits inside the range their tips quote', () => {
    const violations: string[] = [];
    const checked: string[] = [];
    Object.values(FERMENT_PRESETS).forEach((preset) => {
      const promised = promisedDays(preset);
      if (!promised) return; // sauerkraut is the reference ferment — see below
      violations.push(...timingViolations(preset.id, preset.typicalDays, promised));
      checked.push(preset.id);
    });
    expect(violations).toEqual([]);
    // Guard: most presets must carry a documented range, or this passes vacuously.
    expect(checked).toEqual(
      expect.arrayContaining(['kimchi', 'dill-pickles', 'carrot-sticks', 'hot-sauce', 'beet-kvass', 'radish-cauliflower']),
    );
    // Sauerkraut is the engine's reference ferment, so its anchor is
    // REFERENCE_DAYS rather than a quoted range.
    expect(FERMENT_PRESETS.sauerkraut!.typicalDays).toBe(REFERENCE_DAYS);
    expect(FERMENT_PRESETS.sauerkraut!.documentedDays).toBeUndefined();
  });

  it('combos: typicalDays sits inside the range their tips quote', () => {
    const violations: string[] = [];
    VEG_COMBOS.forEach((combo) => {
      const promised = promisedDays(combo);
      expect(`${combo.id}: ${promised ? 'ok' : 'NO DOCUMENTED RANGE'}`).toBe(`${combo.id}: ok`);
      violations.push(...timingViolations(combo.id, combo.typicalDays, promised));
    });
    expect(violations).toEqual([]);
  });

  it('the two combos that used to contradict their guidance now agree', () => {
    // Both inherited the neutral custom rate and overshot their own source
    // guidance — that range now lives in documentedDays rather than the copy.
    const cucumberOnion = VEG_COMBOS.find((c) => c.id === 'cucumber-onion-dill')!;
    expect(cucumberOnion.documentedDays).toEqual([3, 5]);
    expect(daysAsWritten(cucumberOnion)).toBe(4);

    const fruit = VEG_COMBOS.find((c) => c.id === 'mixed-ferment-fruit')!;
    expect(fruit.documentedDays).toEqual([2, 3]);
    expect(daysAsWritten(fruit)).toBe(3);
  });

  it('a pepper mash is slower than the same peppers in brine', () => {
    const hotSauce = FERMENT_PRESETS['hot-sauce']!;
    const jalapeno = findVeg('jalapeno');
    expect(hotSauce.typicalDays).toBe(10);
    // Same peppers, brined: the reference ferment scaled by the pepper rate.
    const brined = estimateFermentTiming(REFERENCE_TEMP, {
      typicalDays: REFERENCE_DAYS,
      vegSpeedRatio: relativeVegSpeed(jalapeno.speedFactor, findVeg('green-cabbage').speedFactor),
    }).days;
    expect(brined).toBeLessThan(hotSauce.typicalDays);
    expect(brined).toBeCloseTo(5.8, 1);
  });
});

describe('copy is aligned with the user\'s conditions, not a flat range', () => {
  const DAY_RANGE = /\d+\s*[–—-]\s*\d+\s*days?/i;

  it('no preset tip or description states a number of days', () => {
    const offenders: string[] = [];
    Object.values(FERMENT_PRESETS).forEach((preset) => {
      [...(preset.tips ?? []), preset.description].forEach((line) => {
        if (DAY_RANGE.test(line)) offenders.push(`${preset.id}: ${line}`);
      });
    });
    expect(offenders).toEqual([]);
  });

  it('no combo tip or description states a number of days', () => {
    const offenders: string[] = [];
    VEG_COMBOS.forEach((combo) => {
      [...combo.tips, combo.description].forEach((line) => {
        if (DAY_RANGE.test(line)) offenders.push(`${combo.id}: ${line}`);
      });
    });
    expect(offenders).toEqual([]);
  });

  it('still has the guidance on record, just not in the copy', () => {
    // The ranges exist as provenance — the guard above would be pointless if
    // the data had simply been deleted.
    const withRanges = Object.values(FERMENT_PRESETS).filter((p) => p.documentedDays);
    expect(withRanges.length).toBeGreaterThanOrEqual(7);
  });
});

describe('vegetable swaps scale the anchor instead of replacing it', () => {
  it('is unchanged when the recipe is used as written', () => {
    Object.values(FERMENT_PRESETS).forEach((preset) => {
      const ratio = relativeVegSpeed(presetReferenceSpeed(preset), presetReferenceSpeed(preset));
      expect(ratio).toBe(1);
    });
  });

  it('shortens the ferment for a faster vegetable and lengthens it for a slower one', () => {
    const sauerkraut = FERMENT_PRESETS.sauerkraut!;
    const reference = presetReferenceSpeed(sauerkraut); // green cabbage, 1.0

    const daikon = estimateFermentTiming(22, { typicalDays: sauerkraut.typicalDays, vegSpeedRatio: relativeVegSpeed(findVeg('daikon').speedFactor, reference) });
    const greenBeans = estimateFermentTiming(22, { typicalDays: sauerkraut.typicalDays, vegSpeedRatio: relativeVegSpeed(findVeg('green-beans').speedFactor, reference) });

    expect(daikon.days).toBeLessThan(sauerkraut.typicalDays);
    expect(greenBeans.days).toBeGreaterThan(sauerkraut.typicalDays);
  });

  it('weighs a mixed jar by mass', () => {
    // 3:1 cabbage:daikon — closer to cabbage than to pure daikon.
    const mixed = mixSpeedFactor([
      { vegId: 'green-cabbage', grams: 750 },
      { vegId: 'daikon', grams: 250 },
    ]);
    expect(mixed).toBeGreaterThan(findVeg('green-cabbage').speedFactor);
    expect(mixed).toBeLessThan(findVeg('daikon').speedFactor);
  });

  it('anchors a combo on the mix it actually applies', () => {
    VEG_COMBOS.forEach((combo) => {
      const applied = mixSpeedFactor(buildComboSetup(combo).vegMix);
      expect(Math.abs(applied - comboReferenceSpeed(combo))).toBeLessThan(1e-9);
    });
  });
});

describe('temperature stays a relative adjustment', () => {
  /** Estimates are rounded to 0.1 days. */
  const withinRounding = (actual: number, expected: number) => Math.abs(actual - expected) <= 0.1;

  it('scales whatever duration the recipe states, keeping its anchor', () => {
    const hotSauce = FERMENT_PRESETS['hot-sauce']!; // 10 days
    const sauerkraut = FERMENT_PRESETS.sauerkraut!; // 7 days

    expect(withinRounding(
      estimateFermentTiming(16, { typicalDays: hotSauce.typicalDays }).days,
      hotSauce.typicalDays * temperatureTimeFactor(16),
    )).toBe(true);
    expect(withinRounding(
      estimateFermentTiming(28, { typicalDays: sauerkraut.typicalDays }).days,
      sauerkraut.typicalDays * temperatureTimeFactor(28),
    )).toBe(true);
  });

  it('moves every recipe in the same direction', () => {
    Object.values(FERMENT_PRESETS).forEach((preset) => {
      expect(estimateFermentTiming(16, { typicalDays: preset.typicalDays }).days).toBeGreaterThan(preset.typicalDays);
      expect(estimateFermentTiming(28, { typicalDays: preset.typicalDays }).days).toBeLessThan(preset.typicalDays);
    });
  });
});
