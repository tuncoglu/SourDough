import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
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
  const { unitSystem } = useAppTheme();
  // If unit is "g", use the dynamic weight unit; otherwise keep as-is
  const displayUnit = unit === 'g' ? weightUnit(unitSystem) : unit;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholderTextColor={Colors.muted}
        {...rest}
      />
      {displayUnit && <Text style={styles.unit}>{displayUnit}</Text>}
      {autoBadge && <Text style={styles.autoBadge}>auto</Text>}
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
    color: Colors.espresso,
  },
  input: {
    flex: 1,
    maxWidth: 90,
    height: 36,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.espresso,
    textAlign: 'right',
  },
  unit: {
    marginLeft: Spacing.xs + 2,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  autoBadge: {
    marginLeft: Spacing.sm,
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    color: Colors.olive,
    fontWeight: '600',
  },
});
