import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme, MaxWidth } from '../theme';
import { formatWeight } from '../lib/unitConversion';
import { isValidDecimalInput } from '../lib/inputValidation';
import type { CalculationResults } from '../models/types';
import { TempRow } from './TempRow';

interface Props {
  scrollRef: React.RefObject<ScrollView | null>;
  flourGrams: string;
  waterGrams: string;
  starterGrams: string;
  starterHydration: string;
  saltPct: string;
  ambientTemp: string;
  onFlourChange: (value: string) => void;
  onWaterChange: (value: string) => void;
  onStarterChange: (value: string) => void;
  onSaltChange: (value: string) => void;
  onAmbientChange: (value: string) => void;
  onCalculate: () => void;
  onDetailed: () => void;
  results: CalculationResults | null;
  calculatedAt: Date | null;
  dirty: boolean;
  calculating: boolean;
}

function Field({ label, value, unit, onChange }: {
  label: string; value: string; unit: string; onChange: (value: string) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.espresso }]}>{label}</Text>
      <View style={[styles.fieldBox, { borderColor: colors.border, backgroundColor: colors.white }]}>
        <TextInput
          value={value}
          onChangeText={(text) => { if (isValidDecimalInput(text)) onChange(text); }}
          keyboardType="decimal-pad"
          accessibilityLabel={`${label}, ${unit}`}
          style={[styles.fieldInput, { color: colors.espresso }]}
          selectTextOnFocus
        />
        <Text style={[styles.fieldUnit, { color: colors.muted }]}>{unit}</Text>
      </View>
    </View>
  );
}

