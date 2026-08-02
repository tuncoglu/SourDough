import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Spacing, FontSize, BorderRadius, Breakpoints, useAppTheme } from '../theme';
import { SHIPTON_MILL_FLOURS, FLOURS_BY_CATEGORY } from '../data/flours';
import { FlourEntry, FlourCategory } from '../models/types';

interface Props {
  value: string;
  onSelect: (flour: FlourEntry) => void;
}

const CATEGORIES = Object.keys(FLOURS_BY_CATEGORY) as FlourCategory[];
const DROPDOWN_MAX_HEIGHT = 360;

export function FlourPicker({ value, onSelect }: Props) {
  const { colors } = useAppTheme();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width >= Breakpoints.desktop;
  const triggerRef = useRef<View>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return SHIPTON_MILL_FLOURS;
    const q = search.toLowerCase();
    return SHIPTON_MILL_FLOURS.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.productNumber.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q),
    );
  }, [search]);

  const handleSelect = (flour: FlourEntry) => {
    onSelect(flour);
    setVisible(false);
    setSearch('');
  };

  const handleClose = () => {
    setVisible(false);
    setSearch('');
  };

  const searchInput = (
    <TextInput
      style={[styles.searchInput, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
      placeholder="Search by name, number, or category…"
      placeholderTextColor={colors.muted}
      value={search}
      onChangeText={setSearch}
      autoFocus
      clearButtonMode="while-editing"
      accessibilityLabel="Search flours"
    />
  );

  const renderItem = ({ item }: { item: FlourEntry }) => (
    <TouchableOpacity
      style={[
        styles.item,
        { borderBottomColor: colors.border },
        value === item.label && { backgroundColor: colors.card },
      ]}
      onPress={() => handleSelect(item)}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <View style={styles.itemContent}>
        <Text style={[styles.itemLabel, { color: colors.espresso }]} numberOfLines={1}>
          {item.label}
        </Text>
        <Text style={[styles.itemMeta, { color: colors.muted }]}>
          {item.category} · {item.protein.toFixed(1)}% protein
        </Text>
        {item.notes ? (
          <Text style={[styles.itemNotes, { color: colors.muted }]} numberOfLines={2}>
            {item.notes}
          </Text>
        ) : null}
      </View>
      {value === item.label && (
        <Text style={[styles.check, { color: colors.olive }]}>✓</Text>
      )}
    </TouchableOpacity>
  );

  const trigger = (
    <TouchableOpacity
      style={[styles.trigger, { backgroundColor: colors.white, borderColor: colors.border }]}
      onPress={() => setVisible(!visible)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Select flour"
    >
      <Text style={[styles.triggerText, { color: colors.espresso }]} numberOfLines={1}>
        {value || 'Select flour…'}
      </Text>
      <Text style={[styles.chevron, { color: colors.muted }, visible && styles.chevronOpen]}>▼</Text>
    </TouchableOpacity>
  );

  // ── Desktop: transparent modal styled as a compact popover ─────────
  if (isDesktop) {
    return (
      <View style={styles.desktopWrapper}>
        <View ref={triggerRef}>{trigger}</View>

        <Modal
          visible={visible}
          transparent
          animationType="fade"
          onRequestClose={handleClose}
        >
          <Pressable style={styles.backdrop} onPress={handleClose}>
            <View style={[styles.dropdown, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <TextInput
                style={[styles.searchInput, { backgroundColor: colors.white, borderColor: colors.border, color: colors.espresso }]}
                placeholder="Search by name, number, or category…"
                placeholderTextColor={colors.muted}
                value={search}
                onChangeText={setSearch}
                autoFocus
                accessibilityLabel="Search flours"
              />
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.label}
                renderItem={renderItem}
                style={{ maxHeight: DROPDOWN_MAX_HEIGHT }}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }

  // ── Mobile: full-screen modal ──────────────────────────────────────
  return (
    <>
      {trigger}

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: colors.cream }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.espresso }]}>Choose Flour</Text>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Done selecting flour"
              accessibilityRole="button"
            >
              <Text style={[styles.closeBtn, { color: colors.terracotta }]}>Done</Text>
            </TouchableOpacity>
          </View>

          {searchInput}

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.label}
            renderItem={renderItem}
            getItemLayout={(_, index) => ({
              length: 72,
              offset: 72 * index,
              index,
            })}
            initialNumToRender={20}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  desktopWrapper: {
    flex: 1,
    position: 'relative',
  },
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
  },
  triggerText: {
    flex: 1,
    fontSize: FontSize.sm,
  },
  chevron: {
    fontSize: FontSize.xs,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
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
  dropdown: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    width: '100%' as const,
    maxWidth: 480,
    maxHeight: '80%' as const,
  },
  modal: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  closeBtn: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  searchInput: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    marginTop: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  itemMeta: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  itemNotes: {
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    marginTop: 1,
  },
  check: {
    fontSize: FontSize.lg,
    marginLeft: Spacing.sm,
  },
});
