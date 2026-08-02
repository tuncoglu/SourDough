import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useYogurtCalculator } from '@/src/hooks/useYogurtCalculator';
import { YogurtResultCard } from '@/src/components/YogurtResultCard';
import { YogurtTimeline } from '@/src/components/YogurtTimeline';
import { YogurtAdvice } from '@/src/components/YogurtAdvice';
import { YogurtScience } from '@/src/components/YogurtScience';
import { LocationBar } from '@/src/components/LocationBar';
import { NumberInput } from '@/src/components/NumberInput';
import { Spacing, FontSize, BorderRadius, useAppTheme, MaxWidth } from '@/src/theme';
import { YogurtType, StarterSource } from '@/src/models/types';
import { MILK_TYPES } from '@/src/data/yogurtCultures';

export default function YogurtScreen() {
  const calc = useYogurtCalculator();
  const { colors } = useAppTheme();

  const handleCalculate = useCallback(() => {
    calc.calculate();
  }, [calc.calculate]);

  const locationSummary = calc.locationData?.summary ?? null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.heading, { color: colors.espresso }]}>🥛 Yogurt</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Starter culture calculator & incubation timeline
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
              {calc.dailyTemps.slice(0, 5).map((d, i) => (
                <View key={i} style={styles.tempDay}>
                  <Text style={[styles.tempDayLabel, { color: colors.muted }]}>{d.day}</Text>
                  <Text style={[styles.tempDayHigh, { color: colors.espresso }]}>{d.high}°</Text>
                  <View style={[styles.tempBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.tempBarFill,
                        {
                          backgroundColor: d.avg > 28 ? colors.hot : d.avg > 24 ? colors.warm : d.avg > 20 ? colors.olive : d.avg > 16 ? colors.cool : colors.cold,
                          height: `${Math.max(8, Math.min(100, ((d.avg - 10) / 20) * 100))}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.tempDayLow, { color: colors.lightText }]}>{d.low}°</Text>
                </View>
              ))}
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
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {calc.thermophilicCultures.map(({ id, preset }) => {
            const active = calc.yogurtType === id;
            return (
              <TouchableOpacity
                key={id}
                style={[
                  styles.presetChip,
                  {
                    backgroundColor: active ? colors.terracotta : colors.card,
                    borderColor: active ? colors.terracotta : colors.border,
                  },
                ]}
                onPress={() => calc.selectPreset(id as YogurtType)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={preset.name}
              >
                <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                <Text
                  style={[
                    styles.presetName,
                    { color: active ? '#FFF' : colors.espresso },
                  ]}
                >
                  {preset.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Mesophilic */}
        <Text style={[styles.groupLabel, { color: colors.lightText }]}>
          🏠 Mesophilic (20–25°C) — ferments at room temperature
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {calc.mesophilicCultures.map(({ id, preset }) => {
            const active = calc.yogurtType === id;
            return (
              <TouchableOpacity
                key={id}
                style={[
                  styles.presetChip,
                  {
                    backgroundColor: active ? colors.terracotta : colors.card,
                    borderColor: active ? colors.terracotta : colors.border,
                  },
                ]}
                onPress={() => calc.selectPreset(id as YogurtType)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={preset.name}
              >
                <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                <Text
                  style={[
                    styles.presetName,
                    { color: active ? '#FFF' : colors.espresso },
                  ]}
                >
                  {preset.name}
                </Text>
              </TouchableOpacity>
            );
          })}
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
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {MILK_TYPES.map((m) => {
            const active = calc.milkId === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.milkChip,
                  {
                    backgroundColor: active ? colors.oliveLight : colors.card,
                    borderColor: active ? colors.olive : colors.border,
                  },
                ]}
                onPress={() => calc.selectMilk(m.id)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={m.name}
              >
                <Text style={styles.milkEmoji}>{m.emoji}</Text>
                <View style={styles.milkInfo}>
                  <Text
                    style={[
                      styles.milkName,
                      { color: active ? '#FFF' : colors.espresso },
                    ]}
                    numberOfLines={1}
                  >
                    {m.name}
                  </Text>
                  <Text style={[styles.milkMacros, { color: active ? 'rgba(255,255,255,0.8)' : colors.lightText }]}>
                    {m.fatPct}% fat · {m.proteinPct}% protein
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Inputs ── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
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

        {/* ── Results ── */}
        {calc.showResults && calc.results && (
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

            {/* Water hardness card */}
            {calc.waterAdvice.length > 0 && (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.cardTitle, { color: colors.espresso }]}>💧 Water</Text>
                {calc.waterAdvice.map((line, i) => (
                  <Text key={i} style={[styles.adviceLine, { color: colors.muted }]}>
                    {line}
                  </Text>
                ))}
              </View>
            )}

            {/* Research context */}
            <YogurtScience
              strainInfo={calc.presetStrainInfo}
              presetHealthNote={calc.presetHealthNote}
            />
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: 'flex-end',
  },
  tempBarFill: {
    width: '100%',
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
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
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
