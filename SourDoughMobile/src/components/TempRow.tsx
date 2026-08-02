import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { tempUnit } from '../lib/unitConversion';

interface Props {
  label: string;
  value: string;
  unit?: string;
  onChangeText: (text: string) => void;
  isAuto?: boolean;
  editing?: boolean;
}

export function TempRow({
  label,
  value,
  unit,
  onChangeText,
  isAuto = false,
  editing = false,
}: Props) {
  const { unitSystem, colors } = useAppTheme();
  const displayUnit = unit ?? tempUnit(unitSystem);

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.espresso }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.white, borderColor: editing ? colors.terracotta : colors.border, color: colors.espresso }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholderTextColor={colors.muted}
      />
      <Text style={[styles.unit, { color: colors.muted }]}>{displayUnit}</Text>
      {isAuto && !editing && (
        <Text style={[styles.autoBadge, { color: colors.olive }]}>auto</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 1,
  },
  label: {
    width: 90,
    fontSize: FontSize.sm,
  },
  input: {
    flex: 1,
    maxWidth: 80,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: FontSize.md,
    textAlign: 'right',
  },
  unit: {
    marginLeft: Spacing.xs + 2,
    fontSize: FontSize.sm,
    width: 20,
  },
  autoBadge: {
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    fontWeight: '600',
  },
});
