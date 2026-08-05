import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { weightUnit, gramsToOz, ozToGrams } from '../lib/unitConversion';
import { useExternalValueSync } from '../hooks/useExternalValueSync';
import { isValidDecimalInput } from '../lib/inputValidation';

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
  const isWeight = unit === 'g';
  const displayUnit = isWeight ? weightUnit(unitSystem) : unit;
  const isImperialWeight = isWeight && unitSystem === 'imperial';

  // Local display string — kept in sync with parent value + unitSystem.
  // When unitSystem changes, recompute from the parent's metric value.
  const [display, setDisplay] = useState(() =>
    isImperialWeight
      ? gramsToOz(parseFloat(value) || 0).toFixed(1)
      : value
  );
  const prevUnitSystem = useRef(unitSystem);

  // Sync display when unitSystem changes
  useEffect(() => {
    if (prevUnitSystem.current !== unitSystem) {
      prevUnitSystem.current = unitSystem;
      // Unit system changed — recompute display from parent's metric value
      if (unitSystem === 'imperial' && isWeight) {
        setDisplay(gramsToOz(parseFloat(value) || 0).toFixed(1));
      } else if (unitSystem === 'metric' && isWeight) {
        setDisplay(value);
      }
    }
  }, [unitSystem, value, isWeight]);

  // Resync when the parent's value is changed programmatically (recipe
  // preset, GPS auto-fill, reset-to-defaults, edit-recipe prefill).
  const toMetric = useCallback((n: number) => ozToGrams(n), []);
  const toDisplay = useCallback((n: number) => gramsToOz(n).toFixed(1), []);
  useExternalValueSync(value, display, setDisplay, isImperialWeight, toMetric, toDisplay);

  const handleChange = (text: string) => {
    if (!isValidDecimalInput(text)) return;
    setDisplay(text);

    if (isImperialWeight) {
      const oz = parseFloat(text);
      if (!isNaN(oz)) {
        onChangeText(String(Math.round(ozToGrams(oz))));
      } else if (text === '' || text === '.') {
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
        style={[styles.input, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
        value={display}
        onChangeText={handleChange}
        keyboardType="decimal-pad"
        placeholderTextColor={colors.muted}
        accessibilityLabel={`${label}${displayUnit ? ` (${displayUnit})` : ''}`}
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
