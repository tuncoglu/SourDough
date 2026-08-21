import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { FALLBACK_HARDNESS } from '../lib/hardnessUtils';

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
  const { colors } = useAppTheme();
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

  const postcodeInput = (
    <>
      <TextInput
        style={[styles.postcodeInput, { backgroundColor: colors.white, borderColor: colors.terracotta, color: colors.espresso }]}
        value={postcode}
        onChangeText={setPostcode}
        placeholder="e.g. SW1A 1AA"
        placeholderTextColor={colors.lightText}
        onSubmitEditing={handlePostcodeSubmit}
        returnKeyType="go"
        autoCapitalize="characters"
        autoCorrect={false}
        accessibilityLabel="Postcode"
      />
      <TouchableOpacity
        style={[styles.postcodeGoBtn, { backgroundColor: colors.terracotta }]}
        onPress={handlePostcodeSubmit}
        activeOpacity={0.7}
        accessibilityLabel="Submit postcode"
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      >
        <Text style={[styles.postcodeGoText, { color: colors.white }]}>Go</Text>
      </TouchableOpacity>
    </>
  );

  const postcodeLink = (
    <TouchableOpacity
      style={[styles.inner, styles.postcodeLink]}
      onPress={() => setShowPostcode(!showPostcode)}
      activeOpacity={0.7}
      accessibilityLabel="Enter postcode for precise location"
      accessibilityRole="button"
      hitSlop={{ top: 8, bottom: 8 }}
    >
      <Text style={[styles.postcodeLinkText, { color: colors.terracotta }]}>
        📍 Enter postcode for precise location
      </Text>
    </TouchableOpacity>
  );

  const fallbackBanner = (icon: string, lines: number) => (
    <TouchableOpacity
      style={[styles.inner, styles.fallbackBanner, { backgroundColor: colors.tipBg, borderLeftColor: colors.warm }]}
      onPress={onTapFallback}
      activeOpacity={0.7}
      accessibilityLabel="Location unavailable. Using default water hardness. Double tap to open Settings."
      accessibilityRole="button"
    >
      <Text style={styles.fallbackIcon}>{icon}</Text>
      <Text style={[styles.fallbackText, { color: colors.terracottaDark }]} numberOfLines={lines}>
        {lines === 2
          ? `Assuming ${FALLBACK_HARDNESS.classification} water (${FALLBACK_HARDNESS.mgL} mg/L). Tap to open Settings → Water Hardness Override.`
          : `Location unavailable. Assuming ${FALLBACK_HARDNESS.classification} water (${FALLBACK_HARDNESS.mgL} mg/L). Tap to open Settings → Water Hardness Override.`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {loading && (
        <View style={styles.inner}>
          <ActivityIndicator size="small" color={colors.terracotta} />
          <Text style={[styles.text, { color: colors.espresso }]}>Detecting location…</Text>
        </View>
      )}
      {!loading && error && !summary && (
        <View>
          <View style={styles.inner}>
            <Text style={[styles.error, { color: colors.error }]} numberOfLines={2}>{error}</Text>
            <TouchableOpacity
              onPress={onRefresh}
              style={styles.retryBtn}
              accessibilityLabel="Retry location detection"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.retryText, { color: colors.terracotta }]}>Retry</Text>
            </TouchableOpacity>
          </View>
          {showFallbackWarning && fallbackBanner('🧪', 2)}
          {onPostcodeSubmit && postcodeLink}
          {showPostcode && <View style={styles.postcodeRow}>{postcodeInput}</View>}
        </View>
      )}
      {!loading && summary && (
        <View>
          <TouchableOpacity
            onPress={onRefresh}
            style={styles.inner}
            accessibilityLabel="Location summary. Tap to refresh"
            accessibilityRole="button"
          >
            <Text style={[styles.text, { color: colors.espresso }]} numberOfLines={2}>{summary}</Text>
            <Text style={[styles.retryText, { color: colors.terracotta }]}>↺</Text>
          </TouchableOpacity>
          {error && (
            <View style={styles.inner}>
              <Text style={[styles.error, { color: colors.error }]} numberOfLines={2}>{error}</Text>
              <TouchableOpacity
                onPress={onRefresh}
                style={styles.retryBtn}
                accessibilityLabel="Retry location detection"
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[styles.retryText, { color: colors.terracotta }]}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
          {onPostcodeSubmit && (
            <View>
              {!showPostcode ? postcodeLink : <View style={styles.postcodeRow}>{postcodeInput}</View>}
            </View>
          )}
        </View>
      )}
      {!loading && !error && !summary && showFallbackWarning && (
        <View>
          {fallbackBanner('📍', 3)}
          {onPostcodeSubmit && postcodeLink}
          {showPostcode && <View style={styles.postcodeRow}>{postcodeInput}</View>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
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
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  error: {
    flex: 1,
    fontSize: FontSize.sm,
  },
  retryBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  retryText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  fallbackBanner: {
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm,
    borderLeftWidth: 3,
    marginTop: Spacing.xs,
  },
  fallbackIcon: {
    fontSize: 14,
  },
  fallbackText: {
    flex: 1,
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: '500',
  },
  postcodeLink: {
    marginTop: Spacing.xs + 2,
    paddingVertical: Spacing.xs,
  },
  postcodeLinkText: {
    fontSize: FontSize.sm,
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
    minHeight: 44,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs + 2,
    fontSize: FontSize.sm,
  },
  postcodeGoBtn: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
  },
  postcodeGoText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
