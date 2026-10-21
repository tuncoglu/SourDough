import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Spacing, FontSize, useAppTheme } from '../theme';
import { FlourPicker } from './FlourPicker';
import { NumberInput } from './NumberInput';
import type { FlourEntry } from '../models/types';
import type { MixRow } from '../hooks/useCalculatorInputs';

interface Props {
  rows: MixRow[];
  onAdd: () => void;
  onRemove: (key: string) => void;
  onUpdateFlour: (key: string, flour: FlourEntry) => void;
  onUpdateGrams: (key: string, grams: string) => void;
}

/** One to three flours, each with a weight. The first row is never removable. */
export function FlourMix({ rows, onAdd, onRemove, onUpdateFlour, onUpdateGrams }: Props) {
  const { colors } = useAppTheme();
  const total = rows.reduce((sum, r) => sum + (parseFloat(r.grams) || 0), 0);
  return (
    <View>
      {rows.map((row, i) => {
        const pct = total > 0 ? Math.round(((parseFloat(row.grams) || 0) / total) * 100) : 0;
        return (
          <View key={row.key} style={styles.row}>
            <View style={styles.picker}>
              <FlourPicker value={row.flour.label} onSelect={(f) => onUpdateFlour(row.key, f)} />
              {rows.length > 1 && <Text style={[styles.pct, { color: colors.muted }]}>{pct}%</Text>}
            </View>
            <View style={styles.grams}>
              <NumberInput label="" value={row.grams} onChangeText={(t) => onUpdateGrams(row.key, t)} unit="g" />
            </View>
            {i > 0 ? (
              <TouchableOpacity
                onPress={() => onRemove(row.key)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Remove flour"
                style={[styles.remove, { backgroundColor: colors.border }]}
              >
                <Text style={[styles.removeText, { color: colors.error }]}>×</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.remove} />
            )}
          </View>
        );
      })}
      {rows.length < 3 && (
        <TouchableOpacity onPress={onAdd} accessibilityRole="button" hitSlop={{ top: 8, bottom: 8 }} style={styles.add}>
          <Text style={[styles.addText, { color: colors.terracotta }]}>+ Add flour</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginTop: Spacing.sm },
  picker: { flex: 1, minWidth: 0 },
  pct: { fontSize: FontSize.xs, marginTop: 2 },
  // NumberInput pads its row by xs + 2; cancel it so the box lines up with the picker.
  grams: { width: 112, flexShrink: 0, marginTop: -(Spacing.xs + 2) },
  remove: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  removeText: { fontSize: FontSize.lg, fontWeight: '700', lineHeight: 22 },
  add: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  addText: { fontSize: FontSize.sm, fontWeight: '700' },
});
