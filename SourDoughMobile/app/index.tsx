import { Link } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme, Spacing, FontSize, BorderRadius, MaxWidth } from '../src/theme';
import { useBreakpoint } from '../src/hooks/useBreakpoint';
import { Seo } from '../src/components/Seo';
import { InstallAppCard, useInstallPrompt } from '../src/components/InstallAppCard';
import { Icon, type IconName } from '../src/components/Icon';
import { WaitlistCard } from '../src/components/WaitlistCard';

interface LandingCard {
  icon: IconName;
  title: string;
  description: string;
  route: string;
}

const CARDS: LandingCard[] = [
  {
    icon: 'bread-slice-outline',
    title: 'Easy Sourdough Bread',
    description:
      'One bowl, a few hands-on steps, and a forecast for when to check the rise.',
    route: '/bread',
  },
  {
    icon: 'cup-outline',
    title: 'Yogurt at home',
    description:
      'Choose your culture and milk. Get a helpful window for when it will set.',
    route: '/yogurt',
  },
  {
    icon: 'barrel-outline',
    title: 'Vegetable ferments',
    description:
      'From sauerkraut to hot sauce, find the right salt and know when to check your jar.',
    route: '/ferments',
  },
];

export default function LandingScreen() {
  const { colors, isDark } = useAppTheme();
  const { isDesktop } = useBreakpoint();
  const { canInstall } = useInstallPrompt();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={['top', 'bottom']}>
      <Seo
        title="Just Dough It — Easy Sourdough, Yogurt & Ferments"
        description="Make low-effort sourdough with a forecast for when to check the rise. Yogurt and lacto-fermentation calculators too. Private, open source, no account required."
        path="/"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.masthead, { borderBottomColor: colors.border }]}>
          <Text style={[styles.brand, { color: colors.espresso }]}>JUST DOUGH IT <Text style={{ color: colors.terracotta }}>✳</Text></Text>
          <Text style={[styles.mastheadAside, { color: colors.muted }]}>GOOD THINGS TAKE TIME. YOU DON'T HAVE TO.</Text>
        </View>

        {/* Editorial hero */}
        <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
          <View style={styles.heroCopy}>
            <Text style={[styles.heroKicker, { color: colors.olive }]}>SOURDOUGH FOR REAL LIFE</Text>
            <Text style={[styles.heroTitle, isDesktop && styles.heroTitleDesktop, { color: colors.espresso }]}>Great bread.{"\n"}<Text style={{ color: colors.terracotta }}>Less doing.</Text></Text>
            <Text style={[styles.heroBody, { color: colors.muted }]}>Take starter from the fridge, mix one bowl, and let the dough rise. We’ll help you know when to check it.</Text>
            <Link href="/bread" style={[styles.cta, { backgroundColor: isDark ? colors.terracottaDark : colors.terracotta }]}>
              <Text style={[styles.ctaText, { color: colors.white }]}>Start your loaf   →</Text>
            </Link>
            <Text style={[styles.heroFootnote, { color: colors.muted }]}>One bowl  ·  No kneading schedule  ·  Your pace</Text>
          </View>
          <View style={[styles.heroImageFrame, isDesktop && styles.heroImageFrameDesktop, { backgroundColor: colors.badgeBg }]}>
            <Image source={require('../assets/images/bread-editorial.png')} style={styles.heroImage} resizeMode="cover" accessibilityLabel="Freshly baked sourdough loaf on a warm kitchen table" />
            <View style={[styles.imageCaption, { backgroundColor: isDark ? colors.card : '#FFF8EC' }]}>
              <Text style={[styles.captionText, { color: colors.espresso }]}>A loaf worth waiting for.</Text>
            </View>
          </View>
        </View>

        {/* Cards */}
        <View style={styles.sectionLead}>
          <Text style={[styles.sectionLabel, { color: colors.terracotta }]}>FROM OUR KITCHEN</Text>
          <Text style={[styles.sectionTitle, { color: colors.espresso }]}>What are we making today?</Text>
        </View>
        <View style={[styles.cards, isDesktop && styles.cardsDesktop]}>
          {CARDS.map((card) => (
            <Link
              key={card.route}
              href={card.route}
              style={[
                styles.card,
                isDesktop && styles.cardDesktop,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              accessibilityLabel={`${card.title}: ${card.description}`}
            >
              <View style={[styles.cardIconWrap, { backgroundColor: colors.badgeBg }]}>
                <Icon name={card.icon} size={24} color={colors.terracotta} />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.espresso }]}>
                  {card.title}
                </Text>
                <Text style={[styles.cardDesc, { color: colors.muted }]}>
                  {card.description}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.muted} />
            </Link>
          ))}
        </View>

        {/* Install PWA when the browser supports it */}
        <InstallAppCard />

        {/* Waitlist for native launch (hidden while an install prompt is available) */}
        {!canInstall && <WaitlistCard />}

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Link href="/history" style={styles.footerLink} accessibilityLabel="View saved recipe history">
            <Icon name="history" size={16} color={colors.muted} />
            <Text style={[styles.footerLinkText, { color: colors.muted }]}>Saved recipes</Text>
          </Link>
          <Link href="/about" style={styles.footerLink} accessibilityLabel="About this app">
            <Icon name="information-outline" size={16} color={colors.muted} />
            <Text style={[styles.footerLinkText, { color: colors.muted }]}>About</Text>
          </Link>
          <Link href="/settings" style={styles.footerLink} accessibilityLabel="Open settings">
            <Icon name="cog-outline" size={16} color={colors.muted} />
            <Text style={[styles.footerLinkText, { color: colors.muted }]}>Settings</Text>
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
    paddingBottom: Spacing.xxl + Spacing.xl,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center' as any,
  },
  contentDesktop: {
    maxWidth: MaxWidth.content,
    paddingHorizontal: Spacing.xxl,
  },
  masthead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.sm, paddingVertical: Spacing.lg, borderBottomWidth: 1 },
  brand: { fontSize: FontSize.sm, fontWeight: '900', letterSpacing: 1.4 },
  mastheadAside: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  hero: { gap: Spacing.xl, paddingTop: Spacing.xxl + Spacing.sm, paddingBottom: 58 },
  heroDesktop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xxl, paddingTop: 60, paddingBottom: 78 },
  heroCopy: { flex: 1 },
  heroKicker: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1.8 },
  heroTitle: { fontFamily: 'Georgia', fontSize: 47, lineHeight: 51, fontWeight: '700', letterSpacing: -1.5, marginTop: Spacing.lg },
  heroTitleDesktop: { fontSize: 61, lineHeight: 65 },
  heroBody: {
    fontSize: FontSize.md,
    lineHeight: 26,
    marginTop: Spacing.lg,
    maxWidth: 430,
  },
  cta: {
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  ctaText: {
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  heroFootnote: { fontSize: FontSize.xs, marginTop: Spacing.lg, lineHeight: 18 },
  heroImageFrame: { height: 290, overflow: 'hidden', borderRadius: 18, position: 'relative' },
  heroImageFrameDesktop: { flex: 1.1, height: 430 },
  heroImage: { width: '100%', height: '100%' },
  imageCaption: { position: 'absolute', bottom: 16, left: 16, borderRadius: 4, paddingHorizontal: 14, paddingVertical: 10 },
  captionText: { fontFamily: 'Georgia', fontSize: FontSize.sm, fontStyle: 'italic' },
  sectionLead: { marginBottom: Spacing.xl },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 2, marginBottom: Spacing.xs },
  sectionTitle: { fontFamily: 'Georgia', fontSize: 29, lineHeight: 35 },
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
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.lg,
    minHeight: 100,
  },
  cardDesktop: {
    flexDirection: 'column' as any,
    alignItems: 'flex-start',
    flexBasis: '29%',
    flexGrow: 1,
    minWidth: 240,
    minHeight: 190,
    padding: Spacing.xl,
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Georgia',
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: FontSize.sm,
    lineHeight: 21,
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.xxl + Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  footerLinkText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
