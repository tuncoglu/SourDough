/**
 * Lazy sourdough method — the only bread method the app shows.
 *
 * One bowl, everything in at once: no autolyse, no kneading, no timed
 * stretch-and-fold schedule, no pre-shape or bench rest, no scoring. The
 * only numbers that depend on the user's conditions are the rise and proof
 * durations, which come from the fermentation engine; everything else is
 * fixed copy so the steps read the same every time.
 */
import { PROOF_FRACTION } from './calculations';
import { formatTemp, formatWeight } from './unitConversion';
import type { UnitSystem } from '../models/types';

export type LazyVessel = 'cocotte' | 'tin';

export interface LazyStep {
  key: 'feed' | 'mix' | 'rise' | 'shape' | 'proof' | 'bake' | 'cool';
  title: string;
  /** Short duration label shown beside the title. */
  duration: string;
  body: string;
  /** Optional secondary line (safety note, optional extra). */
  aside?: string;
}

export const LAZY_BAKE = {
  cocotte: { ovenTempC: 240, preheatMinutes: 30, lidOnMinutes: 25, lidOffMinutes: '15–20', totalMinutes: 45 },
  tin: { ovenTempC: 220, bakeMinutes: '40–45', totalMinutes: 45 },
} as const;

/** Flour and water (each) to refresh the jar with after taking starter out. */
export const STARTER_FEED_GRAMS = 50;

/** Defaults for a first loaf: 75% water, 20% starter, 2% salt. */
export const LAZY_DEFAULTS = { waterPct: 75, starterPct: 20 } as const;

/** Hours rounded to the nearest half hour, at least half an hour. */
export function roundToHalfHour(hours: number): number {
  return Math.max(0.5, Math.round(hours * 2) / 2);
}

export function formatHours(hours: number): string {
  const h = roundToHalfHour(hours);
  return `${Number.isInteger(h) ? h.toFixed(0) : h.toFixed(1)} h`;
}

export function lazyProofHours(bulkHours: number): number {
  return roundToHalfHour(bulkHours * PROOF_FRACTION);
}

export function buildLazySteps(
  vessel: LazyVessel,
  bulkHours: number | null,
  unitSystem: UnitSystem,
  options: {
    /**
     * The starter was fed to its peak beforehand (see `buildFeedStep`), so the
     * jar needs no second feed after mixing.
     */
    starterFed?: boolean;
  } = {},
): LazyStep[] {
  const rise = bulkHours != null ? `about ${formatHours(bulkHours)}` : 'several hours';
  const proof = bulkHours != null
    ? `about ${formatHours(lazyProofHours(bulkHours))}, or overnight`
    : 'a few hours, or overnight';

  const shapeBody = vessel === 'cocotte'
    ? 'Wet your hands. Tip the dough onto the counter, tuck the edges underneath to make a rough ball, and lift it onto a sheet of baking paper in a bowl.'
    : 'Line a loaf tin with baking paper. Wet your hands, fold the dough over itself once or twice and drop it into the tin, seam down. No shaping skill needed.';

  const c = LAZY_BAKE.cocotte;
  const t = LAZY_BAKE.tin;
  const bake: LazyStep = vessel === 'cocotte'
    ? {
      key: 'bake',
      title: 'Bake',
      duration: `${formatTemp(c.ovenTempC, unitSystem, 0)} · ${c.totalMinutes} min`,
      body: `Heat the oven with the cocotte inside to ${formatTemp(c.ovenTempC, unitSystem, 0)} for ${c.preheatMinutes} minutes. Lift the dough in by its paper, put the lid on and bake ${c.lidOnMinutes} minutes. Take the lid off and bake ${c.lidOffMinutes} minutes more, until deep brown.`,
      aside: 'The pot is very hot. Use thick oven gloves.',
    }
    : {
      key: 'bake',
      title: 'Bake',
      duration: `${formatTemp(t.ovenTempC, unitSystem, 0)} · ${t.totalMinutes} min`,
      body: `Heat the oven to ${formatTemp(t.ovenTempC, unitSystem, 0)}. Bake ${t.bakeMinutes} minutes, until deep brown on top. If the sides are pale, lift the loaf out by its paper for the last 5 minutes.`,
    };

  return [
    {
      key: 'mix',
      title: 'Mix',
      duration: 'about 5 min',
      body: "Stir the starter, water and salt together in a large bowl. Add the flour and mix with a spoon or your hand until no dry flour is left. It will look shaggy. That's fine. Cover the bowl.",
      aside: options.starterFed
        ? 'The starter left in the jar was fed with it and is at its peak too. It goes straight back into the fridge. No second feed.'
        : `Feed what's left in your starter jar with equal weights of flour and water (about ${formatWeight(STARTER_FEED_GRAMS, unitSystem, unitSystem === 'imperial' ? 1 : 0)} of each), stir, and put it back in the fridge.`,
    },
    {
      key: 'rise',
      title: 'Rise',
      duration: rise,
      body: 'Leave it covered on the counter. It is ready when it has roughly doubled, the top is domed with bubbles, and it jiggles when you shake the bowl. The dough decides, not the clock.',
      aside: 'Walking past? One stretch and fold helps, but you can skip it.',
    },
    { key: 'shape', title: 'Shape', duration: 'about 2 min', body: shapeBody },
    {
      key: 'proof',
      title: 'Proof',
      duration: proof,
      body: 'Cover and leave until puffy and a floured finger leaves a dent that springs back slowly. Or put it straight in the fridge and bake tomorrow, straight from cold.',
    },
    bake,
    {
      key: 'cool',
      title: 'Cool',
      duration: '1 h',
      body: 'Cool on a rack for at least an hour before slicing. The crumb is still setting.',
    },
  ];
}

