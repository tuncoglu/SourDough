import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { formatTempValue, formatTemp } from '../lib/unitConversion';
import { DynamicFermentation, RecipePreset } from '../models/types';
import { PROOF_FRACTION } from '../lib/calculations';

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

/**
 * Compute the full process time from NOW until bread is out of the oven.
 * Includes: autolyse (before bulk), bulk ferment, bench rest, shaping,
 * proof, scoring, and bake.
 *
 * Folds happen during bulk fermentation so they don't add extra time.
 */
function fullProcessHours(fermentHours: number, preset: RecipePreset | null | undefined): number {
  const proofHours = fermentHours * PROOF_FRACTION;
  if (!preset || preset.id === 'custom') return fermentHours + proofHours;
  const { process, bake } = preset;
  return (
    process.autolyseMinutes / 60 +
    fermentHours +
    process.benchRestMinutes / 60 +
    5 / 60 +  // shaping
    proofHours +
    1 / 60 +  // scoring
    bake.bakeTimeMinutes / 60
  );
}

export function FermentationTimeline({
  dynamic,
  staticHours,
  staticNote,
  fdt,
  preset,
}: Props) {
  const { unitSystem } = useAppTheme();
  const now = new Date();
  const fermentHours = dynamic?.bulkHours ?? staticHours;
  const totalFermentHours = dynamic?.totalHours ?? staticHours;
  const proofHours = fermentHours * PROOF_FRACTION;
  const totalProcessHours = fullProcessHours(fermentHours, preset);

  const readyTime = new Date(now.getTime() + totalProcessHours * 3600000);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>⏱️  Fermentation</Text>

      <View style={styles.summary}>
        {dynamic ? (
          <>
            <View style={styles.hoursRow}>
              <Text style={styles.hours}>
                ~{totalFermentHours.toFixed(1)}h total
              </Text>
              <Text style={styles.readyLabel}>
                Ready ≈ <Text style={styles.readyTime}>{formatClockTime(readyTime)}</Text>
              </Text>
            </View>
            <Text style={styles.breakdown}>
              Bulk ~{fermentHours.toFixed(1)}h + proof ~{proofHours.toFixed(1)}h
            </Text>
            {preset && preset.id !== 'custom' && (
              <Text style={styles.breakdown}>
                Full process ~{totalProcessHours.toFixed(1)}h: autolyse {preset.process.autolyseMinutes}min + bulk ~{fermentHours.toFixed(1)}h + proof ~{proofHours.toFixed(1)}h + bench/shape/bake
              </Text>
            )}
            <Text style={styles.meta}>
              Avg ambient: {formatTemp(dynamic.avgAmbient, unitSystem)} · Peak rate: {dynamic.peakRate}× baseline
            </Text>
          </>
        ) : (
          <>
            <View style={styles.hoursRow}>
              <Text style={styles.hours}>~{staticHours.toFixed(1)}h bulk</Text>
              <Text style={styles.readyLabel}>
                Ready ≈ <Text style={styles.readyTime}>{formatClockTime(readyTime)}</Text>
              </Text>
            </View>
            <Text style={styles.breakdown}>
              Bulk ~{fermentHours.toFixed(1)}h + proof ~{proofHours.toFixed(1)}h
            </Text>
            {preset && preset.id !== 'custom' && (
              <Text style={styles.breakdown}>
                Full process ~{totalProcessHours.toFixed(1)}h: autolyse {preset.process.autolyseMinutes}min + bulk ~{fermentHours.toFixed(1)}h + proof ~{proofHours.toFixed(1)}h + bench/shape/bake
              </Text>
            )}
            <Text style={styles.meta}>{staticNote}</Text>
            <Text style={styles.noForecast}>
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
    color: Colors.espresso,
  },
  readyLabel: {
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  readyTime: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.terracotta,
  },
  breakdown: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginTop: 2,
    fontStyle: 'italic',
  },
  meta: {
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginTop: 2,
  },
  noForecast: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  timeline: {
    marginTop: Spacing.sm,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 4,
    marginBottom: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  col: {
    fontSize: FontSize.xs,
    color: Colors.espresso,
  },
  colHour: {
    width: 48,
    fontWeight: '600',
  },
  colTemp: {
    width: 44,
    textAlign: 'right',
  },
  colRate: {
    width: 44,
    textAlign: 'right',
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
    backgroundColor: '#F0EBE5',
    borderRadius: 3,
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.olive,
    borderRadius: 3,
    opacity: 0.6,
  },
  barLabel: {
    fontSize: FontSize.xs,
    color: Colors.espresso,
    fontWeight: '600',
    marginLeft: 4,
    zIndex: 1,
  },
});

// Text-specific styles (cannot be applied to View)
const textColHour = { fontSize: FontSize.xs, color: Colors.espresso, width: 48, fontWeight: '600' as const };
const textColTemp = { fontSize: FontSize.xs, color: Colors.espresso, width: 44, textAlign: 'right' as const };
const textColRate = { fontSize: FontSize.xs, color: Colors.espresso, width: 44, textAlign: 'right' as const };
const textColProgress = { fontSize: FontSize.xs, color: Colors.espresso, flex: 1, marginLeft: Spacing.sm };

// ── Dynamic Profile Table (collapsible) ──────────────────────────────────

function DynamicProfileTable({ profile }: { profile: DynamicFermentation['profile'] }) {
  const { unitSystem } = useAppTheme();
  const [showAll, setShowAll] = useState(false);
  const INITIAL_ROWS = 12;
  const visible = showAll ? profile : profile.slice(0, INITIAL_ROWS);
  const hasMore = profile.length > INITIAL_ROWS;

  return (
    <View style={styles.timeline}>
      <View style={styles.tableHeader}>
        <Text style={textColHour}>Time</Text>
        <Text style={textColTemp}>Amb</Text>
        <Text style={textColTemp}>Dough</Text>
        <Text style={textColRate}>Rate</Text>
        <Text style={textColProgress}>Progress</Text>
      </View>
      {visible.map((pt, i) => (
        <View style={styles.timelineRow} key={i}>
          <Text style={textColHour}>{pt.hour}</Text>
          <Text style={textColTemp}>{formatTempValue(pt.ambient, unitSystem)}°</Text>
          <Text style={textColTemp}>{formatTempValue(pt.dough, unitSystem)}°</Text>
          <Text style={textColRate}>{pt.rate}×</Text>
          <View style={styles.colProgress}>
            <View style={styles.barContainer}>
              <View
                style={[styles.barFill, { width: `${pt.progress}%` as any }]}
              />
              <View style={styles.barBg} />
              <Text style={styles.barLabel}>{pt.progress}%</Text>
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
          <Text style={toggleStyles.text}>
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
    color: Colors.terracotta,
    fontWeight: '600',
  },
});
