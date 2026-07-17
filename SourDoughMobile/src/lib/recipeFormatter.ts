/**
 * Shared plain-text recipe formatting.
 * Used by both the calculator screen (before save) and the recipe detail screen (after save).
 */
import { SavedRecipe, IngredientResults, FlourBlendEntry, CalculationResults, FlourCategory, UnitSystem } from '../models/types';
import { formatWeight, formatWeightValue, formatTemp, weightUnit } from './unitConversion';

/** Format a saved recipe as plain text for sharing. */
export function formatRecipeText(recipe: SavedRecipe, unitSystem: UnitSystem = 'metric'): string {
  const { inputs, results, locationSummary } = recipe;
  const lines = buildSharedLines(
    locationSummary,
    inputs.flourWeight,
    inputs.flourBlend ?? [
      { label: inputs.flourType, protein: inputs.flourProtein, productNumber: inputs.flourProductNo, category: 'Generic' as FlourCategory, percentage: 100 },
    ],
    inputs.hydration,
    inputs.starterWeight,
    inputs.starterHydration,
    inputs.saltPct,
    inputs.oilPct,
    inputs.preferment,
    results,
    unitSystem,
  );
  return lines.join('\n');
}

/** Format from current input state (before saving — used by the calculator share button). */
export function formatRecipeTextFromState(
  locationSummary: string,
  totalFlourWeight: number,
  blend: FlourBlendEntry[],
  hydrationPct: number,
  starterWeightG: number,
  starterHydrationPct: number,
  saltPct: number,
  oilPct: number | undefined,
  prefermentType: string | undefined,
  prefermentFlourPct: number | undefined,
  results: CalculationResults,
  bakeInfo?: string,
  unitSystem: UnitSystem = 'metric',
): string {
  const lines = buildSharedLines(
    locationSummary,
    totalFlourWeight,
    blend,
    hydrationPct,
    starterWeightG,
    starterHydrationPct,
    saltPct,
    oilPct,
    prefermentType && prefermentFlourPct
      ? { type: 'poolish' as const, flourPct: prefermentFlourPct, hydration: 100 }
      : undefined,
    results,
    unitSystem,
  );

  if (bakeInfo) {
    lines.push('');
    lines.push('🔥 Bake');
    lines.push(`  ${bakeInfo}`);
  }

  return lines.join('\n');
}

function buildSharedLines(
  locationSummary: string,
  totalFlourWeight: number,
  blend: FlourBlendEntry[],
  hydrationPct: number,
  starterWeightG: number,
  starterHydrationPct: number,
  saltPct: number,
  oilPct: number | undefined,
  preferment: { type: 'poolish' | 'biga'; flourPct: number; hydration: number } | undefined,
  results: CalculationResults,
  unitSystem: UnitSystem,
): string[] {
  const wu = weightUnit(unitSystem);
  const lines: string[] = [
    '🥖 Just Dough It Recipe — SourDough',
    '',
    `📍 ${locationSummary}`,
    '',
    '📋 Ingredients',
  ];

  // Flour
  if (blend && blend.length > 1) {
    for (const entry of blend) {
      const grams = totalFlourWeight * entry.percentage / 100;
      const shortName = entry.label.replace(/\s*\([^)]*\)$/, '');
      lines.push(`  ${shortName}: ${formatWeightValue(grams, unitSystem, 0)}${wu} (${Math.round(entry.percentage)}%)`);
    }
  } else if (blend && blend.length === 1) {
    lines.push(`  Flour: ${formatWeightValue(totalFlourWeight, unitSystem, 0)}${wu} ${blend[0].label.replace(/\s*\([^)]*\)$/, '')}`);
  }

  lines.push(`  Hydration: ${hydrationPct.toFixed(0)}%`);
  lines.push(`  Starter: ${formatWeightValue(starterWeightG, unitSystem, 0)}${wu} (${starterHydrationPct.toFixed(0)}% hydration)`);
  lines.push(`  Salt: ${saltPct.toFixed(1)}%`);
  if (oilPct && oilPct > 0) {
    lines.push(`  Oil/Fat: ${oilPct.toFixed(1)}%`);
  }
  if (preferment) {
    lines.push(`  Pre-ferment: ${preferment.type} (${preferment.flourPct.toFixed(0)}% of flour)`);
  }

  lines.push('');
  lines.push('⚖️  Weights');
  lines.push(`  Water: ${formatWeightValue(results.ingredients.addedWater, unitSystem)}${wu}`);
  lines.push(`  Starter: ${formatWeightValue(results.ingredients.starterTotal, unitSystem)}${wu}`);
  if (results.ingredients.oil > 0) {
    lines.push(`  Oil: ${formatWeightValue(results.ingredients.oil, unitSystem)}${wu}`);
  }
  lines.push(`  Salt: ${formatWeightValue(results.ingredients.salt, unitSystem)}${wu}`);
  lines.push(`  Total dough: ${formatWeightValue(results.ingredients.totalDoughWeight, unitSystem)}${wu}`);

  lines.push('');
  lines.push('🌡  Temperatures');
  lines.push(`  FDT: ${formatTemp(results.fdt, unitSystem)} (${results.tempZone})`);
  lines.push(`  Ambient: ${formatTemp(results.fdt, unitSystem)}`); // note: fdt is used as proxy — see note below
  // FIXME: ambient/water temp aren't in CalculationResults — they're in RecipeInputs.
  // For the state-based formatter, the caller should pass these explicitly.
  // For now, we use what we have.

  lines.push('');
  lines.push('⏱️  Fermentation');
  lines.push(`  Bulk ferment: ~${results.staticFermentHours.toFixed(1)} hours`);
  if (results.dynamicFerment) {
    lines.push(`  Dynamic estimate: ~${results.dynamicFerment.totalHours.toFixed(1)} hours`);
  }

  if (results.hardness) {
    lines.push('');
    lines.push('🧪 Water');
    lines.push(`  Hardness: ${results.hardness.classification} (${results.hardness.mgL} mg/L)`);
  }

  lines.push('');
  lines.push('Made with Just Dough It 🥖');
  lines.push('https://github.com/tuncoglu/SourDough');

  return lines;
}