/** One-line bake summary for sharing a loaf as text. */
export function lazyBakeSummary(vessel: LazyVessel, unitSystem: UnitSystem): string {
  return vessel === 'cocotte'
    ? `Bake in a preheated cocotte at ${formatTemp(LAZY_BAKE.cocotte.ovenTempC, unitSystem, 0)}: ${LAZY_BAKE.cocotte.lidOnMinutes} min lid on, ${LAZY_BAKE.cocotte.lidOffMinutes} min lid off`
    : `Bake in a paper-lined loaf tin at ${formatTemp(LAZY_BAKE.tin.ovenTempC, unitSystem, 0)} for ${LAZY_BAKE.tin.bakeMinutes} min`;
}

/**
 * The optional first step: feed the starter so it is at its peak when the
 * dough is mixed. It comes before the six fixed steps and is part of choosing
 * how to use the starter, not a second bread method; the six steps stay as
 * they are.
 */
export function buildFeedStep(opts: {
  /** Hours from the feed to the starter's peak (see starterTimeToPeakHours). */
  leadHours: number;
  roomTempC: number;
  /** What to feed (see starterFeedAmounts). */
  keptGrams: number;
  flourGrams: number;
  waterGrams: number;
  /** Peaked starter the dough takes. */
  neededGrams: number;
  unitSystem: UnitSystem;
}): LazyStep {
  const { unitSystem } = opts;
  const decimals = unitSystem === 'imperial' ? 1 : 0;
  const g = (n: number) => formatWeight(n, unitSystem, decimals);
  const lead = formatHours(opts.leadHours);
  return {
    key: 'feed',
    title: 'Feed',
    duration: `about ${lead} to peak`,
    body:
      `Take the jar out of the fridge. Keep ${g(opts.keptGrams)} of starter in it, stir in ${g(opts.flourGrams)} of flour and ${g(opts.waterGrams)} of water, ` +
      `cover loosely and leave it on the counter. At ${formatTemp(opts.roomTempC, unitSystem, 0)} it peaks after about ${lead}, domed and bubbly. ` +
      `Then ${g(opts.neededGrams)} goes in the dough and the rest stays in the jar. A warmer kitchen gets there sooner.`,
  };
}
