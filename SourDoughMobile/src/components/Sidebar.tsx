import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Spacing, FontSize, BorderRadius, MaxWidth, useAppTheme } from '../theme';

type AppRoute = '/' | '/yogurt' | '/ferments' | '/history' | '/settings';

interface NavItem {
  path: AppRoute;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Sourdough', icon: '🥖' },
  { path: '/yogurt', label: 'Yogurt', icon: '🥛' },
  { path: '/ferments', label: 'Lacto-ferment', icon: '🫙' },
  { path: '/history', label: 'History', icon: '📋' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useAppTheme();

  const isActive = (path: AppRoute) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <View style={[styles.sidebar, { backgroundColor: colors.card, borderRightColor: colors.border }]}>
      {/* Brand */}
      <View style={[styles.brand, { borderBottomColor: colors.border }]}>
        <Text style={styles.brandIcon}>🥖</Text>
        <Text style={[styles.brandName, { color: colors.espresso }]}>Just Dough It</Text>
        <Text style={[styles.brandSub, { color: colors.muted }]}>Perfect bread, less guesswork</Text>
      </View>

      {/* Nav links */}
      <ScrollView style={styles.navScroll} showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <TouchableOpacity
              key={item.path}
              style={[
                styles.navItem,
                active && { backgroundColor: colors.badgeBg },
              ]}
              onPress={() => router.push(item.path)}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, { color: active ? colors.terracotta : colors.muted }, active && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.lightText }]}>v3.0</Text>
        <Text style={[styles.footerText, { color: colors.lightText }]}>MIT License</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: MaxWidth.sidebar,
    borderRightWidth: 1,
    height: '100%',
    paddingTop: Spacing.xl,
  },
  brand: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  brandIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  brandName: {
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  brandSub: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    marginTop: 2,
  },
  navScroll: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    gap: Spacing.md,
  },
  navIcon: {
    fontSize: FontSize.lg,
    width: 28,
    textAlign: 'center',
  },
  navLabel: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  navLabelActive: {
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.xs,
  },
});
