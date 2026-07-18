import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { formatWeight } from '../lib/unitConversion';
import { FlourPicker } from './FlourPicker';
import { NumberInput } from './NumberInput';
import { FlourBlendEntry } from '../models/types';
import { CATEGORY_COLORS, shortenLabel } from '../lib/blendUtils';
import type { MixRow } from '../hooks/useCalculatorInputs';

interface Props {
  mixRows: MixRow[];
  totalFlourWeight: number;
  hydration: string;
  starterWeight: string;
  saltPct: string;
  oilPct: string;
  showOil: boolean;
  onAddFlour: () => void;
  onRemoveFlour: (key: string) => void;
  onUpdateFlour: (key: string, flour: Parameters<typeof FlourPicker>[0]['onSelect'] extends (f: infer F) => void ? F : never) => void;
  onUpdateFlourGrams: (key: string, grams: string) => void;
  setHydration: (v: string) => void;
  setStarterWeight: (v: string) => void;
  setSaltPct: (v: string) => void;
  setOilPct: (v: string) => void;
}

export function FlourBlendCard({
  mixRows,
  totalFlourWeight,
  hydration,
  starterWeight,
  saltPct,
  oilPct,
  showOil,
  onAddFlour,
  onRemoveFlour,
  onUpdateFlour,
  onUpdateFlourGrams,
  setHydration,
  setStarterWeight,
  setSaltPct,
  setOilPct,
}: Props) {
  const { unitSystem } = useAppTheme();
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>FLOUR & INGREDIENTS</Text>

      {mixRows.map((row, i) => (
        <View key={row.key} style={styles.mixRow}>
          <View style={styles.pickerWrap}>
            <FlourPicker
              value={row.flour.label}
              onSelect={(f: any) => onUpdateFlour(row.key, f)}
            />
          </View>
          <NumberInput
            label=""
            value={row.grams}
            onChangeText={(t: string) => onUpdateFlourGrams(row.key, t)}
            unit="g"
          />
          {mixRows.length > 1 && i > 0 && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => onRemoveFlour(row.key)}
              activeOpacity={0.6}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.removeBtnText}>×</Text>
            </TouchableOpacity>
          )}
          {!(mixRows.length > 1 && i > 0) && <View style={styles.removeBtnSpacer} />}
        </View>
      ))}

      {/* Blend summary */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Total: {formatWeight(totalFlourWeight, unitSystem, 0)}</Text>
        {mixRows.length > 1 && totalFlourWeight > 0 && (
          <View style={styles.blendBar}>
            {mixRows.map((r) => {
              const grams = parseFloat(r.grams) || 0;
              const pct = totalFlourWeight > 0 ? (grams / totalFlourWeight) * 100 : 0;
              if (pct <= 0) return null;
              const color = CATEGORY_COLORS[r.flour.category] ?? CATEGORY_COLORS['Generic'];
              const shortName = shortenLabel(r.flour.label);
              return (
                <View key={r.key} style={[styles.blendSegment, { flex: pct, backgroundColor: color }]}>
                  {pct >= 18 && (
                    <Text style={styles.blendSegmentText} numberOfLines={1}>
                      {shortName} {Math.round(pct)}%
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
        {mixRows.length > 1 && totalFlourWeight > 0 && (
          <View style={styles.blendLegend}>
            {mixRows.map((r) => {
              const pct = ((parseFloat(r.grams) || 0) / totalFlourWeight) * 100;
              if (pct <= 0) return null;
              const color = CATEGORY_COLORS[r.flour.category] ?? CATEGORY_COLORS['Generic'];
              const shortName = shortenLabel(r.flour.label);
              return (
                <View key={r.key} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: color }]} />
                  <Text style={styles.legendText}>{shortName} ({Math.round(pct)}%)</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {mixRows.length < 3 && (
        <TouchableOpacity style={styles.addBtn} onPress={onAddFlour} activeOpacity={0.6}>
          <Text style={styles.addBtnText}>+ Add Flour</Text>
        </TouchableOpacity>
      )}

      <NumberInput label="Hydration" value={hydration} onChangeText={setHydration} unit="%" />
      <NumberInput label="Starter" value={starterWeight} onChangeText={setStarterWeight} unit="g" />
      <NumberInput label="Salt" value={saltPct} onChangeText={setSaltPct} unit="%" />

      {showOil && (
        <NumberInput label="Oil / Fat" value={oilPct} onChangeText={setOilPct} unit="%" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.xs, fontWeight: '700', color: Colors.muted,
    letterSpacing: 0.5, marginBottom: Spacing.sm,
  },
  mixRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, gap: Spacing.xs },
  pickerWrap: { flex: 1 },
  removeBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  removeBtnSpacer: { width: 36, height: 36 },
  removeBtnText: { fontSize: FontSize.lg, color: Colors.error, fontWeight: '700', lineHeight: FontSize.lg + 2 },
  summaryRow: {
    paddingVertical: Spacing.sm, borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border, marginBottom: Spacing.xs,
  },
  summaryText: { fontSize: FontSize.xs, color: Colors.muted, fontWeight: '500', marginBottom: Spacing.xs },
  blendBar: { flexDirection: 'row', height: 24, borderRadius: BorderRadius.sm, overflow: 'hidden', marginBottom: Spacing.xs },
  blendSegment: { minWidth: 4, alignItems: 'center', justifyContent: 'center' },
  blendSegmentText: {
    fontSize: 10, fontWeight: '700', color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1,
  },
  blendLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FontSize.xs, color: Colors.muted },
  addBtn: { alignSelf: 'flex-end', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, marginBottom: Spacing.sm },
  addBtnText: { fontSize: FontSize.sm, color: Colors.terracotta, fontWeight: '600' },
});
