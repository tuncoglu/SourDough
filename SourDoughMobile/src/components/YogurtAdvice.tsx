import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';

interface Props {
  advice: string[];
  tips?: string[];
  presetEmoji: string;
  presetName: string;
}

export function YogurtAdvice({ advice, tips, presetEmoji, presetName }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.espresso }]}>💡 Tips & Safety</Text>

      {/* Safety advice */}
      {advice.map((line, i) => (
        <Text
          key={`a-${i}`}
          style={[
            styles.line,
            {
              color: line.startsWith('🔥') ? colors.hot
                : line.startsWith('⚠️') ? colors.hot
                : line.startsWith('❄️') ? colors.cool
                : line.startsWith('✅') ? colors.olive
                : colors.muted,
            },
          ]}
        >
          {line}
        </Text>
      ))}

      {/* Preset-specific tips */}
      {tips && tips.length > 0 && (
        <View style={[styles.tipsSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.tipsTitle, { color: colors.terracotta }]}>
            {presetEmoji} {presetName} tips
          </Text>
          {tips.map((tip, i) => (
            <View key={`t-${i}`} style={styles.tipRow}>
              <Text style={[styles.bullet, { color: colors.terracotta }]}>•</Text>
              <Text style={[styles.tip, { color: colors.muted }]}>{tip}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  line: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  tipsSection: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  tipsTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  tipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  bullet: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    width: 12,
  },
  tip: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    flex: 1,
  },
});
