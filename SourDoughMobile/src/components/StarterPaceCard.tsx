import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, cardStyle, sectionTitleStyle, useAppTheme } from '../theme';
import {
  DEFAULT_PEAK_EFFECTIVE_HOURS,
  PEAKS_NEEDED_TO_LEARN,
  PEAK_ZONE_END_HOURS,
  PEAK_ZONE_START_HOURS,
  starterPace,
  starterTimeToPeakHours,
} from '../lib/starterStatus';
import { FEED_RATIOS } from '../lib/starterLog';
import { hoursLabel } from '../lib/starterFormat';

const TEMPS = [18, 20, 24, 27] as const;
/** Upper ends of the four zones, in effective hours (the last is open). */
const ZONES = [
  { name: 'Just fed', from: 0, to: PEAK_ZONE_START_HOURS },
  { name: 'At peak', from: PEAK_ZONE_START_HOURS, to: PEAK_ZONE_END_HOURS },
  { name: 'Past peak', from: PEAK_ZONE_END_HOURS, to: 14 },
  { name: 'Hungry', from: 14, to: null },
] as const;

interface Props {
  roomTempC: number;
  peakEffectiveHours: number;
  /** How many feedings the user has marked as peaked. */
  markedPeaks: number;
  /** Peaks the learned figure rests on, or null while using the default. */
  learnedFromPeaks: number | null;
}

/** How fast the starter runs here, the zones in clock time, and whether the app has learned this starter. */
export function StarterPaceCard({ roomTempC, peakEffectiveHours, markedPeaks, learnedFromPeaks }: Props) {
  const { colors } = useAppTheme();
  const pace = starterPace(roomTempC);
  // The column nearest the kitchen is the one that applies.
  const nearest = TEMPS.reduce((best, t) => (Math.abs(t - roomTempC) < Math.abs(best - roomTempC) ? t : best), TEMPS[0]);
  const clock = (effective: number) => (effective * (peakEffectiveHours / DEFAULT_PEAK_EFFECTIVE_HOURS)) / pace;

  return (
    <>
      <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[sectionTitleStyle, { color: colors.muted }]}>HOW FAST IT RUNS</Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          A starter works faster when it is warm, and a bigger feed takes longer to peak. Hours from a feed to its peak, by ratio and kitchen temperature (estimates):
        </Text>
        <View style={[styles.tr, { borderBottomColor: colors.border }]}>
          <Text style={[styles.th, styles.first, { color: colors.muted }]}>Ratio</Text>
          {TEMPS.map((t) => (
            <Text key={t} style={[styles.th, styles.cell, { color: colors.muted }]}>{t}°C</Text>
          ))}
        </View>
        {FEED_RATIOS.map((r) => (
          <View key={r} style={[styles.tr, { borderBottomColor: colors.border }]}>
            <Text style={[styles.td, styles.first, { color: colors.espresso }]}>{`1 : ${r} : ${r}`}</Text>
            {TEMPS.map((t) => {
              const h = starterTimeToPeakHours({ roomTempC: t, dilution: 1 + 2 * r, peakEffectiveHours });
              return (
                <Text
                  key={t}
                  style={[styles.td, styles.cell, { color: colors.espresso }, t === nearest && { fontWeight: '800', backgroundColor: colors.badgeBg }]}
                >
                  {Math.round(h * 10) / 10}
                </Text>
              );
            })}
          </View>
        ))}
        {roomTempC >= 26 && (
          <View style={[styles.warn, { backgroundColor: colors.warningBg, borderLeftColor: colors.hot }]}>
            <Text style={[styles.noteTitle, { color: colors.espresso }]}>Warm kitchen</Text>
            <Text style={[styles.noteBody, { color: colors.muted }]}>
              A 1 : 1 : 1 feed peaks fast and is past its window within hours. Feed a bigger ratio, or keep the jar somewhere cooler. This is baker guidance, not measured data.
            </Text>
          </View>
        )}

        <Text style={[styles.sub, { color: colors.espresso }]}>The zones, at your {Math.round(roomTempC)}°C and 1 : 1 : 1</Text>
        {ZONES.map((z) => (
          <View key={z.name} style={[styles.tr, { borderBottomColor: colors.border }]}>
            <Text style={[styles.td, styles.first, { color: colors.espresso }]}>{z.name}</Text>
            <Text style={[styles.td, styles.cell, { color: colors.muted }]}>
              {z.to === null ? `over ${z.from} h` : `${z.from} to ${z.to} h`}
            </Text>
            <Text style={[styles.td, styles.cell2, { color: colors.espresso }]}>
              {z.to === null ? `over ${hoursLabel(clock(z.from))}` : `${hoursLabel(clock(z.from))} to ${hoursLabel(clock(z.to))}`}
            </Text>
          </View>
        ))}
        <Text style={[styles.hint, { color: colors.muted }]}>
          Effective hours are warm-equivalent time at 22°C. Fridge time counts at about 6%.
        </Text>
      </View>

      <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[sectionTitleStyle, { color: colors.muted }]}>YOUR STARTER'S OWN PEAK</Text>
        {learnedFromPeaks !== null ? (
          <Text style={[styles.body, { color: colors.espresso }]}>
            Using <Text style={styles.bold}>{peakEffectiveHours} effective hours</Text>, the median of {learnedFromPeaks} peaks you marked. The default is {DEFAULT_PEAK_EFFECTIVE_HOURS}.
          </Text>
        ) : (
          <Text style={[styles.body, { color: colors.espresso }]}>
            Using the default <Text style={styles.bold}>{DEFAULT_PEAK_EFFECTIVE_HOURS} effective hours</Text>. After {PEAKS_NEEDED_TO_LEARN} marked peaks at similar feed sizes the app uses your starter's own.
            {' '}Marked so far: {markedPeaks}.
          </Text>
        )}
        <Text style={[styles.hint, { color: colors.muted }]}>
          Tap "Mark as peaked" when the starter is domed and just starting to fall. The app turns the clock time into effective hours for that day's kitchen, so a warm day and a cool day count the same.
          {' '}The 6-hour default is this app's own figure, and baker guides only roughly agree. No controlled study was found, so the temperature and feed-size effects are reasoned estimates. That is why it learns from you.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: FontSize.sm, lineHeight: 21, marginBottom: Spacing.sm },
  bold: { fontWeight: '800' },
  hint: { fontSize: FontSize.xs, lineHeight: 17, marginTop: Spacing.sm },
  sub: { fontSize: FontSize.sm, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.xs },
  tr: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs + 2, borderBottomWidth: StyleSheet.hairlineWidth },
  th: { fontSize: FontSize.xs, fontWeight: '700' },
  td: { fontSize: FontSize.sm },
  first: { flex: 1.3 },
  cell: { flex: 1, textAlign: 'right', paddingHorizontal: 4 },
  cell2: { flex: 1.6, textAlign: 'right', paddingHorizontal: 4 },
  warn: { borderLeftWidth: 5, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md },
  noteTitle: { fontSize: FontSize.sm, fontWeight: '700' },
  noteBody: { fontSize: FontSize.xs, lineHeight: 18, marginTop: 2 },
});
