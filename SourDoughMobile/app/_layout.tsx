import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { MciIcon } from '../src/components/MciIcon';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AppThemeProvider, useAppTheme, DarkColors, LightColors } from '../src/theme';
import { ErrorFallback } from '../src/components/ErrorFallback';
import { FeedbackProvider } from '../src/lib/feedback';
import { LocationProvider } from '../src/hooks/useLocation';

// Custom error boundary wrapping the entire app
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return <ErrorFallback error={error} resetError={retry} />;
}

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...MciIcon.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Register the PWA service worker on web so Android Chrome can offer
  // installation again. The worker also gives us offline support for the
  // app shell once it has been visited.
  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' &&
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration is progressive enhancement; ignore
        // failures (e.g. unsupported browsers or private mode).
      });
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <AppThemeProvider>
      <FeedbackProvider>
        <LocationProvider>
          <RootLayoutNav />
        </LocationProvider>
      </FeedbackProvider>
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
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
