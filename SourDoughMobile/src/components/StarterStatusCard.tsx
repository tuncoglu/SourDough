import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, cardStyle, sectionTitleStyle, useAppTheme } from '../theme';
import type { StarterFeeding, StarterStatus } from '../models/types';
import { starterPace, starterZoneColor } from '../lib/starterStatus';
import { clockTime, dayAndTime, hoursLabel, shortDay } from '../lib/starterFormat';
import type { PeakForecast } from '../lib/starterLog';
import { computeVitalityFactor } from '../lib/calculations';

interface Props {
  status: StarterStatus | null;
  feeding: StarterFeeding | null;
  roomTempC: number;
  /** Where the kitchen temperature came from, so the card can say when it is only an outdoor reading. */
  tempSource: 'settings' | 'forecast' | 'default';
  peak: PeakForecast | null;
  onFeedNow: () => void;
  onMarkPeaked: () => void;
  onIntoFridge: () => void;
  onOutOfFridge: () => void;
}

export function StarterStatusCard({
  status, feeding, roomTempC, tempSource, peak, onFeedNow, onMarkPeaked, onIntoFridge, onOutOfFridge,
}: Props) {
  const { colors } = useAppTheme();

  if (!feeding || !status) {
    return (
      <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[sectionTitleStyle, { color: colors.muted }]}>YOUR STARTER</Text>
        <Text style={[styles.title, { color: colors.espresso }]}>Nothing logged yet.</Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          Log a feeding below and the app follows your starter from there: how lively it is, when it peaks, and how that changes the rise.
          {feeding && !status ? ' Your last feeding is too old to go on, so feed it to start again.' : ''}
        </Text>
        <TouchableOpacity onPress={onFeedNow} accessibilityRole="button" style={[styles.primary, { backgroundColor: colors.terracotta }]}>
          <Text style={[styles.primaryText, { color: colors.white }]}>Log a feeding</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const zoneColor = starterZoneColor(status.zone, { ideal: colors.ideal, hot: colors.hot, cold: colors.cold }) ?? colors.espresso;
  const activity = Math.round(computeVitalityFactor(status.effectiveHours) * 100);
  const pace = Math.round(starterPace(roomTempC) * 100);
  const onCounter = !status.isInFridge;
  const canMarkPeak = onCounter && !feeding.peakedAt && (status.zone === 'peak' || status.zone === 'past-peak');

  return (
    <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[sectionTitleStyle, { color: colors.muted }]}>YOUR STARTER</Text>
      <View style={[styles.zone, { backgroundColor: colors.badgeBg, borderColor: zoneColor }]} accessibilityRole="header">
        <Text style={[styles.zoneText, { color: zoneColor }]}>{status.emoji}  {status.label}</Text>
      </View>
      <Text style={[styles.big, { color: colors.terracotta }]}>
        {hoursLabel(status.hoursSinceFed)}
        <Text style={[styles.bigLabel, { color: colors.espresso }]}>  since last fed</Text>
      </Text>

      <Row label="Last fed" value={dayAndTime(feeding.timestamp)} />
      <Row label="Into the fridge" value={feeding.fridgeAt ? dayAndTime(feeding.fridgeAt) : 'Not yet'} />
      {feeding.outOfFridgeAt && <Row label="Out of the fridge" value={dayAndTime(feeding.outOfFridgeAt)} />}
      <Row label="Effective age" value={hoursLabel(status.effectiveHours)} />
      <Row label={`Your kitchen, ${Math.round(roomTempC)}°C`} value={`${pace}% of the 22°C pace`} />
      <Row label="Activity" value={`${activity}% of peak`} last />

      {tempSource !== 'settings' && (
        <Text style={[styles.hint, { color: colors.muted }]}>
          {tempSource === 'forecast'
            ? 'This is the outdoor temperature. A kitchen is usually warmer, so set yours in Settings (Kitchen temperature) for a truer pace.'
            : 'No temperature found, so the pace assumes 22°C. Set your kitchen temperature in Settings.'}
        </Text>
      )}

      {peak && onCounter && (
        <View style={[styles.note, { backgroundColor: colors.tipBg, borderLeftColor: colors.terracotta }]}>
          <Text style={[styles.noteTitle, { color: colors.espresso }]}>
            {status.zone === 'peak'
              ? 'At peak now.'
              : `Peaks about ${clockTime(peak.peakAt)}${shortDay(peak.peakAt) !== shortDay(new Date()) ? `, ${shortDay(peak.peakAt)}` : ''}.`}
          </Text>
          <Text style={[styles.noteBody, { color: colors.muted }]}>
            Window {clockTime(peak.window.from)} to {clockTime(peak.window.to)}. Mixing inside it keeps the starter at 95% or more of its peak activity.
          </Text>
        </View>
      )}
      {status.isInFridge && (
        <View style={[styles.note, { backgroundColor: colors.tipBg, borderLeftColor: colors.terracotta }]}>
          <Text style={[styles.noteTitle, { color: colors.espresso }]}>Fridge time counts at about 6%.</Text>
          <Text style={[styles.noteBody, { color: colors.muted }]}>
            Out of the fridge, a starter needs about 3 hours to warm up.
          </Text>
        </View>
      )}

      {status.isInFridge ? (
        <TouchableOpacity onPress={onOutOfFridge} accessibilityRole="button" style={[styles.primary, { backgroundColor: colors.terracotta }]}>
          <Text style={[styles.primaryText, { color: colors.white }]}>Take it out of the fridge</Text>
        </TouchableOpacity>
      ) : canMarkPeak ? (
        <TouchableOpacity onPress={onMarkPeaked} accessibilityRole="button" style={[styles.primary, { backgroundColor: colors.terracotta }]}>
          <Text style={[styles.primaryText, { color: colors.white }]}>Mark as peaked</Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.row}>
        <TouchableOpacity onPress={onFeedNow} accessibilityRole="button" style={[styles.secondary, { borderColor: colors.terracotta }]}>
          <Text style={[styles.secondaryText, { color: colors.terracotta }]}>Feed it now</Text>
        </TouchableOpacity>
        {onCounter && (
          <TouchableOpacity onPress={onIntoFridge} accessibilityRole="button" style={[styles.secondary, { borderColor: colors.terracotta }]}>
            <Text style={[styles.secondaryText, { color: colors.terracotta }]}>Into the fridge</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.kv, !last && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.kvLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.kvValue, { color: colors.espresso }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: FontSize.lg, fontWeight: '700' },
  body: { fontSize: FontSize.sm, lineHeight: 21, marginTop: Spacing.xs },
  zone: { alignSelf: 'flex-start', borderWidth: 2, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, marginBottom: Spacing.sm },
  zoneText: { fontSize: FontSize.sm, fontWeight: '700' },
  big: { fontFamily: 'Georgia', fontSize: FontSize.title + 7, fontWeight: '700', marginBottom: Spacing.sm },
  bigLabel: { fontFamily: undefined, fontSize: FontSize.sm, fontWeight: '600' },
  kv: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md, paddingVertical: Spacing.sm },
  kvLabel: { fontSize: FontSize.sm, flexShrink: 1 },
  kvValue: { fontSize: FontSize.sm, fontWeight: '700', textAlign: 'right', flexShrink: 1 },
  hint: { fontSize: FontSize.xs, lineHeight: 17, marginTop: Spacing.sm },
  note: { borderLeftWidth: 5, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md },
  noteTitle: { fontSize: FontSize.sm, fontWeight: '700' },
  noteBody: { fontSize: FontSize.xs, lineHeight: 18, marginTop: 2 },
  primary: { minHeight: 52, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.md },
  primaryText: { fontSize: FontSize.md, fontWeight: '700' },
  row: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', marginTop: Spacing.md },
  secondary: { minHeight: 44, paddingHorizontal: Spacing.lg, borderWidth: 2, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontSize: FontSize.sm, fontWeight: '700' },
});
