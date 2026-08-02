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
import { Spacing, FontSize, BorderRadius, Breakpoints, useAppTheme } from '../theme';
import { RecipePreset, BreadType } from '../models/types';
import { RECIPE_PRESETS } from '../data/recipePresets';

interface Props {
  selected: BreadType;
  onSelect: (preset: RecipePreset) => void;
}

export function RecipeTypePicker({ selected, onSelect }: Props) {
  const { colors } = useAppTheme();
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
                  { backgroundColor: colors.white, borderColor: colors.border },
                  isSelected && { backgroundColor: colors.terracotta, borderColor: colors.terracotta },
                ]}
                onPress={() => handleSelect(preset)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={preset.name}
              >
                <Text style={mobileStyles.chipEmoji}>{preset.emoji}</Text>
                <Text
                  style={[
                    mobileStyles.chipLabel,
                    { color: isSelected ? colors.white : colors.espresso },
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
        style={[desktopStyles.trigger, { backgroundColor: colors.white, borderColor: colors.border }]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Choose recipe type"
      >
        <Text style={desktopStyles.triggerEmoji}>
          {selectedPreset?.emoji ?? '🥖'}
        </Text>
        <Text
          style={[
            desktopStyles.triggerText,
            { color: selectedPreset ? colors.espresso : colors.muted },
          ]}
          numberOfLines={1}
        >
          {selectedPreset?.name ?? 'Select recipe type…'}
        </Text>
        <Text style={[desktopStyles.chevron, { color: colors.muted }]}>▼</Text>
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
            style={[desktopStyles.popover, { backgroundColor: colors.white, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[desktopStyles.popoverTitle, { color: colors.espresso }]}>Choose a Recipe</Text>
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
                        { backgroundColor: colors.card, borderColor: colors.border },
                        isSelected && { borderColor: colors.terracotta, backgroundColor: colors.tipBg },
                      ]}
                      onPress={() => handleSelect(preset)}
                      activeOpacity={0.7}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={preset.name}
                    >
                      <Text style={desktopStyles.cardEmoji}>
                        {preset.emoji}
                      </Text>
                      <Text style={[desktopStyles.cardName, { color: colors.espresso }]}>
                        {preset.name}
                      </Text>
                      <Text style={[desktopStyles.cardDesc, { color: colors.muted }]} numberOfLines={2}>
                        {preset.description}
                      </Text>
                      <View style={desktopStyles.cardMeta}>
                        <Text style={[desktopStyles.cardHydration, { color: colors.muted }]}>
                          {preset.id !== 'custom'
                            ? `${preset.dough.typicalHydration}% hyd.`
                            : 'Manual'}
                        </Text>
                        <Text
                          style={[
                            desktopStyles.difficultyBadge,
                            { color: colors.olive, backgroundColor: colors.successBg },
                            preset.difficulty === 'advanced' && {
                              color: colors.terracotta,
                              backgroundColor: colors.warningBg,
                            },
                            preset.difficulty === 'medium' && {
                              color: colors.warm,
                              backgroundColor: colors.tipBg,
                            },
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
    minHeight: 44,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  chipEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  chipLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    maxWidth: 80,
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
    minHeight: 44,
    borderWidth: 1,
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
    fontWeight: '500',
  },
  chevron: {
    fontSize: FontSize.xs,
  },
  backdrop: {
    // web-only: 'fixed' not in RN's position type ('absolute'|'relative')
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
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    width: '100%' as const,
    maxWidth: 640,
    maxHeight: '80%' as const,
    padding: Spacing.lg,
  },
  popoverTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
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
    width: '31%' as const,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexGrow: 0,
    flexShrink: 0,
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  cardName: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: FontSize.xs,
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
    fontWeight: '500',
  },
  difficultyBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
