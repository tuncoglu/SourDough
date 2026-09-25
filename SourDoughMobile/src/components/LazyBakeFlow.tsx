import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme, MaxWidth } from '../theme';
import { useBreakpoint } from '../hooks/useBreakpoint';
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
  saving: boolean;
  onSave: () => void;
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
  const { colors, unitSystem, isDark } = useAppTheme();
  const { isDesktop } = useBreakpoint();
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
    <ScrollView ref={props.scrollRef} style={{ flex: 1 }} contentContainerStyle={[styles.page, isDesktop && styles.pageDesktop]} keyboardShouldPersistTaps="handled">
      <View style={[styles.topline, { borderBottomColor: colors.border }]}>
        <Text style={[styles.brand, { color: colors.espresso }]}>JUST DOUGH IT <Text style={{ color: colors.terracotta }}>✳</Text></Text>
        <TouchableOpacity onPress={props.onDetailed} accessibilityRole="button" accessibilityLabel="Open detailed calculator">
          <Text style={[styles.detailLink, { color: colors.terracotta }]}>Detailed calculator  ↗</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
        <View style={[styles.heroCopy, isDesktop && styles.heroCopyDesktop]}>
          <Text style={[styles.heroKicker, { color: colors.olive }]}>THE SLOW BREAD CLUB  /  NO FUSS REQUIRED</Text>
          <Text style={[styles.title, isDesktop && styles.titleDesktop, { color: colors.espresso }]}>Great bread.{"\n"}<Text style={{ color: colors.terracotta }}>Less doing.</Text></Text>
          <Text style={[styles.intro, { color: colors.muted }]}>Cold starter. One bowl. A little patience. The app watches the clock so you can get on with your day.</Text>
          <View style={[styles.heroRule, { backgroundColor: colors.border }]} />
          <Text style={[styles.heroPromise, { color: colors.espresso }]}>Mix it  <Text style={{ color: colors.terracotta }}>✳</Text>  Let it rise  <Text style={{ color: colors.terracotta }}>✳</Text>  Bake it</Text>
        </View>
        <View style={[styles.heroImageFrame, isDesktop && styles.heroImageFrameDesktop, { backgroundColor: colors.badgeBg }]}>
          <Image source={require('../../assets/images/bread-editorial.png')} style={styles.heroImage} resizeMode="cover" accessibilityLabel="Freshly baked sourdough loaf on a warm kitchen table" />
          <View style={[styles.imageCaption, { backgroundColor: isDark ? colors.card : '#FFF8EC' }]}>
            <Text style={[styles.imageCaptionText, { color: colors.espresso }]}>A good loaf fits around your life.</Text>
          </View>
        </View>
      </View>

      <View style={styles.methodIntro}>
        <Text style={[styles.methodLabel, { color: colors.terracotta }]}>THE METHOD</Text>
        <Text style={[styles.methodHeading, { color: colors.espresso }]}>Three quiet steps to a better loaf.</Text>
      </View>

      <View style={[styles.card, styles.mixCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionNumber, { color: colors.terracotta }]}>01</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: colors.olive }]}>THE MIX</Text>
            <Text style={[styles.cardTitle, { color: colors.espresso }]}>Four ingredients. One bowl.</Text>
          </View>
        </View>
        <Text style={[styles.note, { color: colors.muted }]}>Weigh what you have. Salt adds up automatically.</Text>
        <View style={styles.fieldGrid}>
          <Field label="Flour" value={props.flourGrams} unit="g" onChange={props.onFlourChange} />
          <Field label="Water" value={props.waterGrams} unit="g" onChange={props.onWaterChange} />
          <Field label="Starter" value={props.starterGrams} unit="g" onChange={props.onStarterChange} />
          <Field label="Salt" value={props.saltPct} unit="%" onChange={props.onSaltChange} />
        </View>
        {Number.isFinite(predictedSalt) && <View style={[styles.saltStrip, { backgroundColor: colors.tipBg }]}><Text style={[styles.saltHint, { color: colors.espresso }]}>Salt to weigh  <Text style={{ color: colors.terracotta }}>{formatWeight(predictedSalt, unitSystem, 1)}</Text></Text></View>}
        <View style={[styles.instructions, { borderTopColor: colors.border }]}>
          <Text style={[styles.instruction, { color: colors.espresso }]}>①  Take the starter from the fridge. Put some in a large bowl with the water and salt.</Text>
          <Text style={[styles.instruction, { color: colors.espresso }]}>②  Refresh the flour and water in your starter jar.</Text>
          <Text style={[styles.instruction, { color: colors.espresso }]}>③  Stir the bowl until the salt dissolves, then mix in the flour.</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionNumber, { color: colors.terracotta }]}>02</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: colors.olive }]}>THE WAIT</Text>
            <Text style={[styles.cardTitle, { color: colors.espresso }]}>Let the dough rise.</Text>
          </View>
        </View>
        <Text style={[styles.note, { color: colors.muted }]}>Cover with a damp cloth. Start the forecast when you finish mixing.</Text>
        <View style={styles.tempRow}>
          <TempRow label="Room temp" value={props.ambientTemp} onChangeText={props.onAmbientChange} />
        </View>
        <TouchableOpacity onPress={props.onCalculate} disabled={props.calculating} accessibilityRole="button" accessibilityLabel="Forecast when to check the dough" style={[styles.primaryButton, { backgroundColor: isDark ? colors.terracottaDark : colors.terracotta }]}>
          {props.calculating ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.primaryText, { color: colors.white }]}>{props.results ? 'Update forecast' : 'Forecast the rise'}  →</Text>}
        </TouchableOpacity>
        {props.dirty && <Text style={[styles.stale, { color: colors.warm }]}>Ingredients or conditions changed. Update the forecast.</Text>}
        {bulkHours != null && checkAt && (
          <View style={[styles.forecast, { backgroundColor: colors.successBg, borderColor: colors.olive }]}>
            <Text style={[styles.eyebrow, { color: colors.olive }]}>START CHECKING THE DOUGH</Text>
            <Text style={[styles.forecastTime, { color: colors.espresso }]}>{clock}</Text>
            <Text style={[styles.forecastDate, { color: colors.espresso }]}>{date} · roughly {bulkHours.toFixed(1)} hours after mixing</Text>
            <Text style={[styles.note, { color: colors.muted }]}>This is a check time, not a promise. Look for a noticeably risen, airy dough with bubbles and a gentle jiggle. Your actual dough decides when it moves on.</Text>
          </View>
        )}
        {props.results && (
          <TouchableOpacity onPress={props.onSave} disabled={props.saving || props.dirty} accessibilityRole="button" accessibilityLabel="Save this loaf to history" style={[styles.saveButton, { borderColor: colors.olive, opacity: props.dirty ? 0.5 : 1 }]}>
            <Text style={[styles.saveButtonText, { color: colors.olive }]}>{props.saving ? 'Saving…' : 'Save this loaf  ↗'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionNumber, { color: colors.terracotta }]}>03</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: colors.olive }]}>THE BAKE</Text>
            <Text style={[styles.cardTitle, { color: colors.espresso }]}>Choose the easy finish.</Text>
          </View>
        </View>
        <View style={styles.choiceRow}>
          {(['tin', 'cocotte'] as const).map((option) => (
            <TouchableOpacity key={option} onPress={() => setVessel(option)} accessibilityRole="button" accessibilityState={{ selected: vessel === option }} style={[styles.choice, { borderColor: vessel === option ? colors.terracotta : colors.border, backgroundColor: vessel === option ? colors.tipBg : colors.white }]}>
              <Text style={[styles.choiceTitle, { color: colors.espresso }]}>{option === 'tin' ? '▱  Loaf tin' : '◯  Cocotte'}</Text>
              <Text style={[styles.choiceDesc, { color: colors.muted }]}>{option === 'tin' ? 'Baking paper + easy lift' : 'Paper-lined bowl to hot pot'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.choiceRow}>
          <TouchableOpacity onPress={() => setFold(!fold)} accessibilityRole="button" accessibilityState={{ selected: fold }} style={[styles.smallChoice, { borderColor: fold ? colors.terracotta : colors.border }]}><Text style={{ color: colors.espresso }}>{fold ? '✓ ' : '+ '}One quick fold</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setToppings(!toppings)} accessibilityRole="button" accessibilityState={{ selected: toppings }} style={[styles.smallChoice, { borderColor: toppings ? colors.terracotta : colors.border }]}><Text style={{ color: colors.espresso }}>{toppings ? '✓ ' : '+ '}Toppings</Text></TouchableOpacity>
        </View>
        <View style={[styles.bakeInstructions, { borderTopColor: colors.border }]}>
          {vessel === 'tin' ? (
            <>
              <Text style={[styles.method, { color: colors.espresso }]}>
                {fold ? 'Give the risen dough one brief stretch and fold. ' : ''}
                Line a loaf tin with baking paper and transfer the dough.
                {toppings ? ' Scatter sesame seeds or your favourite toppings over it.' : ''}
                {' '}Cover with a damp cloth for the final proof. Bake when it looks ready.
              </Text>
              <Text style={[styles.method, { color: colors.espresso }]}>Preheat the oven. For steam, use a separate hot tray with a little water or ice if that is part of your oven routine. Keep hands clear of the steam.</Text>
              <Text style={[styles.note, { color: colors.muted }]}>Use your usual oven temperature and bake time. Once baked, lift the loaf out, let it cool for about an hour, then peel away the baking paper.</Text>
            </>
          ) : (
            <>
              <Text style={[styles.method, { color: colors.espresso }]}>
                {fold ? 'Give the risen dough one brief stretch and fold. ' : ''}
                Line the bowl with baking paper and put the dough back for its final proof. Cover with a damp cloth. While it rises, preheat the cocotte or other enamelled cast-iron pot with the oven.
              </Text>
              <Text style={[styles.method, { color: colors.espresso }]}>When the dough looks ready, lift it by the baking paper into the very hot pot.{toppings ? ' Add sesame seeds or your favourite toppings.' : ''} Bake with the lid on first; the covered pot holds the dough’s own steam.</Text>
              <Text style={[styles.note, { color: colors.muted }]}>Use your usual oven temperature and bake time. Handle the hot pot carefully. Cool the baked loaf for about an hour, then peel away the paper.</Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={props.onDetailed} accessibilityRole="button" style={styles.footerLink}>
        <Text style={[styles.detailLink, { color: colors.terracotta }]}>Want flour blends, temperatures, or a full recipe? Open detailed calculator  →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: Spacing.lg, paddingBottom: 80 },
  pageDesktop: { maxWidth: MaxWidth.content, paddingHorizontal: Spacing.xxl },
  topline: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.sm, paddingTop: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1 },
  brand: { fontSize: FontSize.sm, fontWeight: '900', letterSpacing: 1.4 },
  detailLink: { fontSize: FontSize.sm, fontWeight: '700' },
  hero: { gap: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl },
  heroDesktop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xxl, paddingTop: Spacing.xxl + Spacing.md, paddingBottom: 60 },
  heroCopy: { flex: 1 },
  heroCopyDesktop: { paddingRight: Spacing.md },
  heroKicker: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1.8, lineHeight: 18 },
  title: { fontFamily: 'Georgia', fontSize: 45, lineHeight: 48, fontWeight: '700', marginTop: Spacing.lg, letterSpacing: -1.5 },
  titleDesktop: { fontSize: 58, lineHeight: 62 },
  intro: { fontSize: FontSize.md, lineHeight: 26, marginTop: Spacing.lg, maxWidth: 430 },
  heroRule: { width: 54, height: 1, marginTop: Spacing.xl, marginBottom: Spacing.md },
  heroPromise: { fontSize: FontSize.sm, fontWeight: '700', lineHeight: 22 },
  heroImageFrame: { height: 220, borderRadius: 18, overflow: 'hidden', position: 'relative' },
  heroImageFrameDesktop: { flex: 1.05, height: 400 },
  heroImage: { width: '100%', height: '100%' },
  imageCaption: { position: 'absolute', bottom: 16, left: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 4 },
  imageCaptionText: { fontFamily: 'Georgia', fontSize: FontSize.sm, fontStyle: 'italic' },
  methodIntro: { paddingBottom: Spacing.xl },
  methodLabel: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 2, marginBottom: Spacing.xs },
  methodHeading: { fontFamily: 'Georgia', fontSize: 28, lineHeight: 34 },
  card: { borderWidth: 1, borderRadius: 18, padding: Spacing.xl, marginBottom: Spacing.lg },
  mixCard: { borderTopWidth: 3 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.lg, marginBottom: Spacing.sm },
  sectionNumber: { fontFamily: 'Georgia', fontSize: 39, lineHeight: 42 },
  eyebrow: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1.4, marginBottom: 2 },
  cardTitle: { fontFamily: 'Georgia', fontSize: 25, lineHeight: 31, fontWeight: '700' },
  note: { fontSize: FontSize.sm, lineHeight: 22, marginTop: Spacing.sm },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginTop: Spacing.lg },
  field: { minWidth: 128, flexGrow: 1, flexBasis: '42%' },
  fieldLabel: { fontSize: FontSize.xs, fontWeight: '800', marginBottom: Spacing.xs, textTransform: 'uppercase', letterSpacing: 0.7 },
  fieldBox: { borderWidth: 1, borderRadius: BorderRadius.md, flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingHorizontal: Spacing.md },
  fieldInput: { flex: 1, minWidth: 55, fontSize: FontSize.xl, fontWeight: '600', paddingVertical: Spacing.sm },
  fieldUnit: { fontSize: FontSize.sm, fontWeight: '700' },
  saltStrip: { marginTop: Spacing.lg, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md },
  saltHint: { fontSize: FontSize.md, fontWeight: '700' },
  instructions: { marginTop: Spacing.xl, paddingTop: Spacing.lg, borderTopWidth: 1, gap: Spacing.md },
  instruction: { fontSize: FontSize.sm, lineHeight: 23 },
  tempRow: { flexDirection: 'row', marginTop: Spacing.md, marginBottom: Spacing.lg },
  primaryButton: { borderRadius: BorderRadius.md, minHeight: 56, justifyContent: 'center', alignItems: 'center', padding: Spacing.md },
  primaryText: { fontSize: FontSize.md, fontWeight: '800' },
  stale: { fontSize: FontSize.sm, fontWeight: '700', marginTop: Spacing.sm },
  forecast: { borderWidth: 1, borderLeftWidth: 4, borderRadius: BorderRadius.md, padding: Spacing.lg, marginTop: Spacing.lg },
  forecastTime: { fontFamily: 'Georgia', fontSize: 45, lineHeight: 52, fontWeight: '700' },
  forecastDate: { fontSize: FontSize.sm, fontWeight: '700', marginTop: 2 },
  saveButton: { borderWidth: 1, borderRadius: BorderRadius.md, minHeight: 46, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.md },
  saveButtonText: { fontSize: FontSize.sm, fontWeight: '800' },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md },
  choice: { flex: 1, minWidth: 135, borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.lg, minHeight: 88 },
  choiceTitle: { fontFamily: 'Georgia', fontSize: FontSize.lg, fontWeight: '700' },
  choiceDesc: { fontSize: FontSize.xs, marginTop: Spacing.xs, lineHeight: 17 },
  smallChoice: { borderWidth: 1, borderRadius: 20, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, minHeight: 42, justifyContent: 'center' },
  bakeInstructions: { marginTop: Spacing.xl, paddingTop: Spacing.sm, borderTopWidth: 1 },
  method: { fontSize: FontSize.sm, lineHeight: 23, marginTop: Spacing.md },
  footerLink: { alignItems: 'center', padding: Spacing.xl },
});
