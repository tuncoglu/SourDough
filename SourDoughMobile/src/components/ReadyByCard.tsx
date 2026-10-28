import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, cardStyle, sectionTitleStyle, useAppTheme } from '../theme';
import { Chip } from './Chip';
import type { LazyPlan, ProofMode } from '@sourdough/calc/lib/lazyPlan';
import { LAZY_PLAN_MINUTES, FRIDGE_HOURS } from '@sourdough/calc/lib/lazyPlan';
import { clockTime, shortDay } from '@sourdough/calc/lib/starterFormat';
import { dayFromNow } from '@sourdough/calc/lib/lazySchedule';

export type PlanMode = 'now' | 'readyBy';

interface Props {
  mode: PlanMode;
  onMode: (m: PlanMode) => void;
  now: Date;
  dayOffset: number;
  onDay: (offset: number) => void;
  time: string;
  onTime: (t: string) => void;
  timeInvalid: boolean;
  proofMode: ProofMode;
  onProof: (p: ProofMode) => void;
  fridgeHours: string;
  onFridgeHours: (h: string) => void;
  plan: LazyPlan | null;
  /** The plan runs from when the dough was actually mixed. */
  mixed: boolean;
  /** Feeding first, so the plan has a feed. */
  fed: boolean;
  /** When the oven should go on (cocotte), if it should. */
  ovenOn: Date | null;
  /** The earliest it can be ready if started now. */
  earliest: Date | null;
  /** The chosen time needs a start that has already passed. */
  tooEarly: boolean;
  onUseEarliest: () => void;
  /** Something to tell the person about the plan (for example, it will be ready later than asked). */
  note: string | null;
}

/** When a moment falls, with the day only if it is not today. */
export function whenLabel(d: Date, now: Date): string {
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay ? clockTime(d) : `${shortDay(d)}, ${clockTime(d)}`;
}

