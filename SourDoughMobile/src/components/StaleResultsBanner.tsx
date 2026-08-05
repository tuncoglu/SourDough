/**
 * Banner shown above calculator results when inputs changed after the last
 * calculation. Tapping recalculates with the current inputs. Shared by the
 * three calculator screens (bread, yogurt, lacto-fermentation).
 */
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';

interface Props {
  onRecalculate: () => void;
  /** Optional margin override (screens differ in their container spacing). */
  style?: StyleProp<ViewStyle>;
}

export function StaleResultsBanner({ onRecalculate, style }: Props) {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      style={[styles.banner, { backgroundColor: colors.warningBg, borderColor: colors.hot }, style]}
      onPress={onRecalculate}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <Text style={[styles.bannerText, { color: colors.espresso }]}>
        ⚠️  Inputs changed since you calculated — tap to recalculate
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  bannerText: { fontSize: FontSize.sm, fontWeight: '600', lineHeight: 19 },
});
