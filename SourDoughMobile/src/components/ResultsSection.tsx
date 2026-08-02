import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyle, sectionTitleStyle } from '../theme';
import { formatTemp, formatTempValue } from '../lib/unitConversion';
import {
  CalculationResults,
  FlourBlendEntry,
  RecipePreset,
  getTempZoneInfo,
} from '../models/types';
import { FermentationTimeline } from './FermentationTimeline';
import { IngredientResults } from './IngredientResults';
import { AdviceCards } from './FermentAdvice';
import { MethodTimeline } from './MethodTimeline';
import { PROOF_FRACTION } from '../lib/calculations';

interface Props {
  results: CalculationResults;
  blend: FlourBlendEntry[];
  totalFlourWeight: number;
  starterFlourLabel: string;
  preferredType?: string;
  selectedPreset: RecipePreset | null;
  flourTemp: string;
  ambientTemp: string;
  waterTemp: string;
  starterTemp: string;
  saving: boolean;
  onSave: () => void;
  onShare: () => void;
  /** Ready-by planner result (null if not enabled) */
  readyByResult?: {
    startTimeStr: string;
    readyTimeStr: string;
    isToday: boolean;
    startDate: Date;
    totalHours: number;
    breakdownParts: string[];
    fermentHours: number;
  } | null;
}

