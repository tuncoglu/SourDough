import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme, Spacing, FontSize, BorderRadius, cardStyle } from '../../src/theme';
import { Seo } from '../../src/components/Seo';
import { Icon, type IconName } from '../../src/components/Icon';

type MoreRoute = '/history' | '/settings' | '/about';

const ROWS: Array<{ path: MoreRoute; icon: IconName; title: string; sub: string }> = [
  { path: '/history', icon: 'history', title: 'History', sub: 'Saved loaves, yogurts and ferments' },
  { path: '/settings', icon: 'tune-variant', title: 'Settings', sub: 'Units, kitchen temperature, location, water' },
  { path: '/about', icon: 'information-outline', title: 'About and privacy', sub: 'How it works, sources, what is stored' },
];

const PASTA_URL = 'https://pasta.sourdoughcalculator.uk';

export default function MoreScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={['top']}>
      <Seo title="More — Dough & Ferment Calculators" description="History, settings and other calculators." path="/more" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.espresso }]}>More</Text>

        <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {ROWS.map((row, i) => (
            <TouchableOpacity
              key={row.path}
              style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
              onPress={() => router.push(row.path)}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityLabel={`${row.title}. ${row.sub}`}
            >
              <View style={[styles.iconWrap, { backgroundColor: colors.badgeBg }]}>
                <Icon name={row.icon} size={24} color={colors.terracotta} />
              </View>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.espresso }]}>{row.title}</Text>
                <Text style={[styles.rowSub, { color: colors.muted }]}>{row.sub}</Text>
              </View>
              <Icon name="chevron-right" size={22} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.espresso }]}>Also from Sourdough Calculators</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => Linking.openURL(PASTA_URL)}
            activeOpacity={0.6}
            accessibilityRole="link"
            accessibilityLabel="Pasta and noodles, opens in your browser"
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.badgeBg }]}>
              <Icon name="pasta" size={24} color={colors.terracotta} />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: colors.espresso }]}>Pasta &amp; noodles</Text>
              <Text style={[styles.rowSub, { color: colors.muted }]}>pasta.sourdoughcalculator.uk</Text>
            </View>
            <Icon name="open-in-new" size={20} color={colors.muted} />
          </TouchableOpacity>
          <Text style={[styles.hint, { color: colors.muted }]}>
            Opens in your browser. It is a separate calculator with its own settings, and it works offline once loaded.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center' as any,
  },
  title: { fontFamily: 'Georgia', fontSize: FontSize.title, fontWeight: '700', marginBottom: Spacing.lg },
  list: { borderWidth: 1, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, minHeight: 64, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  iconWrap: { width: 40, height: 40, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowTitle: { fontSize: FontSize.md, fontWeight: '700' },
  rowSub: { fontSize: FontSize.sm },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', marginBottom: Spacing.xs },
  hint: { fontSize: FontSize.sm, marginTop: Spacing.sm },
});
