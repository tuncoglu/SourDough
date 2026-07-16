import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';
import { FlourPicker } from './FlourPicker';
import { NumberInput } from './NumberInput';
import { StarterFeeding } from '../models/types';
import type { StarterTrackerState, StarterTrackerActions } from '../hooks/useStarterTracker';

interface Props extends StarterTrackerState, StarterTrackerActions {}

function getStatus(hoursSince: string): { emoji: string; label: string; color?: string } | null {
  const h = parseFloat(hoursSince);
  if (isNaN(h)) return null;
  if (h <= 4) return { emoji: '🌱', label: 'Just fed — building strength' };
  if (h <= 8) return { emoji: '🟢', label: 'At peak activity — great time to bake!', color: Colors.olive };
  if (h <= 14) return { emoji: '🟡', label: 'Still active but past peak' };
  if (h <= 24) return { emoji: '🟠', label: 'Slowing down — feed soon', color: Colors.warm };
  return { emoji: '🔴', label: 'Hungry — time to feed!', color: Colors.error };
}

export function StarterCard(props: Props) {
  const {
    expanded, setExpanded,
    lastFed, hoursSince,
    starterFlourLabel, setStarterFlourLabel,
    feedFlourGrams, setFeedFlourGrams,
    feedWaterGrams, setFeedWaterGrams,
    feedLogging, handleFeedNow,
    recentFeedings,
  } = props;

  const status = getStatus(hoursSince);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.collapsedRow}>
          <Text style={styles.icon}>🫙</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.summary} numberOfLines={1}>
              {lastFed
                ? `${lastFed.flourGrams ?? '?'}g flour + ${lastFed.waterGrams ?? '?'}g water · ${hoursSince}h ago`
                : 'Tap to set up your starter'}
            </Text>
            {status && (
              <Text style={[styles.statusHint, status.color ? { color: status.color } : undefined]}>
                {status.emoji} {status.label}
              </Text>
            )}
          </View>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expanded}>
          <View style={styles.expandedRow}>
            <Text style={styles.expandedLabel}>Flour</Text>
            <View style={{ flex: 1 }}>
              <FlourPicker
                value={starterFlourLabel}
                onSelect={(f) => setStarterFlourLabel(f.label)}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Log a Feed</Text>
          <NumberInput label="Flour used" value={feedFlourGrams} onChangeText={setFeedFlourGrams} unit="g" />
          <NumberInput label="Water used" value={feedWaterGrams} onChangeText={setFeedWaterGrams} unit="g" />
          <TouchableOpacity
            style={styles.feedBtn}
            onPress={handleFeedNow}
            disabled={feedLogging}
            activeOpacity={0.7}
          >
            {feedLogging ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.feedBtnText}>Log Feeding</Text>
            )}
          </TouchableOpacity>

          {lastFed && (
            <Text style={styles.lastFedText}>
              Last fed: {new Date(lastFed.timestamp).toLocaleString()}
            </Text>
          )}
          {recentFeedings.length > 0 && (
            <View style={styles.historyList}>
              {recentFeedings.map((f) => (
                <Text key={f.id} style={styles.historyItem}>
                  {new Date(f.timestamp).toLocaleString([], {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                  {' · '}
                  {f.flourGrams != null ? `${f.flourGrams}g` : '?'} flour + {f.waterGrams != null ? `${f.waterGrams}g` : '?'} water · {f.flourUsed.replace(/\s*\([^)]*\)$/, '')}
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
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  cardHeader: { padding: Spacing.md },
  collapsedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  icon: { fontSize: 18 },
  summary: { fontSize: FontSize.sm, color: Colors.espresso, fontWeight: '500' },
  statusHint: { fontSize: FontSize.xs, color: Colors.muted, marginTop: 2, fontWeight: '500' },
  chevron: { fontSize: FontSize.xs, color: Colors.muted },
  expanded: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  expandedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  expandedLabel: { width: 40, fontSize: FontSize.sm, color: Colors.muted, fontWeight: '500' },
  sectionTitle: {
    fontSize: FontSize.xs, fontWeight: '700', color: Colors.muted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginTop: Spacing.sm, marginBottom: Spacing.xs,
  },
  feedBtn: {
    backgroundColor: Colors.olive, borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, alignItems: 'center',
  },
  feedBtnText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: '700' },
  lastFedText: { fontSize: FontSize.xs, color: Colors.muted },
  historyList: {
    marginTop: Spacing.xs, paddingTop: Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border,
  },
  historyItem: { fontSize: FontSize.xs, color: Colors.muted, paddingVertical: 1 },
});
