import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize } from '../../src/theme';
import { SavedRecipe } from '../../src/models/types';
import { loadRecipes, deleteRecipe } from '../../src/store/recipeStore';
import { RecipeCard } from '../../src/components/RecipeCard';
import { EmptyState } from '../../src/components/EmptyState';
import { Text } from 'react-native';

export default function HistoryScreen() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchRecipes = useCallback(async () => {
    const data = await loadRecipes();
    setRecipes(data);
  }, []);

  // Reload each time the tab is focused
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
    Alert.alert(
      'Delete Recipe',
      'Remove this recipe from your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteRecipe(recipe.id);
            setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
          },
        },
      ],
    );
  };

  const handlePress = (recipe: SavedRecipe) => {
    router.push({
      pathname: '/recipe/[id]',
      params: { id: recipe.id },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>📖  Recipe History</Text>

      {recipes.length === 0 ? (
        <EmptyState
          icon="🍞"
          title="No recipes yet"
          subtitle="Your saved sourdough recipes will appear here. Calculate and save one to get started!"
        />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <RecipeCard recipe={item} onPress={() => handlePress(item)} />
              <Text
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
              >
                Delete
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.espresso,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
  listContent: {
    paddingBottom: 40,
  },
  cardWrapper: {
    alignItems: 'flex-end',
  },
  deleteBtn: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginRight: Spacing.xl,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
  },
});
