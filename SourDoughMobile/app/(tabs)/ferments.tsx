import React, { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { CalculatorShell } from '@/src/components/CalculatorShell';
import { TempForecastCard } from '@/src/components/TempForecastCard';
import { StaleResultsBanner } from '@/src/components/StaleResultsBanner';
import { ValidationMessage } from '@/src/components/ValidationMessage';
import { Chip } from '@/src/components/Chip';
import { LactoResultCard } from '@/src/components/LactoResultCard';
import { LactoTimeline } from '@/src/components/LactoTimeline';
import { AddToCalendarCard } from '@/src/components/AddToCalendarCard';
import { LactoAdvice } from '@/src/components/LactoAdvice';
import { LactoScience } from '@/src/components/LactoScience';
import { LocationBar } from '@/src/components/LocationBar';
import { NumberInput } from '@/src/components/NumberInput';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyleLg } from '@/src/theme';
import { FERMENT_TYPE_ORDER } from '@/src/data/fermentPresets';
import { VEGETABLES, VEG_CATEGORIES } from '@/src/data/vegetables';
import { FermentType, SALT_LABELS, SALT_TYPE_ORDER, PREP_SIZE_LABELS, PREP_SIZE_ORDER } from '@/src/models/types';
import { gramsToOz, ozToGrams, formatWeight, weightUnit } from '@/src/lib/unitConversion';
import { summaryWithHardnessOverride } from '@/src/lib/location';
import { Seo } from '@/src/components/Seo';
import { loadFerments } from '@/src/store/fermentHistoryStore';

