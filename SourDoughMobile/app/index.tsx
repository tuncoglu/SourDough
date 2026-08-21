import { Link } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme, Spacing, FontSize, BorderRadius, cardStyleLg, MaxWidth } from '../src/theme';
import { useBreakpoint } from '../src/hooks/useBreakpoint';
import { Seo } from '../src/components/Seo';
import { InstallAppCard, useInstallPrompt } from '../src/components/InstallAppCard';
import { WaitlistCard } from '../src/components/WaitlistCard';

interface LandingCard {
  emoji: string;
  title: string;
  description: string;
  route: string;
}

const CARDS: LandingCard[] = [
  {
    emoji: '🥖',
    title: 'Sourdough Bread',
    description:
      'Recipe builder with flour blends, hydration targets, and temperature-adjusted fermentation timelines.',
    route: '/bread',
  },
  {
    emoji: '🥛',
    title: 'Yogurt',
    description:
      'Starter culture calculator with 10 cultures, milk types, incubation timeline, and yield estimates.',
    route: '/yogurt',
  },
  {
    emoji: '🫙',
    title: 'Lacto-Fermentation',
    description:
      'Salt calculator for sauerkraut, kimchi, pickles, hot sauce, and more — with day-by-day pH timeline.',
    route: '/ferments',
  },
];

export default function LandingScreen() {
  const { colors } = useAppTheme();
  const { isDesktop } = useBreakpoint();
  const { canInstall } = useInstallPrompt();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={['top', 'bottom']}>
      <Seo
        title="Just Dough It — Sourdough, Yogurt & Ferment Calculators"
        description="Location-aware sourdough bread, yogurt and lacto-fermentation calculators. Recipes adjusted to your kitchen's temperature and water — private, open source, no tracking."
        path="/"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, isDesktop && styles.headerDesktop]}>
          <Text style={[styles.title, isDesktop && styles.titleDesktop, { color: colors.espresso }]}>
            🥖  Just Dough It
          </Text>
          <Text style={[styles.subtitle, isDesktop && styles.subtitleDesktop, { color: colors.muted }]}>
            Perfect bread, less guesswork
          </Text>
          <Text style={[styles.heroBody, isDesktop && styles.heroBodyDesktop, { color: colors.muted }]}>
            Location-aware sourdough, yogurt and lacto-fermentation calculators that adapt to your kitchen.
          </Text>
          <Link href="/bread" style={[styles.cta, { backgroundColor: colors.terracotta }]}>
            <Text style={[styles.ctaText, { color: colors.white }]}>Start calculating →</Text>
          </Link>
        </View>

        {/* Cards */}
        <View style={[styles.cards, isDesktop && styles.cardsDesktop]}>
          {CARDS.map((card) => (
            <Link
              key={card.route}
              href={card.route}
              style={[
                cardStyleLg,
                styles.card,
                isDesktop && styles.cardDesktop,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              accessibilityLabel={`${card.title}: ${card.description}`}
            >
              <View style={[styles.cardIconWrap, { backgroundColor: colors.badgeBg }]}>
                <Text style={styles.cardEmoji}>{card.emoji}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.espresso }]}>
                  {card.title}
                </Text>
                <Text style={[styles.cardDesc, { color: colors.muted }]}>
                  {card.description}
                </Text>
              </View>
              <Text style={[styles.cardArrow, isDesktop && styles.cardArrowDesktop, { color: colors.muted }]}>→</Text>
            </Link>
          ))}
        </View>

        {/* Install PWA when the browser supports it */}
        <InstallAppCard />

        {/* Waitlist for native launch (hidden while an install prompt is available) */}
        {!canInstall && <WaitlistCard />}

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Link href="/history" style={[styles.footerLink, { color: colors.muted }]} accessibilityLabel="View saved recipe history">
            📋  Saved recipes
          </Link>
          <Link href="/about" style={[styles.footerLink, { color: colors.muted }]} accessibilityLabel="About this app">
            ℹ️  About
          </Link>
          <Link href="/settings" style={[styles.footerLink, { color: colors.muted }]} accessibilityLabel="Open settings">
            ⚙️  Settings
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.md,
    paddingBottom: Spacing.xxl,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center' as any,
  },
  contentDesktop: {
    maxWidth: MaxWidth.content,
    paddingTop: Spacing.xxl + Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xxl + Spacing.md,
    alignItems: 'center',
  },
  headerDesktop: {
    marginBottom: Spacing.xxl + Spacing.lg,
  },
  title: {
    fontSize: FontSize.title + 4,
    fontWeight: '800',
    textAlign: 'center',
  },
  titleDesktop: {
    fontSize: FontSize.title + 10,
  },
  subtitle: {
    fontSize: FontSize.lg,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  subtitleDesktop: {
    fontSize: FontSize.xl,
    marginTop: Spacing.md,
  },
  heroBody: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: Spacing.md,
    maxWidth: 420,
  },
  heroBodyDesktop: {
    fontSize: FontSize.md,
    lineHeight: 24,
    marginTop: Spacing.lg,
  },
  cta: {
    marginTop: Spacing.lg + Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl + Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  ctaText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  cards: {
    gap: Spacing.md,
  },
  cardsDesktop: {
    flexDirection: 'row' as any,
    flexWrap: 'wrap' as any,
    gap: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardDesktop: {
    flexDirection: 'column' as any,
    alignItems: 'flex-start',
    flexBasis: '30%',
    flexGrow: 1,
    minWidth: 240,
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: FontSize.sm,
    lineHeight: 18,
    marginTop: 2,
  },
  cardArrow: {
    fontSize: FontSize.xl,
    fontWeight: '300',
  },
  cardArrowDesktop: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.xxl + Spacing.md,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerLink: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
