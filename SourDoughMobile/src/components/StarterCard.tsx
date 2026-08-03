import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { formatWeight, formatWeightValue, weightUnit } from '../lib/unitConversion';
import { FlourPicker } from './FlourPicker';
import { NumberInput } from './NumberInput';
import { StarterStatus } from '../models/types';
import { starterZoneColor } from '../lib/starterStatus';
import type { StarterTrackerState, StarterTrackerActions } from '../hooks/useStarterTracker';

interface Props extends StarterTrackerState, StarterTrackerActions {}

export function StarterCard(props: Props) {
  const { unitSystem, colors } = useAppTheme();
  const wu = weightUnit(unitSystem);
  const {
    expanded, setExpanded,
    lastFed, hoursSince, status,
    starterFlourLabel, setStarterFlourLabel,
    feedFlourGrams, setFeedFlourGrams,
    feedWaterGrams, setFeedWaterGrams,
    feedLogging, handleFeedNow,
    handleFridgeIn, handleFridgeOut,
    recentFeedings,
  } = props;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.collapsedRow}>
          <Text style={styles.icon}>
            {status?.isInFridge ? '❄️' : '🫙'}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.summary, { color: colors.espresso }]} numberOfLines={1}>
              {lastFed
                ? `${lastFed.flourGrams != null ? formatWeightValue(lastFed.flourGrams, unitSystem, 0) : '?'}${wu} flour + ${lastFed.waterGrams != null ? formatWeightValue(lastFed.waterGrams, unitSystem, 0) : '?'}${wu} water · ${hoursSince}h ago`
                : 'Tap to set up your starter'}
            </Text>
            {status && (
              <View style={styles.statusRow}>
                <Text style={[styles.statusHint, { color: starterZoneColor(status.zone, colors) ?? colors.muted }]}>
                  {status.emoji} {status.label}
                </Text>
                {status.effectiveHours !== status.hoursSinceFed && status.hoursSinceFed > 0 && (
                  <Text style={[styles.effectiveNote, { color: colors.lightText }]}>
                    (~{status.effectiveHours.toFixed(0)}h effective)
                  </Text>
                )}
              </View>
            )}
          </View>
          <Text style={[styles.chevron, { color: colors.muted }]}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.expanded, { borderTopColor: colors.border }]}>
          {/* Fridge controls */}
          <View style={styles.fridgeRow}>
            {status?.isInFridge ? (
              <TouchableOpacity
                style={[styles.fridgeOutBtn, { backgroundColor: colors.tipBg, borderColor: colors.warm }]}
                onPress={handleFridgeOut}
                activeOpacity={0.7}
                accessibilityLabel="Take starter out of fridge"
                accessibilityRole="button"
              >
                <Text style={[styles.fridgeOutBtnText, { color: colors.warm }]}>🌡️  Take out of fridge</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.fridgeInBtn, { backgroundColor: colors.coldBg, borderColor: colors.cold }]}
                onPress={handleFridgeIn}
                activeOpacity={0.7}
                accessibilityLabel="Put starter in fridge"
                accessibilityRole="button"
              >
                <Text style={[styles.fridgeInBtnText, { color: colors.cold }]}>❄️  Put in fridge</Text>
              </TouchableOpacity>
            )}
          </View>

          {status?.isInFridge && (
            <Text style={[styles.fridgeHint, { color: colors.muted }]}>
              Starter is dormant in the fridge — metabolic activity ~20× slower. Will keep for 1–2 weeks.
            </Text>
          )}

          {status && !status.isInFridge && status.hoursSinceFridgeOut > 0 && status.hoursSinceFridgeOut < 3 && (
            <Text style={[styles.warmupHint, { color: colors.warm, backgroundColor: colors.tipBg }]}>
              🌤️  Out of fridge {status.hoursSinceFridgeOut.toFixed(1)}h ago. Needs ~{((3 - status.hoursSinceFridgeOut) * 60).toFixed(0)} more minutes to fully activate.
            </Text>
          )}

          <View style={styles.expandedRow}>
            <Text style={[styles.expandedLabel, { color: colors.muted }]}>Flour</Text>
            <View style={{ flex: 1 }}>
              <FlourPicker
                value={starterFlourLabel}
                onSelect={(f) => setStarterFlourLabel(f.label)}
              />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.muted }]}>Log a Feed</Text>
          <NumberInput label="Flour used" value={feedFlourGrams} onChangeText={setFeedFlourGrams} unit="g" />
          <NumberInput label="Water used" value={feedWaterGrams} onChangeText={setFeedWaterGrams} unit="g" />
          <TouchableOpacity
            style={[styles.feedBtn, { backgroundColor: colors.olive }]}
            onPress={handleFeedNow}
            disabled={feedLogging}
            activeOpacity={0.7}
            accessibilityLabel="Log feeding"
            accessibilityRole="button"
          >
            {feedLogging ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={[styles.feedBtnText, { color: colors.white }]}>Log Feeding</Text>
            )}
          </TouchableOpacity>

          {lastFed && (
            <Text style={[styles.lastFedText, { color: colors.muted }]}>
              Last fed: {new Date(lastFed.timestamp).toLocaleString()}
            </Text>
          )}
          {recentFeedings.length > 0 && (
            <View style={[styles.historyList, { borderTopColor: colors.border }]}>
              {recentFeedings.map((f) => (
                <Text key={f.id} style={[styles.historyItem, { color: colors.muted }]}>
                  {new Date(f.timestamp).toLocaleString([], {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                  {' · '}
                  {f.flourGrams != null ? formatWeight(f.flourGrams, unitSystem, 0) : '?'} flour + {f.waterGrams != null ? formatWeight(f.waterGrams, unitSystem, 0) : '?'} water
                  {f.fridgeAt ? ' · ❄️ fridged' : ''}
                  {f.outOfFridgeAt ? ' · 🌡️ out' : ''}
                  {' · '}{f.flourUsed.replace(/\s*\([^)]*\)$/, '')}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.md, marginBottom: Spacing.md,
  },
  cardHeader: { padding: Spacing.md },
  collapsedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  icon: { fontSize: 18 },
  summary: { fontSize: FontSize.sm, fontWeight: '500' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 2 },
  statusHint: { fontSize: FontSize.xs, fontWeight: '500' },
  effectiveNote: { fontSize: FontSize.xs, fontStyle: 'italic' },
  chevron: { fontSize: FontSize.xs },
  expanded: {
    marginTop: Spacing.md, paddingTop: Spacing.md, paddingHorizontal: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth, gap: Spacing.sm,
  },
  expandedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  expandedLabel: { width: 40, fontSize: FontSize.sm, fontWeight: '500' },
  sectionTitle: {
    fontSize: FontSize.xs, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5, marginTop: Spacing.sm, marginBottom: Spacing.xs,
  },
  feedBtn: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, alignItems: 'center',
  },
  feedBtnText: { fontSize: FontSize.xs, fontWeight: '700' },
  lastFedText: { fontSize: FontSize.xs },
  historyList: {
    marginTop: Spacing.xs, paddingTop: Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  historyItem: { fontSize: FontSize.xs, paddingVertical: 1 },
  // Fridge controls
  fridgeRow: { marginBottom: Spacing.xs },
  fridgeInBtn: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, alignItems: 'center',
    borderWidth: 1,
  },
  fridgeInBtnText: { fontSize: FontSize.sm, fontWeight: '700' },
  fridgeOutBtn: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, alignItems: 'center',
    borderWidth: 1,
  },
  fridgeOutBtnText: { fontSize: FontSize.sm, fontWeight: '700' },
  fridgeHint: { fontSize: FontSize.xs, fontStyle: 'italic' },
  warmupHint: {
    fontSize: FontSize.xs, fontWeight: '500',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
  },
});
