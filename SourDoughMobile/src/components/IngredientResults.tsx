import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { formatWeight, formatWeightValue, weightUnit } from '../lib/unitConversion';
import { shortenLabel } from '../lib/blendUtils';
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
  const { unitSystem, colors } = useAppTheme();

  function renderRow(label: string, value: string, note: string | null, bold?: boolean) {
    return (
      <View style={styles.row} key={label}>
        <Text style={[styles.label, bold && styles.bold, { color: colors.espresso }]}>{label}</Text>
        <Text style={[styles.value, bold && styles.bold, { color: colors.espresso }]}>{value}</Text>
        {note && <Text style={[styles.note, { color: colors.muted }]}>{note}</Text>}
      </View>
    );
  }
  const showBlend = blend && blend.length > 1 && totalFlourWeight;
  const wu = weightUnit(unitSystem);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.muted }]}>⚖️  Ingredients (put this in the bowl)</Text>

      {showBlend ? (
        // Multi-flour breakdown
        <>
          {blend!.map((entry) => {
            const grams = totalFlourWeight! * entry.percentage / 100;
            return (
              <View style={styles.row} key={entry.label}>
                <Text style={[styles.label, { color: colors.espresso }]}>
                  {shortenLabel(entry.label)}
                </Text>
                <Text style={[styles.value, { color: colors.espresso }]}>{formatWeight(grams, unitSystem)}</Text>
                <Text style={[styles.note, { color: colors.muted }]}>{Math.round(entry.percentage)}%</Text>
              </View>
            );
          })}
          <View style={[styles.subRow, { borderLeftColor: colors.border, borderTopColor: colors.border }]}>
            <Text style={[styles.subLabel, { color: colors.muted }]}>
              Total flour
            </Text>
            <Text style={[styles.subValue, { color: colors.muted }]}>
              {formatWeight(ingredients.freshFlour, unitSystem)}
            </Text>
          </View>
        </>
      ) : (
        renderRow('Flour', formatWeight(ingredients.freshFlour, unitSystem), null)
      )}

      {renderRow('Water', formatWeight(ingredients.addedWater, unitSystem), null)}
      {renderRow('Starter', formatWeight(ingredients.starterTotal, unitSystem),
        `(${ingredients.starterPct.toFixed(0)}% of total flour)`)}
      <View style={[styles.subRow, { borderLeftColor: colors.border, borderTopColor: colors.border }]}>
        <Text style={[styles.subLabel, { color: colors.muted }]}>flour in starter</Text>
        <Text style={[styles.subValue, { color: colors.muted }]}>
          {formatWeight(ingredients.flourFromStarter, unitSystem)}
          {starterFlourType ? `  (${starterFlourType.replace(/\s*\([^)]*\)$/, '')})` : ''}
        </Text>
      </View>
      <View style={[styles.subRow, { borderLeftColor: colors.border, borderTopColor: colors.border }]}>
        <Text style={[styles.subLabel, { color: colors.muted }]}>water in starter</Text>
        <Text style={[styles.subValue, { color: colors.muted }]}>{formatWeight(ingredients.waterFromStarter, unitSystem)}</Text>
      </View>

      {/* Pre-ferment breakdown */}
      {ingredients.prefermentTotal > 0 && (
        <>
          {renderRow(
            `Pre-ferment (${prefermentType ?? 'poolish'})`,
            formatWeight(ingredients.prefermentTotal, unitSystem),
            `${(ingredients.prefermentFlour / ingredients.totalFlour * 100).toFixed(0)}% of total flour`,
            false,
            colors,
          )}
          <View style={[styles.subRow, { borderLeftColor: colors.border, borderTopColor: colors.border }]}>
            <Text style={[styles.subLabel, { color: colors.muted }]}>flour in pre-ferment</Text>
            <Text style={[styles.subValue, { color: colors.muted }]}>{formatWeight(ingredients.prefermentFlour, unitSystem)}</Text>
          </View>
          <View style={[styles.subRow, { borderLeftColor: colors.border, borderTopColor: colors.border }]}>
            <Text style={[styles.subLabel, { color: colors.muted }]}>water in pre-ferment</Text>
            <Text style={[styles.subValue, { color: colors.muted }]}>{formatWeight(ingredients.prefermentWater, unitSystem)}</Text>
          </View>
        </>
      )}

      {/* Oil */}
      {ingredients.oil > 0 &&
        renderRow('Oil / Fat', formatWeight(ingredients.oil, unitSystem), null)}

      {renderRow('Salt', formatWeight(ingredients.salt, unitSystem), null)}

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {renderRow('Total weight', formatWeight(ingredients.totalDoughWeight, unitSystem),
        `${ingredients.hydrationPct.toFixed(0)}% hydration`,
        true,
        colors)}

      <View style={[styles.noteRow, { borderTopColor: colors.border }]}>
        <Text style={[styles.note, { color: colors.muted }]}>
          Based on {formatWeightValue(ingredients.totalFlour, unitSystem, 0)}{wu} total flour
          (incl. {formatWeight(ingredients.flourFromStarter, unitSystem)} from starter{ingredients.prefermentFlour > 0 ? ` + ${formatWeight(ingredients.prefermentFlour, unitSystem)} in pre-ferment` : ''})
        </Text>
      </View>

      {/* Yield suggestion */}
      {typicalUnitGrams != null && typicalUnitGrams > 0 && unitLabel
        ? (() => {
            const unitCount = ingredients.totalDoughWeight / typicalUnitGrams;
            const IRREGULAR_PLURALS: Record<string, string> = { loaf: 'loaves' };
            const pluralLabel = IRREGULAR_PLURALS[unitLabel] ?? `${unitLabel}s`;
            return (
              <View style={[styles.yieldRow, { borderTopColor: colors.terracotta, backgroundColor: colors.tipBg }]}>
                <Text style={[styles.yieldText, { color: colors.espresso }]}>
                  🧮  This dough yields{' '}
                  <Text style={[styles.yieldBold, { color: colors.terracotta }]}>
                    ~{unitCount.toFixed(1)} {unitCount > 1 ? pluralLabel : unitLabel}
                  </Text>
                  {' '}({formatWeight(typicalUnitGrams, unitSystem, 0)} per {unitLabel})
                </Text>
                {unitCount >= 2 && (
                  <Text style={[styles.yieldSub, { color: colors.muted }]}>
                    Scale each to {formatWeight(typicalUnitGrams, unitSystem, 0)} for the best result.
                  </Text>
                )}
              </View>
            );
          })()
        : null}
    </View>
  );
}

const CARD_PADDING = Spacing.md;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: CARD_PADDING,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
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
  },
  value: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
    fontSize: FontSize.lg,
  },
  note: {
    fontSize: FontSize.xs,
    marginLeft: Spacing.sm,
    maxWidth: '40%',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingLeft: Spacing.md,
    borderLeftWidth: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 2,
    paddingTop: Spacing.xs,
  },
  subLabel: {
    flex: 1,
    fontSize: FontSize.xs,
  },
  subValue: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  noteRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  yieldRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    marginHorizontal: -CARD_PADDING,
    paddingHorizontal: CARD_PADDING,
    paddingBottom: Spacing.sm,
    marginBottom: -CARD_PADDING,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  yieldText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  yieldBold: {
    fontWeight: '700',
  },
  yieldSub: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
});
