import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLactoCalculator } from '@/src/hooks/useLactoCalculator';
import { KeyboardScreen } from '@/src/components/KeyboardScreen';
import { Chip } from '@/src/components/Chip';
import { LactoResultCard } from '@/src/components/LactoResultCard';
import { LactoTimeline } from '@/src/components/LactoTimeline';
import { LactoAdvice } from '@/src/components/LactoAdvice';
import { LactoScience } from '@/src/components/LactoScience';
import { LocationBar } from '@/src/components/LocationBar';
import { NumberInput } from '@/src/components/NumberInput';
import { Spacing, FontSize, BorderRadius, useAppTheme, MaxWidth, cardStyleLg } from '@/src/theme';
import { FERMENT_TYPE_ORDER } from '@/src/data/fermentPresets';
import { VEGETABLES, VEG_CATEGORIES } from '@/src/data/vegetables';
import { FermentType, SALT_LABELS, SALT_TYPE_ORDER } from '@/src/models/types';

export default function FermentsScreen() {
  const router = useRouter();
  const calc = useLactoCalculator();
  const { colors } = useAppTheme();

  const handleCalculate = useCallback(() => {
    calc.calculate();
  }, [calc.calculate]);

  const locationSummary = calc.locationData?.summary ?? null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={['top']}>
      <KeyboardScreen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header — tap to return home */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
            <Text style={[styles.heading, { color: colors.espresso }]}>🥖  Just Dough It</Text>
          </TouchableOpacity>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Perfect bread, less guesswork
          </Text>
        </View>

        {/* ── Location Bar ── */}
        <LocationBar
          summary={locationSummary}
          loading={calc.locLoading}
          error={calc.locError}
          onRefresh={calc.onRefreshLocation}
          showFallbackWarning={!calc.locLoading && !calc.locationData}
          onPostcodeSubmit={calc.onPostcodeSubmit}
        />

        {/* ── Temperature Forecast ── */}
        {calc.dailyTemps.length > 0 && (
          <View style={[styles.tempCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.tempTitle, { color: colors.espresso }]}>
              🌡 Fermentation temperature
            </Text>
            <View style={styles.tempDays}>
              {calc.dailyTemps.slice(0, 7).map((d, i, arr) => {
                // Show only actual forecast days — stop before repeated data
                if (i > 0 && d.high === arr[i - 1].high && d.low === arr[i - 1].low) return null;
                const dayColor = d.avg > 24 ? colors.hot : d.avg > 20 ? colors.olive : d.avg > 16 ? colors.cool : colors.cold;
                const allHigh = Math.max(...arr.slice(0, 7).map(x => x.high));
                const allLow = Math.min(...arr.slice(0, 7).map(x => x.low));
                const range = allHigh - allLow || 1;
                const topPct = ((allHigh - d.high) / range) * 100;
                const heightPct = ((d.high - d.low) / range) * 100;
                return (
                <View key={i} style={styles.tempDay}>
                  <Text style={[styles.tempDayLabel, { color: colors.muted }]}>{d.day}</Text>
                  <Text style={[styles.tempDayHigh, { color: colors.espresso }]}>{d.high}°</Text>
                  <View style={[styles.tempBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.tempBarFill,
                        {
                          backgroundColor: dayColor,
                          top: `${topPct}%`,
                          height: `${Math.max(8, heightPct)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.tempDayLow, { color: colors.lightText }]}>{d.low}°</Text>
                </View>
                );
              })}
            </View>
            <Text style={[styles.tempSummary, { color: colors.lightText, borderTopColor: colors.border }]}>
              {calc.tempResult?.summary ?? 'Using weather forecast for accurate timing'}
              {calc.tempResult?.source === 'fallback' && ' — enable location for local temps'}
            </Text>
          </View>
        )}

        {/* ── Ferment Type Picker ── */}
        <Text style={[styles.sectionLabel, { color: colors.espresso }]}>Style</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {FERMENT_TYPE_ORDER.map(({ id, preset }) => (
              <Chip
                key={id}
                selected={calc.fermentType === id}
                onPress={() => calc.selectPreset(id as FermentType)}
                label={preset.name}
                colorScheme="terracotta"
              >
                <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                <Text style={[styles.presetName, { color: calc.fermentType === id ? colors.white : colors.espresso }]}>
                  {preset.name}
                </Text>
              </Chip>
            ))}
        </ScrollView>

        {/* ── Recommended Combinations ── */}
        {calc.vegMix.length === 0 && (
          <View style={[styles.combosCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.combosTitle, { color: colors.muted }]}>SUGGESTED COMBINATIONS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.combosRow}>
              {calc.VEG_COMBOS.map((combo) => (
                <TouchableOpacity
                  key={combo.id}
                  style={[styles.comboChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => calc.applyCombo(combo)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.comboEmoji}>{combo.emoji}</Text>
                  <Text style={[styles.comboName, { color: colors.espresso }]} numberOfLines={1}>{combo.name}</Text>
                  <Text style={[styles.comboVegs, { color: colors.lightText }]} numberOfLines={1}>
                    {combo.vegetables.map(v => v.label).join(', ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Vegetable / Fruit Picker ── */}
        <Text style={[styles.sectionLabel, { color: colors.espresso }]}>
          {calc.isMultiVeg ? 'Vegetables in the mix' : 'Vegetable or fruit'}
        </Text>
        <View style={[styles.vegPicker, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Selected veg summary */}
          <View style={[styles.currentVeg, { borderBottomColor: colors.border }]}>
            <Text style={styles.currentVegEmoji}>{calc.veg.emoji}</Text>
            <View style={styles.currentVegInfo}>
              <Text style={[styles.currentVegName, { color: colors.espresso }]}>
                {calc.isMultiVeg ? `${calc.vegMix.length} vegetables selected` : calc.veg.name}
              </Text>
              <Text style={[styles.currentVegMeta, { color: colors.lightText }]}>
                ~{calc.veg.waterContentPct}% water · {calc.veg.firmness} · salt:{' '}
                {calc.method === 'brine' ? calc.veg.typicalBrineSaltPct : calc.veg.typicalDrySaltPct}%
              </Text>
            </View>
          </View>

          {/* Veg chip grid */}
          {VEG_CATEGORIES.map(({ key, label }) => {
            const items = VEGETABLES.filter((v) => v.category === key);
            if (items.length === 0) return null;
            return (
              <View key={key} style={styles.vegCategory}>
                <Text style={[styles.vegCatLabel, { color: colors.muted }]}>{label}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vegChipRow}>
                  {items.map((veg) => {
                    const inMix = !!calc.vegMix.find(m => m.vegId === veg.id);
                    const isSelected = calc.isMultiVeg ? inMix : calc.vegId === veg.id;
                    return (
                      <Chip
                        key={veg.id}
                        selected={isSelected}
                        onPress={() => calc.toggleVegInMix(veg.id)}
                        label={veg.name}
                        colorScheme="olive"
                        inactiveBg={colors.white}
                        style={styles.vegChip}
                      >
                        <Text style={styles.vegChipEmoji}>{veg.emoji}</Text>
                        <Text style={[styles.vegChipName, { color: isSelected ? colors.white : colors.espresso }]} numberOfLines={1}>
                          {veg.name}
                        </Text>
                      </Chip>
                    );
                  })}
                </ScrollView>
              </View>
            );
          })}

          {/* Clear mix button */}
          {calc.isMultiVeg && (
            <TouchableOpacity
              style={styles.clearMixBtn}
              onPress={() => { calc.vegMix.forEach(m => calc.toggleVegInMix(m.vegId)); }}
              activeOpacity={0.7}
            >
              <Text style={[styles.clearMixText, { color: colors.terracotta }]}>Clear selection</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Individual veg weights (multi-veg mode) ── */}
        {calc.isMultiVeg && (
          <View style={[cardStyleLg, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.miniLabel, { color: colors.muted }]}>WEIGHT PER INGREDIENT</Text>
            {calc.vegMixEntries.map((m) => (
              <View key={m.vegId} style={styles.mixWeightRow}>
                <Text style={styles.mixWeightEmoji}>{m.veg.emoji}</Text>
                <Text style={[styles.mixWeightLabel, { color: colors.espresso }]} numberOfLines={1}>{m.veg.name}</Text>
                <TextInput
                  style={[styles.mixWeightInput, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
                  value={m.grams}
                  onChangeText={(t) => calc.updateMixGrams(m.vegId, t)}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                />
                <Text style={[styles.mixWeightUnit, { color: colors.muted }]}>g</Text>
              </View>
            ))}
            <View style={[styles.mixTotalRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.mixTotalLabel, { color: colors.espresso }]}>Total weight</Text>
              <Text style={[styles.mixTotalValue, { color: colors.terracotta }]}>{calc.totalMixGrams}g</Text>
            </View>
          </View>
        )}

        {/* ── Inputs ── */}
        <View style={[cardStyleLg, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {!calc.isMultiVeg && (
            <NumberInput
              label="Weight"
              value={calc.vegWeight}
              unit="g"
            onChangeText={calc.setVegWeight}
            placeholder="500"
          />

          {calc.method === 'brine' && (
            <NumberInput
              label="Water"
              value={calc.waterAmount}
              unit="ml"
              onChangeText={calc.setWaterAmount}
              placeholder="500"
            />
          )}
          )}

          <NumberInput
            label="Salt %"
            value={calc.saltPct}
            unit="%"
            onChangeText={calc.setSaltPct}
            placeholder="2.0"
          />
          <View style={styles.hintRow}>
            <Text style={[styles.hintText, { color: colors.lightText }]}>
              {calc.method === 'brine'
                ? `Recommended ${calc.veg.typicalBrineSaltPct}% for ${calc.veg.name.toLowerCase()}`
                : `Recommended ${calc.veg.typicalDrySaltPct}% for ${calc.veg.name.toLowerCase()}`}
            </Text>
          </View>

          <Text style={[styles.miniLabel, { color: colors.muted }]}>Salt type</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
          >
            {SALT_TYPE_ORDER.map((st) => (
                <Chip
                  key={st}
                  selected={calc.saltType === st}
                  onPress={() => calc.setSaltType(st)}
                  label={SALT_LABELS[st]}
                  colorScheme="olive"
                  inactiveBg={colors.white}
                  style={styles.saltChip}
                >
                  <Text style={[styles.saltChipText, { color: calc.saltType === st ? colors.white : colors.muted }]}>
                    {SALT_LABELS[st]}
                  </Text>
                </Chip>
              ))}
          </ScrollView>
        </View>

        {/* ── Calculate ── */}
        <TouchableOpacity
          style={[styles.calcBtn, { backgroundColor: colors.terracotta }]}
          onPress={handleCalculate}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Text style={[styles.calcBtnText, { color: colors.white }]}>Calculate</Text>
        </TouchableOpacity>

        {/* ── Results ── */}
        {calc.showResults && calc.results && (
          <View style={styles.results}>
            <LactoResultCard results={calc.results} method={calc.method} />
            <LactoTimeline timeline={calc.timeline} results={calc.results} />
            <LactoAdvice
              advice={calc.advice}
              tips={calc.tips}
              presetEmoji={calc.presetEmoji}
              presetName={calc.presetName}
            />

            {/* Water hardness card */}
            {calc.waterAdvice.length > 0 && (
              <View style={[cardStyleLg, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.cardTitle, { color: colors.espresso }]}>💧 Water</Text>
                {calc.waterAdvice.map((line, i) => (
                  <Text key={i} style={[styles.adviceLine, { color: colors.muted }]}>
                    {line}
                  </Text>
                ))}
              </View>
            )}

            {/* Research context */}
            <LactoScience
              vegResearchNote={calc.veg.researchNote}
              presetHealthNote={calc.presetHealthNote}
            />
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
      </KeyboardScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    maxWidth: MaxWidth.form,
    width: '100%',
    alignSelf: 'center' as any,
  },
  header: {
    marginBottom: Spacing.md,
  },
  heading: {
    fontSize: FontSize.title,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },

  // Temperature forecast card
  tempCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tempTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  tempDays: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tempDay: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tempDayLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tempDayHigh: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  tempBar: {
    width: '100%',
    height: 28,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  tempBarFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 4,
    minHeight: 4,
  },
  tempDayLow: {
    fontSize: 11,
  },
  tempSummary: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
  },

  // Style chips
  chipScroll: {
    marginBottom: Spacing.md,
    maxHeight: 60,
  },
  chipRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
  },
  presetEmoji: {
    fontSize: 16,
  },
  presetName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },

  // Veg picker
  vegPicker: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  currentVeg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  currentVegEmoji: {
    fontSize: 28,
  },
  currentVegInfo: {
    flex: 1,
  },
  currentVegName: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  currentVegMeta: {
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  vegCategory: {
    marginBottom: Spacing.sm,
  },
  vegCatLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    paddingLeft: 2,
  },
  vegChipRow: {
    gap: Spacing.xs,
    paddingRight: Spacing.md,
  },
  vegChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  vegChipEmoji: {
    fontSize: 14,
  },
  vegChipName: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    maxWidth: 100,
  },

  // Inputs
  cardGap: { gap: Spacing.xs },
  hintRow: {
    marginTop: -6,
    marginBottom: Spacing.xs,
    paddingLeft: 90,
  },
  hintText: {
    fontSize: FontSize.xs,
  },
  miniLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginTop: Spacing.xs,
    paddingLeft: 2,
  },
  // Combos
  combosCard: {
    borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg,
  },
  combosTitle: {
    fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm,
  },
  combosRow: { gap: Spacing.sm, paddingRight: Spacing.md },
  comboChip: {
    borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.sm + 2, width: 150, gap: 2,
  },
  comboEmoji: { fontSize: 20 },
  comboName: { fontSize: FontSize.xs, fontWeight: '700' },
  comboVegs: { fontSize: 10, lineHeight: 14 },
  // Clear mix
  clearMixBtn: { alignSelf: 'flex-end', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm },
  clearMixText: { fontSize: FontSize.xs, fontWeight: '600' },
  // Mix weights
  mixWeightRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  mixWeightEmoji: { fontSize: 16 },
  mixWeightLabel: { flex: 1, fontSize: FontSize.sm },
  mixWeightInput: {
    width: 64, height: 36, borderWidth: 1, borderRadius: BorderRadius.sm,
    textAlign: 'right', fontSize: FontSize.sm, fontWeight: '600', paddingHorizontal: Spacing.sm,
  },
  mixWeightUnit: { fontSize: FontSize.xs, width: 14 },
  mixTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: Spacing.sm, marginTop: Spacing.xs },
  mixTotalLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  mixTotalValue: { fontSize: FontSize.lg, fontWeight: '800' },
  saltChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  saltChipText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },

  // Calculate
  calcBtn: {
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  calcBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },

  // Results
  results: {
    gap: Spacing.lg,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  adviceLine: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  bottomPad: {
    height: 60,
  },
});
