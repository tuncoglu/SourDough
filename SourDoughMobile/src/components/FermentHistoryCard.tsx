/**
 * One row in the ferment history.
 *
 * Ferments are recorded automatically rather than saved, so the card shows
 * what was made, when, and the estimate it produced — plus a shortcut back
 * into the calculator with the same inputs.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyle } from '../theme';
import { FermentHistoryEntry } from '../models/types';
import { fermentSummary } from '../lib/fermentHistory';
import { Icon } from './Icon';
import { formatTemp } from '../lib/unitConversion';

interface Props {
  entry: FermentHistoryEntry;
  onLoad: () => void;
  onDelete: () => void;
}

/** "3 Sep" — the list is a timeline, so the year is only shown when it differs. */
function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

export function FermentHistoryCard({ entry, onLoad, onDelete }: Props) {
  const { colors, unitSystem } = useAppTheme();

  return (
    <View style={[cardStyle, styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={styles.emoji}>{entry.presetEmoji}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.espresso }]} numberOfLines={1}>
            {entry.presetName}
          </Text>
          <Text style={[styles.summary, { color: colors.muted }]} numberOfLines={1}>
            {fermentSummary(entry)}
          </Text>
        </View>
        <Text style={[styles.when, { color: colors.lightText }]}>{formatWhen(entry.createdAt)}</Text>
      </View>

      <View style={[styles.facts, { borderTopColor: colors.border }]}>
        <Fact
          colors={colors}
          label="estimate"
          value={`${entry.results.estimatedDays} days`}
        />
        <Fact
          colors={colors}
          label="salt"
          value={`${entry.results.saltGrams} g`}
        />
        <Fact
          colors={colors}
          label="at"
          value={formatTemp(entry.results.tempC, unitSystem, 0)}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onLoad}
          style={styles.action}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={`Load ${entry.presetName} back into the calculator`}
        >
          <Icon name="refresh" size={18} color={colors.terracotta} />
          <Text style={[styles.actionText, { color: colors.terracotta }]}>Calculate again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          style={styles.action}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${entry.presetName} from history`}
        >
          <Icon name="trash-can-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Fact({
  colors,
  label,
  value,
}: {
  colors: { muted: string; espresso: string };
  label: string;
  value: string;
}) {
  return (
    <View style={styles.fact}>
      <Text style={[styles.factValue, { color: colors.espresso }]}>{value}</Text>
      <Text style={[styles.factLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  emoji: { fontSize: 26 },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.md, fontWeight: '700' },
  summary: { fontSize: FontSize.xs, marginTop: 1 },
  when: { fontSize: FontSize.xs },
  facts: {
    flexDirection: 'row',
    gap: Spacing.lg,
    borderTopWidth: 1,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  fact: {},
  factValue: { fontSize: FontSize.sm, fontWeight: '700' },
  factLabel: { fontSize: FontSize.xs },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, minHeight: 32 },
  actionText: { fontSize: FontSize.sm, fontWeight: '600' },
});
