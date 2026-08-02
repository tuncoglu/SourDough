import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { BorderRadius, Spacing, useAppTheme } from '../theme';

interface Props {
  selected: boolean;
  onPress: () => void;
  /** Screen-reader label and fallback text. */
  label: string;
  /** Color scheme for the selected state. Default: 'terracotta'. */
  colorScheme?: 'terracotta' | 'olive';
  /** Inactive background override. Default: colors.card. Use colors.white for veg chips. */
  inactiveBg?: string;
  /** Accessibility role. Default: 'radio'. Use 'button' for filter chips. */
  role?: 'radio' | 'button';
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Selectable pill-shaped chip with built-in accessibility and theming.
 *
 * Handles the active/inactive color switching, touch target, role,
 * and selected-state announcement so call sites don't copy-paste them.
 */
export function Chip({
  selected,
  onPress,
  label,
  colorScheme = 'terracotta',
  inactiveBg: inactiveBgProp,
  role = 'radio',
  children,
  style,
}: Props) {
  const { colors } = useAppTheme();
  const isTerracotta = colorScheme === 'terracotta';

  const activeBg = isTerracotta ? colors.terracotta : colors.oliveLight;
  const activeBorder = isTerracotta ? colors.terracotta : colors.olive;
  const inactiveBg = inactiveBgProp ?? colors.card;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          backgroundColor: selected ? activeBg : inactiveBg,
          borderColor: selected ? activeBorder : colors.border,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole={role}
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    minHeight: 44,
  },
});
