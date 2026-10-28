/**
 * Timing responsiveness tests.
 *
 * A recipe's `typicalDays` is an anchor, not an answer: it is the duration at
 * 22 °C, the recipe's own vegetables, its own salt level and the reference
 * water hardness. Everything the user's kitchen does differently must move
 * the number — and each factor must be exactly 1 at the reference conditions
 * so a recipe used as written still returns its documented duration.
 */
import {
  estimateFermentTiming,
  labRelativeRate,
  saltStopsFermentation,
  saltTimeFactor,
  SALT_OPTIMUM_PCT,
  temperatureTimeFactor,
  waterHardnessTimeFactor,
  LAB_CARDINAL,
  REFERENCE_DAYS,
  REFERENCE_HARDNESS_MGL,
} from '../src/lib/lactoCalculations';
import { FERMENT_PRESETS, VEG_COMBOS } from '../src/data/fermentPresets';
import { PREP_SIZE_ORDER, PREP_TIME_FACTOR } from '../src/models/types';
import { FALLBACK_HARDNESS } from '../src/lib/hardnessUtils';
import { VEGETABLES, findVeg } from '../src/data/vegetables';
import { recommendedSaltPct } from '../src/lib/fermentSetup';
import { waterHardnessFermentAdvice } from '../src/lib/lactoCalculations';

const RECIPE = { typicalDays: 10 };

describe('temperature (cardinal / Ratkowsky model)', () => {
  it('is neutral at the 22°C reference', () => {
    expect(labRelativeRate(22)).toBeCloseTo(1, 6);
    expect(temperatureTimeFactor(22)).toBeCloseTo(1, 6);
  });

  it('accelerates from cold towards the optimum, then decelerates', () => {
    // Monotonic rise up to Topt ...
    expect(labRelativeRate(10)).toBeLessThan(labRelativeRate(16));
    expect(labRelativeRate(16)).toBeLessThan(labRelativeRate(22));
    expect(labRelativeRate(22)).toBeLessThan(labRelativeRate(28));
    expect(labRelativeRate(28)).toBeLessThan(labRelativeRate(LAB_CARDINAL.tOpt));
    // ... and a real decline beyond it: a hot kitchen is SLOWER, not faster.
    expect(labRelativeRate(35)).toBeLessThan(labRelativeRate(LAB_CARDINAL.tOpt));
    expect(labRelativeRate(40)).toBeLessThan(labRelativeRate(35));
    expect(labRelativeRate(44)).toBeLessThan(labRelativeRate(40));
  });

  it('converges on zero at both cardinal limits', () => {
    expect(labRelativeRate(LAB_CARDINAL.tMin)).toBe(0);
    expect(labRelativeRate(LAB_CARDINAL.tMax)).toBe(0);
    expect(labRelativeRate(-5)).toBe(0);
    expect(labRelativeRate(60)).toBe(0);
  });

  it('stalls in a domestic fridge instead of extrapolating a Q10 curve', () => {
    // The old Q10 model finished a 10-day ferment in 60 days at 2°C.
    [0, 2, 4, 6, 8].forEach((t) => {
      const timing = estimateFermentTiming(t, RECIPE);
      expect(`at ${t}°C: ${timing.stalled}`).toBe(`at ${t}°C: true`);
      expect(timing.stallReason).toBe('cold');
    });
  });

  it('flags a ferment that is too hot to succeed rather than calling it fast', () => {
    const hot = estimateFermentTiming(45, RECIPE);
    expect(hot.stalled).toBe(true);
    expect(hot.stallReason).toBe('hot');
    // 35-40°C is slow-but-possible; it must not be reported as faster than 32°C.
    expect(estimateFermentTiming(38, RECIPE).days).toBeGreaterThan(estimateFermentTiming(32, RECIPE).days);
  });

  it('keeps a realistic ratio between a cool room and the reference', () => {
    // Practical sauerkraut guidance: ~1-2 weeks at 22°C vs ~4-6 weeks at 10-12°C.
    // Practical sauerkraut: ~1–2 weeks at 22 °C vs ~4–6 weeks at 10–12 °C,
    // and Pederson & Albury saw 6+ months at 7.5 °C. The model should sit
    // between the coarse band and the field data.
    const ratio = estimateFermentTiming(11, RECIPE).days / RECIPE.typicalDays;
    expect(ratio).toBeGreaterThan(3);
    expect(ratio).toBeLessThan(8);
  });

  it('moves the headline number for a real recipe', () => {
    expect(estimateFermentTiming(22, RECIPE).days).toBe(10);
    expect(estimateFermentTiming(16, RECIPE).days).toBeCloseTo(23.0, 1);
    expect(estimateFermentTiming(28, RECIPE).days).toBeCloseTo(6.0, 1);
    expect(estimateFermentTiming(32, RECIPE).days).toBeCloseTo(5.0, 1);
    // A 16 °C kitchen is the common real-world case, and 2.2–2.7× is what
    // three independent measurements say. Guard the ratio itself.
    const ratio16 = estimateFermentTiming(16, RECIPE).days / RECIPE.typicalDays;
    expect(ratio16).toBeGreaterThan(2.2);
    expect(ratio16).toBeLessThan(2.7);
  });
});

