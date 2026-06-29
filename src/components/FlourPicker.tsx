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
import { Colors, Spacing, FontSize, BorderRadius, Breakpoints } from '../theme';
import { SHIPTON_MILL_FLOURS, FLOURS_BY_CATEGORY } from '../data/flours';
import { FlourEntry, FlourCategory } from '../models/types';

interface Props {
  value: string;
  onSelect: (flour: FlourEntry) => void;
}

const CATEGORIES = Object.keys(FLOURS_BY_CATEGORY) as FlourCategory[];
const DROPDOWN_MAX_HEIGHT = 360;

export function FlourPicker({ value, onSelect }: Props) {
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

  const trigger = (
    <TouchableOpacity
      style={styles.trigger}
      onPress={() => setVisible(!visible)}
      activeOpacity={0.7}
    >
      <Text style={styles.triggerText} numberOfLines={1}>
        {value || 'Select flour…'}
      </Text>
      <Text style={[styles.chevron, visible && styles.chevronOpen]}>▼</Text>
    </TouchableOpacity>
  );

  // ── Desktop: popover dropdown ──────────────────────────────────────
  if (isDesktop) {
    return (
      <View style={styles.desktopWrapper}>
        <View ref={triggerRef}>{trigger}</View>

        {visible && (
          <>
            {/* Backdrop to capture outside clicks */}
            <Pressable style={styles.backdrop} onPress={handleClose} />
            <View style={styles.dropdown}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, number, or category…"
                placeholderTextColor={Colors.muted}
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      value === item.label && styles.itemSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.itemContent}>
                      <Text style={styles.itemLabel} numberOfLines={1}>
                        {item.label}
                      </Text>
                      <Text style={styles.itemMeta}>
                        {item.category} · {item.protein.toFixed(1)}% protein
                      </Text>
                      {item.notes ? (
                        <Text style={styles.itemNotes} numberOfLines={2}>
                          {item.notes}
                        </Text>
                      ) : null}
                    </View>
                    {value === item.label && (
                      <Text style={styles.check}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
                style={{ maxHeight: DROPDOWN_MAX_HEIGHT }}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </>
        )}
      </View>
    );
  }

  // ── Mobile: full-screen modal ──────────────────────────────────────
  return (
    <>
      {trigger}

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Flour</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeBtn}>Done</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, number, or category…"
            placeholderTextColor={Colors.muted}
            value={search}
            onChangeText={setSearch}
            autoFocus
            clearButtonMode="while-editing"
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  value === item.label && styles.itemSelected,
                ]}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemLabel} numberOfLines={1}>
                    {item.label}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {item.category} · {item.protein.toFixed(1)}% protein
                  </Text>
                  {item.notes ? (
                    <Text style={styles.itemNotes} numberOfLines={1}>
                      {item.notes}
                    </Text>
                  ) : null}
                </View>
                {value === item.label && (
                  <Text style={styles.check}>✓</Text>
                )}
              </TouchableOpacity>
            )}
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
    height: 36,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
  },
  triggerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.espresso,
  },
  chevron: {
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  backdrop: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  dropdown: {
    position: 'absolute' as any,
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    minWidth: 300,
  },
  modal: {
    flex: 1,
    backgroundColor: Colors.cream,
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
    color: Colors.espresso,
  },
  closeBtn: {
    fontSize: FontSize.lg,
    color: Colors.terracotta,
    fontWeight: '600',
  },
  searchInput: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    height: 40,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.espresso,
    marginTop: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  itemSelected: {
    backgroundColor: Colors.card,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.espresso,
  },
  itemMeta: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginTop: 2,
  },
  itemNotes: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    fontStyle: 'italic',
    marginTop: 1,
  },
  check: {
    fontSize: FontSize.lg,
    color: Colors.olive,
    marginLeft: Spacing.sm,
  },
});
