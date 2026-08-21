import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme, Spacing, FontSize, BorderRadius, cardStyle } from '../theme';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * Small install card shown only on web when the browser offers PWA
 * installation (Chrome/Android). This complements the native browser prompt
 * and gives users a persistent tap target to install the app.
 */
export function InstallAppCard() {
  const { colors } = useAppTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const onBeforeInstallPrompt = (event: Event) => {
      // Prevent the browser's default mini-infobar so we can show a
      // consistent in-page install card instead.
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  if (Platform.OS !== 'web' || installed || !deferredPrompt) {
    return null;
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <View
      style={[
        cardStyle,
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.espresso }]}>📲 Install Just Dough It</Text>
      <Text style={[styles.body, { color: colors.muted }]}>
        Add the app to your home screen for quick access and offline use.
      </Text>
      <TouchableOpacity
        onPress={handleInstall}
        accessibilityRole="button"
        accessibilityLabel="Install Just Dough It app"
        style={[styles.button, { backgroundColor: colors.terracotta }]}
      >
        <Text style={[styles.buttonText, { color: colors.white }]}>Install app</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.sm,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  body: {
    fontSize: FontSize.sm,
    lineHeight: 19,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  button: {
    minHeight: 44,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
