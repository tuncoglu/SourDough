import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';
import { DynamicFermentation } from '../models/types';

interface Props {
  dynamic?: DynamicFermentation | null;
  staticHours: number;
  staticNote: string;
  fdt: number;
}

export function FermentationTimeline({
  dynamic,
  staticHours,
  staticNote,
  fdt,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>⏱️  Fermentation</Text>

      <View style={styles.summary}>
        {dynamic ? (
          <>
            <Text style={styles.hours}>
              ~{dynamic.totalHours.toFixed(1)} hours
            </Text>
            <Text style={styles.meta}>
              Avg ambient: {dynamic.avgAmbient}°C · Peak rate: {dynamic.peakRate}× baseline
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.hours}>~{staticHours.toFixed(1)} hours</Text>
            <Text style={styles.meta}>{staticNote}</Text>
            <Text style={styles.noForecast}>
              ⚡ No hourly forecast — using constant-temp estimate
            </Text>
          </>
        )}
      </View>

      {dynamic && dynamic.profile.length > 0 && (
        <View style={styles.timeline}>
          <View style={styles.tableHeader}>
            <Text style={textColHour}>Hour</Text>
            <Text style={textColTemp}>Amb</Text>
            <Text style={textColTemp}>Dough</Text>
            <Text style={textColRate}>Rate</Text>
            <Text style={textColProgress}>Progress</Text>
          </View>
          {dynamic.profile.slice(0, 12).map((pt, i) => (
            <View style={styles.timelineRow} key={i}>
              <Text style={textColHour}>{pt.hour}</Text>
              <Text style={textColTemp}>{pt.ambient}°</Text>
              <Text style={textColTemp}>{pt.dough}°</Text>
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
        </View>
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
  hours: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.espresso,
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
    fontSize: 9,
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
