import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';

import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { Sidebar } from '@/src/components/Sidebar';
import { MaxWidth } from '@/src/theme';

const TAB_BAR_STYLE = {
  backgroundColor: '#FFFCF7',
  borderTopColor: '#E8DDD4',
} as const;

const TAB_ICON_SIZE = 26;

function TabIcon({ name, color }: { name: string; color: string }) {
  return (
    <SymbolView
      name={{ ios: name, android: name, web: name } as any}
      tintColor={color as any}
      size={TAB_ICON_SIZE}
    />
  );
}

export default function TabLayout() {
  const { isDesktop } = useBreakpoint();

  // Single <Tabs> navigator instance — never swaps, so navigation state is
  // preserved across responsive layout changes (critical for web hydration
  // where useWindowDimensions reports 0×0 on first render, then real dims).
  return (
    <View style={[styles.shell, isDesktop && styles.shellDesktop]}>
      {isDesktop && <Sidebar />}
      <View style={styles.content}>
        <View style={isDesktop ? styles.maxWidth : undefined}>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: '#C1784B',
              tabBarInactiveTintColor: '#998B82',
              tabBarStyle: {
                ...TAB_BAR_STYLE,
                // Hide the bottom tab bar on desktop (sidebar replaces it)
                display: isDesktop ? 'none' : 'flex',
              },
              headerShown: false,
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: 'Calculator',
                tabBarIcon: ({ color }) => (
                  <TabIcon name="chart.bar.fill" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="history"
              options={{
                title: 'History',
                tabBarIcon: ({ color }) => (
                  <TabIcon name="clock.arrow.circlepath" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Settings',
                tabBarIcon: ({ color }) => (
                  <TabIcon name="gearshape.fill" color={color} />
                ),
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
  maxWidth: {
    flex: 1,
    maxWidth: MaxWidth.content,
    width: '100%',
    alignSelf: 'center' as any,
  },
});