describe('salt (U-shaped, optimum ~2.25%)', () => {
  it('is flat across the working band, not relative to the recipe', () => {
    expect(saltTimeFactor(1.5)).toBe(1);
    expect(saltTimeFactor(2.0)).toBe(1);
    expect(saltTimeFactor(SALT_OPTIMUM_PCT)).toBe(1);
    expect(saltTimeFactor(2.75)).toBe(1);
    // Stamer 1971: 3.5% costs +33–67% generation time; the curve must show it.
    expect(saltTimeFactor(3.5)).toBeGreaterThan(1.3);
  });

  it('slows the ferment when salted ABOVE the optimum', () => {
    // Stamer 1971 pins 3.5% at +33–67%; Xiong 2016 pins 5% at +50% onset and
    // 8% at 3×. The curve must respect both ends.
    expect(saltTimeFactor(3.5, 2.0)).toBeGreaterThan(1.3);
    expect(saltTimeFactor(3.5, 2.0)).toBeLessThan(1.7);
    expect(saltTimeFactor(5.0, 2.0)).toBeGreaterThan(saltTimeFactor(3.5, 2.0));
    expect(saltTimeFactor(8.0, 2.0)).toBeGreaterThan(2.5);
  });

  it('also slows it BELOW the optimum — a low-salt jar is not a fast jar', () => {
    // Yang 2020: acidification is fastest near 2.5% and slower on both sides.
    expect(saltTimeFactor(1.0, 2.25)).toBeGreaterThan(1);
    expect(saltTimeFactor(0.5, 2.25)).toBeGreaterThan(saltTimeFactor(1.0, 2.25));
    // ... and the app must never present under-salting as a shortcut.
    expect(estimateFermentTiming(22, { ...RECIPE, saltPct: 1.0, recipeSaltPct: 2.25 }).days)
      .toBeGreaterThan(estimateFermentTiming(22, { ...RECIPE, saltPct: 2.25, recipeSaltPct: 2.25 }).days);
  });

  it('is clamped so one extreme input cannot dominate the estimate', () => {
    expect(saltTimeFactor(20, 2.25)).toBe(3.0);
    expect(saltTimeFactor(0.1, 2.25)).toBeLessThanOrEqual(1.6);
    // ... and the same jar measured against a salty recipe is not penalised twice.
    expect(saltTimeFactor(4.0, 4.0)).toBe(1);
  });

  it('stops the ferment near 10% salt', () => {
    expect(saltStopsFermentation(10)).toBe(true);
    expect(saltStopsFermentation(4)).toBe(false);
  });

  it('ignores a missing salt value', () => {
    expect(saltTimeFactor(0)).toBe(1);
  });

  it('moves the headline number for a real recipe', () => {
    expect(estimateFermentTiming(22, { ...RECIPE, saltPct: 2.25, recipeSaltPct: 2.25 }).days).toBe(10);
    expect(estimateFermentTiming(22, { ...RECIPE, saltPct: 8, recipeSaltPct: 2.25 }).days).toBeGreaterThan(25);
    // The classic 2% dry-salt kraut must not be penalised as "mis-salted".
    expect(estimateFermentTiming(22, { ...RECIPE, saltPct: 2, recipeSaltPct: 2 }).days).toBe(10);
  });

  it('never penalises the salt level the app itself recommends', () => {
    // The prefilled/recommended level is what a user who follows the app
    // will actually use — it must not read as "you salted wrong".
    VEGETABLES.forEach((veg) => {
      (['dry', 'brine', 'mash'] as const).forEach((method) => {
        const recommended = recommendedSaltPct(veg, method);
        const factor = saltTimeFactor(recommended, recommended);
        expect(`${veg.id}/${method}: ${recommended}%`).toBe(`${veg.id}/${method}: ${recommended}%`);
        expect(factor).toBe(1);
      });
    });
  });
});

