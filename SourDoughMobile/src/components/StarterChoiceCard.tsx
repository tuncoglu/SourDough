import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing, FontSize, BorderRadius, cardStyle, sectionTitleStyle, useAppTheme } from '../theme';
import { Chip } from './Chip';
import type { StarterStatus } from '../models/types';
import { FEED_RATIOS } from '../lib/starterLog';
import { hoursLabel } from '../lib/starterFormat';
import { formatHours } from '../lib/lazyMethod';

export type StarterMode = 'fridge' | 'fed';

interface Props {
  mode: StarterMode;
  onMode: (m: StarterMode) => void;
  ratio: number;
  onRatio: (r: number) => void;
  /** The starter's state from the log, if there is a usable one. */
  status: StarterStatus | null;
  /** Rise (bulk) hours for each choice, so the person can compare them. */
  riseHours: { fridge: number | null; fed: number | null };
  /** How lively the starter is in the chosen mode, % of its peak. */
  activityPct: number | null;
  /** The starter's temperature in the chosen mode, formatted for display. */
  starterTempText: string;
  /** Hours from a feed to the peak at this ratio (null when the kitchen temperature is not known). */
  timeToPeakHours: number | null;
  peakWindowHours: { from: number; to: number } | null;
  /** The feed for this loaf, formatted for display. */
  feedText: string;
  /** Shown once a feeding was made for this loaf. */
  peakText: string | null;
}

/** How the starter goes into this loaf: straight from the fridge, or fed first and mixed at its peak. */
export function StarterChoiceCard({
  mode, onMode, ratio, onRatio, status, riseHours, activityPct, starterTempText, timeToPeakHours, peakWindowHours, feedText, peakText,
}: Props) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const fed = mode === 'fed';

  const option = (key: StarterMode, title: string, hint: string, rise: number | null) => {
    const selected = mode === key;
    return (
      <TouchableOpacity
        key={key}
        onPress={() => onMode(key)}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        style={[styles.option, {
          borderColor: selected ? colors.terracotta : colors.border,
          borderWidth: selected ? 2 : 1,
          backgroundColor: selected ? colors.tipBg : colors.white,
        }]}
      >
        <Text style={[styles.optionTitle, { color: colors.espresso }]}>{title}</Text>
        <Text style={[styles.optionHint, { color: colors.muted }]}>
          {hint}{rise != null ? ` The rise takes about ${formatHours(rise)}.` : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[sectionTitleStyle, { color: colors.muted }]}>YOUR STARTER</Text>

      {status ? (
        <Text style={[styles.state, { color: colors.espresso }]}>
          {status.emoji}  {status.label}
          <Text style={[styles.stateSub, { color: colors.muted }]}>  ·  effective age {hoursLabel(status.effectiveHours)}</Text>
        </Text>
      ) : (
        <Text style={[styles.stateSub, { color: colors.muted }]}>
          No feedings logged, so this assumes a fridge-cold starter at full strength.{' '}
          <Text style={{ color: colors.terracotta, fontWeight: '700' }} onPress={() => router.push('/starter')} accessibilityRole="link">
            Log your feedings
          </Text>
          {' '}and the plan follows your starter.
        </Text>
      )}

      <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel="How to use the starter">
        {option('fed', 'Feed it first, mix at peak', 'Feed it a few hours before you mix, then mix when it peaks.', riseHours.fed)}
        {option('fridge', 'Straight from the fridge', 'Least effort: mix straight away.', riseHours.fridge)}
      </View>

      {fed && (
        <>
          <Text style={[styles.label, { color: colors.espresso }]}>Feed ratio (starter : flour : water)</Text>
          <View style={styles.chips}>
            {FEED_RATIOS.map((r) => (
              <Chip key={r} selected={ratio === r} onPress={() => onRatio(r)} label={`Ratio 1 to ${r} to ${r}`}>
                <Text style={[styles.chipText, { color: ratio === r ? colors.white : colors.espresso }]}>{`1 : ${r} : ${r}`}</Text>
              </Chip>
            ))}
          </View>
          <Text style={[styles.hint, { color: colors.muted }]}>
            A bigger feed peaks later. Pick the ratio that puts the peak at a time that suits you.
          </Text>
          <Text style={[styles.feed, { color: colors.espresso }]}>{feedText}</Text>
        </>
      )}

      <View style={[styles.kvBox, { borderTopColor: colors.border }]}>
        {activityPct !== null && <Kv label="Starter activity" value={`${activityPct}% of peak`} />}
        <Kv label="Starter temperature" value={starterTempText} />
        {fed && timeToPeakHours !== null && <Kv label="Time to peak" value={`about ${hoursLabel(timeToPeakHours)}`} />}
        {fed && peakWindowHours && <Kv label="Peak window" value={`${hoursLabel(peakWindowHours.from)} to ${hoursLabel(peakWindowHours.to)} after the feed`} last />}
      </View>

      {peakText && (
        <View style={[styles.note, { backgroundColor: colors.successBg, borderLeftColor: colors.olive }]}>
          <Text style={[styles.noteText, { color: colors.espresso }]}>{peakText}</Text>
        </View>
      )}

      <Text style={[styles.hint, { color: colors.muted }]}>
        {fed
          ? 'The starter you kept is fed with the rest, so after mixing the jar goes straight back into the fridge. No second feed.'
          : 'After you mix, refresh the jar with equal weights of flour and water, then put it back in the fridge.'}
        {' '}Activity and timing are estimates that follow your kitchen, and the app learns your starter's own peak from the peaks you mark.
      </Text>
    </View>
  );
}

function Kv({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.kv, !last && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.kvLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.kvValue, { color: colors.espresso }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  state: { fontSize: FontSize.sm, fontWeight: '700' },
  stateSub: { fontSize: FontSize.xs, lineHeight: 18, fontWeight: '400' },
  options: { gap: Spacing.sm, marginTop: Spacing.md },
  option: { borderRadius: BorderRadius.md, padding: Spacing.md, minHeight: 52 },
  optionTitle: { fontSize: FontSize.md, fontWeight: '700' },
  optionHint: { fontSize: FontSize.xs, lineHeight: 18, marginTop: 2 },
  label: { fontSize: FontSize.sm, fontWeight: '600', marginTop: Spacing.lg, marginBottom: Spacing.xs },
  chips: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  chipText: { fontSize: FontSize.sm, fontWeight: '700' },
  hint: { fontSize: FontSize.xs, lineHeight: 17, marginTop: Spacing.sm },
  feed: { fontSize: FontSize.sm, fontWeight: '700', marginTop: Spacing.sm },
  kvBox: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: Spacing.md, paddingTop: Spacing.xs },
  kv: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md, paddingVertical: Spacing.sm },
  kvLabel: { fontSize: FontSize.sm, flexShrink: 1 },
  kvValue: { fontSize: FontSize.sm, fontWeight: '700', textAlign: 'right', flexShrink: 1 },
  note: { borderLeftWidth: 5, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md },
  noteText: { fontSize: FontSize.sm, lineHeight: 20 },
});
