import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyleLg } from '../theme';
import { LactoDayPoint, FermentResults } from '../models/types';
import { FINAL_PH, TARGET_PH, SAFETY_PH } from '../lib/lactoCalculations';

interface Props {
  timeline: LactoDayPoint[];
  results: FermentResults;
}

export function LactoTimeline({ timeline, results }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[cardStyleLg, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.espresso }]}>📅 Timeline</Text>

      {/* Summary */}
      <Text style={[styles.summary, { color: colors.muted }]}>
        The ferment will take about{' '}
        <Text style={{ color: colors.terracotta, fontWeight: '700' }}>
          {results.estimatedDays} days
        </Text>
        . Taste from day {Math.round(results.estimatedDaysMin)}; fully sour by day{' '}
        {Math.round(results.estimatedDaysMax)}.
      </Text>

      {/* Day markers */}
      <View style={styles.timelineList}>
        {timeline.map((point, i) => (
          <View key={i} style={styles.point}>
            {/* Line + dot */}
            <View style={styles.dotCol}>
              <View style={[styles.dot, { backgroundColor: i === timeline.length - 1 ? colors.olive : colors.terracotta }]} />
              {i < timeline.length - 1 && (
                <View style={[styles.line, { backgroundColor: colors.border }]} />
              )}
            </View>

            {/* Content */}
            <View style={styles.pointContent}>
              <Text style={[styles.pointLabel, { color: colors.espresso }]}>
                {point.label}
              </Text>
              <Text style={[styles.pointDesc, { color: colors.muted }]}>
                {point.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* pH note */}
      <View style={[styles.phNote, { backgroundColor: colors.successBg, borderColor: colors.olive }]}>
        <Text style={[styles.phText, { color: colors.olive }]}>
          🛡️ Final pH ≈{FINAL_PH.toFixed(1)} &nbsp;|&nbsp; Stable below {TARGET_PH.toFixed(1)} &nbsp;|&nbsp;
          Safe below pH {SAFETY_PH.toFixed(1)} &nbsp;|&nbsp; Fridge when you like the taste
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  summary: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  timelineList: {
    marginTop: Spacing.sm,
    gap: 0,
  },
  point: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dotCol: {
    alignItems: 'center',
    width: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 14,
  },
  pointContent: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  pointLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  pointDesc: {
    fontSize: FontSize.sm,
    lineHeight: 19,
  },
  phNote: {
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  phText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
});
