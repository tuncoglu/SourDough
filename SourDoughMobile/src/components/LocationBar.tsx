import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

interface Props {
  summary: string | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  /** Show a warning banner when location is unavailable and defaults are assumed. */
  showFallbackWarning?: boolean;
  /** Called when the user taps the fallback warning banner. */
  onTapFallback?: () => void;
}

export function LocationBar({ summary, loading, error, onRefresh, showFallbackWarning, onTapFallback }: Props) {
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
      {!loading && !summary && showFallbackWarning && (
        <TouchableOpacity
          style={[styles.inner, styles.fallbackInner]}
          onPress={onTapFallback}
          activeOpacity={0.7}
        >
          <Text style={styles.fallbackIcon}>📍</Text>
          <Text style={styles.fallbackText} numberOfLines={3}>
            Location unavailable. Assuming moderately soft water (120 mg/L). Tap to set manually.
          </Text>
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
  fallbackInner: {
    backgroundColor: '#FFF8F0',
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warm,
  },
  fallbackIcon: {
    fontSize: 14,
  },
  fallbackText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: '#B85C2E',
    lineHeight: 18,
    fontWeight: '500',
  },
});
