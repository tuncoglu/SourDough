/**
 * Card with a small section title and one line of text per entry.
 *
 * Shared by the warning cards (AdviceCards) and the water-hardness advice
 * card — both are the same "titled card + list of lines" shape with
 * different colors and titles.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, useAppTheme, cardStyle, sectionTitleStyle } from '../theme';

interface Props {
  title: string;
  lines: string[];
  tone?: 'warning' | 'info';
}

export function NoticeCard({ title, lines, tone = 'info' }: Props) {
  const { colors } = useAppTheme();
  if (lines.length === 0) return null;
  const warning = tone === 'warning';
  return (
    <View
      style={[
        cardStyle,
        {
          backgroundColor: warning ? colors.warningBg : colors.card,
          borderColor: warning ? colors.hot : colors.border,
        },
      ]}
    >
      <Text style={[sectionTitleStyle, { color: colors.muted }]}>{title}</Text>
      {lines.map((line, i) => (
        <Text key={i} style={[styles.line, { color: warning ? colors.error : colors.muted }]}>{line}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginBottom: 2,
  },
});
