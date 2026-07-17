import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
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
  const { unitSystem } = useAppTheme();
  const displayUnit = unit ?? tempUnit(unitSystem);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, editing && styles.inputEditing]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholderTextColor={Colors.muted}
      />
      <Text style={styles.unit}>{displayUnit}</Text>
      {isAuto && !editing && (
        <Text style={styles.autoBadge}>auto</Text>
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
    color: Colors.espresso,
  },
  input: {
    flex: 1,
    maxWidth: 80,
    height: 34,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.espresso,
    textAlign: 'right',
  },
  inputEditing: {
    borderColor: Colors.terracotta,
  },
  unit: {
    marginLeft: Spacing.xs + 2,
    fontSize: FontSize.sm,
    color: Colors.muted,
    width: 20,
  },
  autoBadge: {
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    color: Colors.olive,
    fontWeight: '600',
  },
});
