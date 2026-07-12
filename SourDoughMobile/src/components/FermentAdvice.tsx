import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

interface Props {
  warnings: string[];
}

export function AdviceCards({ warnings }: Props) {
  if (warnings.length === 0) return null;

  return (
    <View style={[styles.card, styles.warningCard]}>
      <Text style={styles.title}>⚠️  Warnings</Text>
      {warnings.map((w, i) => (
        <Text key={i} style={styles.warningText}>{w}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  warningCard: {
    borderColor: '#F0C0B0',
    backgroundColor: '#FFF5F2',
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  warningText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    lineHeight: 20,
    marginBottom: 2,
  },
});
