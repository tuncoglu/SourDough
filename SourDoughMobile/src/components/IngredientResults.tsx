import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';
import { IngredientResults as IngredientResultsType } from '../models/types';

interface Props {
  ingredients: IngredientResultsType;
}

export function IngredientResults({ ingredients }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>⚖️  Ingredients (put this in the bowl)</Text>

      {renderRow('Flour', `${ingredients.freshFlour.toFixed(1)} g`, null)}
      {renderRow('Water', `${ingredients.addedWater.toFixed(1)} g`, null)}
      {renderRow('Starter', `${ingredients.starterTotal.toFixed(1)} g`,
        `(${ingredients.starterPct.toFixed(0)}% of total flour)`)}
      {renderRow('Salt', `${ingredients.salt.toFixed(1)} g`, null)}

      <View style={styles.divider} />

      {renderRow('Total weight', `${ingredients.totalDoughWeight.toFixed(1)} g`,
        `${ingredients.hydrationPct.toFixed(0)}% hydration`,
        true)}

      <View style={styles.noteRow}>
        <Text style={styles.note}>
          Based on {ingredients.totalFlour.toFixed(0)}g total flour
          (incl. {ingredients.flourFromStarter.toFixed(1)}g from starter)
        </Text>
      </View>
    </View>
  );
}

function renderRow(
  label: string,
  value: string,
  note: string | null,
  bold?: boolean,
) {
  return (
    <View style={styles.row} key={label}>
      <Text style={[styles.label, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.value, bold && styles.bold]}>{value}</Text>
      {note && <Text style={styles.note}>{note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  label: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.espresso,
  },
  value: {
    fontSize: FontSize.md,
    color: Colors.espresso,
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
    fontSize: FontSize.lg,
  },
  note: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginLeft: Spacing.sm,
    maxWidth: '40%',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  noteRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
});
