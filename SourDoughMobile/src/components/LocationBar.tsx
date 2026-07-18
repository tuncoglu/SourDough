import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
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
  /** Called when the user submits a postcode for precise location. */
  onPostcodeSubmit?: (postcode: string) => void;
}

export function LocationBar({ summary, loading, error, onRefresh, showFallbackWarning, onTapFallback, onPostcodeSubmit }: Props) {
  const [showPostcode, setShowPostcode] = useState(false);
  const [postcode, setPostcode] = useState('');

  const handlePostcodeSubmit = () => {
    const trimmed = postcode.trim();
    if (trimmed && onPostcodeSubmit) {
      onPostcodeSubmit(trimmed);
      setPostcode('');
      setShowPostcode(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.inner}>
          <ActivityIndicator size="small" color={Colors.terracotta} />
          <Text style={styles.text}>Detecting location…</Text>
        </View>
      )}
      {!loading && error && (
        <View>
          <View style={styles.inner}>
            <Text style={styles.error} numberOfLines={2}>{error}</Text>
            <TouchableOpacity onPress={onRefresh} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
          {showFallbackWarning && (
            <TouchableOpacity
              style={[styles.inner, styles.fallbackBanner]}
              onPress={onTapFallback}
              activeOpacity={0.7}
            >
              <Text style={styles.fallbackIcon}>🧪</Text>
              <Text style={styles.fallbackText} numberOfLines={2}>
                Assuming moderately soft water (120 mg/L). Tap to set manually.
              </Text>
            </TouchableOpacity>
          )}
          {onPostcodeSubmit && (
            <TouchableOpacity
              style={[styles.inner, styles.postcodeLink]}
              onPress={() => setShowPostcode(!showPostcode)}
              activeOpacity={0.7}
            >
              <Text style={styles.postcodeLinkText}>
                📍 Enter postcode for precise location
              </Text>
            </TouchableOpacity>
          )}
          {showPostcode && (
            <View style={styles.postcodeRow}>
              <TextInput
                style={styles.postcodeInput}
                value={postcode}
                onChangeText={setPostcode}
                placeholder="e.g. SW1A 1AA"
                placeholderTextColor={Colors.lightText}
                onSubmitEditing={handlePostcodeSubmit}
                returnKeyType="go"
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.postcodeGoBtn}
                onPress={handlePostcodeSubmit}
                activeOpacity={0.7}
              >
                <Text style={styles.postcodeGoText}>Go</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      {!loading && !error && summary && (
        <View>
          <TouchableOpacity onPress={onRefresh} style={styles.inner}>
            <Text style={styles.text} numberOfLines={2}>{summary}</Text>
            <Text style={styles.retryText}>↺</Text>
          </TouchableOpacity>
          {onPostcodeSubmit && (
            <View>
              {!showPostcode ? (
                <TouchableOpacity
                  style={[styles.inner, styles.postcodeLink]}
                  onPress={() => setShowPostcode(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.postcodeLinkText}>
                    📍 Enter postcode for precise location
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.postcodeRow}>
                  <TextInput
                    style={styles.postcodeInput}
                    value={postcode}
                    onChangeText={setPostcode}
                    placeholder="e.g. SW1A 1AA"
                    placeholderTextColor={Colors.lightText}
                    onSubmitEditing={handlePostcodeSubmit}
                    returnKeyType="go"
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.postcodeGoBtn}
                    onPress={handlePostcodeSubmit}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.postcodeGoText}>Go</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      )}
      {!loading && !error && !summary && showFallbackWarning && (
        <View>
          <TouchableOpacity
            style={[styles.inner, styles.fallbackBanner]}
            onPress={onTapFallback}
            activeOpacity={0.7}
          >
            <Text style={styles.fallbackIcon}>📍</Text>
            <Text style={styles.fallbackText} numberOfLines={3}>
              Location unavailable. Assuming moderately soft water (120 mg/L). Tap to set manually.
            </Text>
          </TouchableOpacity>
          {onPostcodeSubmit && (
            <TouchableOpacity
              style={[styles.inner, styles.postcodeLink]}
              onPress={() => setShowPostcode(!showPostcode)}
              activeOpacity={0.7}
            >
              <Text style={styles.postcodeLinkText}>
                📍 Enter postcode for precise location
              </Text>
            </TouchableOpacity>
          )}
          {showPostcode && (
            <View style={styles.postcodeRow}>
              <TextInput
                style={styles.postcodeInput}
                value={postcode}
                onChangeText={setPostcode}
                placeholder="e.g. SW1A 1AA"
                placeholderTextColor={Colors.lightText}
                onSubmitEditing={handlePostcodeSubmit}
                returnKeyType="go"
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.postcodeGoBtn}
                onPress={handlePostcodeSubmit}
                activeOpacity={0.7}
              >
                <Text style={styles.postcodeGoText}>Go</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  fallbackBanner: {
    backgroundColor: '#FFF8F0',
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warm,
    marginTop: Spacing.xs,
  },
  fallbackIcon: {
    fontSize: 14,
  },
  fallbackText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: '#8E4820',
    lineHeight: 18,
    fontWeight: '500',
  },
  postcodeLink: {
    marginTop: Spacing.xs + 2,
    paddingVertical: Spacing.xs,
  },
  postcodeLinkText: {
    fontSize: FontSize.xs,
    color: Colors.terracotta,
    fontWeight: '600',
  },
  postcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  postcodeInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.terracotta,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs + 2,
    fontSize: FontSize.sm,
    color: Colors.espresso,
  },
  postcodeGoBtn: {
    backgroundColor: Colors.terracotta,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  postcodeGoText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
