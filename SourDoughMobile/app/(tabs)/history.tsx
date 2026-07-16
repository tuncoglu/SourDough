import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../../src/theme';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { SavedRecipe, BreadType } from '../../src/models/types';
import { loadRecipes, deleteRecipe, saveRecipe, generateRecipeId } from '../../src/store/recipeStore';
import { RecipeCard } from '../../src/components/RecipeCard';
import { EmptyState } from '../../src/components/EmptyState';
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

  const handleDelete = (recipe: SavedRecipe) => {
    Alert.alert('Delete Recipe', 'Remove this recipe from your history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRecipe(recipe.id);
          setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
        },
      },
    ]);
  };

  const handleDuplicate = async (recipe: SavedRecipe) => {
    const clone: SavedRecipe = {
      ...recipe,
      id: generateRecipeId(),
      createdAt: new Date().toISOString(),
    };
    await saveRecipe(clone);
    await fetchRecipes();
    Alert.alert('Duplicated', 'Recipe copied to your history.');
  };

  const handleEdit = (recipe: SavedRecipe) => {
    // Navigate to calculator with the recipe data pre-filled
    router.push({
      pathname: '/',
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
        />
      </View>

      {/* Filter chips */}
      <View style={styles.chipRow}>
        {FILTER_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip.key}
            style={[
              styles.chip,
              {
                backgroundColor: activeFilter === chip.key ? colors.terracotta : colors.card,
                borderColor: activeFilter === chip.key ? colors.terracotta : colors.border,
              },
            ]}
            onPress={() => setActiveFilter(chip.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, { color: activeFilter === chip.key ? '#FFFFFF' : colors.muted }]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
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
                <TouchableOpacity onPress={() => handleEdit(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.actionBtn}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDuplicate(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.actionBtn}>📋</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={[styles.actionBtn, { color: Colors.error }]}>🗑️</Text>
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
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    fontSize: FontSize.xl, fontWeight: '800', color: Colors.espresso,
    textAlign: 'center', marginVertical: Spacing.md,
  },
  searchRow: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    height: 40,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.espresso,
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
