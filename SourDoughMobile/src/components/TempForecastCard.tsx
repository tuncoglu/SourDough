/**
 * Day-by-day temperature forecast bar card.
 *
 * Shared by the yogurt and lacto-fermentation screens, which previously
 * copy-pasted the same bar math with different titles, color thresholds,
 * and summary suffixes. The color thresholds differ per screen, so the
 * caller supplies a `dayColor` function.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { DailyTempSummary, FermentTempResult } from '../lib/lactoCalculations';
import { formatTempValue } from '../lib/unitConversion';

interface Props {
  dailyTemps: DailyTempSummary[];
  title: string;
  /** Summary line from the temp engine (or a fallback string). */
  summary: string;
  /** Source of the summary — appends the "enable location" hint when fallback. */
  source?: FermentTempResult['source'];
  /** Whether location/weather is available at all — the "enable location"
   *  hint is only appended when fallback AND location is actually off
   *  (not when the weather fetch merely failed). */
  locationEnabled?: boolean;
  /** Additional screen-specific suffixes (e.g. yogurt culture hints). */
  suffixes?: string[];
  /** Map an average daily temp (°C) to a theme color. */
  dayColor: (avg: number) => string;
}

export function TempForecastCard({
  dailyTemps,
  title,
  summary,
  source,
  locationEnabled = false,
  suffixes,
  dayColor,
}: Props) {
  const { colors, unitSystem } = useAppTheme();
  const days = dailyTemps.slice(0, 10);
  const summaryText = [
    summary,
    source === 'fallback' && !locationEnabled ? ' — enable location for local temps' : '',
    ...(suffixes ?? []),
  ].filter(Boolean).join('');

  // Hoisted — computed once instead of inside the .map (was O(n²))
  const allHigh = Math.max(...days.map((x) => x.high));
  const allLow = Math.min(...days.map((x) => x.low));
  const range = allHigh - allLow || 1;

  return (
    <View style={[styles.tempCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.tempTitle, { color: colors.espresso }]}>{title}</Text>
      <View style={styles.tempDays}>
        {days.map((d, i, arr) => {
          // Show only actual forecast days — stop before repeated data
          if (i > 0 && d.high === arr[i - 1].high && d.low === arr[i - 1].low) return null;
          const topPct = ((allHigh - d.high) / range) * 100;
          const heightPct = ((d.high - d.low) / range) * 100;
          return (
            <View key={i} style={styles.tempDay}>
              <Text style={[styles.tempDayLabel, { color: colors.muted }]}>{d.day}</Text>
              <Text style={[styles.tempDayHigh, { color: colors.espresso }]}>{formatTempValue(d.high, unitSystem, 0)}°</Text>
              <View style={[styles.tempBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.tempBarFill,
                    {
                      backgroundColor: dayColor(d.avg),
                      top: `${topPct}%`,
                      height: `${Math.max(8, heightPct)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.tempDayLow, { color: colors.lightText }]}>{formatTempValue(d.low, unitSystem, 0)}°</Text>
            </View>
          );
        })}
      </View>
      <Text style={[styles.tempSummary, { color: colors.lightText, borderTopColor: colors.border }]}>
        {summaryText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tempCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tempTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  tempDays: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tempDay: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tempDayLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  tempDayHigh: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  tempBar: {
    width: '100%',
    height: 28,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  tempBarFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 4,
    minHeight: 4,
  },
  tempDayLow: {
    fontSize: 11,
  },
  tempSummary: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
  },
});
