import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AppThemeProvider, useAppTheme, DarkColors, LightColors } from '../src/theme';
import { ErrorFallback } from '../src/components/ErrorFallback';

// Custom error boundary wrapping the entire app
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return <ErrorFallback error={error} resetError={retry} />;
}

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppThemeProvider>
      <RootLayoutNav />
    </AppThemeProvider>
  );
}

function RootLayoutNav() {
  const { isDark } = useAppTheme();
  const bg = isDark ? DarkColors.cream : LightColors.cream;
  const cardBg = isDark ? DarkColors.card : LightColors.card;
  const tint = isDark ? DarkColors.terracotta : LightColors.terracotta;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="recipe/[id]"
        options={{
          title: 'Recipe',
          presentation: 'card',
          headerStyle: { backgroundColor: cardBg },
          headerTintColor: tint,
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
    </Stack>
  );
}
