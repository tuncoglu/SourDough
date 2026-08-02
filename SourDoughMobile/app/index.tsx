import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme, Spacing, FontSize, BorderRadius, cardStyleLg } from '../src/theme';

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
    route: '/(tabs)',
  },
  {
    emoji: '🥛',
    title: 'Yogurt',
    description:
      'Starter culture calculator with 10 heirloom cultures, milk types, incubation timeline, and yield estimates.',
    route: '/(tabs)/yogurt',
  },
  {
    emoji: '🫙',
    title: 'Lacto-Fermentation',
    description:
      'Salt calculator for sauerkraut, kimchi, pickles, hot sauce, and more — with day-by-day pH timeline.',
    route: '/(tabs)/ferments',
  },
];

export default function LandingScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.espresso }]}>🥖  Just Dough It</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            What are we making today?
          </Text>
        </View>

        {/* Cards */}
        <View style={styles.cards}>
          {CARDS.map((card) => (
            <TouchableOpacity
              key={card.route}
              style={[cardStyleLg, styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(card.route)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${card.title}: ${card.description}`}
            >
              <Text style={styles.cardEmoji}>{card.emoji}</Text>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.espresso }]}>
                  {card.title}
                </Text>
                <Text style={[styles.cardDesc, { color: colors.muted }]}>
                  {card.description}
                </Text>
              </View>
              <Text style={[styles.cardArrow, { color: colors.muted }]}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/history')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="View saved recipe history"
          >
            <Text style={[styles.footerLink, { color: colors.muted }]}>
              📋  Saved recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/settings')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Text style={[styles.footerLink, { color: colors.muted }]}>
              ⚙️  Settings
            </Text>
          </TouchableOpacity>
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
  header: {
    marginBottom: Spacing.xxl + Spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.title + 4,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.lg,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  cards: {
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardEmoji: {
    fontSize: 32,
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
