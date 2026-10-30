import { Tabs, usePathname } from 'expo-router';
import { View, Text, Platform, StyleSheet } from 'react-native';

import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { Sidebar } from '@/src/components/Sidebar';
import { Icon, type IconName } from '@/src/components/Icon';
import { MaxWidth, useAppTheme } from '@/src/theme';

function useTabBarStyle() {
  const { colors } = useAppTheme();
  return {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
  };
}

const TAB_ICON_SIZE = 24;

function TabIcon({ name, focused, color }: { name: IconName; focused: boolean; color: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.tabIconWrap, focused && { backgroundColor: colors.badgeBg }]}>
      <Icon name={name} size={TAB_ICON_SIZE} color={color as string} />
    </View>
  );
}

// Icons shared between sidebar (Sidebar.tsx) and tab bar — keep in sync.
const TAB_ICONS = {
  calculator: 'bread-slice-outline',
  starter: 'flask-outline',
  yogurt: 'cup-outline',
  ferments: 'barrel-outline',
  more: 'dots-horizontal',
} as const;

// Reached from the More tab, not from the bar.
const HIDDEN_SCREENS = ['history', 'settings', 'about'] as const;

export default function TabLayout() {
  const pathname = usePathname();
  const moreActive = pathname === '/more' || HIDDEN_SCREENS.some((n) => pathname === `/${n}`);
  const { isDesktop } = useBreakpoint();
  const { colors } = useAppTheme();
  const tabBarStyle = useTabBarStyle();

  // Single <Tabs> navigator instance — never swaps, so navigation state is
  // preserved across responsive layout changes (critical for web hydration
  // where useWindowDimensions reports 0×0 on first render, then real dims).
  return (
    <View style={[styles.shell, isDesktop && styles.shellDesktop]}>
      {isDesktop && <Sidebar />}
      <View style={styles.content}>
        <View style={styles.maxWidth}>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: colors.terracotta,
              tabBarInactiveTintColor: colors.muted,
              tabBarStyle: {
                ...tabBarStyle,
                // Hide the bottom tab bar on desktop (sidebar replaces it)
                display: isDesktop ? 'none' : 'flex',
                // The icon circle plus its label is taller than the default bar; on a phone the system inset
                // absorbs the difference, on the web there is no inset and the label would be clipped.
                ...(Platform.OS === 'web' ? { height: 64 } : null),
              },
              headerShown: false,
            }}
          >
            <Tabs.Screen
              name="bread"
              options={{
                title: 'Bread',
                tabBarIcon: ({ focused, color }) => <TabIcon name={TAB_ICONS.calculator} focused={focused} color={color as string} />,
              }}
            />
            <Tabs.Screen
              name="starter"
              options={{
                title: 'Starter',
                tabBarIcon: ({ focused, color }) => <TabIcon name={TAB_ICONS.starter} focused={focused} color={color as string} />,
              }}
            />
            <Tabs.Screen
              name="yogurt"
              options={{
                title: 'Yogurt',
                tabBarIcon: ({ focused, color }) => <TabIcon name={TAB_ICONS.yogurt} focused={focused} color={color as string} />,
              }}
            />
            <Tabs.Screen
              name="ferments"
              options={{
                title: 'Ferment',
                tabBarIcon: ({ focused, color }) => <TabIcon name={TAB_ICONS.ferments} focused={focused} color={color as string} />,
              }}
            />
            <Tabs.Screen
              name="more"
              options={{
                title: 'More',
                // History, Settings and About open from More; the bar keeps More lit while they are showing.
                // (The tint options apply to the whole bar, so More lights itself up here rather than through them.)
                tabBarIcon: ({ focused, color }) => (
                  <TabIcon name={TAB_ICONS.more} focused={focused || moreActive} color={(moreActive ? colors.terracotta : color) as string} />
                ),
                tabBarLabel: ({ focused, color }) => (
                  <Text style={[styles.tabLabel, { color: moreActive ? colors.terracotta : color }, (focused || moreActive) && styles.tabLabelActive]}>
                    More
                  </Text>
                ),
              }}
            />
            {HIDDEN_SCREENS.map((name) => (
              <Tabs.Screen key={name} name={name} options={{ href: null }} />
            ))}
          </Tabs>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  shellDesktop: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    overflow: 'visible' as any,
  },
  tabLabel: { fontSize: 10, fontWeight: '500' },
  tabLabelActive: { fontWeight: '800' },
  tabIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxWidth: {
    flex: 1,
    maxWidth: MaxWidth.content,
    width: '100%',
    alignSelf: 'center' as any,
  },
});
