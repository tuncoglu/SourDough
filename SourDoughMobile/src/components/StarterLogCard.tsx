import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, cardStyle, sectionTitleStyle, useAppTheme } from '../theme';
import type { StarterFeeding } from '@sourdough/calc/models/types';
import { ratioLabel } from '@sourdough/calc/lib/starterLog';
import { dayAndTime, spanLabel } from '@sourdough/calc/lib/starterFormat';
import { feedDilution, feedSizeFactor, starterPace } from '@sourdough/calc/lib/starterStatus';

/** How many feedings the list shows (the store keeps many more). */
const SHOWN = 12;

interface Props {
  feedings: StarterFeeding[];
  onMarkPeaked: (id: string) => void;
  onIntoFridge: (id: string) => void;
  onOutOfFridge: (id: string) => void;
}

function amounts(f: StarterFeeding): string {
  const parts: string[] = [];
  if (f.starterKeptGrams) parts.push(`${f.starterKeptGrams} g starter`);
  parts.push(`${f.flourGrams} g flour`, `${f.waterGrams} g water`);
  return `${ratioLabel(f)} · ${parts.join(' + ')}`;
}

/** Effective hours a marked peak came to, for display. */
function peakEffective(f: StarterFeeding): string | null {
  if (!f.peakedAt || f.roomTempC === undefined) return null;
  const clock = (new Date(f.peakedAt).getTime() - new Date(f.timestamp).getTime()) / 3_600_000;
  if (!Number.isFinite(clock) || clock <= 0) return null;
  return `${Math.round(((clock * starterPace(f.roomTempC)) / feedSizeFactor(feedDilution(f))) * 10) / 10} effective hours`;
}

/** The feeding log, newest first. Only the newest can be marked as peaked or moved in and out of the fridge. */
export function StarterLogCard({ feedings, onMarkPeaked, onIntoFridge, onOutOfFridge }: Props) {
  const { colors } = useAppTheme();
  if (feedings.length === 0) return null;

  return (
    <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[sectionTitleStyle, { color: colors.muted }]}>FEEDING LOG</Text>
      {feedings.slice(0, SHOWN).map((f, i) => {
        const inFridge = !!f.fridgeAt && !f.outOfFridgeAt;
        const tag = inFridge ? 'in the fridge' : f.fridgeAt ? 'out of the fridge' : 'on the counter';
        const eff = peakEffective(f);
        return (
          <View
            key={f.id}
            style={[
              styles.entry,
              { borderColor: i === 0 ? colors.terracotta : colors.border, borderWidth: i === 0 ? 2 : 1, backgroundColor: colors.white },
            ]}
          >
            <View style={styles.head}>
              <Text style={[styles.date, { color: colors.espresso }]}>{dayAndTime(f.timestamp)}</Text>
              <Text style={[styles.tag, { color: i === 0 ? colors.white : colors.muted, backgroundColor: i === 0 ? colors.terracotta : colors.badgeBg }]}>{tag}</Text>
            </View>
            <Text style={[styles.line, { color: colors.muted }]}>{amounts(f)}</Text>
            <Text style={[styles.line, { color: colors.muted }]}>{f.flourUsed}</Text>
            {f.fridgeAt && (
              <Text style={[styles.line, { color: colors.muted }]}>
                Fridge {dayAndTime(f.fridgeAt)}{f.outOfFridgeAt ? ` · out ${dayAndTime(f.outOfFridgeAt)}` : ''}
              </Text>
            )}
            {f.peakedAt ? (
              <Text style={[styles.line, { color: colors.espresso }]}>
                Peaked after {spanLabel(f.timestamp, f.peakedAt)}{eff ? ` · ${eff}` : ''}
              </Text>
            ) : f.fridgeAt && !f.outOfFridgeAt ? (
              <Text style={[styles.line, { color: colors.muted }]}>Straight into the fridge, so no peak logged.</Text>
            ) : null}
            {f.notes ? <Text style={[styles.line, { color: colors.espresso }]}>{f.notes}</Text> : null}

            {i === 0 && (
              <View style={styles.actions}>
                {!f.peakedAt && !inFridge && (
                  <TouchableOpacity onPress={() => onMarkPeaked(f.id)} accessibilityRole="button" style={[styles.btn, { borderColor: colors.terracotta }]}>
                    <Text style={[styles.btnText, { color: colors.terracotta }]}>Mark as peaked</Text>
                  </TouchableOpacity>
                )}
                {inFridge ? (
                  <TouchableOpacity onPress={() => onOutOfFridge(f.id)} accessibilityRole="button" style={[styles.btn, { borderColor: colors.terracotta }]}>
                    <Text style={[styles.btnText, { color: colors.terracotta }]}>Out of the fridge</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => onIntoFridge(f.id)} accessibilityRole="button" style={[styles.btn, { borderColor: colors.terracotta }]}>
                    <Text style={[styles.btnText, { color: colors.terracotta }]}>Into the fridge</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      })}
      <Text style={[styles.foot, { color: colors.muted }]}>The log keeps your last 500 feedings on this device.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  entry: { borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  date: { fontSize: FontSize.sm, fontWeight: '700' },
  tag: { fontSize: FontSize.xs, fontWeight: '700', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm, overflow: 'hidden' },
  line: { fontSize: FontSize.xs, lineHeight: 18, marginTop: 2 },
  actions: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', marginTop: Spacing.sm },
  btn: { minHeight: 44, paddingHorizontal: Spacing.lg, borderWidth: 2, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: FontSize.sm, fontWeight: '700' },
  foot: { fontSize: FontSize.xs, marginTop: Spacing.xs },
});
