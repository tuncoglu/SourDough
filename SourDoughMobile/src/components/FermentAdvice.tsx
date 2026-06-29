import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

interface Props {
  fermentAdvice: string[];
  waterHardnessAdvice: string[];
  warnings: string[];
}

export function AdviceCards({ fermentAdvice, waterHardnessAdvice, warnings }: Props) {
  return (
    <>
      {warnings.length > 0 && (
        <View style={[styles.card, styles.warningCard]}>
          <Text style={styles.title}>⚠️  Warnings</Text>
          {warnings.map((w, i) => (
            <Text key={i} style={styles.warningText}>{w}</Text>
          ))}
        </View>
      )}

      {fermentAdvice.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.title}>🛠️  Fermentation Advice</Text>
          {fermentAdvice.map((a, i) => (
            <Text key={i} style={styles.adviceText}>{a}</Text>
          ))}
        </View>
      )}

      {waterHardnessAdvice.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.title}>🧪  Water Hardness</Text>
          {waterHardnessAdvice.map((h, i) => (
            <Text key={i} style={styles.adviceText}>{h}</Text>
          ))}
        </View>
      )}
    </>
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
  adviceText: {
    fontSize: FontSize.sm,
    color: Colors.espresso,
    lineHeight: 20,
    marginBottom: 2,
  },
  warningText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    lineHeight: 20,
    marginBottom: 2,
  },
});
