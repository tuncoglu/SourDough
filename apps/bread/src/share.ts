import type { BreadForm, BreadPlan } from '@sourdough/calc/lib/breadPlan';
import { formatHours, lazyBakeSummary } from '@sourdough/calc/lib/lazyMethod';
import { formatWeight } from '@sourdough/calc/lib/unitConversion';
import type { Units } from '@sourdough/core/settings';

/** The loaf as plain text, for sharing or copying. */
export function loafText(form: BreadForm, plan: BreadPlan, units: Units): string | null {
  const est = plan.chosen?.estimate;
  if (!est) return null;
  const ing = est.results.ingredients;
  const w = (g: number) => formatWeight(g, units, units === 'imperial' ? 1 : 0);
  const lines = [
    'Lazy sourdough',
    '',
    ...(plan.flourRows.length > 1 ? plan.flourRows.map((r) => `${r.flour.label}: ${w(r.grams)}`) : [`Flour: ${w(plan.flourGrams)} ${plan.flourRows[0]?.flour.label ?? ''}`.trim()]),
    `Water: ${w(ing.addedWater)} (${form.waterPct} %)`,
    `Starter: ${w(ing.starterTotal)} (${form.starterPct} %, ${form.starterHydration} % hydration${plan.fed ? ', fed first and mixed at its peak' : ', from the fridge'})`,
    `Salt: ${w(ing.salt)} (${form.saltPct} %)`,
    `Dough: ${w(est.doughGrams)}`,
    '',
    `Rise: about ${formatHours(est.bulkHours)} (an estimate; judge by the dough)`,
    form.proofMode === 'fridge' ? `Proof: ${form.fridgeHours} h in the fridge, bake from cold` : `Proof: about ${formatHours(est.proofHours)} on the counter`,
    lazyBakeSummary(form.vessel, units),
    '',
    'Mix everything in one bowl, no kneading. Guidance, not guarantee.',
  ];
  return lines.join('\n');
}

export type ShareResult = 'shared' | 'copied' | 'failed';

/** Use the device's share sheet if there is one, else copy to the clipboard. */
export async function shareText(text: string): Promise<ShareResult> {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ text });
      return 'shared';
    }
  } catch (e) {
    // Closing the share sheet is not a failure.
    if ((e as { name?: string })?.name === 'AbortError') return 'failed';
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
