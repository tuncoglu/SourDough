import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/theme';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { SavedRecipe, FlourBlendEntry } from '../../src/models/types';
import { getRecipe } from '../../src/store/recipeStore';
import { getTempZoneInfo } from '../../src/models/types';
import { getBlend } from '../../src/lib/flourSearch';
import { IngredientResults } from '../../src/components/IngredientResults';
import { FermentationTimeline } from '../../src/components/FermentationTimeline';
import { AdviceCards } from '../../src/components/FermentAdvice';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<SavedRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDesktop } = useBreakpoint();

  useEffect(() => {
    if (!id) return;
    getRecipe(id).then((r) => {
      setRecipe(r);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.terracotta} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const zoneInfo = getTempZoneInfo(recipe.results.tempZone);
  const date = new Date(recipe.createdAt);

  // ── Inputs card ──────────────────────────────────────────────────────
  const blend = getBlend(recipe.inputs);
  const showBlendDetail = blend.length > 1;

  const inputsCard = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📋  INPUTS</Text>

      {showBlendDetail ? (
        // Multi-flour breakdown
        <>
          <Text style={styles.sectionLabel}>Flour mix ({recipe.inputs.flourWeight.toFixed(0)}g total)</Text>
          {blend.map((entry: FlourBlendEntry) => {
            const grams = recipe.inputs.flourWeight * entry.percentage / 100;
            return (
              <View style={styles.row} key={entry.label}>
                <Text style={styles.label}>
                  {entry.label.replace(/\s*\([^)]*\)$/, '')}
                </Text>
                <Text style={styles.value}>
                  {grams.toFixed(0)}g ({Math.round(entry.percentage)}%)
                </Text>
              </View>
            );
          })}
          <View style={styles.row}>
            <Text style={styles.label}>Protein (wtd.)</Text>
            <Text style={styles.value}>{recipe.inputs.flourProtein.toFixed(1)}%</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Flour</Text>
            <Text style={styles.value}>{recipe.inputs.flourWeight.toFixed(0)}g — {recipe.inputs.flourType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Protein</Text>
            <Text style={styles.value}>{recipe.inputs.flourProtein.toFixed(1)}%</Text>
          </View>
        </>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Hydration</Text>
        <Text style={styles.value}>{recipe.inputs.hydration.toFixed(0)}%</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Starter</Text>
        <Text style={styles.value}>{recipe.inputs.starterWeight.toFixed(0)}g ({recipe.inputs.starterHydration.toFixed(0)}% hyd.)</Text>
      </View>
      {recipe.inputs.starterFlourType && (
        <View style={styles.row}>
          <Text style={styles.label}>Starter flour</Text>
          <Text style={styles.value}>{recipe.inputs.starterFlourType}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.label}>Salt</Text>
        <Text style={styles.value}>{recipe.inputs.saltPct.toFixed(1)}%</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Ambient</Text>
        <Text style={styles.value}>{recipe.inputs.ambientTemp.toFixed(1)}°C</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Flour temp</Text>
        <Text style={styles.value}>{recipe.inputs.flourTemp.toFixed(1)}°C</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Water temp</Text>
        <Text style={styles.value}>{recipe.inputs.waterTemp.toFixed(1)}°C</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Starter temp</Text>
        <Text style={styles.value}>{recipe.inputs.starterTemp.toFixed(1)}°C</Text>
      </View>
    </View>
  );

  // ── Results section ──────────────────────────────────────────────────
  const resultsSection = (
    <>
      {/* FDT */}
      <View style={styles.fdtCard}>
        <Text style={styles.fdtLabel}>Final Dough Temperature</Text>
        <Text style={[styles.fdtValue, { color: zoneInfo.color }]}>
          {zoneInfo.icon}  {recipe.results.fdt.toFixed(1)}°C
        </Text>
        <Text style={[styles.fdtZone, { color: zoneInfo.color }]}>
          {zoneInfo.label}
        </Text>
      </View>

      {/* Fermentation */}
      <FermentationTimeline
        dynamic={recipe.results.dynamicFerment}
        staticHours={recipe.results.staticFermentHours}
        staticNote={recipe.results.staticFermentNote}
        fdt={recipe.results.fdt}
      />

      {/* Ingredients */}
      <IngredientResults
        ingredients={recipe.results.ingredients}
        blend={blend}
        totalFlourWeight={recipe.inputs.flourWeight}
        starterFlourType={recipe.inputs.starterFlourType}
      />

      {/* Advice */}
      <AdviceCards
        fermentAdvice={recipe.results.fermentAdvice}
        waterHardnessAdvice={recipe.results.waterHardnessAdvice}
        warnings={recipe.results.warnings}
      />
    </>
  );

  // ── Desktop Layout ───────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen options={{ title: 'Recipe Detail' }} />
        <Text style={styles.date}>
          {date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={styles.location}>{recipe.locationSummary}</Text>

        <View style={desktopStyles.twoCol}>
          <ScrollView
            style={desktopStyles.leftCol}
            contentContainerStyle={desktopStyles.colContent}
            showsVerticalScrollIndicator={false}
          >
            {inputsCard}
          </ScrollView>
          <ScrollView
            style={desktopStyles.rightCol}
            contentContainerStyle={desktopStyles.colContent}
            showsVerticalScrollIndicator={false}
          >
            {resultsSection}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ── Mobile Layout ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ title: 'Recipe Detail' }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.date}>
          {date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={styles.location}>{recipe.locationSummary}</Text>

        {inputsCard}
        {resultsSection}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  date: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.espresso,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  location: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: FontSize.lg,
    color: Colors.error,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.espresso,
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  label: {
    width: 100,
    fontSize: FontSize.sm,
    color: Colors.espresso,
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.espresso,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  fdtCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  fdtLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  fdtValue: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  fdtZone: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
});

const desktopStyles = StyleSheet.create({
  twoCol: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  leftCol: {
    flex: 0.8,
  },
  rightCol: {
    flex: 1.2,
  },
  colContent: {
    paddingBottom: 40,
  },
});
