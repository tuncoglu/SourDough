import { useState, useCallback } from 'react';
import { Share, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import {
  CalculationResults,
  SavedRecipe,
  FlourBlendEntry,
} from '../models/types';
import { saveRecipe, updateRecipe, generateRecipeId } from '../store/recipeStore';
import { getBlendProtein, buildFlourTypeLabel, buildPrefermentConfig, POOLISH_HYDRATION, BIGA_HYDRATION } from '../lib/blendUtils';
import { formatRecipeTextFromState } from '../lib/recipeFormatter';
import { copyToClipboard } from '../lib/clipboard';
import { useAppTheme } from '../theme';
import { useFeedback } from '../lib/feedback';

const SAVE_COUNT_KEY = 'sourdough_save_count';
const REVIEW_REQUESTED_KEY = 'sourdough_review_requested';

interface SaveParams {
  blend: FlourBlendEntry[];
  totalFlourWeight: number;
  waterGrams: string;
  starterWeight: string;
  saltPct: string;
  starterHydrationStr: string;
  oilPct: string;
  ambientTemp: string;
  flourTemp: string;
  waterTemp: string;
  starterTemp: string;
  starterFlourLabel: string;
  prefermentEnabled: boolean;
  prefermentFlourPct: string;
  prefermentType?: 'poolish' | 'biga';
  breadType: string;
  results: CalculationResults;
  locationSummary: string;
  coldProofEnabled: boolean;
  coldProofHours: string;
  coldProofTemp: string;
  /** When set, update this existing recipe instead of creating a new one. */
  editId?: string;
}

interface ShareParams {
  blend: FlourBlendEntry[];
  totalFlourWeight: number;
  waterGrams: string;
  starterWeight: string;
  saltPct: string;
  starterHydrationStr: string;
  oilPct: string;
  ambientTemp: string;
  waterTemp: string;
  prefermentEnabled: boolean;
  prefermentFlourPct: string;
  prefermentType?: 'poolish' | 'biga';
  results: CalculationResults;
  locationSummary: string;
  bakeInfo?: string;
  unitSystem: import('../models/types').UnitSystem;
  coldProofEnabled: boolean;
  coldProofHours: string;
}

export function useRecipeActions() {
  const { unitSystem } = useAppTheme();
  const { showToast, alert } = useFeedback();
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async (params: SaveParams) => {
    const {
      blend, totalFlourWeight, waterGrams, starterWeight, saltPct,
      starterHydrationStr, oilPct, ambientTemp, flourTemp, waterTemp,
      starterTemp, starterFlourLabel, prefermentEnabled, prefermentFlourPct,
      prefermentType,
      breadType, results, locationSummary,
      coldProofEnabled, coldProofHours, coldProofTemp,
      editId,
    } = params;

    if (!results) return;
    setSaving(true);

    const flourType = blend.length === 1
      ? blend[0].label
      : buildFlourTypeLabel(blend);
    const flourProtein = blend.length > 1 ? getBlendProtein(blend) : blend[0].protein;

    const shyd = parseFloat(starterHydrationStr);
    const oil = parseFloat(oilPct) || 0;
    const prefConfig = prefermentEnabled
      ? buildPrefermentConfig(prefermentType, prefermentFlourPct)
      : undefined;

    const recipe: SavedRecipe = {
      id: editId ?? generateRecipeId(),
      createdAt: new Date().toISOString(),
      inputs: {
        flourWeight: totalFlourWeight,
        flourType,
        flourProtein,
        flourProductNo: blend[0].productNumber,
        flourBlend: blend,
        hydration: results.ingredients.hydrationPct,
        addedWaterGrams: parseFloat(waterGrams) || undefined,
        starterWeight: parseFloat(starterWeight),
        starterHydration: shyd,
        starterFlourType: starterFlourLabel,
        saltPct: parseFloat(saltPct),
        oilPct: oil,
        ambientTemp: parseFloat(ambientTemp),
        flourTemp: parseFloat(flourTemp),
        waterTemp: parseFloat(waterTemp),
        starterTemp: parseFloat(starterTemp),
        breadType: breadType !== 'custom' ? breadType : undefined,
        preferment: prefConfig,
        coldProofHours: coldProofEnabled ? (parseFloat(coldProofHours) || undefined) : undefined,
        coldProofTemp: coldProofEnabled ? (parseFloat(coldProofTemp) || 4) : undefined,
      },
      results,
      locationSummary: locationSummary ?? '📍 Unknown location',
      breadType: breadType !== 'custom' ? breadType : undefined,
    };

    try {
      if (editId) {
        await updateRecipe(recipe);
      } else {
        await saveRecipe(recipe);
      }

      // Review prompt tracking
      try {
        const raw = await AsyncStorage.getItem(SAVE_COUNT_KEY);
        const count = (raw ? parseInt(raw, 10) : 0) + 1;
        await AsyncStorage.setItem(SAVE_COUNT_KEY, String(count));

        const alreadyRequested = await AsyncStorage.getItem(REVIEW_REQUESTED_KEY);
        if (count >= 3 && !alreadyRequested) {
          const available = await StoreReview.isAvailableAsync();
          if (available) {
            await AsyncStorage.setItem(REVIEW_REQUESTED_KEY, 'true');
            await StoreReview.requestReview();
          }
        }
      } catch {
        // Silently ignore review tracking failures
      }

      showToast(editId ? 'Recipe updated in your history.' : 'Recipe saved to your history.', 'success');
      return true;
    } catch {
      alert('Error', 'Could not save recipe.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const handleShare = useCallback(async (params: ShareParams) => {
    const {
      blend, totalFlourWeight, waterGrams, starterWeight, saltPct,
      starterHydrationStr, oilPct, ambientTemp, waterTemp,
      prefermentEnabled, prefermentFlourPct, prefermentType,
      results, locationSummary, bakeInfo, unitSystem,
    } = params;

    const text = formatRecipeTextFromState(
      locationSummary,
      totalFlourWeight,
      blend,
      results.ingredients.hydrationPct,
      parseFloat(starterWeight),
      parseFloat(starterHydrationStr),
      parseFloat(saltPct),
      parseFloat(oilPct) || undefined,
      prefermentEnabled ? (prefermentType || 'poolish') : undefined,
      prefermentEnabled ? parseFloat(prefermentFlourPct) || undefined : undefined,
      prefermentEnabled ? (prefermentType === 'biga' ? BIGA_HYDRATION : POOLISH_HYDRATION) : undefined,
      results,
      bakeInfo,
      unitSystem,
      parseFloat(ambientTemp) || undefined,
      parseFloat(waterTemp) || undefined,
    );

    try {
      if (Platform.OS === 'web') {
        const shared = await (navigator.share
          ? navigator.share({ text }).then(() => true).catch(() => false)
          : Promise.resolve(false));
        if (!shared) {
          const copied = await copyToClipboard(text);
          if (copied) {
            showToast('Recipe copied to clipboard.', 'success');
          }
        }
      } else {
        await Share.share({ message: text });
      }
    } catch {
      // User cancelled — no-op
    }
  }, []);

  return { saving, handleSave, handleShare };
}
