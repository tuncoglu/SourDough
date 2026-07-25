import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { FermentResults } from '../models/types';
import { weightUnit } from '../lib/unitConversion';

interface Props {
  results: FermentResults;
  method: 'dry' | 'brine' | 'mash';
}

export function LactoResultCard({ results, method }: Props) {
  const { colors, unitSystem } = useAppTheme();
  const unit = weightUnit(unitSystem);

  const saltDisplay = unitSystem === 'imperial'
    ? `${(results.saltGrams / 28.35).toFixed(2)} oz`
    : `${results.saltGrams} g`;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.espresso }]}>🧂 Salt</Text>

      {/* Salt weight */}
      <View style={styles.resultRow}>
        <Text style={[styles.label, { color: colors.muted }]}>You need</Text>
        <Text style={[styles.value, { color: colors.espresso }]}>
          {saltDisplay}
        </Text>
      </View>

      {/* Volume equivalents */}
      <View style={[styles.volumeRow, { borderTopColor: colors.border }]}>
        <Text style={[styles.volumeLabel, { color: colors.lightText }]}>
          That's about
        </Text>
        <View style={styles.volumeValues}>
          <VolumeBadge
            value={results.saltTeaspoons}
            unit="tsp"
            colors={colors}
          />
          <VolumeBadge
            value={results.saltTablespoons}
            unit="tbsp"
            colors={colors}
          />
        </View>
      </View>

      <Text style={[styles.saltType, { color: colors.lightText }]}>
        using {results.saltLabel.toLowerCase()}
      </Text>

      {/* Brine info */}
      {method === 'brine' && results.totalBrineGrams > 0 && (
        <View style={[styles.brineRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.muted }]}>Total brine</Text>
          <Text style={[styles.value, { color: colors.espresso }]}>
            {unitSystem === 'imperial'
              ? `${(results.totalBrineGrams / 28.35).toFixed(1)} oz`
              : `${results.totalBrineGrams} g`}
          </Text>
          <Text style={[styles.brineStrength, { color: colors.olive }]}>
            {results.brineStrengthDisplay}
          </Text>
        </View>
      )}

      {/* Effective salinity for dry/mash */}
      {method !== 'brine' && (
        <View style={[styles.brineRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.muted }]}>Effective brine</Text>
          <Text style={[styles.value, { color: colors.espresso }]}>
            ~{results.effectiveSalinity}%
          </Text>
          <Text style={[styles.brineStrength, { color: colors.lightText }]}>
            after veg water releases
          </Text>
        </View>
      )}
    </View>
  );
}

function VolumeBadge({
  value,
  unit,
  colors,
}: {
  value: number;
  unit: string;
  colors: Record<string, string>;
}) {
  return (
    <View style={[volStyles.badge, { backgroundColor: '#F5EDE4' }]}>
      <Text style={[volStyles.badgeValue, { color: colors.espresso }]}>
        {value < 0.1 ? value.toFixed(2) : value < 1 ? value.toFixed(1) : Math.round(value)}
      </Text>
      <Text style={[volStyles.badgeUnit, { color: colors.muted }]}>{unit}</Text>
    </View>
  );
}

const volStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.sm,
  },
  badgeValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  badgeUnit: {
    fontSize: FontSize.sm,
  },
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.md,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  volumeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: Spacing.md,
  },
  volumeLabel: {
    fontSize: FontSize.sm,
  },
  volumeValues: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  saltType: {
    fontSize: FontSize.xs,
    marginTop: -4,
  },
  brineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: Spacing.md,
  },
  brineStrength: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
});