export function LazyBakeFlow(props: Props) {
  const { colors, unitSystem } = useAppTheme();
  const [vessel, setVessel] = useState<'tin' | 'cocotte'>('tin');
  const [fold, setFold] = useState(false);
  const [toppings, setToppings] = useState(false);
  const bulkHours = props.results?.dynamicFerment?.bulkHours ?? props.results?.staticFermentHours;
  const checkAt = bulkHours != null && props.calculatedAt
    ? new Date(props.calculatedAt.getTime() + bulkHours * 3600000)
    : null;
  const clock = checkAt?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const date = checkAt?.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  const starterFlour = Number(props.starterGrams) * 100 / (100 + Number(props.starterHydration));
  const predictedSalt = (Number(props.flourGrams) + starterFlour) * Number(props.saltPct) / 100;

  return (
    <ScrollView ref={props.scrollRef} style={{ flex: 1 }} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.topline}>
        <Text style={[styles.brand, { color: colors.terracotta }]}>JUST DOUGH IT  /  SOURDOUGH</Text>
        <TouchableOpacity onPress={props.onDetailed} accessibilityRole="button" accessibilityLabel="Open detailed calculator">
          <Text style={[styles.detailLink, { color: colors.terracotta }]}>Detailed calculator  ›</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.espresso }]}>Great bread. Less doing.</Text>
      <Text style={[styles.intro, { color: colors.muted }]}>One bowl, your cold starter, and a forecast for when to check the rise. No kneading schedule required.</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.eyebrow, { color: colors.olive }]}>01  THE MIX</Text>
        <Text style={[styles.cardTitle, { color: colors.espresso }]}>Four ingredients. One bowl.</Text>
        <Text style={[styles.note, { color: colors.muted }]}>Amounts are entered in grams for accurate measuring. Salt is calculated from the flour weight.</Text>
        <View style={styles.fieldGrid}>
          <Field label="Flour" value={props.flourGrams} unit="g" onChange={props.onFlourChange} />
          <Field label="Water" value={props.waterGrams} unit="g" onChange={props.onWaterChange} />
          <Field label="Starter" value={props.starterGrams} unit="g" onChange={props.onStarterChange} />
          <Field label="Salt" value={props.saltPct} unit="%" onChange={props.onSaltChange} />
        </View>
        {Number.isFinite(predictedSalt) && <Text style={[styles.saltHint, { color: colors.muted }]}>Salt to weigh: about {formatWeight(predictedSalt, unitSystem, 1)}</Text>}
        <Text style={[styles.note, { color: colors.muted }]}>Take the starter from the fridge and put some in a large bowl with the water and salt. Refresh the flour and water in your starter jar. Stir the bowl until the salt dissolves, then mix in the flour.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.eyebrow, { color: colors.olive }]}>02  THE WAIT</Text>
        <Text style={[styles.cardTitle, { color: colors.espresso }]}>Let the dough rise.</Text>
        <View style={styles.tempRow}>
          <TempRow label="Room temp" value={props.ambientTemp} onChangeText={props.onAmbientChange} />
        </View>
        <TouchableOpacity onPress={props.onCalculate} disabled={props.calculating} accessibilityRole="button" accessibilityLabel="Forecast when to check the dough" style={[styles.primaryButton, { backgroundColor: colors.terracotta }]}>
          {props.calculating ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.primaryText, { color: colors.white }]}>{props.results ? 'Update forecast' : 'Forecast the rise'}  →</Text>}
        </TouchableOpacity>
        {props.dirty && <Text style={[styles.stale, { color: colors.warm }]}>Ingredients or conditions changed. Update the forecast.</Text>}
        {bulkHours != null && checkAt && (
          <View style={[styles.forecast, { backgroundColor: colors.tipBg }]}>
            <Text style={[styles.eyebrow, { color: colors.olive }]}>START CHECKING THE DOUGH</Text>
            <Text style={[styles.forecastTime, { color: colors.espresso }]}>{clock}</Text>
            <Text style={[styles.forecastDate, { color: colors.espresso }]}>{date} · roughly {bulkHours.toFixed(1)} hours after mixing</Text>
            <Text style={[styles.note, { color: colors.muted }]}>This is a check time, not a promise. Look for a noticeably risen, airy dough with bubbles and a gentle jiggle. Your actual dough decides when it moves on.</Text>
          </View>
        )}
        <Text style={[styles.note, { color: colors.muted }]}>Start the forecast when you mix. Cover the bowl with a damp cloth while it rises.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.eyebrow, { color: colors.olive }]}>03  THE BAKE</Text>
        <Text style={[styles.cardTitle, { color: colors.espresso }]}>Choose the easy finish.</Text>
        <View style={styles.choiceRow}>
          {(['tin', 'cocotte'] as const).map((option) => (
            <TouchableOpacity key={option} onPress={() => setVessel(option)} accessibilityRole="button" accessibilityState={{ selected: vessel === option }} style={[styles.choice, { borderColor: vessel === option ? colors.terracotta : colors.border, backgroundColor: vessel === option ? colors.tipBg : colors.white }]}>
              <Text style={[styles.choiceTitle, { color: colors.espresso }]}>{option === 'tin' ? 'Loaf tin' : 'Cocotte'}</Text>
              <Text style={[styles.choiceDesc, { color: colors.muted }]}>{option === 'tin' ? 'Baking paper + easy lift' : 'Preheated covered pot'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.choiceRow}>
          <TouchableOpacity onPress={() => setFold(!fold)} accessibilityRole="button" accessibilityState={{ selected: fold }} style={[styles.smallChoice, { borderColor: fold ? colors.terracotta : colors.border }]}><Text style={{ color: colors.espresso }}>{fold ? '✓ ' : '+ '}One quick fold</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setToppings(!toppings)} accessibilityRole="button" accessibilityState={{ selected: toppings }} style={[styles.smallChoice, { borderColor: toppings ? colors.terracotta : colors.border }]}><Text style={{ color: colors.espresso }}>{toppings ? '✓ ' : '+ '}Toppings</Text></TouchableOpacity>
        </View>
        <Text style={[styles.method, { color: colors.espresso }]}>
          {fold ? 'Give the risen dough one brief stretch and fold. ' : ''}
          {vessel === 'tin' ? 'Line a loaf tin with baking paper and transfer the dough. ' : 'Keep the dough in the bowl until bake time, then transfer it carefully into the thoroughly preheated cocotte. '}
          {toppings ? 'Scatter sesame seeds or your favourite toppings over it. ' : ''}
          Cover with a damp cloth while it finishes rising. Bake when the dough looks ready.
        </Text>
        <Text style={[styles.method, { color: colors.espresso }]}>
          {vessel === 'tin'
            ? 'Preheat the oven. For steam, use a separate hot tray with a little water or ice if that is part of your oven routine. Keep hands clear of the steam.'
            : 'Preheat the cocotte with the oven and bake with its lid on first; the covered pot holds the dough’s own steam. Handle the very hot pot carefully.'}
        </Text>
        <Text style={[styles.note, { color: colors.muted }]}>Use your usual oven temperature and bake time for your tin or pot. When baked, lift out and cool for about an hour. Peel off the baking paper once cool enough.</Text>
      </View>

      <TouchableOpacity onPress={props.onDetailed} accessibilityRole="button" style={styles.footerLink}>
        <Text style={[styles.detailLink, { color: colors.terracotta }]}>Want flour blends, temperatures, or a full recipe? Open detailed calculator  →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { width: '100%', maxWidth: MaxWidth.form + 100, alignSelf: 'center', padding: Spacing.lg, paddingBottom: 70 },
  topline: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
  brand: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1 },
  detailLink: { fontSize: FontSize.sm, fontWeight: '700' },
  title: { fontSize: FontSize.title + 7, lineHeight: 41, fontWeight: '800', marginTop: Spacing.xxl },
  intro: { fontSize: FontSize.md, lineHeight: 24, marginTop: Spacing.sm, marginBottom: Spacing.xxl },
  card: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  eyebrow: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1, marginBottom: Spacing.sm },
  cardTitle: { fontSize: FontSize.xl, fontWeight: '800', marginBottom: Spacing.sm },
  note: { fontSize: FontSize.sm, lineHeight: 21, marginTop: Spacing.sm },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginTop: Spacing.md },
  field: { minWidth: 135, flexGrow: 1, flexBasis: '42%' },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: '700', marginBottom: Spacing.xs },
  fieldBox: { borderWidth: 1, borderRadius: BorderRadius.md, flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingHorizontal: Spacing.md },
  fieldInput: { flex: 1, minWidth: 60, fontSize: FontSize.lg, paddingVertical: Spacing.sm },
  fieldUnit: { fontSize: FontSize.sm, fontWeight: '700' },
  saltHint: { fontSize: FontSize.sm, fontWeight: '600', marginTop: Spacing.sm },
  tempRow: { flexDirection: 'row', marginTop: Spacing.md, marginBottom: Spacing.md },
  primaryButton: { borderRadius: BorderRadius.md, minHeight: 52, justifyContent: 'center', alignItems: 'center', padding: Spacing.md },
  primaryText: { fontSize: FontSize.md, fontWeight: '800' },
  stale: { fontSize: FontSize.sm, fontWeight: '700', marginTop: Spacing.sm },
  forecast: { borderRadius: BorderRadius.md, padding: Spacing.lg, marginTop: Spacing.lg },
  forecastTime: { fontSize: FontSize.title + 6, fontWeight: '800' },
  forecastDate: { fontSize: FontSize.sm, fontWeight: '700', marginTop: 2 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  choice: { flex: 1, minWidth: 135, borderWidth: 2, borderRadius: BorderRadius.md, padding: Spacing.md, minHeight: 75 },
  choiceTitle: { fontSize: FontSize.md, fontWeight: '800' },
  choiceDesc: { fontSize: FontSize.xs, marginTop: 3 },
  smallChoice: { borderWidth: 1, borderRadius: BorderRadius.md, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, minHeight: 42, justifyContent: 'center' },
  method: { fontSize: FontSize.sm, lineHeight: 22, marginTop: Spacing.md },
  footerLink: { alignItems: 'center', padding: Spacing.md },
});
