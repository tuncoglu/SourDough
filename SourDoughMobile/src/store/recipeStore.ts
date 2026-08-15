import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedRecipe } from '../models/types';

const RECIPES_KEY = 'sourdough_recipes';

/** Load all saved recipes, newest first */
export async function loadRecipes(): Promise<SavedRecipe[]> {
  try {
    const json = await AsyncStorage.getItem(RECIPES_KEY);
    if (!json) return [];
    const recipes: SavedRecipe[] = JSON.parse(json);
    return recipes.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch {
    return [];
  }
}

// Serialize read-modify-write cycles through a module-level promise
// chain. Two rapid saves (double-tap, or save while a delete runs) both
// read the same base list; without this the later writer clobbers the
// earlier one and loses user data.
let writeQueue: Promise<unknown> = Promise.resolve();
function serialized<T>(op: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(op, op);
  writeQueue = run.then(() => undefined, () => undefined);
  return run;
}

/** Save a recipe (appends to start). Resolves true when the history cap
 *  trimmed the oldest entries, so callers can tell the user. */
export function saveRecipe(recipe: SavedRecipe): Promise<boolean> {
  return serialized(async () => {
    const recipes = await loadRecipes();
    recipes.unshift(recipe);
    // Keep max 200 recipes
    const trimmed = recipes.length > 200;
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes.slice(0, 200)));
    return trimmed;
  });
}

/**
 * Save a recipe, replacing any existing recipe with the same id in place.
 * Used by the edit flow — editing a saved recipe must update it, not
 * duplicate it. The original creation date is preserved so history
 * ordering stays stable.
 */
export function updateRecipe(recipe: SavedRecipe): Promise<void> {
  return serialized(async () => {
    const recipes = await loadRecipes();
    const idx = recipes.findIndex((r) => r.id === recipe.id);
    if (idx === -1) {
      recipes.unshift(recipe);
    } else {
      recipes[idx] = { ...recipe, createdAt: recipes[idx].createdAt };
    }
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes.slice(0, 200)));
  });
}

/** Delete a recipe by id */
export function deleteRecipe(id: string): Promise<void> {
  return serialized(async () => {
    const recipes = await loadRecipes();
    const filtered = recipes.filter((r) => r.id !== id);
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(filtered));
  });
}

/** Get a single recipe by id */
export async function getRecipe(id: string): Promise<SavedRecipe | null> {
  const recipes = await loadRecipes();
  return recipes.find((r) => r.id === id) ?? null;
}

/** Generate a unique recipe ID */
export function generateRecipeId(): string {
  return `recipe_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
