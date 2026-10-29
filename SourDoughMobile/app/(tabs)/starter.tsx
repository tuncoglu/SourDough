import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Spacing, FontSize, useAppTheme } from '../../src/theme';
import { Seo } from '../../src/components/Seo';
import { StarterStatusCard } from '../../src/components/StarterStatusCard';
import { StarterFeedCard } from '../../src/components/StarterFeedCard';
import { StarterPaceCard } from '../../src/components/StarterPaceCard';
import { StarterLogCard } from '../../src/components/StarterLogCard';
import { useStarterStatus } from '../../src/hooks/useStarterStatus';
import { useKitchenTemp } from '../../src/hooks/useKitchenTemp';
import { peakForecast } from '@sourdough/calc/lib/starterLog';
import { getStarterFlour, setStarterFlour } from '../../src/store/starterStore';
import { getSettings } from '../../src/store/settingsCache';

export default function StarterScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const kitchen = useKitchenTemp();
  const starter = useStarterStatus(kitchen.tempC);

  // The feed form starts from the flour the starter is usually fed with and its hydration.
  const [feedDefaults, setFeedDefaults] = useState<{ flour: string; hydration: number } | null>(null);
  useEffect(() => {
    Promise.all([getStarterFlour(), getSettings()])
      .then(([flour, s]) => setFeedDefaults({ flour, hydration: s.defaultStarterHydration || 100 }))
      .catch(() => setFeedDefaults({ flour: 'Generic: Bread Flour', hydration: 100 }));
  }, []);

  const scrollRef = useRef<ScrollView>(null);
  const feedY = useRef(0);
  const goToFeed = () => scrollRef.current?.scrollTo({ y: Math.max(0, feedY.current - 12), animated: true });

  const peak = starter.feeding
    ? peakForecast(starter.feeding, { roomTempC: kitchen.tempC, peakEffectiveHours: starter.peakEffectiveHours })
    : null;
  const markedPeaks = starter.feedings.filter((f) => !!f.peakedAt).length;
  const latest = starter.feeding;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]} edges={['top']}>
      <Seo
        title="Sourdough Starter — Dough & Ferment Calculators"
        description="Keep track of when you fed your starter, how lively it is, and when it peaks, so the bread plan can use it. Free, private, open source."
        path="/starter"
      />
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.brand, { color: colors.terracotta }]}>JUST DOUGH IT  /  STARTER</Text>
          <Text style={[styles.heading, { color: colors.espresso }]} accessibilityRole="header">Your starter.</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            When you fed it, how lively it is, and when it peaks. The bread page uses this to plan.
          </Text>
        </View>

        <StarterStatusCard
          status={starter.status}
          feeding={latest}
          roomTempC={kitchen.tempC}
          tempSource={kitchen.source}
          peak={peak}
          onFeedNow={goToFeed}
          onMarkPeaked={() => latest && starter.markPeaked(latest.id)}
          onIntoFridge={() => latest && starter.intoFridge(latest.id)}
          onOutOfFridge={() => latest && starter.outOfFridge(latest.id)}
        />

        <View onLayout={(e) => { feedY.current = e.nativeEvent.layout.y; }}>
          {feedDefaults && (
            <StarterFeedCard
              defaultFlourLabel={feedDefaults.flour}
              hydration={feedDefaults.hydration}
              roomTempC={kitchen.tempC}
              peakEffectiveHours={starter.peakEffectiveHours}
              onFeed={async (draft) => {
                const ok = await starter.feed(draft);
                if (ok && draft.flours[0]) setStarterFlour(draft.flours[0].label).catch(() => {});
                return ok;
              }}
            />
          )}
        </View>

        <StarterLogCard
          feedings={starter.feedings}
          onMarkPeaked={starter.markPeaked}
          onIntoFridge={starter.intoFridge}
          onOutOfFridge={starter.outOfFridge}
        />

        <StarterPaceCard
          roomTempC={kitchen.tempC}
          peakEffectiveHours={starter.peakEffectiveHours}
          markedPeaks={markedPeaks}
          learnedFromPeaks={starter.learnedFromPeaks}
        />

        <Text style={[styles.foot, { color: colors.muted }]} onPress={() => router.push('/bread')} accessibilityRole="link">
          Back to the bread
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  page: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: 40 },
  header: { marginBottom: Spacing.xl },
  brand: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1.4, marginBottom: Spacing.sm },
  heading: { fontFamily: 'Georgia', fontSize: FontSize.title + 7, fontWeight: '700' },
  subtitle: { fontSize: FontSize.sm, lineHeight: 21, marginTop: Spacing.xs },
  foot: { fontSize: FontSize.sm, fontWeight: '700', textAlign: 'center', marginTop: Spacing.md },
});
