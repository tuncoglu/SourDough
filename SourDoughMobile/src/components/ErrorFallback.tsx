import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

interface Props {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😔</Text>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>
        Just Dough It encountered an unexpected error. Your recipes and settings are safe.
      </Text>

      {__DEV__ && (
        <View style={styles.devBox}>
          <Text style={styles.devTitle}>Error details (dev mode)</Text>
          <Text style={styles.devMessage}>{error.message}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.btn} onPress={resetError} activeOpacity={0.8}>
        <Text style={styles.btnText}>Reload</Text>
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
      >
        <Text style={styles.reportText}>Report this issue on GitHub</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cream,
    padding: Spacing.xl,
  },
  emoji: { fontSize: 48, marginBottom: Spacing.md },
  title: {
    fontSize: FontSize.xl, fontWeight: '800', color: Colors.espresso,
    marginBottom: Spacing.sm, textAlign: 'center',
  },
  message: {
    fontSize: FontSize.sm, color: Colors.muted, textAlign: 'center',
    lineHeight: 20, marginBottom: Spacing.xl,
  },
  devBox: {
    backgroundColor: '#FFF5F0', borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.xl, width: '100%',
    borderLeftWidth: 3, borderLeftColor: Colors.warm,
  },
  devTitle: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.muted, marginBottom: Spacing.xs },
  devMessage: { fontSize: FontSize.xs, color: Colors.error, fontFamily: 'SpaceMono' },
  btn: {
    backgroundColor: Colors.terracotta, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl, marginBottom: Spacing.md,
  },
  btnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '700' },
  reportBtn: { paddingVertical: Spacing.sm },
  reportText: { fontSize: FontSize.xs, color: Colors.muted, textDecorationLine: 'underline' },
});
