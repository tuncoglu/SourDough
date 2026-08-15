import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing, FontSize, BorderRadius, MaxWidth, useAppTheme } from '../../src/theme';
import { useFeedback } from '../../src/lib/feedback';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { SavedRecipe, BreadType } from '../../src/models/types';
import { loadRecipes, deleteRecipe, saveRecipe, generateRecipeId } from '../../src/store/recipeStore';
import { RecipeCard } from '../../src/components/RecipeCard';
import { EmptyState } from '../../src/components/EmptyState';
import { Chip } from '../../src/components/Chip';
import { RECIPE_PRESETS, getPreset } from '../../src/data/recipePresets';

const FILTER_CHIPS: { key: string; label: string; match: (r: SavedRecipe) => boolean }[] = [
  { key: 'all', label: 'All', match: () => true },
  { key: 'boules', label: '🥖 Boules', match: (r) => ['classic-boule', 'spelt-loaf', '100-rye'].includes(r.breadType ?? '') },
  { key: 'pizza', label: '🍕 Pizza', match: (r) => ['pizza', 'franco-manca-pizza'].includes(r.breadType ?? '') },
  { key: 'flatbreads', label: '🫓 Flatbreads', match: (r) => ['pita-naan', 'flatbread', 'focaccia', 'crackers-grissini'].includes(r.breadType ?? '') },
  { key: 'enriched', label: '🧈 Enriched', match: (r) => ['challah', 'brioche'].includes(r.breadType ?? '') },
  { key: 'advanced', label: '💎 Advanced', match: (r) => r.results.tempZone === 'warm' || r.results.tempZone === 'hot' || ['baguette', 'ciabatta', 'pan-de-cristal'].includes(r.breadType ?? '') },
];

export default function HistoryScreen() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();
  const { confirm, showToast } = useFeedback();
  const { isDesktop } = useBreakpoint();
  const { colors } = useAppTheme();

  const fetchRecipes = useCallback(async () => {
    const data = await loadRecipes();
    setRecipes(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [fetchRecipes]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecipes();
    setRefreshing(false);
  };

  const handleDelete = async (recipe: SavedRecipe) => {
    const ok = await confirm({
      title: 'Delete Recipe',
      message: 'Remove this recipe from your history?',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    await deleteRecipe(recipe.id);
    setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
    showToast('Recipe deleted.', 'success');
  };

  const handleDuplicate = async (recipe: SavedRecipe) => {
    const clone: SavedRecipe = {
      ...recipe,
      id: generateRecipeId(),
      createdAt: new Date().toISOString(),
    };
    await saveRecipe(clone);
    await fetchRecipes();
    showToast('Recipe copied to your history.', 'success');
  };

  const handleEdit = (recipe: SavedRecipe) => {
    // Navigate to calculator with the recipe data pre-filled
    router.push({
      pathname: '/bread',
      params: { editRecipeId: recipe.id },
    } as any);
  };

  const handlePress = (recipe: SavedRecipe) => {
    router.push({
      pathname: '/recipe/[id]',
      params: { id: recipe.id },
    } as any);
  };

  // Filter + search
  const filteredRecipes = useMemo(() => {
    const chip = FILTER_CHIPS.find((c) => c.key === activeFilter);
    let result = chip ? recipes.filter(chip.match) : recipes;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => {
        const preset = r.breadType ? getPreset(r.breadType) : null;
        return (
          r.inputs.flourType.toLowerCase().includes(q) ||
          (preset?.name.toLowerCase().includes(q)) ||
          r.locationSummary.toLowerCase().includes(q) ||
          r.inputs.flourBlend?.some((b) => b.label.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [recipes, search, activeFilter]);

  const numColumns = isDesktop ? 2 : 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]} edges={['top']}>
      <Text style={[styles.header, { color: colors.espresso }]}>📖  Recipe History</Text>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.espresso }]}
          placeholder="Search recipes…"
          placeholderTextColor={colors.lightText}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Search recipes"
        />
      </View>

      {/* Filter chips */}
      <View style={styles.chipRow}>
        {FILTER_CHIPS.map((chip) => (
          <Chip
            key={chip.key}
            selected={activeFilter === chip.key}
            onPress={() => setActiveFilter(chip.key)}
            label={chip.label}
            colorScheme="terracotta"
            role="button"
            style={styles.chip}
          >
            <Text style={[styles.chipText, { color: activeFilter === chip.key ? colors.white : colors.muted }]}>
              {chip.label}
            </Text>
          </Chip>
        ))}
      </View>

      {/* Results */}
      {filteredRecipes.length === 0 ? (
        <EmptyState
          icon={search.trim() ? '🔍' : '🥖'}
          title={search.trim() ? 'No matches' : 'No recipes yet'}
          subtitle={search.trim()
            ? 'Try a different search or filter.'
            : 'Your saved sourdough recipes will appear here. Calculate and save one to get started!'}
        />
      ) : (
        <FlatList
          key={numColumns}
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <View style={[styles.cardWrapper, numColumns > 1 && styles.cardWrapperGrid]}>
              <RecipeCard recipe={item} onPress={() => handlePress(item)} />
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Edit recipe"
                  accessibilityRole="button"
                >
                  <Text style={styles.actionBtn}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDuplicate(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Duplicate recipe"
                  accessibilityRole="button"
                >
                  <Text style={styles.actionBtn}>📋</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Delete recipe"
                  accessibilityRole="button"
                >
                  <Text style={[styles.actionBtn, { color: colors.error }]}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={[
            styles.listContent,
            numColumns > 1 && styles.listContentGrid,
          ]}
          columnWrapperStyle={numColumns > 1 ? { gap: Spacing.md } : undefined}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', maxWidth: MaxWidth.content, alignSelf: 'center' },
  header: {
    fontSize: FontSize.xl, fontWeight: '800',
    textAlign: 'center', marginVertical: Spacing.md,
  },
  searchRow: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  chipText: { fontSize: FontSize.xs, fontWeight: '600' },
  listContent: { paddingBottom: 40 },
  listContentGrid: { paddingHorizontal: Spacing.lg },
  cardWrapper: { alignItems: 'stretch', paddingHorizontal: Spacing.lg },
  cardWrapperGrid: { flex: 1 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  actionBtn: { fontSize: FontSize.md },
});