describe('water chemistry', () => {
  it('is neutral at the reference hardness', () => {
    expect(waterHardnessTimeFactor(REFERENCE_HARDNESS_MGL, true)).toBe(1);
  });

  it('matches the app-wide fallback assumption, so the two cannot drift', () => {
    expect(FALLBACK_HARDNESS.mgL).toBe(REFERENCE_HARDNESS_MGL);
  });

  it('sours marginally faster in soft water and slower in hard water', () => {
    expect(waterHardnessTimeFactor(40, true)).toBeLessThan(1);
    expect(waterHardnessTimeFactor(300, true)).toBeGreaterThan(1);
  });

  it('agrees with the advice copy shown next to it', () => {
    // The water card tells the user soft water "may sour slightly faster";
    // the model must not disagree with the sentence the user just read.
    const soft = waterHardnessFermentAdvice({ mgL: 40, classification: 'soft', note: '' }).join(' ');
    expect(soft.toLowerCase()).toContain('faster');
    expect(waterHardnessTimeFactor(40, true)).toBeLessThan(waterHardnessTimeFactor(300, true));
  });

  it('stays inside the mass-balance bound — hardness is mostly about texture', () => {
    // 1.2-3 meq/L of alkalinity against ~50-120 mmol/L of acid needed to
    // reach pH 4.6 is a few percent at most; the cap enforces that.
    expect(waterHardnessTimeFactor(0, true)).toBeGreaterThanOrEqual(0.97);
    expect(waterHardnessTimeFactor(2000, true)).toBeLessThanOrEqual(1.03);
  });

  it('does not apply when the ferment uses no added water', () => {
    // A dry-salted kraut or a pepper mash contains only the vegetable's own
    // cell water — the tap never touches it.
    expect(waterHardnessTimeFactor(40, false)).toBe(1);
    expect(waterHardnessTimeFactor(600, false)).toBe(1);
    expect(estimateFermentTiming(22, { ...RECIPE, hardnessMgL: 600, usesAddedWater: false }).days).toBe(10);
    expect(estimateFermentTiming(22, { ...RECIPE, hardnessMgL: 600, usesAddedWater: true }).days).toBeGreaterThan(10);
  });

  it('ignores unknown hardness', () => {
    expect(waterHardnessTimeFactor(null, true)).toBe(1);
    expect(waterHardnessTimeFactor(undefined, true)).toBe(1);
  });
});

