import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyle, sectionTitleStyle } from '../theme';

interface Props {
  warnings: string[];
}

export function AdviceCards({ warnings }: Props) {
  const { colors } = useAppTheme();
  if (warnings.length === 0) return null;

  return (
    <View style={[cardStyle, { backgroundColor: colors.warningBg, borderColor: colors.hot }]}>
      <Text style={[sectionTitleStyle, { color: colors.muted }]}>⚠️  Warnings</Text>
      {warnings.map((w, i) => (
        <Text key={i} style={[styles.warningText, { color: colors.error }]}>{w}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  warningText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginBottom: 2,
  },
});
