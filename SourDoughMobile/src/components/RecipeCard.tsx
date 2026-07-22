import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { SavedRecipe } from '../models/types';
import { getTempZoneInfo } from '../models/types';
import { getBlendDisplayLabel } from '../lib/flourSearch';
import { PROOF_FRACTION } from '../lib/calculations';

interface Props {
  recipe: SavedRecipe;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: Props) {
  const { colors } = useAppTheme();
  const zoneInfo = getTempZoneInfo(recipe.results.tempZone);
  const date = new Date(recipe.createdAt);
  const totalHours = recipe.results.dynamicFerment?.totalHours
    ?? recipe.results.staticFermentHours * (1 + PROOF_FRACTION);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.date, { color: colors.muted }]}>
          {date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={[styles.fdt, { color: zoneInfo.color }]}>
          {zoneInfo.icon} {recipe.results.fdt}°C
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={[styles.flour, { color: colors.espresso }]} numberOfLines={1}>
          {getBlendDisplayLabel(recipe.inputs)}
        </Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          {recipe.inputs.hydration.toFixed(0)}% hydration ·{' '}
          {recipe.results.ingredients.totalDoughWeight.toFixed(0)}g ·{' '}
          ~{totalHours.toFixed(1)}h total
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs + 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  date: {
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  fdt: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  body: {},
  flour: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.espresso,
    marginBottom: 2,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
});