describe('prep size (first-order, measured)', () => {
  it('matches the measured shredded-vs-whole contrast', () => {
    // Niksic et al. 2005: shredded cabbage 15 days, whole heads 28 days.
    expect(PREP_TIME_FACTOR.whole / PREP_TIME_FACTOR.shredded).toBeCloseTo(28 / 15, 2);
  });

  it('is monotonic — a finer cut never ferments slower', () => {
    // Non-decreasing rather than strictly increasing: grated and shredded tie.
    const ladder = PREP_SIZE_ORDER.map((p) => PREP_TIME_FACTOR[p]);
    for (let i = 1; i < ladder.length; i++) {
      expect(ladder[i]).toBeGreaterThanOrEqual(ladder[i - 1]);
    }
    expect(ladder[ladder.length - 1]).toBeGreaterThan(ladder[0]);
  });

  it('is neutral when the user cuts it the way the recipe is written', () => {
    const asWritten = estimateFermentTiming(22, {
      ...RECIPE, prepSize: 'shredded', referencePrep: 'shredded',
    });
    expect(asWritten.days).toBe(10);
    expect(asWritten.factors.map((f) => f.id)).not.toContain('prep');
  });

  it('moves the estimate when the user deviates, in the right direction', () => {
    const shredded = estimateFermentTiming(22, { ...RECIPE, prepSize: 'shredded', referencePrep: 'sliced' });
    const whole = estimateFermentTiming(22, { ...RECIPE, prepSize: 'whole', referencePrep: 'sliced' });
    expect(shredded.days).toBeLessThan(10);
    expect(whole.days).toBeGreaterThan(10);
    expect(whole.days / shredded.days).toBeCloseTo(1.875, 1);
  });

  it('explains itself in the breakdown', () => {
    const timing = estimateFermentTiming(22, { ...RECIPE, prepSize: 'whole', referencePrep: 'shredded' });
    const prep = timing.factors.find((f) => f.id === 'prep');
    expect(prep).toBeDefined();
    expect(prep!.factor).toBeGreaterThan(1);
    expect(prep!.label).toContain('coarser');
    expect(prep!.detail).toContain('diffuse');
  });

  it('never extrapolates beyond the measured range', () => {
    // The ladder is anchored on shredded vs whole = 28/15 (Niksic 2005). An
    // earlier version invented 0.65 for "grated", which turned whole-vs-grated
    // into a 2.3x penalty on a mash recipe — bigger than any measured effect.
    const factors = PREP_SIZE_ORDER.map((p) => PREP_TIME_FACTOR[p]);
    expect(Math.max(...factors) / Math.min(...factors)).toBeCloseTo(28 / 15, 3);
  });

  it('treats grated and shredded alike — no study separates them', () => {
    expect(PREP_TIME_FACTOR.grated).toBe(PREP_TIME_FACTOR.shredded);
  });

  it('every recipe declares the prep its duration assumes', () => {
    Object.values(FERMENT_PRESETS).forEach((preset) => {
      expect(`${preset.id}: ${PREP_SIZE_ORDER.includes(preset.referencePrep)}`).toBe(`${preset.id}: true`);
    });
    VEG_COMBOS.forEach((combo) => {
      expect(`${combo.id}: ${PREP_SIZE_ORDER.includes(combo.referencePrep)}`).toBe(`${combo.id}: true`);
    });
  });
});

describe('factors compose, and explain themselves', () => {
  it('multiplies the anchor by every applied factor', () => {
    const timing = estimateFermentTiming(16, {
      typicalDays: 10,
      saltPct: 4.5,
      hardnessMgL: 300,
      usesAddedWater: true,
    });
    const product = timing.factors.reduce((p, f) => p * f.factor, 1);
    expect(timing.days).toBeCloseTo(10 * product, 1);
    expect(timing.factors.map((f) => f.id)).toEqual(['temperature', 'salt', 'water']);
  });

  it('reports the recipe baseline alongside the adjusted result', () => {
    const timing = estimateFermentTiming(16, RECIPE);
    expect(timing.referenceDays).toBe(10);
    expect(timing.days).toBeGreaterThan(timing.referenceDays);
    expect(timing.tempC).toBe(16);
  });

  it('always explains the temperature, and omits factors that changed nothing', () => {
    const flat = estimateFermentTiming(22, {
      typicalDays: 10,
      saltPct: 2.5,
      recipeSaltPct: 2.5,
      hardnessMgL: REFERENCE_HARDNESS_MGL,
      usesAddedWater: true,
      vegSpeedRatio: 1,
    });
    expect(flat.factors).toHaveLength(1);
    expect(flat.factors[0].id).toBe('temperature');
    expect(flat.factors[0].factor).toBeCloseTo(1, 6);
    expect(flat.days).toBe(10);
  });

  it('labels every factor for the user', () => {
    const timing = estimateFermentTiming(16, {
      typicalDays: 7,
      saltPct: 4,
      hardnessMgL: 40,
      usesAddedWater: true,
      vegSpeedRatio: 1.5,
    });
    timing.factors.forEach((f) => {
      expect(f.label.length).toBeGreaterThan(3);
      expect(f.detail.length).toBeGreaterThan(20);
      expect(Number.isFinite(f.factor)).toBe(true);
    });
  });
});

