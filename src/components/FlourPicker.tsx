import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';
import { SHIPTON_MILL_FLOURS, FLOURS_BY_CATEGORY } from '../data/flours';
import { FlourEntry, FlourCategory } from '../models/types';

interface Props {
  value: string;
  onSelect: (flour: FlourEntry) => void;
}

const CATEGORIES = Object.keys(FLOURS_BY_CATEGORY) as FlourCategory[];

export function FlourPicker({ value, onSelect }: Props) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

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

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerText} numberOfLines={1}>
          {value || 'Select flour…'}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Flour</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
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
                  {item.notes && (
                    <Text style={styles.itemNotes} numberOfLines={1}>
                      {item.notes}
                    </Text>
                  )}
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
