import { useState, useMemo, useCallback } from 'react';
import { RecipePreset } from '../models/types';
import { RECIPE_PRESETS } from '../data/recipePresets';
import { useAppTheme } from '../theme';
import { formatTemp } from '../lib/unitConversion';

interface Recommendation {
  preset: RecipePreset;
  reason: string;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useDailyRecommendation(ambientTempStr: string, breadType: string) {
  // Store dismiss per-day so it resets tomorrow
  const [dismissedDate, setDismissedDate] = useState<string | null>(null);
  const { unitSystem } = useAppTheme();

  const dismissed = dismissedDate === todayKey();

  const dismiss = useCallback(() => setDismissedDate(todayKey()), []);

  const recommendation = useMemo((): Recommendation | null => {
    if (dismissed) return null;
    if (breadType !== 'custom') return null;

    const amb = parseFloat(ambientTempStr);
    if (isNaN(amb)) return null;
    const ambDisplay = formatTemp(amb, unitSystem, 0);

    const hour = new Date().getHours();
    let preset: RecipePreset;
    let reason: string;

    if (amb < 19) {
      preset = RECIPE_PRESETS.find((p) => p.id === 'classic-boule')!;
      reason = `Cool ${ambDisplay} kitchen — perfect for a slow, flavourful ferment.`;
    } else if (amb >= 26) {
      preset = RECIPE_PRESETS.find((p) => p.id === 'focaccia')!;
      reason = `Warm ${ambDisplay} — dough will ferment fast. A focaccia handles speed well.`;
    } else if (hour >= 16 && hour < 20) {
      preset = RECIPE_PRESETS.find((p) => p.id === 'pita-naan')!;
      reason = `Evening bake? Quick pita or naan — ready in time for dinner.`;
    } else if (hour >= 6 && hour < 11) {
      preset = RECIPE_PRESETS.find((p) => p.id === 'classic-boule')!;
      reason = `Morning start — you have all day for a classic sourdough boule.`;
    } else {
      preset = RECIPE_PRESETS.find((p) => p.id === 'classic-boule')!;
      reason = `${ambDisplay} ambient — a versatile day for sourdough.`;
    }

    return { preset, reason };
  }, [ambientTempStr, breadType, dismissed, unitSystem]);

  return { recommendation, dismiss };
}
