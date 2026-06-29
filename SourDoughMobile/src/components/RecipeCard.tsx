import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';
import { SavedRecipe } from '../models/types';
import { getTempZoneInfo } from '../models/types';

interface Props {
  recipe: SavedRecipe;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: Props) {
  const zoneInfo = getTempZoneInfo(recipe.results.tempZone);
  const date = new Date(recipe.createdAt);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.date}>
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
        <Text style={styles.flour} numberOfLines={1}>
          {recipe.inputs.flourType}
        </Text>
        <Text style={styles.meta}>
          {recipe.inputs.hydration.toFixed(0)}% hydration ·{' '}
          {recipe.results.ingredients.totalDoughWeight.toFixed(0)}g ·{' '}
          ~{recipe.results.dynamicFerment?.totalHours ?? recipe.results.staticFermentHours}h ferment
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
