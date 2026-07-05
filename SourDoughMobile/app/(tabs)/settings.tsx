import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius, MaxWidth } from '../../src/theme';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { UserSettings, DEFAULT_SETTINGS } from '../../src/models/types';
import { loadSettings, saveSettings } from '../../src/store/settingsStore';
import { NumberInput } from '../../src/components/NumberInput';
import { FlourPicker } from '../../src/components/FlourPicker';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [flourLabel, setFlourLabel] = useState(DEFAULT_SETTINGS.defaultFlourType);
  const [loading, setLoading] = useState(true);
  const { isDesktop } = useBreakpoint();

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setFlourLabel(s.defaultFlourType);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    const updated: UserSettings = {
      ...settings,
      defaultFlourType: flourLabel,
    };
    await saveSettings(updated);
    setSettings(updated);
    Alert.alert('Saved', 'Settings saved. New defaults will apply to new calculations.');
  };

  const handleReset = () => {
    Alert.alert('Reset Defaults', 'Restore all default values?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await saveSettings(DEFAULT_SETTINGS);
          setSettings(DEFAULT_SETTINGS);
          setFlourLabel(DEFAULT_SETTINGS.defaultFlourType);
        },
      },
    ]);
  };

  if (loading) return null;

  const content = (
    <>
      {/* Defaults */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>DEFAULT VALUES</Text>
        <Text style={styles.description}>
          These defaults are pre-filled when you open the calculator.
        </Text>

        <NumberInput
          label="Flour weight"
          value={String(settings.defaultFlourWeight)}
          onChangeText={(v) => {
            const n = parseFloat(v);
            if (!isNaN(n)) setSettings({ ...settings, defaultFlourWeight: n });
          }}
          unit="g"
        />

        <View style={styles.flourRow}>
          <Text style={styles.flourLabel}>Flour type</Text>
          <FlourPicker
            value={flourLabel}
            onSelect={(f) => setFlourLabel(f.label)}
          />
        </View>

        <NumberInput
          label="Hydration"
          value={String(settings.defaultHydration)}
          onChangeText={(v) => {
            const n = parseFloat(v);
            if (!isNaN(n)) setSettings({ ...settings, defaultHydration: n });
          }}
          unit="%"
        />

        <NumberInput
          label="Salt"
          value={String(settings.defaultSaltPct)}
          onChangeText={(v) => {
            const n = parseFloat(v);
            if (!isNaN(n)) setSettings({ ...settings, defaultSaltPct: n });
          }}
          unit="%"
        />

        <NumberInput
          label="Starter hyd."
          value={String(settings.defaultStarterHydration)}
          onChangeText={(v) => {
            const n = parseFloat(v);
            if (!isNaN(n)) setSettings({ ...settings, defaultStarterHydration: n });
          }}
          unit="%"
        />
      </View>

      {/* Actions */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
        <Text style={styles.saveBtnText}>Save Defaults</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.7}>
        <Text style={styles.resetBtnText}>Reset to Factory Defaults</Text>
      </TouchableOpacity>

      {/* About */}
      <View style={[styles.card, styles.aboutCard]}>
        <Text style={styles.cardTitle}>ABOUT</Text>
        <Text style={styles.aboutText}>
          🥖 Just Dough It v3.0
        </Text>
        <Text style={styles.aboutText}>
          Auto-detects your location, local temperature, and water hardness
          to calculate exact ingredient weights and predict fermentation time
          dynamically based on the weather forecast.
        </Text>
        <Text style={[styles.aboutText, styles.aboutCredit]}>
          Flour catalogue: Shipton Mill + generics.{'\n'}
          Weather: Open-Meteo (free, no API key).{'\n'}
          Geocoding: OpenStreetMap Nominatim.
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>⚙️  Settings</Text>
        {isDesktop ? (
          <View style={{ maxWidth: MaxWidth.form, alignSelf: 'center', width: '100%' }}>
            {content}
          </View>
        ) : (
          content
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  scrollContentDesktop: {
    alignItems: 'center',
  },
  header: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.espresso,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  flourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
  },
  flourLabel: {
    width: 90,
    fontSize: FontSize.sm,
    color: Colors.espresso,
  },
  saveBtn: {
    backgroundColor: Colors.terracotta,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  resetBtn: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resetBtnText: {
    color: Colors.error,
    fontSize: FontSize.sm,
  },
  aboutCard: {
    marginTop: Spacing.md,
  },
  aboutText: {
    fontSize: FontSize.sm,
    color: Colors.espresso,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  aboutCredit: {
    color: Colors.muted,
    fontSize: FontSize.xs,
  },
});
