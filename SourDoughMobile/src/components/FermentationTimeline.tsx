import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { formatTempValue, formatTemp } from '../lib/unitConversion';
import { DynamicFermentation, RecipePreset } from '../models/types';
import { PROOF_FRACTION, computeProcessHours } from '../lib/calculations';

interface Props {
  dynamic?: DynamicFermentation | null;
  staticHours: number;
  staticNote: string;
  fdt: number;
  /** If a recipe preset is selected, compute full process end time (not just ferment) */
  preset?: RecipePreset | null;
}

/** Format a Date to a friendly time string like "2:30 PM" */
function formatClockTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}


export function FermentationTimeline({
  dynamic,
  staticHours,
  staticNote,
  fdt,
  preset,
}: Props) {
  const { unitSystem, colors } = useAppTheme();
  const now = new Date();
  const fermentHours = dynamic?.bulkHours ?? staticHours;
  const totalFermentHours = dynamic?.totalHours ?? staticHours;
  const proofHours = fermentHours * PROOF_FRACTION;
  const totalProcessHours = computeProcessHours(fermentHours, preset);

  const readyTime = new Date(now.getTime() + totalProcessHours * 3600000);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.muted }]}>⏱️  Fermentation</Text>

      <View style={styles.summary}>
        {dynamic ? (
          <>
            <View style={styles.hoursRow}>
              <Text style={[styles.hours, { color: colors.espresso }]}>
                ~{totalFermentHours.toFixed(1)}h total
              </Text>
              <Text style={[styles.readyLabel, { color: colors.muted }]}>
                Ready ≈ <Text style={[styles.readyTime, { color: colors.terracotta }]}>{formatClockTime(readyTime)}</Text>
              </Text>
            </View>
            <Text style={[styles.breakdown, { color: colors.muted }]}>
              Bulk ~{fermentHours.toFixed(1)}h + proof ~{proofHours.toFixed(1)}h
            </Text>
            {preset && preset.id !== 'custom' && (
              <Text style={[styles.breakdown, { color: colors.muted }]}>
                Full process ~{totalProcessHours.toFixed(1)}h: autolyse {preset.process.autolyseMinutes}min + bulk ~{fermentHours.toFixed(1)}h + proof ~{proofHours.toFixed(1)}h + bench/shape/bake
              </Text>
            )}
            <Text style={[styles.meta, { color: colors.muted }]}>
              Avg ambient: {formatTemp(dynamic.avgAmbient, unitSystem)} · Peak rate: {dynamic.peakRate}× baseline
            </Text>
          </>
        ) : (
          <>
            <View style={styles.hoursRow}>
              <Text style={[styles.hours, { color: colors.espresso }]}>~{staticHours.toFixed(1)}h bulk</Text>
              <Text style={[styles.readyLabel, { color: colors.muted }]}>
                Ready ≈ <Text style={[styles.readyTime, { color: colors.terracotta }]}>{formatClockTime(readyTime)}</Text>
              </Text>
            </View>
            <Text style={[styles.breakdown, { color: colors.muted }]}>
              Bulk ~{fermentHours.toFixed(1)}h + proof ~{proofHours.toFixed(1)}h
            </Text>
            {preset && preset.id !== 'custom' && (
              <Text style={[styles.breakdown, { color: colors.muted }]}>
                Full process ~{totalProcessHours.toFixed(1)}h: autolyse {preset.process.autolyseMinutes}min + bulk ~{fermentHours.toFixed(1)}h + proof ~{proofHours.toFixed(1)}h + bench/shape/bake
              </Text>
            )}
            <Text style={[styles.meta, { color: colors.muted }]}>{staticNote}</Text>
            <Text style={[styles.noForecast, { color: colors.muted }]}>
              ⚡ No hourly forecast — using constant-temp estimate
            </Text>
          </>
        )}
      </View>

      {dynamic && dynamic.profile.length > 0 && (
        <DynamicProfileTable profile={dynamic.profile} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  summary: {
    marginBottom: Spacing.md,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  hours: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  readyLabel: {
    fontSize: FontSize.sm,
  },
  readyTime: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  breakdown: {
    fontSize: FontSize.xs,
    marginTop: 2,
    fontStyle: 'italic',
  },
  meta: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  noForecast: {
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    marginTop: 4,
  },
  timeline: {
    marginTop: Spacing.sm,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  colProgress: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 18,
    position: 'relative',
  },
  barBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 3,
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 3,
    opacity: 0.6,
  },
  barLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginLeft: 4,
    zIndex: 1,
  },
});

// Text-specific styles (cannot be applied to View)
const textColHour = { fontSize: FontSize.xs, width: 48, fontWeight: '600' as const };
const textColTemp = { fontSize: FontSize.xs, width: 44, textAlign: 'right' as const };
const textColRate = { fontSize: FontSize.xs, width: 44, textAlign: 'right' as const };
const textColProgress = { fontSize: FontSize.xs, flex: 1, marginLeft: Spacing.sm };

// ── Dynamic Profile Table (collapsible) ──────────────────────────────────

function DynamicProfileTable({ profile }: { profile: DynamicFermentation['profile'] }) {
  const { unitSystem, colors } = useAppTheme();
  const [showAll, setShowAll] = useState(false);
  const INITIAL_ROWS = 12;
  const visible = showAll ? profile : profile.slice(0, INITIAL_ROWS);
  const hasMore = profile.length > INITIAL_ROWS;

  return (
    <View style={styles.timeline}>
      <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
        <Text style={[textColHour, { color: colors.espresso }]}>Time</Text>
        <Text style={[textColTemp, { color: colors.espresso }]}>Amb</Text>
        <Text style={[textColTemp, { color: colors.espresso }]}>Dough</Text>
        <Text style={[textColRate, { color: colors.espresso }]}>Rate</Text>
        <Text style={[textColProgress, { color: colors.espresso }]}>Progress</Text>
      </View>
      {visible.map((pt, i) => (
        <View style={styles.timelineRow} key={i}>
          <Text style={[textColHour, { color: colors.espresso }]}>{pt.hour}</Text>
          <Text style={[textColTemp, { color: colors.espresso }]}>{formatTempValue(pt.ambient, unitSystem)}°</Text>
          <Text style={[textColTemp, { color: colors.espresso }]}>{formatTempValue(pt.dough, unitSystem)}°</Text>
          <Text style={[textColRate, { color: colors.espresso }]}>{pt.rate}×</Text>
          <View style={styles.colProgress}>
            <View style={styles.barContainer}>
              <View style={[styles.barBg, { backgroundColor: colors.border }]} />
              <View
                style={[styles.barFill, { backgroundColor: colors.olive, width: `${pt.progress}%` }]}
              />
              <Text style={[styles.barLabel, { color: colors.espresso }]}>{pt.progress}%</Text>
            </View>
          </View>
        </View>
      ))}
      {hasMore && (
        <TouchableOpacity
          style={toggleStyles.btn}
          onPress={() => setShowAll(!showAll)}
          activeOpacity={0.7}
        >
          <Text style={[toggleStyles.text, { color: colors.terracotta }]}>
            {showAll ? 'Show less ▲' : `Show all ${profile.length} rows ▼`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const toggleStyles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
