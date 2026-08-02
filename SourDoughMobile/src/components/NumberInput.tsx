import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { weightUnit } from '../lib/unitConversion';

interface Props extends Omit<TextInputProps, 'onChangeText'> {
  label: string;
  value: string;
  unit?: string;
  onChangeText: (text: string) => void;
  autoBadge?: boolean; // shows "auto" badge
}

export function NumberInput({
  label,
  value,
  unit,
  onChangeText,
  autoBadge,
  ...rest
}: Props) {
  const { unitSystem, colors } = useAppTheme();
  // If unit is "g", use the dynamic weight unit; otherwise keep as-is
  const displayUnit = unit === 'g' ? weightUnit(unitSystem) : unit;

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.espresso }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholderTextColor={colors.muted}
        {...rest}
      />
      {displayUnit && <Text style={[styles.unit, { color: colors.muted }]}>{displayUnit}</Text>}
      {autoBadge && <Text style={[styles.autoBadge, { color: colors.olive }]}>auto</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
  },
  label: {
    width: 90,
    fontSize: FontSize.sm,
  },
  input: {
    flex: 1,
    maxWidth: 90,
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
  },
  autoBadge: {
    marginLeft: Spacing.sm,
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    fontWeight: '600',
  },
});
