import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, cardStyle, sectionTitleStyle, useAppTheme } from '../theme';
import { Chip } from './Chip';
import { FlourMix } from './FlourMix';
import { NumberInput } from './NumberInput';
import { findFlour } from '@sourdough/calc/lib/flourSearch';
import { feedDilution, starterPeakWindowHours, starterTimeToPeakHours } from '@sourdough/calc/lib/starterStatus';
import { DEFAULT_KEPT_GRAMS, FEED_RATIOS, amountsForRatio, ratioLabel } from '@sourdough/calc/lib/starterLog';
import { clockTime, hoursLabel } from '@sourdough/calc/lib/starterFormat';
import type { FlourEntry } from '@sourdough/calc/models/types';
import type { MixRow } from '../hooks/useCalculatorInputs';

interface Props {
  /** The flour the starter is usually fed with. */
  defaultFlourLabel: string;
  /** The starter's hydration, %. */
  hydration: number;
  roomTempC: number;
  peakEffectiveHours: number;
  onFeed: (draft: {
    flours: { label: string; grams: string }[];
    waterGrams: string;
    keptGrams: string;
    notes?: string;
  }) => Promise<boolean>;
}

let rowKey = 0;
const newKey = () => `feed_flour_${rowKey++}`;

/** Feed the starter now: how much to keep, what to feed it (one to three flours) and the ratio. */
export function StarterFeedCard({ defaultFlourLabel, hydration, roomTempC, peakEffectiveHours, onFeed }: Props) {
  const { colors } = useAppTheme();
  const [rows, setRows] = useState<MixRow[]>(() => [
    { key: newKey(), flour: findFlour(defaultFlourLabel), grams: String(DEFAULT_KEPT_GRAMS) },
  ]);
  const [kept, setKept] = useState(String(DEFAULT_KEPT_GRAMS));
  const [water, setWater] = useState(String(DEFAULT_KEPT_GRAMS));
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [logged, setLogged] = useState(false);

  const flourTotal = rows.reduce((s, r) => s + (parseFloat(r.grams) || 0), 0);
  const keptNum = parseFloat(kept) || 0;
  const waterNum = parseFloat(water) || 0;
  const feed = { starterKeptGrams: keptNum, flourGrams: flourTotal, waterGrams: waterNum };
  const totalInJar = keptNum + flourTotal + waterNum;

  const peak = useMemo(() => {
    if (flourTotal <= 0 || waterNum <= 0) return null;
    const hours = starterTimeToPeakHours({
      roomTempC,
      dilution: feedDilution(feed),
      peakEffectiveHours,
    });
    return { hours, window: starterPeakWindowHours(hours) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTempC, peakEffectiveHours, keptNum, flourTotal, waterNum]);

  const touch = () => setLogged(false);

  /** Set the flour and water for a 1 : r : r feed of the starter you keep. */
  const applyRatio = (r: number) => {
    touch();
    const { flourGrams, waterGrams } = amountsForRatio({ keptGrams: keptNum, ratio: r, hydration });
    setWater(String(waterGrams));
    setRows((prev) => {
      const total = prev.reduce((s, x) => s + (parseFloat(x.grams) || 0), 0);
      return prev.map((x) => ({
        ...x,
        grams: String(
          prev.length === 1
            ? flourGrams
            : Math.round(flourGrams * (total > 0 ? (parseFloat(x.grams) || 0) / total : 1 / prev.length)),
        ),
      }));
    });
  };

  const submit = async () => {
    setBusy(true);
    try {
      const ok = await onFeed({
        flours: rows.map((r) => ({ label: r.flour.label, grams: r.grams })),
        waterGrams: water,
        keptGrams: kept,
        notes,
      });
      if (ok) {
        setLogged(true);
        setNotes('');
      }
    } finally {
      setBusy(false);
    }
  };

  const canFeed = flourTotal > 0 && waterNum > 0 && !busy;

  return (
    <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[sectionTitleStyle, { color: colors.muted }]}>FEED IT</Text>
      <Text style={[styles.hint, { color: colors.muted }]}>
        Keep some starter in the jar, then add flour and water. For a loaf that mixes at its peak, the bread page tells you when.
      </Text>

      <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel="Feed ratio">
        {FEED_RATIOS.map((r) => {
          const selected = ratioLabel(feed) === `1 : ${r} : ${r}`;
          return (
            <Chip key={r} selected={selected} onPress={() => applyRatio(r)} label={`Ratio 1 to ${r} to ${r}`}>
              <Text style={[styles.chipText, { color: selected ? colors.white : colors.espresso }]}>{`1 : ${r} : ${r}`}</Text>
            </Chip>
          );
        })}
      </View>

      <NumberInput label="Starter kept in the jar" value={kept} unit="g" onChangeText={(v) => { touch(); setKept(v); }} />
      <Text style={[styles.label, { color: colors.espresso }]}>Flour</Text>
      <FlourMix
        rows={rows}
        onAdd={() => { touch(); setRows((p) => (p.length < 3 ? [...p, { key: newKey(), flour: findFlour('Generic: Bread Flour'), grams: '' }] : p)); }}
        onRemove={(key) => { touch(); setRows((p) => p.filter((r) => r.key !== key)); }}
        onUpdateFlour={(key, flour: FlourEntry) => { touch(); setRows((p) => p.map((r) => (r.key === key ? { ...r, flour } : r))); }}
        onUpdateGrams={(key, grams) => { touch(); setRows((p) => p.map((r) => (r.key === key ? { ...r, grams } : r))); }}
      />
      <NumberInput label="Water" value={water} unit="g" onChangeText={(v) => { touch(); setWater(v); }} />

      <View style={[styles.summary, { backgroundColor: colors.tipBg }]}>
        <Text style={[styles.summaryTitle, { color: colors.espresso }]}>
          {ratioLabel(feed)}: {Math.round(totalInJar)} g in all
        </Text>
        {peak ? (
          <Text style={[styles.summaryBody, { color: colors.muted }]}>
            Peaks in about {hoursLabel(peak.hours)} at {Math.round(roomTempC)}°C, between {hoursLabel(peak.window.from)} and {hoursLabel(peak.window.to)}.
            {' '}Fed now, that is around {clockTime(new Date(Date.now() + peak.hours * 3_600_000))}.
          </Text>
        ) : (
          <Text style={[styles.summaryBody, { color: colors.muted }]}>Enter the flour and water to see when it peaks.</Text>
        )}
      </View>

      <Text style={[styles.label, { color: colors.espresso }]}>Notes</Text>
      <TextInput
        value={notes}
        onChangeText={(t) => { touch(); setNotes(t); }}
        placeholder="Optional"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Notes"
        style={[styles.notes, { color: colors.espresso, borderColor: colors.border, backgroundColor: colors.white }]}
      />

      <TouchableOpacity
        onPress={submit}
        disabled={!canFeed}
        accessibilityRole="button"
        style={[styles.primary, { backgroundColor: colors.terracotta, opacity: canFeed ? 1 : 0.5 }]}
      >
        <Text style={[styles.primaryText, { color: colors.white }]}>{logged ? 'Logged. Feed again' : "I've fed it"}</Text>
      </TouchableOpacity>
      {logged && (
        <Text style={[styles.hint, { color: colors.olive }]} accessibilityLiveRegion="polite">
          Logged. The app now follows this feeding.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chipText: { fontSize: FontSize.sm, fontWeight: '700' },
  hint: { fontSize: FontSize.xs, lineHeight: 17, marginBottom: Spacing.sm },
  chips: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', marginBottom: Spacing.sm },
  label: { fontSize: FontSize.sm, fontWeight: '600', marginTop: Spacing.md, marginBottom: Spacing.xs },
  summary: { borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md },
  summaryTitle: { fontSize: FontSize.sm, fontWeight: '700' },
  summaryBody: { fontSize: FontSize.xs, lineHeight: 18, marginTop: 2 },
  notes: { borderWidth: 1, borderRadius: BorderRadius.md, minHeight: 48, paddingHorizontal: Spacing.md, fontSize: FontSize.md },
  primary: { minHeight: 56, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.lg },
  primaryText: { fontSize: FontSize.md, fontWeight: '700' },
});
