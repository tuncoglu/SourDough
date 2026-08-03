import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme, Spacing, FontSize, BorderRadius, cardStyle, sectionTitleStyle } from '../../src/theme';
import { KeyboardScreen } from '../../src/components/KeyboardScreen';

function LinkText({ children, url }: { children: string; url: string }) {
  const { colors } = useAppTheme();
  return (
    <Text style={[aboutStyles.link, { color: colors.terracotta }]} onPress={() => Linking.openURL(url)}>
      {children}
    </Text>
  );
}

export default function AboutScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[aboutStyles.safe, { backgroundColor: colors.cream }]} edges={['top']}>
      <KeyboardScreen>
        <ScrollView
          style={aboutStyles.scroll}
          contentContainerStyle={aboutStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={aboutStyles.header}>
            <Text style={[aboutStyles.appName, { color: colors.espresso }]}>🥖  Just Dough It</Text>
            <Text style={[aboutStyles.version, { color: colors.muted }]}>v3.0</Text>
            <Text style={[aboutStyles.tagline, { color: colors.muted }]}>
              Science-driven fermentation, adjusted to your kitchen.
            </Text>
          </View>

          {/* What it does */}
          <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[sectionTitleStyle, { color: colors.muted }]}>WHAT IT DOES</Text>

            <View style={[aboutStyles.featureItem, { borderTopColor: colors.border }]}>
              <Text style={[aboutStyles.featureEmoji, { color: colors.espresso }]}>🥖</Text>
              <View style={aboutStyles.featureBody}>
                <Text style={[aboutStyles.featureTitle, { color: colors.espresso }]}>Sourdough Bread Calculator</Text>
                <Text style={[aboutStyles.featureDesc, { color: colors.muted }]}>
                  Recipe builder with flour blends, hydration targets, and temperature-adjusted fermentation timelines. Auto-detects your local weather and water hardness.
                </Text>
              </View>
            </View>

            <View style={[aboutStyles.featureItem, { borderTopColor: colors.border }]}>
              <Text style={[aboutStyles.featureEmoji, { color: colors.espresso }]}>🥛</Text>
              <View style={aboutStyles.featureBody}>
                <Text style={[aboutStyles.featureTitle, { color: colors.espresso }]}>Yogurt Calculator</Text>
                <Text style={[aboutStyles.featureDesc, { color: colors.muted }]}>
                  10 heirloom starter cultures (thermophilic & mesophilic), milk type picker, incubation timeline, yield & nutrition estimates. Use your last batch as starter.
                </Text>
              </View>
            </View>

            <View style={[aboutStyles.featureItem, { borderTopColor: colors.border }]}>
              <Text style={[aboutStyles.featureEmoji, { color: colors.espresso }]}>🫙</Text>
              <View style={aboutStyles.featureBody}>
                <Text style={[aboutStyles.featureTitle, { color: colors.espresso }]}>Lacto-Fermentation Calculator</Text>
                <Text style={[aboutStyles.featureDesc, { color: colors.muted }]}>
                  7 ferment styles, 25+ vegetables, salt calculator with volume conversion for 10 salt types, and day-by-day LAB succession timeline.
                </Text>
              </View>
            </View>
          </View>

          {/* How it works */}
          <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[sectionTitleStyle, { color: colors.muted }]}>HOW IT WORKS</Text>
            <Text style={[aboutStyles.body, { color: colors.espresso }]}>
              Just Dough It uses your location to detect ambient temperature (via Open-Meteo) and water hardness (by region), then adjusts fermentation timelines accordingly. All calculations use Q10 kinetics — the same model used in food science — to predict how temperature affects fermentation rate.
            </Text>
            <Text style={[aboutStyles.body, { color: colors.espresso, marginTop: Spacing.sm }]}>
              The calculation engine is pure TypeScript — no server, no API calls for the math. Everything happens on your device.
            </Text>
          </View>

          {/* Privacy */}
          <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[sectionTitleStyle, { color: colors.muted }]}>PRIVACY</Text>
            <Text style={[aboutStyles.body, { color: colors.espresso }]}>
              No accounts. No tracking. No cloud storage.
            </Text>
            <Text style={[aboutStyles.body, { color: colors.espresso, marginTop: Spacing.sm }]}>
              Your recipes and starter logs stay on your device. Location coordinates are sent only to fetch weather (Open-Meteo) and geocode your city (OpenStreetMap) — never stored or shared.
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://github.com/tuncoglu/SourDough/blob/main/SourDoughMobile/PRIVACY.md')}
              activeOpacity={0.7}
            >
              <Text style={[aboutStyles.link, { color: colors.terracotta, marginTop: Spacing.sm }]}>
                Full privacy policy →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Acknowledgements */}
          <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[sectionTitleStyle, { color: colors.muted }]}>ACKNOWLEDGEMENTS</Text>
            <Text style={[aboutStyles.body, { color: colors.espresso }]}>
              Weather data:{' '}
              <LinkText url="https://open-meteo.com/">Open-Meteo</LinkText>
              {' — free, open-source weather API.\n'}
              Geocoding:{' '}
              <LinkText url="https://nominatim.openstreetmap.org/">OpenStreetMap / Nominatim</LinkText>
              {'\n'}
              Flour data:{' '}
              <LinkText url="https://www.shipton-mill.com/">Shipton Mill</LinkText>
              {'\n'}
              Yogurt cultures:{' '}
              <LinkText url="https://freshlyfermented.co.uk/">Freshly Fermented</LinkText>
              {'\n'}
              Built with{' '}
              <LinkText url="https://expo.dev/">Expo</LinkText>
              {' + '}
              <LinkText url="https://reactnative.dev/">React Native</LinkText>
            </Text>
          </View>

          {/* Footer */}
          <View style={aboutStyles.footer}>
            <Text style={[aboutStyles.footerText, { color: colors.muted }]}>
              Open source under the MIT License.{'\n'}
              <LinkText url="https://github.com/tuncoglu/SourDough">github.com/tuncoglu/SourDough</LinkText>
            </Text>
          </View>
        </ScrollView>
      </KeyboardScreen>
    </SafeAreaView>
  );
}

const aboutStyles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center' as any,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.md,
  },
  appName: {
    fontSize: FontSize.title,
    fontWeight: '800',
  },
  version: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  tagline: {
    fontSize: FontSize.md,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  featureEmoji: {
    fontSize: 22,
    marginTop: 2,
  },
  featureBody: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  featureDesc: {
    fontSize: FontSize.xs,
    lineHeight: 17,
    marginTop: 2,
  },
  body: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  link: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  footerText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
});
