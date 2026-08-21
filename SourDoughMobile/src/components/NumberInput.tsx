import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { useBreakpoint } from '../hooks/useBreakpoint';
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
  const { isMobile } = useBreakpoint();
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
        // Keep one decimal place of gram precision — rounding to whole
        // grams snaps small amounts (0.15 oz = 4.25 g) back to the
        // previous value and rewrites the user's typing.
        onChangeText(String(Math.round(ozToGrams(oz) * 10) / 10));
      } else if (text === '' || text === '.') {
        onChangeText('0');
      }
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={[styles.row, isMobile && styles.rowMobile]}>
      <Text style={[styles.label, isMobile && styles.labelMobile, { color: colors.espresso }]}>{label}</Text>
      <View style={[styles.inputGroup, isMobile && styles.inputGroupMobile]}>
        <TextInput
          style={[styles.input, isMobile && styles.inputMobile, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
  },
  rowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: Spacing.xs,
  },
  label: {
    width: 90,
    fontSize: FontSize.sm,
  },
  labelMobile: {
    width: 'auto',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputGroupMobile: {
    flex: 1,
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
  inputMobile: {
    maxWidth: '100%',
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
