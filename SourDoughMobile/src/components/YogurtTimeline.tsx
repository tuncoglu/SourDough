import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { YogurtStepPoint, YogurtResults } from '../models/types';

interface Props {
  timeline: YogurtStepPoint[];
  results: YogurtResults;
}

export function YogurtTimeline({ timeline, results }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.espresso }]}>📅 Timeline</Text>

      {/* Summary */}
      <Text style={[styles.summary, { color: colors.muted }]}>
        Incubation takes about{' '}
        <Text style={{ color: colors.terracotta, fontWeight: '700' }}>
          {results.incubationHours} hours
        </Text>
        . Check from hour {Math.round(results.incubationHoursMin)}; ready by hour{' '}
        {Math.round(results.incubationHoursMax)}.
      </Text>

      {/* Step markers */}
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

      {/* Temperature note */}
      <View style={[styles.tempNote, { backgroundColor: '#FFF8F3', borderColor: colors.warm }]}>
        <Text style={[styles.tempText, { color: colors.warm }]}>
          🌡 Keep temperature stable during incubation · Temperature swings cause graininess · Refrigerate 4h after completion to fully set
        </Text>
      </View>
    </View>
  );
}

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
  tempNote: {
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  tempText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
});
