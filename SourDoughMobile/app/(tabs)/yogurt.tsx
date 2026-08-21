import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useYogurtCalculator } from '@/src/hooks/useYogurtCalculator';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { CalculatorShell } from '@/src/components/CalculatorShell';
import { TempForecastCard } from '@/src/components/TempForecastCard';
import { StaleResultsBanner } from '@/src/components/StaleResultsBanner';
import { ValidationMessage } from '@/src/components/ValidationMessage';
import { Chip } from '@/src/components/Chip';
import { YogurtResultCard } from '@/src/components/YogurtResultCard';
import { YogurtTimeline } from '@/src/components/YogurtTimeline';
import { YogurtAdvice } from '@/src/components/YogurtAdvice';
import { YogurtScience } from '@/src/components/YogurtScience';
import { LocationBar } from '@/src/components/LocationBar';
import { NumberInput } from '@/src/components/NumberInput';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyleLg } from '@/src/theme';
import { formatTemp } from '@/src/lib/unitConversion';
import { summaryWithHardnessOverride } from '@/src/lib/location';
import { Seo } from '@/src/components/Seo';
import { PREHEAT_TEMP_C } from '@/src/lib/yogurtCalculations';
import { YogurtType, StarterSource } from '@/src/models/types';
import { MILK_TYPES } from '@/src/data/yogurtCultures';

