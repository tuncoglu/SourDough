import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme, AppColors, cardStyleLg } from '../theme';
import { YogurtResults, YogurtCultureType } from '../models/types';
import { weightUnit } from '../lib/unitConversion';

interface Props {
  results: YogurtResults;
  cultureType: YogurtCultureType;
  thickness: string;
  nutrition: { fatPct: number; proteinPct: number } | null;
}

export function YogurtResultCard({ results, cultureType, thickness, nutrition }: Props) {
  const { colors, unitSystem } = useAppTheme();
  const unit = weightUnit(unitSystem);

  const yieldDisplay = unitSystem === 'imperial'
    ? `${(results.estimatedYieldGrams / 28.35).toFixed(1)} oz`
    : `${results.estimatedYieldGrams} g`;

  const milkDisplay = unitSystem === 'imperial'
    ? `${(results.milkGrams / 28.35).toFixed(1)} oz`
    : `${results.milkGrams} g`;

  return (
    <View style={[cardStyleLg, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.espresso }]}>🫙 Yield & Timing</Text>

      {/* Milk → Yogurt */}
      <View style={styles.resultRow}>
        <Text style={[styles.label, { color: colors.muted }]}>{milkDisplay} milk</Text>
        <Text style={[styles.arrow, { color: colors.terracotta }]}>→</Text>
        <Text style={[styles.value, { color: colors.espresso }]}>
          {yieldDisplay} yogurt
        </Text>
      </View>

      {/* Servings */}
      <View style={styles.subRow}>
        <Text style={[styles.subText, { color: colors.lightText }]}>
          ~{results.estimatedServings} servings · ~{results.estimatedYieldLitres}L
        </Text>
      </View>

      {/* Incubation */}
      <View style={[styles.divider, { borderTopColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.muted }]}>Incubation</Text>
        <Text style={[styles.highlight, { color: colors.terracotta }]}>
          {results.incubationHours}h
        </Text>
        <Text style={[styles.range, { color: colors.lightText }]}>
          range {results.incubationHoursMin}–{results.incubationHoursMax}h
        </Text>
      </View>

      {/* Starter */}
      <View style={styles.divider}>
        <Text style={[styles.label, { color: colors.muted }]}>Starter</Text>
        {results.starterSource === 'previous-batch' ? (
          <>
            <Text style={[styles.value, { color: colors.espresso }]}>
              {results.previousBatchGrams}g
            </Text>
            <Text style={[styles.range, { color: colors.lightText }]}>
              previous batch (~{Math.round(results.previousBatchGrams / 15)} tbsp)
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.value, { color: colors.espresso }]}>
              {results.sachetCount} sachet{results.sachetCount > 1 ? 's' : ''}
            </Text>
            <Text style={[styles.range, { color: colors.lightText }]}>
              {results.starterRatioDisplay}
            </Text>
          </>
        )}
      </View>

      {/* Culture type badge */}
      <View style={styles.badgeRow}>
        <Text style={[styles.badge, {
          backgroundColor: cultureType === 'thermophilic' ? colors.warningBg : colors.coldBg,
          color: cultureType === 'thermophilic' ? colors.warm : colors.cool,
        }]}>
          {cultureType === 'thermophilic' ? '🌡 Thermophilic' : '🏠 Mesophilic'}
        </Text>
        <Text style={[styles.badge, { backgroundColor: colors.successBg, color: colors.olive }]}>
          {thickness}
        </Text>
      </View>

      {/* Nutrition */}
      {nutrition && (
        <View style={[styles.divider, { borderTopColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.muted }]}>Per 100g</Text>
          <Text style={[styles.nutritionText, { color: colors.espresso }]}>
            {nutrition.fatPct}g fat · {nutrition.proteinPct}g protein
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    flex: 1,
  },
  arrow: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  value: {
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  subRow: {
    paddingLeft: 2,
    marginTop: -2,
  },
  subText: {
    fontSize: FontSize.xs,
  },
  divider: {
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  highlight: {
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  range: {
    fontSize: FontSize.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  badge: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  nutritionText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});
