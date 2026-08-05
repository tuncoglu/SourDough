/**
 * Inline validation error shown above the Calculate button when required
 * inputs are missing. Shared by the yogurt and lacto-fermentation screens.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';

interface Props {
  message: string;
}

export function ValidationMessage({ message }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.box, { backgroundColor: colors.warningBg, borderColor: colors.error }]}>
      <Text style={[styles.text, { color: colors.error }]}>
        ⚠️ {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    marginTop: Spacing.sm,
    marginBottom: -Spacing.sm,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    lineHeight: 19,
  },
});
