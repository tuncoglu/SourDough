import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, Breakpoints } from '../theme';
import { RecipePreset, BreadType } from '../models/types';
import { RECIPE_PRESETS } from '../data/recipePresets';

interface Props {
  selected: BreadType;
  onSelect: (preset: RecipePreset) => void;
}

export function RecipeTypePicker({ selected, onSelect }: Props) {
  const [visible, setVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= Breakpoints.desktop;

  const selectedPreset = RECIPE_PRESETS.find((p) => p.id === selected);

  const handleSelect = (preset: RecipePreset) => {
    onSelect(preset);
    setVisible(false);
  };

  // ── Mobile: horizontal scrollable chip row ────────────────────────────
  if (!isDesktop) {
    return (
      <View style={mobileStyles.wrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={mobileStyles.chipRow}
        >
          {RECIPE_PRESETS.map((preset) => {
            const isSelected = selected === preset.id;
            return (
              <TouchableOpacity
                key={preset.id}
                style={[
                  mobileStyles.chip,
                  isSelected && mobileStyles.chipSelected,
                ]}
                onPress={() => handleSelect(preset)}
                activeOpacity={0.7}
              >
                <Text style={mobileStyles.chipEmoji}>{preset.emoji}</Text>
                <Text
                  style={[
                    mobileStyles.chipLabel,
                    isSelected && mobileStyles.chipLabelSelected,
                  ]}
                  numberOfLines={1}
                >
                  {preset.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // ── Desktop: trigger button + modal grid ──────────────────────────────
  return (
    <View style={desktopStyles.wrapper}>
      <TouchableOpacity
        style={desktopStyles.trigger}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={desktopStyles.triggerEmoji}>
          {selectedPreset?.emoji ?? '🥖'}
        </Text>
        <Text style={desktopStyles.triggerText} numberOfLines={1}>
          {selectedPreset?.name ?? 'Select recipe type…'}
        </Text>
        <Text style={desktopStyles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={desktopStyles.backdrop}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={desktopStyles.popover}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={desktopStyles.popoverTitle}>Choose a Recipe</Text>
            <ScrollView
              style={desktopStyles.gridScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={desktopStyles.grid}>
                {RECIPE_PRESETS.map((preset) => {
                  const isSelected = selected === preset.id;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      style={[
                        desktopStyles.card,
                        isSelected && desktopStyles.cardSelected,
                      ]}
                      onPress={() => handleSelect(preset)}
                      activeOpacity={0.7}
                    >
                      <Text style={desktopStyles.cardEmoji}>
                        {preset.emoji}
                      </Text>
                      <Text style={desktopStyles.cardName}>
                        {preset.name}
                      </Text>
                      <Text style={desktopStyles.cardDesc} numberOfLines={2}>
                        {preset.description}
                      </Text>
                      <View style={desktopStyles.cardMeta}>
                        <Text style={desktopStyles.cardHydration}>
                          {preset.id !== 'custom'
                            ? `${preset.dough.typicalHydration}% hyd.`
                            : 'Manual'}
                        </Text>
                        <Text
                          style={[
                            desktopStyles.difficultyBadge,
                            preset.difficulty === 'advanced' &&
                              desktopStyles.difficultyAdvanced,
                            preset.difficulty === 'medium' &&
                              desktopStyles.difficultyMedium,
                          ]}
                        >
                          {preset.difficulty}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ── Mobile Styles ─────────────────────────────────────────────────────────
const mobileStyles = StyleSheet.create({
  wrapper: {
    marginTop: Spacing.xs,
  },
  chipRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  chip: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#F0EBE5',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.terracotta,
    borderColor: Colors.terracotta,
  },
  chipEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  chipLabel: {
    fontSize: FontSize.xs,
    color: Colors.espresso,
    fontWeight: '500',
    maxWidth: 80,
  },
  chipLabelSelected: {
    color: Colors.white,
  },
});

// ── Desktop Styles ────────────────────────────────────────────────────────
const desktopStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
  },
  triggerEmoji: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  triggerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.espresso,
    fontWeight: '500',
  },
  chevron: {
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  backdrop: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  popover: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    width: '100%' as any,
    maxWidth: 640,
    maxHeight: '80%' as any,
    padding: Spacing.lg,
  },
  popoverTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.espresso,
    marginBottom: Spacing.md,
  },
  gridScroll: {
    maxHeight: 440,
  },
  grid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: Spacing.sm,
  },
  card: {
    width: '31%' as any,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexGrow: 0,
    flexShrink: 0,
  },
  cardSelected: {
    borderColor: Colors.terracotta,
    backgroundColor: '#FFF5EF',
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  cardName: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.espresso,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    lineHeight: 15,
    marginBottom: Spacing.sm,
  },
  cardMeta: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHydration: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    fontWeight: '500',
  },
  difficultyBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.olive,
    backgroundColor: '#EDF2E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    textTransform: 'uppercase' as any,
    letterSpacing: 0.5,
  },
  difficultyMedium: {
    color: '#B8860B',
    backgroundColor: '#FFF8E7',
  },
  difficultyAdvanced: {
    color: Colors.terracotta,
    backgroundColor: '#FFF0EB',
  },
});
