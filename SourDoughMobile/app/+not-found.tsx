import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Seo } from '../src/components/Seo';
import { useAppTheme } from '../src/theme';

export default function NotFoundScreen() {
  const { colors } = useAppTheme();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <Seo
        title="Page not found — Just Dough It"
        description="This page doesn't exist. Head back to the Just Dough It calculators."
        path="/+not-found"
      />
      <View style={[styles.container, { backgroundColor: colors.cream }]}>
        <Text style={[styles.title, { color: colors.espresso }]}>🥖 This page doesn&apos;t exist.</Text>
        <Link href="/" style={[styles.link, { color: colors.terracotta }]}>
          Go to the calculators →
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: '700' },
  link: { fontSize: 16, fontWeight: '600' },
});