describe('the anchor survives every adjustment', () => {
  it('returns exactly typicalDays at 22°C, reference water, own salt, own veg', () => {
    Object.values(FERMENT_PRESETS).forEach((preset) => {
      const recipeSalt = recommendedSaltPct(findVeg(preset.defaultVegId), preset.method);
      const timing = estimateFermentTiming(22, {
        typicalDays: preset.typicalDays,
        saltPct: recipeSalt,
        recipeSaltPct: recipeSalt,
        hardnessMgL: REFERENCE_HARDNESS_MGL,
        usesAddedWater: preset.method === 'brine',
        vegSpeedRatio: 1,
      });
      expect(`${preset.id}=${timing.days}`).toBe(`${preset.id}=${preset.typicalDays}`);
    });
    VEG_COMBOS.forEach((combo) => {
      const timing = estimateFermentTiming(22, {
        typicalDays: combo.typicalDays,
        saltPct: combo.typicalSaltPct,
        recipeSaltPct: combo.typicalSaltPct,
        hardnessMgL: REFERENCE_HARDNESS_MGL,
        usesAddedWater: combo.method === 'brine',
        vegSpeedRatio: 1,
      });
      expect(`${combo.id}=${timing.days}`).toBe(`${combo.id}=${combo.typicalDays}`);
    });
  });

  it('keeps the ±40% window around the adjusted number, not the anchor', () => {
    const timing = estimateFermentTiming(16, RECIPE);
    // (Values are rounded to 0.1 day, hence the bands rather than equality.)
    expect(timing.daysMin).toBeGreaterThan(timing.days * 0.55);
    expect(timing.daysMin).toBeLessThan(timing.days * 0.65);
    expect(timing.daysMax).toBeGreaterThan(timing.days * 1.35);
    expect(timing.daysMax).toBeLessThan(timing.days * 1.45);
  });

  it('still respects the global clamps', () => {
    const cold = estimateFermentTiming(-5, { typicalDays: 30 });
    expect(cold.days).toBeLessThanOrEqual(60);
    const hot = estimateFermentTiming(45, { typicalDays: 1 });
    expect(hot.days).toBeGreaterThanOrEqual(1);
  });
});

describe('a worked example end to end', () => {
  it('hot sauce in a cool kitchen with soft water and a heavy salt hand', () => {
    const hotSauce = FERMENT_PRESETS['hot-sauce']!;
    const timing = estimateFermentTiming(15, {
      typicalDays: hotSauce.typicalDays,
      saltPct: 4.5,
      recipeSaltPct: 3.0,
      hardnessMgL: 35,
      usesAddedWater: hotSauce.method === 'brine', // mash: no added water
      vegSpeedRatio: 1,
    });

    // Mash uses no added water, so water hardness must not appear at all.
    expect(timing.factors.map((f) => f.id)).toEqual(['temperature', 'salt']);
    expect(timing.referenceDays).toBe(10);
    // 10 days × tempFactor(15 °C) × the salt penalty for 4.5%
    const expected = 10 * temperatureTimeFactor(15) * saltTimeFactor(4.5, 3.0);
    expect(timing.days).toBeCloseTo(expected, 0);
    // The salt penalty is a real, evidence-backed effect at this level.
    expect(saltTimeFactor(4.5, 3.0)).toBeGreaterThan(1.3);
  });

  it('same peppers, brined, in the same kitchen', () => {
    const kitchen = { saltPct: 3.5, hardnessMgL: 35, usesAddedWater: true };
    const peppers = estimateFermentTiming(15, {
      ...kitchen,
      typicalDays: REFERENCE_DAYS,
      vegSpeedRatio: findVeg('jalapeno').speedFactor / findVeg('green-cabbage').speedFactor,
    });
    const cabbage = estimateFermentTiming(15, {
      ...kitchen,
      typicalDays: REFERENCE_DAYS,
      vegSpeedRatio: 1,
    });

    // The same cool, soft-water kitchen — the faster vegetable is what
    // shortens the ferment, and all three adjustments are reported.
    // Hardness is now correctly tiny (≈1%), so it may not clear the display
    // threshold; the vegetable factor is the one doing the visible work.
    const ids = peppers.factors.map((f) => f.id);
    expect(ids).toContain('temperature');
    expect(ids).toContain('vegetables');
    // 3.5% is above the flat band, so it is reported (and identical for both
    // jars, which is why it does not change the comparison).
    expect(peppers.factors.find((f) => f.id === 'salt')).toBeDefined();
    expect(peppers.days).toBeLessThan(cabbage.days);
    expect(peppers.factors.find((f) => f.id === 'vegetables')!.factor).toBeLessThan(1);
  });
});
