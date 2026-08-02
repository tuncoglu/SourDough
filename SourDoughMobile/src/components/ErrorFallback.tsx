import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';

interface Props {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.cream }]}>
      <Text style={styles.emoji}>😔</Text>
      <Text style={[styles.title, { color: colors.espresso }]}>Something went wrong</Text>
      <Text style={[styles.message, { color: colors.muted }]}>
        Just Dough It encountered an unexpected error. Your recipes and settings are safe.
      </Text>

      {__DEV__ && (
        <View style={[styles.devBox, { backgroundColor: colors.warningBg, borderLeftColor: colors.warm }]}>
          <Text style={[styles.devTitle, { color: colors.muted }]}>Error details (dev mode)</Text>
          <Text style={[styles.devMessage, { color: colors.error }]}>{error.message}</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.terracotta }]} onPress={resetError} activeOpacity={0.8}>
        <Text style={[styles.btnText, { color: colors.white }]}>Reload</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reportBtn}
        onPress={() => {
          // Open GitHub issues in browser
          if (typeof window !== 'undefined') {
            window.open('https://github.com/tuncoglu/SourDough/issues/new', '_blank');
          }
        }}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.reportText, { color: colors.muted }]}>Report this issue on GitHub</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emoji: { fontSize: 48, marginBottom: Spacing.md },
  title: {
    fontSize: FontSize.xl, fontWeight: '800',
    marginBottom: Spacing.sm, textAlign: 'center',
  },
  message: {
    fontSize: FontSize.sm, textAlign: 'center',
    lineHeight: 20, marginBottom: Spacing.xl,
  },
  devBox: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.xl, width: '100%',
    borderLeftWidth: 3,
  },
  devTitle: { fontSize: FontSize.xs, fontWeight: '700', marginBottom: Spacing.xs },
  devMessage: { fontSize: FontSize.xs, fontFamily: 'SpaceMono' },
  btn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl, marginBottom: Spacing.md,
  },
  btnText: { fontSize: FontSize.md, fontWeight: '700' },
  reportBtn: { minHeight: 44, justifyContent: 'center', paddingVertical: Spacing.sm },
  reportText: { fontSize: FontSize.xs, textDecorationLine: 'underline' },
});
