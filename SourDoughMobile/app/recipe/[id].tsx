import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Share,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyle, sectionTitleStyle } from '../../src/theme';
import { formatTemp, formatWeight, formatWeightValue, weightUnit } from '../../src/lib/unitConversion';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { SavedRecipe, FlourBlendEntry } from '../../src/models/types';
import { getRecipe } from '../../src/store/recipeStore';
import { getTempZoneInfo, tempZoneColor } from '../../src/models/types';
import { getBlend } from '../../src/lib/blendUtils';
import { formatRecipeText } from '../../src/lib/recipeFormatter';
import { IngredientResults } from '../../src/components/IngredientResults';
import { FermentationTimeline } from '../../src/components/FermentationTimeline';
import { AdviceCards } from '../../src/components/FermentAdvice';
import { MethodTimeline } from '../../src/components/MethodTimeline';
import { getPreset } from '../../src/data/recipePresets';
import { copyToClipboard } from '../../src/lib/clipboard';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<SavedRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDesktop } = useBreakpoint();
  const { unitSystem, colors } = useAppTheme();

  useEffect(() => {
    if (!id) return;
    getRecipe(id).then((r) => {
      setRecipe(r);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        <ActivityIndicator size="large" color={colors.terracotta} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const zoneInfo = getTempZoneInfo(recipe.results.tempZone);
  const date = new Date(recipe.createdAt);
  const preset = recipe.breadType ? getPreset(recipe.breadType) : undefined;

  const handleShare = async () => {
    if (!recipe) return;
    const text = formatRecipeText(recipe, unitSystem);
    try {
      if (Platform.OS === 'web') {
        const shared = await (navigator.share
          ? navigator.share({ text }).then(() => true).catch(() => false)
          : Promise.resolve(false));
        if (!shared) {
          const copied = await copyToClipboard(text);
          if (copied) {
            Alert.alert('Copied!', 'Recipe copied to clipboard.');
          }
        }
      } else {
        await Share.share({ message: text });
      }
    } catch {
      // User cancelled — no-op
    }
  };

  // ── Inputs card ──────────────────────────────────────────────────────
  const blend = getBlend(recipe.inputs);
  const showBlendDetail = blend.length > 1;

  const inputsCard = (
    <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[sectionTitleStyle, { color: colors.muted }]}>📋  INPUTS</Text>

      {showBlendDetail ? (
        // Multi-flour breakdown
        <>
          <Text style={[styles.sectionLabel, { color: colors.espresso }]}>Flour mix ({formatWeight(recipe.inputs.flourWeight, unitSystem, 0)} total)</Text>
          {blend.map((entry: FlourBlendEntry) => {
            const grams = recipe.inputs.flourWeight * entry.percentage / 100;
            return (
              <View style={styles.row} key={entry.label}>
                <Text style={[styles.label, { color: colors.espresso }]}>
                  {entry.label.replace(/\s*\([^)]*\)$/, '')}
                </Text>
                <Text style={[styles.value, { color: colors.espresso }]}>
                  {formatWeightValue(grams, unitSystem, 0)}{weightUnit(unitSystem)} ({Math.round(entry.percentage)}%)
                </Text>
              </View>
            );
          })}
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.espresso }]}>Protein (wtd.)</Text>
            <Text style={[styles.value, { color: colors.espresso }]}>{recipe.inputs.flourProtein.toFixed(1)}%</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.espresso }]}>Flour</Text>
            <Text style={[styles.value, { color: colors.espresso }]}>{formatWeight(recipe.inputs.flourWeight, unitSystem, 0)} — {recipe.inputs.flourType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.espresso }]}>Protein</Text>
            <Text style={[styles.value, { color: colors.espresso }]}>{recipe.inputs.flourProtein.toFixed(1)}%</Text>
          </View>
        </>
      )}

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.espresso }]}>Hydration</Text>
        <Text style={[styles.value, { color: colors.espresso }]}>{recipe.inputs.hydration.toFixed(0)}%</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.espresso }]}>Starter</Text>
        <Text style={[styles.value, { color: colors.espresso }]}>{formatWeight(recipe.inputs.starterWeight, unitSystem, 0)} ({recipe.inputs.starterHydration.toFixed(0)}% hyd.)</Text>
      </View>
      {recipe.inputs.starterFlourType && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.espresso }]}>Starter flour</Text>
          <Text style={[styles.value, { color: colors.espresso }]}>{recipe.inputs.starterFlourType}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.espresso }]}>Salt</Text>
        <Text style={[styles.value, { color: colors.espresso }]}>{recipe.inputs.saltPct.toFixed(1)}%</Text>
      </View>
      {recipe.inputs.oilPct && recipe.inputs.oilPct > 0 ? (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.espresso }]}>Oil / Fat</Text>
          <Text style={[styles.value, { color: colors.espresso }]}>{recipe.inputs.oilPct.toFixed(1)}%</Text>
        </View>
      ) : null}
      {recipe.inputs.preferment ? (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.espresso }]}>Pre-ferment</Text>
          <Text style={[styles.value, { color: colors.espresso }]}>{recipe.inputs.preferment.type} — {recipe.inputs.preferment.flourPct.toFixed(0)}% of flour</Text>
        </View>
      ) : null}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.espresso }]}>Ambient</Text>
        <Text style={[styles.value, { color: colors.espresso }]}>{formatTemp(recipe.inputs.ambientTemp, unitSystem)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.espresso }]}>Flour temp</Text>
        <Text style={[styles.value, { color: colors.espresso }]}>{formatTemp(recipe.inputs.flourTemp, unitSystem)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.espresso }]}>Water temp</Text>
        <Text style={[styles.value, { color: colors.espresso }]}>{formatTemp(recipe.inputs.waterTemp, unitSystem)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.espresso }]}>Starter temp</Text>
        <Text style={[styles.value, { color: colors.espresso }]}>{formatTemp(recipe.inputs.starterTemp, unitSystem)}</Text>
      </View>
    </View>
  );

  // ── Results section ──────────────────────────────────────────────────
  const resultsSection = (
    <>
      {/* FDT */}
      <View style={[styles.fdtCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.fdtLabel, { color: colors.muted }]}>Final Dough Temperature</Text>
        <Text style={[styles.fdtValue, { color: tempZoneColor(recipe.results.tempZone, colors) }]}>
          {zoneInfo.icon}  {formatTemp(recipe.results.fdt, unitSystem)}
        </Text>
        <Text style={[styles.fdtZone, { color: tempZoneColor(recipe.results.tempZone, colors) }]}>
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
        prefermentType={recipe.inputs.preferment?.type}
        typicalUnitGrams={preset?.typicalUnitGrams}
        unitLabel={preset?.unitLabel}
      />

      {/* Warnings */}
      <AdviceCards warnings={recipe.results.warnings} />

      {/* Method Timeline */}
      {preset && (
        <MethodTimeline
          preset={preset}
          staticFermentHours={recipe.results.staticFermentHours}
          fermentAdvice={recipe.results.fermentAdvice}
        />
      )}
    </>
  );

  // ── Layout (responsive; single component tree — no remount on resize) ──
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]} edges={['top']}>
      <Stack.Screen options={{ title: 'Recipe Detail' }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && desktopStyles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.date, { color: colors.espresso }]}>
          {preset ? `${preset.emoji} ${preset.name} — ` : ''}
          {date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={[styles.location, { color: colors.muted }]}>{recipe.locationSummary}</Text>

        <View style={isDesktop && desktopStyles.twoCol}>
          <View style={isDesktop && desktopStyles.leftCol}>
            {inputsCard}
          </View>
          <View style={isDesktop && desktopStyles.rightCol}>
            {resultsSection}
            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: colors.olive }]}
              onPress={handleShare}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Text style={[styles.shareBtnText, { color: colors.white }]}>📤  Share Recipe</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  date: {
    fontSize: FontSize.md,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  location: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: FontSize.lg,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
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
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: FontSize.sm,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  fdtCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  fdtLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
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
  shareBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  shareBtnText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});

const desktopStyles = StyleSheet.create({
  scrollContentDesktop: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  twoCol: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  leftCol: {
    flex: 0.8,
  },
  rightCol: {
    flex: 1.2,
  },
});
