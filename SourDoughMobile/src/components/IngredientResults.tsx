import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';
import { IngredientResults as IngredientResultsType, FlourBlendEntry } from '../models/types';

interface Props {
  ingredients: IngredientResultsType;
  blend?: FlourBlendEntry[];
  totalFlourWeight?: number;
  starterFlourType?: string;
  prefermentType?: string;
  /** Typical weight per unit (loaf, baguette, etc.). 0 = whole batch. */
  typicalUnitGrams?: number;
  /** Label for a single unit. */
  unitLabel?: string;
}

export function IngredientResults({ ingredients, blend, totalFlourWeight, starterFlourType, prefermentType, typicalUnitGrams, unitLabel }: Props) {
  const showBlend = blend && blend.length > 1 && totalFlourWeight;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>⚖️  Ingredients (put this in the bowl)</Text>

      {showBlend ? (
        // Multi-flour breakdown
        <>
          {blend!.map((entry) => {
            const grams = totalFlourWeight! * entry.percentage / 100;
            return (
              <View style={styles.row} key={entry.label}>
                <Text style={styles.label}>
                  {entry.label.replace(/\s*\([^)]*\)$/, '')}
                </Text>
                <Text style={styles.value}>{grams.toFixed(1)} g</Text>
                <Text style={styles.note}>{Math.round(entry.percentage)}%</Text>
              </View>
            );
          })}
          <View style={styles.subRow}>
            <Text style={styles.subLabel}>
              Total flour
            </Text>
            <Text style={styles.subValue}>
              {ingredients.freshFlour.toFixed(1)} g
            </Text>
          </View>
        </>
      ) : (
        renderRow('Flour', `${ingredients.freshFlour.toFixed(1)} g`, null)
      )}

      {renderRow('Water', `${ingredients.addedWater.toFixed(1)} g`, null)}
      {renderRow('Starter', `${ingredients.starterTotal.toFixed(1)} g`,
        `(${ingredients.starterPct.toFixed(0)}% of total flour)`)}
      <View style={styles.subRow}>
        <Text style={styles.subLabel}>flour in starter</Text>
        <Text style={styles.subValue}>
          {ingredients.flourFromStarter.toFixed(1)} g
          {starterFlourType ? `  (${starterFlourType.replace(/\s*\([^)]*\)$/, '')})` : ''}
        </Text>
      </View>
      <View style={styles.subRow}>
        <Text style={styles.subLabel}>water in starter</Text>
        <Text style={styles.subValue}>{ingredients.waterFromStarter.toFixed(1)} g</Text>
      </View>

      {/* Pre-ferment breakdown */}
      {ingredients.prefermentTotal > 0 && (
        <>
          {renderRow(
            `Pre-ferment (${prefermentType ?? 'poolish'})`,
            `${ingredients.prefermentTotal.toFixed(1)} g`,
            `${(ingredients.prefermentFlour / ingredients.totalFlour * 100).toFixed(0)}% of total flour`,
          )}
          <View style={styles.subRow}>
            <Text style={styles.subLabel}>flour in pre-ferment</Text>
            <Text style={styles.subValue}>{ingredients.prefermentFlour.toFixed(1)} g</Text>
          </View>
          <View style={styles.subRow}>
            <Text style={styles.subLabel}>water in pre-ferment</Text>
            <Text style={styles.subValue}>{ingredients.prefermentWater.toFixed(1)} g</Text>
          </View>
        </>
      )}

      {/* Oil */}
      {ingredients.oil > 0 &&
        renderRow('Oil / Fat', `${ingredients.oil.toFixed(1)} g`, null)}

      {renderRow('Salt', `${ingredients.salt.toFixed(1)} g`, null)}

      <View style={styles.divider} />

      {renderRow('Total weight', `${ingredients.totalDoughWeight.toFixed(1)} g`,
        `${ingredients.hydrationPct.toFixed(0)}% hydration`,
        true)}

      <View style={styles.noteRow}>
        <Text style={styles.note}>
          Based on {ingredients.totalFlour.toFixed(0)}g total flour
          (incl. {ingredients.flourFromStarter.toFixed(1)}g from starter{ingredients.prefermentFlour > 0 ? ` + ${ingredients.prefermentFlour.toFixed(1)}g in pre-ferment` : ''})
        </Text>
      </View>

      {/* Yield suggestion */}
      {typicalUnitGrams != null && typicalUnitGrams > 0 && unitLabel
        ? (() => {
            const unitCount = ingredients.totalDoughWeight / typicalUnitGrams;
            const IRREGULAR_PLURALS: Record<string, string> = { loaf: 'loaves' };
            const pluralLabel = IRREGULAR_PLURALS[unitLabel] ?? `${unitLabel}s`;
            return (
              <View style={styles.yieldRow}>
                <Text style={styles.yieldText}>
                  🧮  This dough yields{' '}
                  <Text style={styles.yieldBold}>
                    ~{unitCount.toFixed(1)} {unitCount > 1 ? pluralLabel : unitLabel}
                  </Text>
                  {' '}({typicalUnitGrams}g per {unitLabel})
                </Text>
                {unitCount >= 2 && (
                  <Text style={styles.yieldSub}>
                    Scale each to {typicalUnitGrams}g for the best result.
                  </Text>
                )}
              </View>
            );
          })()
        : null}
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

const CARD_PADDING = Spacing.md;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: CARD_PADDING,
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
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingLeft: Spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    marginTop: 2,
    paddingTop: Spacing.xs,
  },
  subLabel: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  subValue: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    fontWeight: '500',
  },
  noteRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  yieldRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.terracotta,
    backgroundColor: '#FFF5EF',
    marginHorizontal: -CARD_PADDING,
    paddingHorizontal: CARD_PADDING,
    paddingBottom: Spacing.sm,
    marginBottom: -CARD_PADDING,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  yieldText: {
    fontSize: FontSize.sm,
    color: Colors.espresso,
    lineHeight: 20,
  },
  yieldBold: {
    fontWeight: '700',
    color: Colors.terracotta,
  },
  yieldSub: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
});