export default function FermentsScreen() {
  const router = useRouter();
  const calc = useLactoCalculator();
  // "Calculate again" from the history tab arrives as ?historyId=…
  const { historyId } = useLocalSearchParams<{ historyId?: string }>();
  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(null);

  useEffect(() => {
    if (!historyId || historyId === loadedHistoryId) return;
    loadFerments().then((entries) => {
      const entry = entries.find((e) => e.id === historyId);
      if (!entry) return;
      calc.restoreFrom(entry);
      setLoadedHistoryId(historyId);
    });
  }, [historyId, loadedHistoryId, calc.restoreFrom]);
  const { colors, unitSystem } = useAppTheme();
  const { isDesktop } = useBreakpoint();

  const handleCalculate = useCallback(() => {
    calc.calculate();
  }, [calc.calculate]);

  const locationSummary = calc.locationData
    ? summaryWithHardnessOverride(calc.locationData, calc.waterHardnessOverride, unitSystem)
    : null;

  const inputPanels = (
    <>
      {/* Header — tap to return home */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
            <Text style={[styles.brand, { color: colors.terracotta }]}>JUST DOUGH IT  /  FERMENTS</Text>
          </TouchableOpacity>
          <Text style={[styles.heading, { color: colors.espresso }]}>A little jar of magic.</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Choose what goes in. We'll help with salt and timing.
          </Text>
        </View>

        {/* ── Location Bar ── */}
        <LocationBar
          summary={locationSummary}
          loading={calc.locLoading}
          error={calc.locError}
          onRefresh={calc.onRefreshLocation}
          showFallbackWarning={!calc.locLoading && !calc.locationData}
          onTapFallback={() => router.push('/settings')}
          onPostcodeSubmit={calc.onPostcodeSubmit}
        />

        {/* ── Temperature Forecast ── */}
        {calc.dailyTemps.length > 0 && (
          <TempForecastCard
            dailyTemps={calc.dailyTemps}
            title="🌡 Fermentation temperature"
            summary={calc.tempSummary}
            source={calc.tempSource}
            locationEnabled={!!calc.locationData}
            dayColor={(avg) => avg > 24 ? colors.hot : avg > 20 ? colors.olive : avg > 16 ? colors.cool : colors.cold}
          />
        )}

        {/* ── Ferment Type Picker ── */}
        <Text style={[styles.sectionLabel, { color: colors.espresso }]}>Style</Text>
        <ScrollView
          horizontal={!isDesktop}
          scrollEnabled={!isDesktop}
          showsHorizontalScrollIndicator={false}
          style={[styles.chipScroll, isDesktop && styles.chipScrollDesktop]}
          contentContainerStyle={[styles.chipRow, isDesktop && styles.chipRowDesktop]}
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
            <ScrollView horizontal showsHorizontalScrollIndicator={isDesktop} contentContainerStyle={styles.combosRow}>
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
                {calc.acidBalance.acidLimited
                  ? calc.acidBalance.measuredEndPH != null
                    ? ` · stops near pH ${calc.acidBalance.measuredEndPH.toFixed(1)}`
                    : ' · may not fully sour'
                  : ''}
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
                <ScrollView horizontal showsHorizontalScrollIndicator={isDesktop} contentContainerStyle={styles.vegChipRow}>
                  {items.map((veg) => {
                    const inMix = !!calc.vegMix.find(m => m.vegId === veg.id);
                    const isSelected = calc.isMultiVeg ? inMix : calc.vegId === veg.id;
                    return (
                      <Chip
                        key={veg.id}
                        selected={isSelected}
                        // Tap REPLACES the single selection (or edits an
                        // existing mix); long-press ADDS to a mix. Tapping used
                        // to always start a mix, which left no way to choose a
                        // different vegetable at all — a 43-vegetable picker
                        // where the vegetable could not be changed.
                        onPress={() => (calc.isMultiVeg
                          ? calc.toggleVegInMix(veg.id)
                          : calc.selectVeg(veg.id))}
                        onLongPress={() => calc.toggleVegInMix(veg.id)}
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

          <Text style={[styles.pickerHint, { color: colors.lightText }]}>
            Tap to choose · long-press to add a second vegetable to a mix
          </Text>

          {/* Clear mix button */}
          {calc.isMultiVeg && (
            <TouchableOpacity
              style={styles.clearMixBtn}
              onPress={calc.clearMix}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Clear vegetable selection"
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
                  value={unitSystem === 'imperial' ? gramsToOz(parseFloat(m.grams) || 0).toFixed(1) : m.grams}
                  onChangeText={(t) => calc.updateMixGrams(m.vegId, unitSystem === 'imperial' ? String(Math.round(ozToGrams(parseFloat(t) || 0) * 10) / 10) : t)}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                  accessibilityLabel={`${m.veg.name} weight in ${weightUnit(unitSystem)}`}
                />
                <Text style={[styles.mixWeightUnit, { color: colors.muted }]}>{weightUnit(unitSystem)}</Text>
              </View>
            ))}
            <View style={[styles.mixTotalRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.mixTotalLabel, { color: colors.espresso }]}>Total weight</Text>
              <Text style={[styles.mixTotalValue, { color: colors.terracotta }]}>{formatWeight(calc.totalMixGrams, unitSystem, 0)}</Text>
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
          )}

          {calc.method === 'brine' && (
            <NumberInput
              label="Water"
              value={calc.waterAmount}
              unit="ml"
              onChangeText={calc.setWaterAmount}
              placeholder="500"
            />
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
                ? `Recommended ${calc.veg.typicalBrineSaltPct}% for ${calc.isMultiVeg ? 'your selected mix' : calc.veg.name.toLowerCase()}`
                : `Recommended ${calc.veg.typicalDrySaltPct}% for ${calc.isMultiVeg ? 'your selected mix' : calc.veg.name.toLowerCase()}`}
            </Text>
          </View>

          <Text style={[styles.miniLabel, { color: colors.muted }]}>Salt type</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={isDesktop}
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

          {/* Cut size — a first-order factor: sugar has to diffuse out of the
              tissue before LAB can use it, so surface area sets the early pace.
              Hidden for mashes, which are blended by definition. */}
          {calc.method !== 'mash' && (
          <>
          <Text style={[styles.miniLabel, { color: colors.muted }]}>Cut size</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={isDesktop}
            style={styles.chipScroll}
          >
            {PREP_SIZE_ORDER.map((prep) => (
              <Chip
                key={prep}
                selected={calc.prepSize === prep}
                onPress={() => calc.setPrepSize(prep)}
                label={PREP_SIZE_LABELS[prep]}
                colorScheme="olive"
                inactiveBg={colors.white}
                style={styles.saltChip}
              >
                <Text style={[styles.saltChipText, { color: calc.prepSize === prep ? colors.white : colors.muted }]}>
                  {PREP_SIZE_LABELS[prep]}
                </Text>
              </Chip>
            ))}
          </ScrollView>
          <View style={styles.hintRow}>
            <Text style={[styles.hintText, { color: colors.lightText }]}>
              Finer cuts ferment faster — shredded cabbage is done in about half the time of whole heads
            </Text>
          </View>
          </>
          )}

          {/* Starter culture — acts on the lag phase, so it is modelled as a
              fixed saving rather than a percentage. */}
          <TouchableOpacity
            style={styles.starterRow}
            onPress={() => calc.setUseStarter(!calc.useStarter)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: calc.useStarter }}
            accessibilityLabel="I used a starter culture"
          >
            <View
              style={[
                styles.starterBox,
                {
                  borderColor: calc.useStarter ? colors.olive : colors.border,
                  backgroundColor: calc.useStarter ? colors.olive : colors.white,
                },
              ]}
            >
              {calc.useStarter && <Text style={styles.starterTick}>✓</Text>}
            </View>
            <View style={styles.starterText}>
              <Text style={[styles.starterLabel, { color: colors.espresso }]}>Starter culture</Text>
              <Text style={[styles.starterHint, { color: colors.lightText }]}>
                Commercial sachet or fresh mild brine — skips most of the slow start
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Validation message ── */}
        {calc.validationError && <ValidationMessage message={calc.validationError} />}

        {/* ── Calculate ── */}
        <TouchableOpacity
          style={[styles.calcBtn, { backgroundColor: colors.terracotta }]}
          onPress={handleCalculate}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Text style={[styles.calcBtnText, { color: colors.white }]}>Calculate</Text>
        </TouchableOpacity>
      </>
  );

  const resultsPanel = calc.showResults && calc.results && (
    <View style={styles.results}>
      {calc.inputsDirty && <StaleResultsBanner onRecalculate={handleCalculate} />}
      <LactoResultCard results={calc.results} method={calc.method} />
      <LactoTimeline timeline={calc.timeline} results={calc.results} timing={calc.timing} />
      <AddToCalendarCard
        presetName={calc.presetName}
        presetEmoji={calc.presetEmoji}
        vegName={calc.veg.name}
        method={calc.method}
        vegWeightG={calc.isMultiVeg ? calc.totalMixGrams : parseFloat(calc.vegWeight) || 0}
        waterG={calc.method === 'brine' ? parseFloat(calc.waterAmount) || 0 : 0}
        saltG={calc.results.saltGrams}
        saltPct={parseFloat(calc.saltPct) || 0}
        saltLabel={calc.results.saltLabel}
        tempC={calc.effectiveTemp}
        results={calc.results}
        timeline={calc.timeline}
        timing={calc.timing}
      />
      <LactoAdvice
        advice={calc.advice}
        tips={calc.tips}
        presetEmoji={calc.presetEmoji}
        presetName={calc.presetName}
      />

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

      <LactoScience
              vegResearchNote={calc.veg.researchNote}
              presetHealthNote={calc.presetHealthNote}
            />
          </View>
  );

  const scrollRef = React.useRef<ScrollView>(null);

  // Scroll to results when they first appear (mobile single-column layout)
  useEffect(() => {
    if (calc.showResults) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [calc.showResults]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={['top']}>
      <Seo
        title="Lacto-Fermentation Calculator — Just Dough It"
        description="Salt, brine and a day-by-day pH timeline for sauerkraut, kimchi, pickles and hot sauce — adjusted to your ambient temperature. Free, private, open source."
        path="/ferments"
      />
      <CalculatorShell right={resultsPanel} leftRef={scrollRef}>
        {inputPanels}
      </CalculatorShell>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  brand: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1.4, marginBottom: Spacing.sm },
  heading: {
    fontFamily: 'Georgia',
    fontSize: FontSize.title + 7,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: FontSize.sm,
    lineHeight: 21,
    marginTop: Spacing.xs,
  },
  sectionLabel: {
    fontFamily: 'Georgia',
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },

  // Style chips
  chipScroll: {
    marginBottom: Spacing.md,
    maxHeight: 60,
  },
  chipScrollDesktop: { maxHeight: 160 },
  chipRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  chipRowDesktop: { flexDirection: 'row', flexWrap: 'wrap', paddingRight: 0 },
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
  pickerHint: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    paddingLeft: 2,
  },
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

  starterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    minHeight: 44,
  },
  starterBox: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starterTick: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  starterText: {
    flex: 1,
  },
  starterLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  starterHint: {
    fontSize: FontSize.xs,
    lineHeight: 16,
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
});
