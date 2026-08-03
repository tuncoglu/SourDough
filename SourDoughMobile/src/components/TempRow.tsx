import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { tempUnit, celsiusToFahrenheit, fahrenheitToCelsius } from '../lib/unitConversion';

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
  const isImperial = unitSystem === 'imperial';

  // Local display string for imperial conversion
  const [display, setDisplay] = useState(() =>
    isImperial
      ? celsiusToFahrenheit(parseFloat(value) || 0).toFixed(1)
      : value
  );
  const prevUnitSystem = useRef(unitSystem);

  // Sync when unitSystem changes
  useEffect(() => {
    if (prevUnitSystem.current !== unitSystem) {
      prevUnitSystem.current = unitSystem;
      if (unitSystem === 'imperial') {
        setDisplay(celsiusToFahrenheit(parseFloat(value) || 0).toFixed(1));
      } else {
        setDisplay(value);
      }
    }
  }, [unitSystem, value]);

  const handleChange = (text: string) => {
    if (text !== '' && !/^-?\d*\.?\d*$/.test(text)) return;
    setDisplay(text);

    if (isImperial) {
      const f = parseFloat(text);
      if (!isNaN(f)) {
        onChangeText(String(Math.round(fahrenheitToCelsius(f) * 10) / 10));
      } else if (text === '' || text === '.' || text === '-') {
        onChangeText('0');
      }
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.espresso }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.white, borderColor: editing ? colors.terracotta : colors.border, color: colors.espresso }]}
        value={display}
        onChangeText={handleChange}
        keyboardType="decimal-pad"
        placeholderTextColor={colors.muted}
        accessibilityLabel={`${label} (${displayUnit})`}
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