export function ResultsSection({
  results, blend, totalFlourWeight, starterFlourLabel,
  preferredType, selectedPreset,
  flourTemp, ambientTemp, waterTemp, starterTemp,
  saving, onSave, onShare, readyByResult,
}: Props) {
  const { unitSystem, colors } = useAppTheme();
  const zoneInfo = getTempZoneInfo(results.tempZone);
  const targetFDT = 26.0;

  const fdtCard = (
    <View style={[styles.fdtCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.fdtLabel, { color: colors.muted }]}>Final Dough Temperature</Text>
      <Text style={[styles.fdtValue, { color: zoneInfo.color }]}>
        {zoneInfo.icon}  {formatTemp(results.fdt, unitSystem)}
      </Text>
      <Text style={[styles.fdtZone, { color: zoneInfo.color }]}>{zoneInfo.label}</Text>
      {(() => {
        const zone = results.tempZone;
        if (zone === 'ideal') {
          return <Text style={[styles.fdtHint, { color: colors.muted }]}>Your dough is in the optimal fermentation range</Text>;
        }
        const targetFDT = 26.0;
        const neededWater = Math.round((targetFDT * 4 - parseFloat(flourTemp) - parseFloat(ambientTemp) - parseFloat(starterTemp)) * 10) / 10;
        const currentWater = parseFloat(waterTemp);
        const diff = Math.round((neededWater - currentWater) * 10) / 10;
        if (zone === 'cold' || zone === 'cool') {
          return (
            <>
              <Text style={[styles.fdtHint, { color: colors.muted }]}>{formatTemp(results.fdt, unitSystem)} is below the {formatTemp(targetFDT, unitSystem)} target — fermentation will be slower.</Text>
              <Text style={[styles.fdtAction, { color: colors.espresso, backgroundColor: colors.tipBg }]}>
                💧 Heat your water to <Text style={{ fontWeight: '800' }}>{formatTempValue(neededWater, unitSystem)}°</Text> (currently {formatTempValue(currentWater, unitSystem)}°, +{formatTempValue(diff, unitSystem)}°)
              </Text>
            </>
          );
        }
        return (
          <>
            <Text style={[styles.fdtHint, { color: colors.muted }]}>{formatTemp(results.fdt, unitSystem)} is above the {formatTemp(targetFDT, unitSystem)} target — fermentation will be faster. Watch closely!</Text>
            <Text style={[styles.fdtAction, { color: colors.espresso, backgroundColor: colors.tipBg }]}>
              💧 Cool your water to <Text style={{ fontWeight: '800' }}>{formatTempValue(neededWater, unitSystem)}°</Text> (currently {formatTempValue(currentWater, unitSystem)}°, {formatTempValue(diff, unitSystem)}°)
            </Text>
          </>
        );
      })()}
    </View>
  );

  return (
    <>
      {fdtCard}

      <FermentationTimeline
        dynamic={results.dynamicFerment}
        staticHours={results.staticFermentHours}
        staticNote={results.staticFermentNote}
        fdt={results.fdt}
        preset={selectedPreset}
      />

      {readyByResult && (
        <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[sectionTitleStyle, { color: colors.muted }]}>🕐  YOUR SCHEDULE</Text>
          <View style={readyStyles.resultRow}>
            <View style={readyStyles.resultBlock}>
              <Text style={[readyStyles.resultLabel, { color: colors.muted }]}>Start mixing</Text>
              <Text style={[readyStyles.resultTime, { color: colors.terracotta }]}>{readyByResult.startTimeStr}</Text>
              {!readyByResult.isToday && (
                <Text style={[readyStyles.resultDate, { color: colors.muted }]}>
                  {readyByResult.startDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
              )}
            </View>
            <Text style={[readyStyles.resultArrow, { color: colors.muted }]}>→</Text>
            <View style={readyStyles.resultBlock}>
              <Text style={[readyStyles.resultLabel, { color: colors.muted }]}>Ready by</Text>
              <Text style={[readyStyles.resultTime, { color: colors.terracotta }]}>{readyByResult.readyTimeStr}</Text>
            </View>
          </View>
          <Text style={[styles.cardHint, { color: colors.muted }]}>
            ~{readyByResult.totalHours.toFixed(1)}h total · {readyByResult.breakdownParts.join(' · ')}
          </Text>
        </View>
      )}

      <IngredientResults
        ingredients={results.ingredients}
        blend={blend}
        totalFlourWeight={totalFlourWeight}
        starterFlourType={starterFlourLabel}
        prefermentType={preferredType}
        typicalUnitGrams={selectedPreset?.typicalUnitGrams}
        unitLabel={selectedPreset?.unitLabel}
      />

      <AdviceCards warnings={results.warnings} />

      {selectedPreset && (
        <MethodTimeline
          preset={selectedPreset}
          staticFermentHours={results.dynamicFerment?.bulkHours ?? results.staticFermentHours}
          fermentAdvice={results.fermentAdvice}
        />
      )}

      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.terracotta }]} onPress={onSave} disabled={saving} activeOpacity={0.8}>
        {saving ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={[styles.saveBtnText, { color: colors.white }]}>💾  Save Recipe</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.card, borderColor: colors.olive }]} onPress={onShare} activeOpacity={0.8}>
        <Text style={[styles.shareBtnText, { color: colors.olive }]}>📤  Share Recipe</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  cardHint: { fontSize: FontSize.xs, lineHeight: 16 },
  fdtCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md, padding: Spacing.lg, marginBottom: Spacing.md, alignItems: 'center',
  },
  fdtLabel: {
    fontSize: FontSize.xs, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.xs,
  },
  fdtValue: { fontSize: FontSize.title + 4, fontWeight: '800', marginBottom: Spacing.xs },
  fdtZone: { fontSize: FontSize.md, fontWeight: '500' },
  fdtHint: { fontSize: FontSize.xs, marginTop: Spacing.xs, textAlign: 'center' },
  fdtAction: {
    fontSize: FontSize.sm, marginTop: Spacing.sm, textAlign: 'center',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, overflow: 'hidden', lineHeight: 20,
  },
  saveBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, alignItems: 'center', marginBottom: Spacing.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontWeight: '700' },
  shareBtn: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.md, paddingVertical: Spacing.md, alignItems: 'center', marginBottom: Spacing.lg,
  },
  shareBtnText: { fontSize: FontSize.md, fontWeight: '700' },
});

const readyStyles = StyleSheet.create({
  resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.lg, paddingVertical: Spacing.md },
  resultBlock: { alignItems: 'center' },
  resultLabel: { fontSize: FontSize.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.xs },
  resultTime: { fontSize: FontSize.xxl, fontWeight: '800' },
  resultDate: { fontSize: FontSize.xs, marginTop: 2 },
  resultArrow: { fontSize: FontSize.xl, fontWeight: '300', marginTop: Spacing.md },
});
