/**
 * "Add to Google Calendar" card for the lacto-fermentation results panel.
 *
 * Builds pre-filled Google Calendar events (see src/lib/calendar.ts) for the
 * milestones that actually matter when a jar is fermenting: the day it should
 * be ready, the first taste check, and a bar covering the whole ferment.
 *
 * No native calendar module, no permissions, no account — the link opens
 * Google Calendar with everything filled in and the user presses Save.
 */
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme, AppColors, cardStyleLg } from '../theme';
import { FermentMethod, FermentResults, LactoDayPoint } from '../models/types';
import { FermentTiming } from '../lib/lactoCalculations';
import { Icon, IconName } from './Icon';
import {
  FermentCalendarInput,
  FermentEventKind,
  addDays,
  buildFermentCalendarUrl,
  fermentReadyDate,
  formatEventDate,
} from '../lib/calendar';
import { useFeedback } from '../lib/feedback';

interface Props {
  presetName: string;
  presetEmoji: string;
  vegName: string;
  method: FermentMethod;
  vegWeightG: number;
  waterG: number;
  saltG: number;
  saltPct: number;
  saltLabel: string;
  tempC: number;
  results: FermentResults;
  timeline: LactoDayPoint[];
  /** Conditions behind the estimate, copied into the event description. */
  timing?: FermentTiming | null;
}

export function AddToCalendarCard(props: Props) {
  const {
    presetName, presetEmoji, vegName, method,
    vegWeightG, waterG, saltG, saltPct, saltLabel, tempC,
    results, timeline, timing,
  } = props;
  const { colors, unitSystem } = useAppTheme();
  const { showToast } = useFeedback();

  // The ferment starts when the user is looking at this screen (day 0 = today).
  const calendarInput: FermentCalendarInput = useMemo(() => ({
    presetName,
    presetEmoji,
    vegName,
    method,
    vegWeightG,
    waterG,
    saltG,
    saltPct,
    saltLabel,
    tempC,
    estimatedDays: results.estimatedDays,
    estimatedDaysMin: results.estimatedDaysMin,
    estimatedDaysMax: results.estimatedDaysMax,
    timeline,
    timing,
    unitSystem,
  }), [
    presetName, presetEmoji, vegName, method, vegWeightG, waterG, saltG,
    saltPct, saltLabel, tempC, results, timeline, timing, unitSystem,
  ]);

  const today = useMemo(() => new Date(), []);
  const readyDate = useMemo(
    () => fermentReadyDate({ ...calendarInput, startDate: today }),
    [calendarInput, today],
  );
  const tasteDay = Math.max(1, Math.round(results.estimatedDaysMin));
  const readyDay = Math.max(1, Math.ceil(results.estimatedDays));
  const tasteDate = useMemo(
    () => addDays(today, Math.min(tasteDay, readyDay)),
    [today, tasteDay, readyDay],
  );

  const openEvent = useCallback(async (kind: FermentEventKind) => {
    const url = buildFermentCalendarUrl(kind, { ...calendarInput, startDate: new Date() });
    try {
      await Linking.openURL(url);
    } catch {
      showToast('Could not open Google Calendar on this device.', 'error');
    }
  }, [calendarInput, showToast]);

  return (
    <View style={[cardStyleLg, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.titleRow}>
        <Icon name="calendar-outline" size={18} color={colors.espresso} />
        <Text style={[styles.title, { color: colors.espresso }]}>Google Calendar</Text>
      </View>

      <Text style={[styles.summary, { color: colors.muted }]}>
        {presetEmoji} {presetName} takes about{' '}
        <Text style={{ color: colors.terracotta, fontWeight: '700' }}>
          {Math.round(results.estimatedDays)} days
        </Text>
        . Starting today, it should be ready on{' '}
        <Text style={{ color: colors.espresso, fontWeight: '700' }}>
          {formatEventDate(readyDate)}
        </Text>
        .
      </Text>

      {/* Primary action — the reminder people actually want */}
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: colors.terracotta }]}
        onPress={() => openEvent('ready')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Add ready-day reminder to Google Calendar for ${formatEventDate(readyDate)}`}
      >
        <View style={styles.btnRow}>
          <Icon name="bell-outline" size={18} color={colors.white} />
          <Text style={[styles.primaryBtnText, { color: colors.white }]}>
            Remind me when it's ready
          </Text>
        </View>
        <Text style={[styles.primaryBtnSub, { color: colors.white }]}>
          day {readyDay} · {formatEventDate(readyDate)}
        </Text>
      </TouchableOpacity>

      {/* Secondary actions */}
      <View style={styles.secondaryRow}>
        <SecondaryButton
          colors={colors}
          icon="silverware-fork-knife"
          label="Taste check"
          sublabel={`day ${tasteDay} · ${formatEventDate(tasteDate)}`}
          accessibilityLabel={`Add a taste-check reminder to Google Calendar on day ${tasteDay}`}
          onPress={() => openEvent('taste')}
        />
        <SecondaryButton
          colors={colors}
          icon="timer-sand"
          label="Whole ferment"
          sublabel={`day 0–${readyDay}`}
          accessibilityLabel="Add the whole ferment as a multi-day Google Calendar event"
          onPress={() => openEvent('span')}
        />
      </View>

      <Text style={[styles.footnote, { color: colors.lightText }]}>
        Opens Google Calendar with the batch, salt and day-by-day schedule filled in — just press Save.
      </Text>
    </View>
  );
}

function SecondaryButton({
  colors,
  icon,
  label,
  sublabel,
  accessibilityLabel,
  onPress,
}: {
  colors: AppColors;
  icon: IconName;
  label: string;
  sublabel: string;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.secondaryBtn, { borderColor: colors.border, backgroundColor: colors.white }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.btnRow}>
        <Icon name={icon} size={16} color={colors.espresso} />
        <Text style={[styles.secondaryLabel, { color: colors.espresso }]}>{label}</Text>
      </View>
      <Text style={[styles.secondarySub, { color: colors.lightText }]}>{sublabel}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  summary: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  primaryBtn: {
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    gap: 2,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  primaryBtnText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  primaryBtnSub: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    opacity: 0.9,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    gap: 2,
    minHeight: 44,
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  secondarySub: {
    fontSize: FontSize.xs,
  },
  footnote: {
    fontSize: FontSize.xs,
    lineHeight: 17,
    marginTop: Spacing.sm,
  },
});
