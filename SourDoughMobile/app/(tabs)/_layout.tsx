import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { Sidebar } from '@/src/components/Sidebar';
import { MaxWidth } from '@/src/theme';

const TAB_SCREEN_OPTIONS = {
  tabBarActiveTintColor: '#C1784B',
  tabBarInactiveTintColor: '#998B82',
  tabBarStyle: {
    backgroundColor: '#FFFCF7',
    borderTopColor: '#E8DDD4',
  },
  headerShown: false,
} as const;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDesktop } = useBreakpoint();

  // ── Desktop: sidebar + content (no bottom tab bar) ────────────────────
  if (isDesktop) {
    return (
      <View style={desktopStyles.shell}>
        <Sidebar />
        <View style={desktopStyles.content}>
          <View style={desktopStyles.maxWidth}>
            <Tabs
              tabBar={() => null}
              screenOptions={{ headerShown: false }}
            >
              <Tabs.Screen name="index" options={{ title: 'Calculator' }} />
              <Tabs.Screen name="history" options={{ title: 'History' }} />
              <Tabs.Screen name="starter" options={{ title: 'Starter' }} />
              <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
            </Tabs>
          </View>
        </View>
      </View>
    );
  }

  // ── Mobile / Tablet: bottom tabs ──────────────────────────────────────
  return (
    <Tabs screenOptions={TAB_SCREEN_OPTIONS}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'chart.bar.fill', android: 'calculate', web: 'calculate' } as any}
              tintColor={color as any}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' } as any}
              tintColor={color as any}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="starter"
        options={{
          title: 'Starter',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'flask.fill', android: 'science', web: 'science' } as any}
              tintColor={color as any}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' } as any}
              tintColor={color as any}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const desktopStyles = StyleSheet.create({
  shell: {
    flex: 1,
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
