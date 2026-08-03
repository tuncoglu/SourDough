import React, { useCallback } from 'react';
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
import { KeyboardScreen } from '@/src/components/KeyboardScreen';
import { Chip } from '@/src/components/Chip';
import { YogurtResultCard } from '@/src/components/YogurtResultCard';
import { YogurtTimeline } from '@/src/components/YogurtTimeline';
import { YogurtAdvice } from '@/src/components/YogurtAdvice';
import { YogurtScience } from '@/src/components/YogurtScience';
import { LocationBar } from '@/src/components/LocationBar';
import { NumberInput } from '@/src/components/NumberInput';
import { Spacing, FontSize, BorderRadius, useAppTheme, MaxWidth, cardStyleLg } from '@/src/theme';
import { YogurtType, StarterSource } from '@/src/models/types';
import { MILK_TYPES } from '@/src/data/yogurtCultures';

export default function YogurtScreen() {
  const router = useRouter();
  const calc = useYogurtCalculator();
  const { colors } = useAppTheme();
  const { isDesktop } = useBreakpoint();

  const handleCalculate = useCallback(() => {
    calc.calculate();
  }, [calc.calculate]);

  const locationSummary = calc.locationData?.summary ?? null;

  const inputPanels = (
    <>
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
            🌡 Ambient temperature
          </Text>
          <View style={styles.tempDays}>
            {calc.dailyTemps.slice(0, 10).map((d, i, arr) => {
              if (i > 0 && d.high === arr[i - 1].high && d.low === arr[i - 1].low) return null;
              const dayColor = d.avg > 28 ? colors.hot : d.avg > 24 ? colors.warm : d.avg > 20 ? colors.olive : d.avg > 16 ? colors.cool : colors.cold;
              const allHigh = Math.max(...arr.slice(0, 10).map(x => x.high));
              const allLow = Math.min(...arr.slice(0, 10).map(x => x.low));
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
            {calc.tempResult?.summary ?? 'Using weather forecast for ambient temp'}
            {calc.tempResult?.source === 'fallback' && ' — enable location for local temps'}
            {calc.cultureType === 'thermophilic' && ' (thermophilic — use a heat source at 40–45°C)'}
            {calc.cultureType === 'mesophilic' && ' (mesophilic — room temp is your incubation temp)'}
          </Text>
        </View>
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
          {MILK_TYPES.map((m) => (
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
                  2 tbsp ≈ 30g per litre of milk. Use plain, unflavored yogurt.
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
                Heat to 85°C for 30 min — denatures proteins for thicker set
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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={['top']}>
      <KeyboardScreen>
        {isDesktop ? (
          <View style={desktopStyles.twoCol}>
            <ScrollView style={desktopStyles.leftCol} contentContainerStyle={desktopStyles.leftContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {inputPanels}
            </ScrollView>
            <ScrollView style={desktopStyles.rightCol} contentContainerStyle={desktopStyles.rightContent} showsVerticalScrollIndicator={false}>
              {resultsPanel}
            </ScrollView>
          </View>
        ) : (
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {inputPanels}
            {resultsPanel}
            <View style={styles.bottomPad} />
          </ScrollView>
        )}
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
  groupLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
    paddingLeft: 2,
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
  bottomPad: {
    height: 60,
  },
});

const desktopStyles = StyleSheet.create({
  twoCol: { flex: 1, flexDirection: 'row', gap: Spacing.lg, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  leftCol: { flex: 1, maxWidth: 420 },
  leftContent: { paddingBottom: 40, paddingTop: Spacing.md },
  rightCol: { flex: 1.3 },
  rightContent: { paddingBottom: 40, paddingTop: Spacing.md },
});