export default function YogurtScreen() {
  const router = useRouter();
  const calc = useYogurtCalculator();
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
          <Text style={[styles.heading, { color: colors.espresso }]}>🥖  Just Dough It</Text>
        </TouchableOpacity>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Cultured at home, your way
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
          title="🌡 Ambient temperature"
          summary={calc.tempResult?.summary ?? 'Using weather forecast for ambient temp'}
          source={calc.tempResult?.source}
          locationEnabled={!!calc.locationData}
          suffixes={[
            calc.cultureType === 'thermophilic' ? ` (thermophilic — use a heat source at ${formatTemp(40, unitSystem, 0)}–${formatTemp(45, unitSystem, 0)})` : '',
            calc.cultureType === 'mesophilic' ? ' (mesophilic — room temp is your incubation temp)' : '',
          ]}
          dayColor={(avg) => avg > 28 ? colors.hot : avg > 24 ? colors.warm : avg > 20 ? colors.olive : avg > 16 ? colors.cool : colors.cold}
        />
      )}

      {/* ── Culture Type Picker ── */}
      <Text style={[styles.sectionLabel, { color: colors.espresso }]}>Starter Culture</Text>

        {/* Thermophilic */}
        <Text style={[styles.groupLabel, { color: colors.lightText }]}>
          🌡 Thermophilic (40–45°C) — needs a heat source
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={isDesktop}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {calc.thermophilicCultures.map(({ id, preset }) => (
              <Chip
                key={id}
                selected={calc.yogurtType === id}
                onPress={() => calc.selectPreset(id as YogurtType)}
                label={preset.name}
                colorScheme="terracotta"
              >
                <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                <Text style={[styles.presetName, { color: calc.yogurtType === id ? colors.white : colors.espresso }]}>
                  {preset.name}
                </Text>
              </Chip>
            ))}
        </ScrollView>

        {/* Mesophilic */}
        <Text style={[styles.groupLabel, { color: colors.lightText }]}>
          🏠 Mesophilic (20–25°C) — ferments at room temperature
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={isDesktop}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {calc.mesophilicCultures.map(({ id, preset }) => (
              <Chip
                key={id}
                selected={calc.yogurtType === id}
                onPress={() => calc.selectPreset(id as YogurtType)}
                label={preset.name}
                colorScheme="terracotta"
              >
                <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                <Text style={[styles.presetName, { color: calc.yogurtType === id ? colors.white : colors.espresso }]}>
                  {preset.name}
                </Text>
              </Chip>
            ))}
        </ScrollView>

        {/* Culture description */}
        <View style={[styles.descCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.descEmoji, { color: colors.espresso }]}>
            {calc.presetEmoji}
          </Text>
          <Text style={[styles.descText, { color: colors.muted }]}>
            {calc.cultureDescription}
          </Text>
        </View>

        {/* ── Milk Type Picker ── */}
        <Text style={[styles.sectionLabel, { color: colors.espresso }]}>Milk</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={isDesktop}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {MILK_TYPES.filter((m) =>
              calc.yogurtType === 'vegan-soya' ? m.source === 'plant' : m.source !== 'plant'
            ).map((m) => (
              <Chip
                key={m.id}
                selected={calc.milkId === m.id}
                onPress={() => calc.selectMilk(m.id)}
                label={m.name}
                colorScheme="olive"
                style={styles.milkChip}
              >
                <Text style={styles.milkEmoji}>{m.emoji}</Text>
                <View style={styles.milkInfo}>
                  <Text
                    style={[styles.milkName, { color: calc.milkId === m.id ? colors.white : colors.espresso }]}
                    numberOfLines={1}
                  >
                    {m.name}
                  </Text>
                  <Text style={[styles.milkMacros, { color: calc.milkId === m.id ? colors.white : colors.lightText }]}>
                    {m.fatPct}% fat · {m.proteinPct}% protein
                  </Text>
                </View>
              </Chip>
            ))}
        </ScrollView>

        {/* ── Inputs ── */}
        <View style={[cardStyleLg, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <NumberInput
            label="Milk"
            value={calc.milkLitres}
            unit="L"
            onChangeText={calc.setMilkLitres}
            placeholder="2"
          />
          <View style={styles.hintRow}>
            <Text style={[styles.hintText, { color: colors.lightText }]}>
              Typical: 2L for thermophilic, 1L for mesophilic
            </Text>
          </View>

          {/* Starter source toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <Text style={[styles.toggleTitle, { color: colors.espresso }]}>
                Previous batch starter
              </Text>
              <Text style={[styles.toggleHint, { color: colors.lightText }]}>
                Use yogurt from your last batch instead of freeze-dried sachets
              </Text>
            </View>
            <Switch
              value={calc.starterSource === 'previous-batch'}
              onValueChange={(v) => calc.setStarterSource(v ? 'previous-batch' : 'sachet')}
              trackColor={{ false: colors.disabledBg, true: colors.oliveLight }}
              thumbColor={calc.starterSource === 'previous-batch' ? colors.olive : colors.disabled}
              accessibilityLabel="Use previous batch as starter"
            />
          </View>

          {calc.starterSource === 'sachet' ? (
            <>
              <NumberInput
                label="Sachets"
                value={calc.sachetCount}
                unit="pcs"
                onChangeText={calc.setSachetCount}
                placeholder="1"
              />
              <View style={styles.hintRow}>
                <Text style={[styles.hintText, { color: colors.lightText }]}>
                  Auto-calculated: 1 sachet per {calc.cultureType === 'thermophilic' ? '2L' : '1L'} recommended
                </Text>
              </View>
            </>
          ) : (
            <>
              <NumberInput
                label="Starter"
                value={calc.previousBatchGrams}
                unit="g"
                onChangeText={calc.setPreviousBatchGrams}
                placeholder="60"
              />
              <View style={styles.hintRow}>
                <Text style={[styles.hintText, { color: colors.lightText }]}>
                  2 tbsp ≈ 30g per litre of milk. Use plain, unflavoured yogurt.
                </Text>
              </View>
            </>
          )}

          {/* Pre-heat toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <Text style={[styles.toggleTitle, { color: colors.espresso }]}>
                Pre-heat milk
              </Text>
              <Text style={[styles.toggleHint, { color: colors.lightText }]}>
                Heat to {formatTemp(PREHEAT_TEMP_C, unitSystem, 0)} for 30 min — denatures proteins for thicker set
              </Text>
            </View>
            <Switch
              value={calc.preHeatEnabled}
              onValueChange={calc.setPreHeatEnabled}
              trackColor={{ false: colors.disabledBg, true: colors.oliveLight }}
              thumbColor={calc.preHeatEnabled ? colors.olive : colors.disabled}
              accessibilityLabel="Pre-heat milk to 85 degrees Celsius"
            />
          </View>
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
      <YogurtResultCard
        results={calc.results}
        cultureType={calc.cultureType}
        thickness={calc.thickness}
        nutrition={calc.nutrition}
      />
      <YogurtTimeline timeline={calc.timeline} results={calc.results} />
      <YogurtAdvice
        advice={calc.advice}
        tips={calc.tips}
        presetEmoji={calc.presetEmoji}
        presetName={calc.presetName}
      />

      <YogurtScience
        strainInfo={calc.presetStrainInfo}
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
        title="Yogurt Maker Calculator — Just Dough It"
        description="Incubation time, starter culture, yield and nutrition for 10 yogurt cultures, adjusted to your kitchen temperature. Free, private, open source."
        path="/yogurt"
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
  groupLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
    paddingLeft: 2,
  },

  // Culture chips
  chipScroll: {
    marginBottom: Spacing.sm,
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

  // Culture description card
  descCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  descEmoji: {
    fontSize: 24,
  },
  descText: {
    flex: 1,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },

  // Milk chips
  milkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
  },
  milkEmoji: {
    fontSize: 18,
  },
  milkInfo: {
    gap: 1,
  },
  milkName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    maxWidth: 160,
  },
  milkMacros: {
    fontSize: FontSize.xs,
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  toggleLabel: {
    flex: 1,
    marginRight: Spacing.md,
  },
  toggleTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  toggleHint: {
    fontSize: FontSize.xs,
    marginTop: 2,
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
