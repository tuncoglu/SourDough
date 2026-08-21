import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { Sidebar } from '@/src/components/Sidebar';
import { MaxWidth, useAppTheme } from '@/src/theme';

function useTabBarStyle() {
  const { colors } = useAppTheme();
  return {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
  };
}

const TAB_ICON_SIZE = 24;

function TabEmoji({ emoji, focused }: { emoji: string; focused: boolean }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.tabIconWrap, focused && { backgroundColor: colors.badgeBg }]}>
      <Text style={{ fontSize: TAB_ICON_SIZE, opacity: focused ? 1 : 0.75 }}>{emoji}</Text>
    </View>
  );
}

// Icons shared between sidebar (Sidebar.tsx) and tab bar — keep in sync.
const TAB_ICONS = {
  calculator: '🥖',
  yogurt: '🥛',
  ferments: '🫙',
  history: '📋',
  settings: '⚙️',
  about: 'ℹ️',
} as const;

export default function TabLayout() {
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
              },
              headerShown: false,
            }}
          >
            <Tabs.Screen
              name="bread"
              options={{
                title: 'Sourdough',
                tabBarIcon: ({ focused }) => <TabEmoji emoji={TAB_ICONS.calculator} focused={focused} />,
              }}
            />
            <Tabs.Screen
              name="yogurt"
              options={{
                title: 'Yogurt',
                tabBarIcon: ({ focused }) => <TabEmoji emoji={TAB_ICONS.yogurt} focused={focused} />,
              }}
            />
            <Tabs.Screen
              name="ferments"
              options={{
                title: 'Lacto-ferment',
                tabBarIcon: ({ focused }) => <TabEmoji emoji={TAB_ICONS.ferments} focused={focused} />,
              }}
            />
            <Tabs.Screen
              name="history"
              options={{
                title: 'History',
                tabBarIcon: ({ focused }) => <TabEmoji emoji={TAB_ICONS.history} focused={focused} />,
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Settings',
                tabBarIcon: ({ focused }) => <TabEmoji emoji={TAB_ICONS.settings} focused={focused} />,
              }}
            />
            <Tabs.Screen
              name="about"
              options={{
                title: 'About',
                tabBarIcon: ({ focused }) => <TabEmoji emoji={TAB_ICONS.about} focused={focused} />,
              }}
            />
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