/** Start now, or say when it should be ready to slice and get every clock time worked back from that. */
export function ReadyByCard(p: Props) {
  const { colors } = useAppTheme();
  const readyAt = p.plan ? new Date(p.plan.steps.find((s) => s.key === 'cool')!.at.getTime() + LAZY_PLAN_MINUTES.cool * 60_000) : null;
  const find = (key: string) => p.plan?.steps.find((s) => s.key === key)?.at ?? null;
  const rows: { label: string; at: Date | null }[] = [
    { label: 'Feed the starter', at: p.plan?.feedAt ?? null },
    { label: 'Mix', at: find('mix') },
    { label: 'Heat the oven', at: p.ovenOn },
    { label: 'Bake', at: find('bake') },
    { label: 'Ready to slice', at: readyAt },
  ];
  const visible = rows.filter((r) => r.at);

  return (
    <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[sectionTitleStyle, { color: colors.muted }]}>WHEN</Text>

      {p.mixed ? (
        <Text style={[styles.body, { color: colors.espresso }]}>
          You mixed at {find('mix') ? clockTime(find('mix')!) : '—'}. Here is the rest of the day, worked forward from then.
        </Text>
      ) : (
        <>
          <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel="Plan from">
            <Chip selected={p.mode === 'now'} onPress={() => p.onMode('now')} label="Start now">
              <Text style={[styles.chipText, { color: p.mode === 'now' ? colors.white : colors.espresso }]}>Start now</Text>
            </Chip>
            <Chip selected={p.mode === 'readyBy'} onPress={() => p.onMode('readyBy')} label="Ready to slice by">
              <Text style={[styles.chipText, { color: p.mode === 'readyBy' ? colors.white : colors.espresso }]}>Ready to slice by</Text>
            </Chip>
          </View>

          {p.mode === 'readyBy' && (
            <>
              <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel="Day">
                {[0, 1, 2, 3, 4].map((i) => {
                  const d = dayFromNow(p.now, i);
                  const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
                  return (
                    <Chip key={i} selected={p.dayOffset === i} onPress={() => p.onDay(i)} label={label}>
                      <Text style={[styles.chipText, { color: p.dayOffset === i ? colors.white : colors.espresso }]}>{label}</Text>
                    </Chip>
                  );
                })}
              </View>
              <Text style={[styles.label, { color: colors.espresso }]}>Time</Text>
              <TextInput
                value={p.time}
                onChangeText={p.onTime}
                placeholder="09:00"
                placeholderTextColor={colors.muted}
                keyboardType="numbers-and-punctuation"
                accessibilityLabel="Ready to slice at (time)"
                style={[styles.input, { color: colors.espresso, borderColor: p.timeInvalid ? colors.error : colors.border, backgroundColor: colors.white }]}
              />
              {p.timeInvalid && (
                <Text style={[styles.error, { color: colors.error }]}>Enter a time like 09:00 or 9pm.</Text>
              )}
            </>
          )}

          <Text style={[styles.label, { color: colors.espresso }]}>Proof</Text>
          <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel="Where it proofs">
            <Chip selected={p.proofMode === 'counter'} onPress={() => p.onProof('counter')} label="Proof on the counter">
              <Text style={[styles.chipText, { color: p.proofMode === 'counter' ? colors.white : colors.espresso }]}>Counter</Text>
            </Chip>
            <Chip selected={p.proofMode === 'fridge'} onPress={() => p.onProof('fridge')} label="Proof in the fridge">
              <Text style={[styles.chipText, { color: p.proofMode === 'fridge' ? colors.white : colors.espresso }]}>Fridge</Text>
            </Chip>
          </View>
          {p.proofMode === 'fridge' && (
            <View style={styles.fridgeRow}>
              <Text style={[styles.hint, { color: colors.muted, flex: 1 }]}>
                Hours in the fridge, {FRIDGE_HOURS.min} to {FRIDGE_HOURS.max}. It bakes straight from cold.
              </Text>
              <TextInput
                value={p.fridgeHours}
                onChangeText={(t) => { if (/^\d{0,2}(\.\d?)?$/.test(t)) p.onFridgeHours(t); }}
                keyboardType="decimal-pad"
                accessibilityLabel="Hours in the fridge"
                style={[styles.hoursInput, { color: colors.espresso, borderColor: colors.border, backgroundColor: colors.white }]}
              />
              <Text style={[styles.hint, { color: colors.muted }]}>h</Text>
            </View>
          )}
        </>
      )}

      {p.tooEarly && p.earliest && (
        <View style={[styles.note, { backgroundColor: colors.warningBg, borderLeftColor: colors.hot }]}>
          <Text style={[styles.noteTitle, { color: colors.espresso }]}>That is earlier than it can be.</Text>
          <Text style={[styles.noteBody, { color: colors.muted }]}>
            Starting now, the earliest it is ready to slice is {whenLabel(p.earliest, p.now)}.
          </Text>
          <TouchableOpacity onPress={p.onUseEarliest} accessibilityRole="button" style={[styles.useBtn, { borderColor: colors.terracotta }]}>
            <Text style={[styles.useBtnText, { color: colors.terracotta }]}>Use {whenLabel(p.earliest, p.now)}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!p.tooEarly && p.note && (
        <View style={[styles.note, { backgroundColor: colors.tipBg, borderLeftColor: colors.terracotta }]}>
          <Text style={[styles.noteBody, { color: colors.espresso }]}>{p.note}</Text>
        </View>
      )}

      {p.plan && !p.tooEarly && visible.length > 0 && (
        <View style={[styles.table, { borderTopColor: colors.border }]}>
          {visible.map((r, i) => (
            <View key={r.label} style={[styles.kv, i < visible.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
              <Text style={[styles.kvLabel, { color: colors.muted }]}>{r.label}</Text>
              <Text style={[styles.kvValue, { color: colors.espresso }]}>{whenLabel(r.at!, p.now)}</Text>
            </View>
          ))}
        </View>
      )}
      {p.plan?.mixWindow && !p.tooEarly && !p.mixed && (
        <Text style={[styles.hint, { color: colors.muted }]}>
          Mixing between {clockTime(p.plan.mixWindow.from)} and {clockTime(p.plan.mixWindow.to)} keeps the starter at 95% or more of its peak.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: FontSize.sm, lineHeight: 21 },
  chips: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', marginTop: Spacing.xs, marginBottom: Spacing.xs },
  chipText: { fontSize: FontSize.sm, fontWeight: '700' },
  label: { fontSize: FontSize.sm, fontWeight: '600', marginTop: Spacing.md, marginBottom: Spacing.xs },
  input: { borderWidth: 1, borderRadius: BorderRadius.md, minHeight: 48, paddingHorizontal: Spacing.md, fontSize: FontSize.md },
  error: { fontSize: FontSize.xs, marginTop: Spacing.xs },
  hint: { fontSize: FontSize.xs, lineHeight: 17, marginTop: Spacing.sm },
  fridgeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  hoursInput: { borderWidth: 1, borderRadius: BorderRadius.md, minHeight: 44, width: 64, textAlign: 'right', paddingHorizontal: Spacing.sm, fontSize: FontSize.md },
  note: { borderLeftWidth: 5, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md },
  noteTitle: { fontSize: FontSize.sm, fontWeight: '700' },
  noteBody: { fontSize: FontSize.sm, lineHeight: 20 },
  useBtn: { alignSelf: 'flex-start', minHeight: 44, paddingHorizontal: Spacing.lg, borderWidth: 2, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.sm },
  useBtnText: { fontSize: FontSize.sm, fontWeight: '700' },
  table: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: Spacing.md, paddingTop: Spacing.xs },
  kv: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md, paddingVertical: Spacing.sm },
  kvLabel: { fontSize: FontSize.sm, flexShrink: 1 },
  kvValue: { fontSize: FontSize.sm, fontWeight: '700', textAlign: 'right', flexShrink: 1 },
});
