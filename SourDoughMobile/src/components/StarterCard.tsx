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
import { StarterStatus } from '../models/types';
import type { StarterTrackerState, StarterTrackerActions } from '../hooks/useStarterTracker';

interface Props extends StarterTrackerState, StarterTrackerActions {}

export function StarterCard(props: Props) {
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
    <View style={styles.card}>
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
            <Text style={styles.summary} numberOfLines={1}>
              {lastFed
                ? `${lastFed.flourGrams ?? '?'}g flour + ${lastFed.waterGrams ?? '?'}g water · ${hoursSince}h ago`
                : 'Tap to set up your starter'}
            </Text>
            {status && (
              <View style={styles.statusRow}>
                <Text style={[styles.statusHint, status.color ? { color: status.color } : undefined]}>
                  {status.emoji} {status.label}
                </Text>
                {status.effectiveHours !== status.hoursSinceFed && status.hoursSinceFed > 0 && (
                  <Text style={styles.effectiveNote}>
                    (~{status.effectiveHours.toFixed(0)}h effective)
                  </Text>
                )}
              </View>
            )}
          </View>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expanded}>
          {/* Fridge controls */}
          <View style={styles.fridgeRow}>
            {status?.isInFridge ? (
              <TouchableOpacity style={styles.fridgeOutBtn} onPress={handleFridgeOut} activeOpacity={0.7}>
                <Text style={styles.fridgeOutBtnText}>🌡️  Take out of fridge</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.fridgeInBtn} onPress={handleFridgeIn} activeOpacity={0.7}>
                <Text style={styles.fridgeInBtnText}>❄️  Put in fridge</Text>
              </TouchableOpacity>
            )}
          </View>

          {status?.isInFridge && (
            <Text style={styles.fridgeHint}>
              Starter is dormant in the fridge — metabolic activity ~20× slower. Will keep for 1–2 weeks.
            </Text>
          )}

          {status && !status.isInFridge && status.hoursSinceFridgeOut > 0 && status.hoursSinceFridgeOut < 3 && (
            <Text style={styles.warmupHint}>
              🌤️  Out of fridge {status.hoursSinceFridgeOut.toFixed(1)}h ago. Needs ~{((3 - status.hoursSinceFridgeOut) * 60).toFixed(0)} more minutes to fully activate.
            </Text>
          )}

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
                  {f.flourGrams != null ? `${f.flourGrams}g` : '?'} flour + {f.waterGrams != null ? `${f.waterGrams}g` : '?'} water
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
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, marginBottom: Spacing.md,
  },
  cardHeader: { padding: Spacing.md },
  collapsedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  icon: { fontSize: 18 },
  summary: { fontSize: FontSize.sm, color: Colors.espresso, fontWeight: '500' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 2 },
  statusHint: { fontSize: FontSize.xs, color: Colors.muted, fontWeight: '500' },
  effectiveNote: { fontSize: 10, color: Colors.lightText, fontStyle: 'italic' },
  chevron: { fontSize: FontSize.xs, color: Colors.muted },
  expanded: {
    marginTop: Spacing.md, paddingTop: Spacing.md, paddingHorizontal: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border, gap: Spacing.sm,
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
  // Fridge controls
  fridgeRow: { marginBottom: Spacing.xs },
  fridgeInBtn: {
    backgroundColor: '#E8F0FE', borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, alignItems: 'center',
    borderWidth: 1, borderColor: '#B8D4F0',
  },
  fridgeInBtnText: { color: '#4A90D9', fontSize: FontSize.sm, fontWeight: '700' },
  fridgeOutBtn: {
    backgroundColor: '#FDF3E8', borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, alignItems: 'center',
    borderWidth: 1, borderColor: '#F0C8A0',
  },
  fridgeOutBtnText: { color: Colors.warm, fontSize: FontSize.sm, fontWeight: '700' },
  fridgeHint: { fontSize: FontSize.xs, color: Colors.muted, fontStyle: 'italic' },
  warmupHint: {
    fontSize: FontSize.xs, color: '#E8A040', fontWeight: '500',
    backgroundColor: '#FFF8F0', borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
  },
});
