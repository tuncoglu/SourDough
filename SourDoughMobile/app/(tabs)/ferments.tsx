import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLactoCalculator } from '@/src/hooks/useLactoCalculator';
import { LactoResultCard } from '@/src/components/LactoResultCard';
import { LactoTimeline } from '@/src/components/LactoTimeline';
import { LactoAdvice } from '@/src/components/LactoAdvice';
import { NumberInput } from '@/src/components/NumberInput';
import { TempRow } from '@/src/components/TempRow';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme, MaxWidth } from '@/src/theme';
import { FERMENT_TYPE_ORDER } from '@/src/data/fermentPresets';
import { VEGETABLES, VEG_CATEGORIES } from '@/src/data/vegetables';
import { FermentType, SaltCrystal, SALT_LABELS } from '@/src/models/types';

const SALT_TYPES: SaltCrystal[] = ['fine-sea', 'coarse-sea', 'diamond-kosher', 'morton-kosher', 'pickling'];

export default function FermentsScreen() {
  const calc = useLactoCalculator();
  const { colors } = useAppTheme();

  const handleCalculate = useCallback(() => {
    calc.calculate();
  }, [calc.calculate]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.heading, { color: colors.espresso }]}>🫙 Lacto-Fermentation</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Salt calculator & fermentation timeline
          </Text>
        </View>

        {/* ── Ferment Type Picker ── */}
        <Text style={[styles.sectionLabel, { color: colors.espresso }]}>Style</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {FERMENT_TYPE_ORDER.map(({ id, preset }) => {
            const active = calc.fermentType === id;
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
                onPress={() => calc.selectPreset(id as FermentType)}
                activeOpacity={0.7}
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

        {/* ── Vegetable / Fruit Picker ── */}
        <Text style={[styles.sectionLabel, { color: colors.espresso }]}>Vegetable or fruit</Text>
        <View style={[styles.vegPicker, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Current selection */}
          <View style={styles.currentVeg}>
            <Text style={styles.currentVegEmoji}>{calc.veg.emoji}</Text>
            <View style={styles.currentVegInfo}>
              <Text style={[styles.currentVegName, { color: colors.espresso }]}>
                {calc.veg.name}
              </Text>
              <Text style={[styles.currentVegMeta, { color: colors.lightText }]}>
                {calc.veg.waterContentPct}% water · {calc.veg.firmness} · salt:{' '}
                {calc.method === 'brine' ? calc.veg.typicalBrineSaltPct : calc.veg.typicalDrySaltPct}%
              </Text>
            </View>
          </View>

          {/* Category rows */}
          {VEG_CATEGORIES.map(({ key, label }) => {
            const items = VEGETABLES.filter((v) => v.category === key);
            if (items.length === 0) return null;
            return (
              <View key={key} style={styles.vegCategory}>
                <Text style={[styles.vegCatLabel, { color: colors.muted }]}>{label}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.vegChipRow}
                >
                  {items.map((veg) => {
                    const active = calc.vegId === veg.id;
                    return (
                      <TouchableOpacity
                        key={veg.id}
                        style={[
                          styles.vegChip,
                          {
                            backgroundColor: active ? colors.oliveLight : colors.white,
                            borderColor: active ? colors.olive : colors.border,
                          },
                        ]}
                        onPress={() => calc.selectVeg(veg.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.vegChipEmoji}>{veg.emoji}</Text>
                        <Text
                          style={[
                            styles.vegChipName,
                            { color: active ? '#FFF' : colors.espresso },
                          ]}
                          numberOfLines={1}
                        >
                          {veg.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            );
          })}
        </View>

        {/* ── Inputs ── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
            {SALT_TYPES.map((st) => {
              const active = calc.saltType === st;
              return (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.saltChip,
                    {
                      backgroundColor: active ? colors.olive : colors.white,
                      borderColor: active ? colors.olive : colors.border,
                    },
                  ]}
                  onPress={() => calc.setSaltType(st)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.saltChipText,
                      { color: active ? '#FFF' : colors.muted },
                    ]}
                  >
                    {SALT_LABELS[st]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.tempSection}>
            <TempRow
              label="Ambient"
              value={calc.ambientTemp}
              onChangeText={calc.setAmbientTemp}
            />
          </View>
        </View>

        {/* ── Calculate ── */}
        <TouchableOpacity
          style={[styles.calcBtn, { backgroundColor: colors.terracotta }]}
          onPress={handleCalculate}
          activeOpacity={0.8}
        >
          <Text style={styles.calcBtnText}>Calculate</Text>
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
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
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
    marginBottom: Spacing.lg,
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
    borderBottomColor: Colors.border,
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
  miniLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginTop: Spacing.xs,
    paddingLeft: 2,
  },
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
  tempSection: {
    marginTop: Spacing.sm,
  },

  // Calculate
  calcBtn: {
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  calcBtnText: {
    color: '#FFF',
    fontSize: FontSize.lg,
    fontWeight: '700',
  },

  // Results
  results: {
    gap: Spacing.lg,
  },
  bottomPad: {
    height: 60,
  },
});
