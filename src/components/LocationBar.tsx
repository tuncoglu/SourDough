import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

interface Props {
  summary: string | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function LocationBar({ summary, loading, error, onRefresh }: Props) {
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.inner}>
          <ActivityIndicator size="small" color={Colors.terracotta} />
          <Text style={styles.text}>Detecting location…</Text>
        </View>
      )}
      {!loading && error && (
        <View style={styles.inner}>
          <Text style={styles.error} numberOfLines={2}>{error}</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      {!loading && summary && (
        <TouchableOpacity onPress={onRefresh} style={styles.inner}>
          <Text style={styles.text} numberOfLines={2}>{summary}</Text>
          <Text style={styles.retryText}>↺</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    marginBottom: Spacing.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  text: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.espresso,
    lineHeight: 18,
  },
  error: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.error,
  },
  retryBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  retryText: {
    fontSize: FontSize.sm,
    color: Colors.terracotta,
    fontWeight: '600',
  },
});
