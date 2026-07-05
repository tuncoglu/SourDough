import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, MaxWidth } from '../theme';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Calculator', icon: '🥖' },
  { path: '/history', label: 'History', icon: '📖' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <View style={styles.sidebar}>
      {/* Brand */}
      <TouchableOpacity
        style={styles.brand}
        onPress={() => router.push('/')}
        activeOpacity={0.7}
      >
        <Text style={styles.brandIcon}>🥖</Text>
        <Text style={styles.brandName}>Just Dough It</Text>
        <Text style={styles.brandSub}>Perfect bread, less guesswork</Text>
      </TouchableOpacity>

      {/* Nav links */}
      <ScrollView style={styles.navScroll} showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <TouchableOpacity
              key={item.path}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => router.push(item.path as any)}
              activeOpacity={0.6}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>v3.0</Text>
        <Text style={styles.footerText}>MIT License</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: MaxWidth.sidebar,
    backgroundColor: Colors.card,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    height: '100%',
    paddingTop: Spacing.xl,
  },
  brand: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    color: Colors.espresso,
  },
  brandSub: {
    fontSize: FontSize.xs,
    color: Colors.muted,
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    gap: Spacing.md,
  },
  navItemActive: {
    backgroundColor: '#F5EDE4',
  },
  navIcon: {
    fontSize: FontSize.lg,
    width: 28,
    textAlign: 'center',
  },
  navLabel: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.muted,
  },
  navLabelActive: {
    color: Colors.terracotta,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.lightText,
  },
});
