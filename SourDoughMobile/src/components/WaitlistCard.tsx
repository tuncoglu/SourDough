import React, { useState } from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme, Spacing, FontSize, BorderRadius, cardStyle } from '../theme';
import { SITE_NAME } from '../lib/site';

/**
 * Waitlist sign-up for the upcoming iOS/Android launch.
 *
 * On web this renders a small email capture card. Native builds intentionally
 * skip it because the app is already installed there.
 *
 * Collection is deliberately zero-config:
 * - If EXPO_PUBLIC_WAITLIST_ENDPOINT is set at build time, the form POSTs
 *   `{ email }` as JSON to that endpoint (e.g. a Formspree endpoint or a
 *   Cloudflare Worker). CORS must be enabled on the endpoint.
 * - Otherwise it falls back to opening a pre-filled email to
 *   info@sourdoughcalculator.uk. This still works on a static site with no
 *   backend and no extra sign-ups.
 */
const WAITLIST_EMAIL = 'info@sourdoughcalculator.uk';
const WAITLIST_ENDPOINT = process.env.EXPO_PUBLIC_WAITLIST_ENDPOINT;

type Status = 'idle' | 'loading' | 'success' | 'error';

export function WaitlistCard() {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  if (Platform.OS !== 'web') {
    return null;
  }

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    if (WAITLIST_ENDPOINT) {
      setStatus('loading');
      setMessage('');
      try {
        const response = await fetch(WAITLIST_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed }),
        });
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }
        setEmail('');
        setStatus('success');
        setMessage("You're on the list! We'll email you when native apps launch.");
      } catch {
        // If the configured endpoint is unavailable, fall back to mailto so
        // the sign-up is never a dead end.
        const opened = await openMailtoFallback(trimmed);
        if (opened) {
          setStatus('success');
          setMessage('Your email app should open — just press send to confirm your spot.');
        }
      }
      return;
    }

    const opened = await openMailtoFallback(trimmed);
    if (opened) {
      setStatus('success');
      setMessage('Your email app should open — just press send to confirm your spot.');
    }
  };

  const openMailtoFallback = async (value: string): Promise<boolean> => {
    const subject = encodeURIComponent(`${SITE_NAME} — native app waitlist`);
    const body = encodeURIComponent(`Please add me to the ${SITE_NAME} waitlist.\n\nEmail: ${value}`);
    try {
      await Linking.openURL(`mailto:${WAITLIST_EMAIL}?subject=${subject}&body=${body}`);
      return true;
    } catch {
      setStatus('error');
      setMessage('Could not open your email app. Please email us directly at ' + WAITLIST_EMAIL);
      return false;
    }
  };

  return (
    <View
      style={[
        cardStyle,
        styles.card,
        { backgroundColor: colors.tipBg, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.espresso }]}>
        📱 iOS & Android launch
      </Text>
      <Text style={[styles.body, { color: colors.muted }]}>
        The web app is free forever. Join the waitlist and be first to know when native apps land.
      </Text>

      <View style={styles.form}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.white,
              borderColor: status === 'error' ? colors.error : colors.border,
              color: colors.espresso,
            },
          ]}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (status === 'error') {
              setStatus('idle');
              setMessage('');
            }
          }}
          placeholder="you@example.com"
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          accessibilityLabel="Email address for launch notifications"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={status !== 'loading'}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={status === 'loading'}
          accessibilityRole="button"
          accessibilityLabel="Join the iOS and Android waitlist"
          style={[
            styles.button,
            { backgroundColor: colors.terracotta, opacity: status === 'loading' ? 0.6 : 1 },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>
            {status === 'loading' ? 'Joining…' : 'Join waitlist'}
          </Text>
        </TouchableOpacity>
      </View>

      {message ? (
        <Text
          style={[
            styles.message,
            { color: status === 'error' ? colors.error : colors.olive },
          ]}
        >
          {message}
        </Text>
      ) : null}
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
  form: {
    gap: Spacing.sm,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
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
  message: {
    fontSize: FontSize.sm,
    lineHeight: 19,
    marginTop: Spacing.sm,
  },
});
