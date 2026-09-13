import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyleLg } from '../theme';
import { LactoDayPoint, FermentResults } from '../models/types';
import { FINAL_PH, TARGET_PH, SAFETY_PH, readinessPH, FermentTiming } from '../lib/lactoCalculations';
import { formatTemp } from '../lib/unitConversion';

/** Recipes are written at 22 °C — shown in the user's own units. */
const REFERENCE_TEMP_C = 22;

interface Props {
  timeline: LactoDayPoint[];
  results: FermentResults;
  /** What moved the estimate — recipe anchor plus each applied adjustment. */
  timing?: FermentTiming | null;
}

export function LactoTimeline({ timeline, results, timing }: Props) {
  const { colors, unitSystem } = useAppTheme();

  return (
    <View style={[cardStyleLg, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.espresso }]}>📅 Timeline</Text>

      {/* Summary — or an honest "this won't work here" when it won't. */}
      {timing?.stalled ? (
        <View style={[styles.stall, { backgroundColor: colors.warningBg, borderColor: colors.hot }]}>
          <Text style={[styles.stallTitle, { color: colors.error }]}>
            {timing.stallReason === 'hot'
              ? '🔥 Too warm for lactic acid bacteria'
              : '❄️ Too cold to ferment'}
          </Text>
          <Text style={[styles.stallBody, { color: colors.muted }]}>
            {timing.stallReason === 'hot'
              ? `At ${Math.round(timing.tempC)} °C the LAB that sour your vegetables are inhibited, and `
                + 'spoilage organisms take over instead. Move the jar somewhere below 30 °C.'
              : `At ${Math.round(timing.tempC)} °C LAB are effectively dormant, so this jar will not sour in any `
                + 'useful time — cold is how you *stop* a ferment. Move it somewhere 18–24 °C, or leave it cold '
                + 'for a very slow, very gradual change.'}
          </Text>
        </View>
      ) : (
        <Text style={[styles.summary, { color: colors.muted }]}>
          Ready to refrigerate in about{' '}
          <Text style={{ color: colors.terracotta, fontWeight: '700' }}>
            {results.estimatedDays} days
          </Text>
          . Taste from day {Math.round(results.estimatedDaysMin)}; leave it past day{' '}
          {Math.round(results.estimatedDaysMax)} for a deeper sour.
        </Text>
      )}

      {/* Where the number comes from — the estimate is adjusted to the user's
          kitchen, not a fixed figure, and this is the arithmetic behind it. */}
      {timing && (
        <View style={[styles.factors, { backgroundColor: colors.tipBg, borderColor: colors.border }]}>
          <Text style={[styles.factorsTitle, { color: colors.muted }]}>
            RECIPE BASELINE {timing.referenceDays} DAYS AT {formatTemp(REFERENCE_TEMP_C, unitSystem, 0).toUpperCase()}
          </Text>
          {timing.factors.map((f) => (
            <View key={f.id} style={styles.factorRow}>
              <Text style={[styles.factorLabel, { color: colors.muted }]} numberOfLines={1}>
                {f.label}
              </Text>
              <Text
                style={[
                  styles.factorValue,
                  {
                    color: f.daysDelta
                      ? colors.olive
                      : f.factor > 1.005 ? colors.warm : f.factor < 0.995 ? colors.olive : colors.lightText,
                  },
                ]}
              >
                {f.daysDelta ? `${f.daysDelta.toFixed(1)} d` : `×${f.factor.toFixed(2)}`}
              </Text>
            </View>
          ))}
        </View>
      )}

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

      {/* The two clocks: the planning date is when it is safe and pleasantly
          sour; a genuine full sour (pH ≈3.5) is a different, much later date. */}
      <Text style={[styles.twoClocks, { color: colors.lightText }]}>
        Two dates, not one. The figure above is when it is safe (below pH 4.6) and good to eat.
        It keeps souring after that — in the jar, and slowly in the fridge — so leave it longer
        for a sharper, more complex ferment.
      </Text>

      {/* pH note */}
      <View style={[styles.phNote, { backgroundColor: colors.successBg, borderColor: colors.olive }]}>
        <Text style={[styles.phText, { color: colors.olive }]}>
          🛡️ Safe below pH {SAFETY_PH.toFixed(1)} &nbsp;|&nbsp; Stable below {TARGET_PH.toFixed(1)} &nbsp;|&nbsp; Final ≈{FINAL_PH.toFixed(1)}
          {timing ? `\n👅 At ${timing.tempC.toFixed(0)} °C it tastes ready around pH ${readinessPH(timing.tempC).toFixed(1)} — fridge when you like it` : ''}
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
  stall: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  stallTitle: {
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  stallBody: {
    fontSize: FontSize.sm,
    lineHeight: 19,
  },
  twoClocks: {
    fontSize: FontSize.xs,
    lineHeight: 17,
    marginTop: Spacing.sm,
  },
  factors: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    gap: 2,
  },
  factorsTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  factorLabel: {
    flex: 1,
    fontSize: FontSize.xs,
  },
  factorValue: {
    fontSize: FontSize.xs,
    fontWeight: '700',
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
