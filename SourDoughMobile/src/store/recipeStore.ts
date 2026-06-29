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

/** Save a recipe (appends to start) */
export async function saveRecipe(recipe: SavedRecipe): Promise<void> {
  const recipes = await loadRecipes();
  recipes.unshift(recipe);
  // Keep max 200 recipes
  const trimmed = recipes.slice(0, 200);
  await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(trimmed));
}

/** Delete a recipe by id */
export async function deleteRecipe(id: string): Promise<void> {
  const recipes = await loadRecipes();
  const filtered = recipes.filter((r) => r.id !== id);
  await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(filtered));
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
