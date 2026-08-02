import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';

interface Props {
  warnings: string[];
}

export function AdviceCards({ warnings }: Props) {
  const { colors } = useAppTheme();
  if (warnings.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.warningBg, borderColor: colors.hot }]}>
      <Text style={[styles.title, { color: colors.muted }]}>⚠️  Warnings</Text>
      {warnings.map((w, i) => (
        <Text key={i} style={[styles.warningText, { color: colors.error }]}>{w}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  warningText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginBottom: 2,
  },
});
