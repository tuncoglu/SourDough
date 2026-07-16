import { useState, useCallback } from 'react';
import { Alert, Share, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import {
  CalculationResults,
  SavedRecipe,
  FlourBlendEntry,
} from '../models/types';
import { saveRecipe, generateRecipeId } from '../store/recipeStore';
import { getBlendProtein } from '../lib/blendUtils';
import { formatRecipeTextFromState } from '../lib/recipeFormatter';
import { copyToClipboard } from '../lib/clipboard';

const SAVE_COUNT_KEY = 'sourdough_save_count';
const REVIEW_REQUESTED_KEY = 'sourdough_review_requested';

interface SaveParams {
  blend: FlourBlendEntry[];
  totalFlourWeight: number;
  hydration: string;
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
  breadType: string;
  results: CalculationResults;
  locationSummary: string;
}

interface ShareParams {
  blend: FlourBlendEntry[];
  totalFlourWeight: number;
  hydration: string;
  starterWeight: string;
  saltPct: string;
  starterHydrationStr: string;
  oilPct: string;
  ambientTemp: string;
  waterTemp: string;
  prefermentEnabled: boolean;
  prefermentFlourPct: string;
  results: CalculationResults;
  locationSummary: string;
  bakeInfo?: string;
}

export function useRecipeActions() {
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async (params: SaveParams) => {
    const {
      blend, totalFlourWeight, hydration, starterWeight, saltPct,
      starterHydrationStr, oilPct, ambientTemp, flourTemp, waterTemp,
      starterTemp, starterFlourLabel, prefermentEnabled, prefermentFlourPct,
      breadType, results, locationSummary,
    } = params;

    if (!results) return;
    setSaving(true);

    const flourType = blend.length === 1
      ? blend[0].label
      : blend.map((e) => `${Math.round(e.percentage)}% ${e.label.replace(/\s*\([^)]*\)$/, '')}`).join(' + ');
    const flourProtein = blend.length > 1 ? getBlendProtein(blend) : blend[0].protein;

    const shyd = parseFloat(starterHydrationStr);
    const oil = parseFloat(oilPct) || 0;
    const prefConfig = prefermentEnabled
      ? { type: 'poolish' as const, flourPct: parseFloat(prefermentFlourPct) || 30, hydration: 100 }
      : undefined;

    const recipe: SavedRecipe = {
      id: generateRecipeId(),
      createdAt: new Date().toISOString(),
      inputs: {
        flourWeight: totalFlourWeight,
        flourType,
        flourProtein,
        flourProductNo: blend[0].productNumber,
        flourBlend: blend,
        hydration: parseFloat(hydration),
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
      },
      results,
      locationSummary: locationSummary ?? '📍 Unknown location',
      breadType: breadType !== 'custom' ? breadType : undefined,
    };

    try {
      await saveRecipe(recipe);

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

      Alert.alert('Saved', 'Recipe saved to your history.');
    } catch {
      Alert.alert('Error', 'Could not save recipe.');
    } finally {
      setSaving(false);
    }
  }, []);

  const handleShare = useCallback(async (params: ShareParams) => {
    const {
      blend, totalFlourWeight, hydration, starterWeight, saltPct,
      starterHydrationStr, oilPct, ambientTemp, waterTemp,
      prefermentEnabled, prefermentFlourPct, results, locationSummary, bakeInfo,
    } = params;

    const text = formatRecipeTextFromState(
      locationSummary,
      totalFlourWeight,
      blend,
      parseFloat(hydration),
      parseFloat(starterWeight),
      parseFloat(starterHydrationStr),
      parseFloat(saltPct),
      parseFloat(oilPct) || undefined,
      prefermentEnabled ? 'poolish' : undefined,
      prefermentEnabled ? parseFloat(prefermentFlourPct) || undefined : undefined,
      results,
      bakeInfo,
    );

    try {
      if (Platform.OS === 'web') {
        const shared = await (navigator.share
          ? navigator.share({ text }).then(() => true).catch(() => false)
          : Promise.resolve(false));
        if (!shared) {
          const copied = await copyToClipboard(text);
          if (copied) {
            Alert.alert('Copied!', 'Recipe copied to clipboard.');
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
