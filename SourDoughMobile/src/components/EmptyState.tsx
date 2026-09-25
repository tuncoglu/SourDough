import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontSize, Spacing, useAppTheme } from '../theme';

interface Props {
  icon: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: colors.espresso }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} accessibilityRole="button" style={[styles.action, { backgroundColor: colors.terracotta }]}>
          <Text style={[styles.actionText, { color: colors.white }]}>{actionLabel}  →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    maxWidth: 560,
    alignSelf: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  action: { marginTop: Spacing.xl, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: 10, minHeight: 46, justifyContent: 'center' },
  actionText: { fontSize: FontSize.sm, fontWeight: '800' },
});
