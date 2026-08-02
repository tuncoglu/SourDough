import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing, FontSize, BorderRadius, MaxWidth, useAppTheme, cardStyle, sectionTitleStyle } from '../../src/theme';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { UserSettings, DEFAULT_SETTINGS, ThemeMode, UnitSystem } from '../../src/models/types';
import { getSettings, updateSettings } from '../../src/store/settingsCache';
import { NumberInput } from '../../src/components/NumberInput';
import { FlourPicker } from '../../src/components/FlourPicker';

const THEME_OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: 'system', label: '🌓  System' },
  { key: 'light', label: '☀️  Light' },
  { key: 'dark', label: '🌙  Dark' },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [flourLabel, setFlourLabel] = useState(DEFAULT_SETTINGS.defaultFlourType);
  const [loading, setLoading] = useState(true);
  const { isDesktop } = useBreakpoint();
  const { colors, themeMode, setThemeMode, unitSystem, setUnitSystem } = useAppTheme();

  useEffect(() => {
    getSettings().then((s) => {
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
    await updateSettings(updated);
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
          await updateSettings(DEFAULT_SETTINGS);
          setSettings(DEFAULT_SETTINGS);
          setFlourLabel(DEFAULT_SETTINGS.defaultFlourType);
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]} edges={['top']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.terracotta} />
          <Text style={[styles.loadingText, { color: colors.muted }]}>Loading settings…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const content = (
    <>
      {/* Defaults */}
      <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[sectionTitleStyle, { color: colors.muted }]}>DEFAULT VALUES</Text>
        <Text style={[styles.description, { color: colors.muted }]}>
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
          <Text style={[styles.flourLabel, { color: colors.espresso }]}>Flour type</Text>
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

      {/* Water Hardness Override */}
      <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[sectionTitleStyle, { color: colors.muted }]}>WATER HARDNESS OVERRIDE (OPTIONAL)</Text>
        <Text style={[styles.description, { color: colors.muted }]}>
          Leave at 0 for auto-detect. Enter your local water hardness in mg/L CaCO₃{'\n'}
          (check your water company's website or use a test kit).
        </Text>

        <NumberInput
          label="Hardness"
          value={String(settings.waterHardnessOverride || 0)}
          onChangeText={(v) => {
            const n = parseFloat(v);
            if (!isNaN(n)) setSettings({ ...settings, waterHardnessOverride: n });
          }}
          unit="mg/L"
        />
      </View>

      {/* Theme */}
      <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[sectionTitleStyle, { color: colors.muted }]}>APPEARANCE</Text>

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>Theme</Text>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.themeChip,
                {
                  backgroundColor: themeMode === opt.key ? colors.terracotta : colors.white,
                  borderColor: themeMode === opt.key ? colors.terracotta : colors.border,
                },
              ]}
              onPress={() => setThemeMode(opt.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.themeChipText,
                  { color: themeMode === opt.key ? '#FFFFFF' : colors.espresso },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.muted, marginTop: Spacing.md }]}>Units</Text>
        <View style={styles.themeRow}>
          {(['metric', 'imperial'] as UnitSystem[]).map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.themeChip,
                {
                  backgroundColor: unitSystem === opt ? colors.terracotta : colors.white,
                  borderColor: unitSystem === opt ? colors.terracotta : colors.border,
                },
              ]}
              onPress={() => setUnitSystem(opt)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.themeChipText,
                  { color: unitSystem === opt ? '#FFFFFF' : colors.espresso },
                ]}
              >
                {opt === 'metric' ? '📏  Metric (g, °C)' : '📐  Imperial (oz, °F)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: colors.terracotta }]}
        onPress={handleSave}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <Text style={[styles.saveBtnText, { color: colors.white }]}>Save Defaults</Text>
      </TouchableOpacity>

      <View style={{ height: 1, backgroundColor: colors.border, marginTop: Spacing.lg, marginBottom: Spacing.md }} />

      <View style={{ backgroundColor: colors.card, borderRadius: BorderRadius.md, padding: Spacing.md }}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.7} accessibilityRole="button">
          <Text style={[styles.resetBtnText, { color: colors.error }]}>Reset to Factory Defaults</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={[cardStyle, styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[sectionTitleStyle, { color: colors.muted }]}>ABOUT</Text>
        <Text style={[styles.aboutText, { color: colors.espresso }]}>
          🥖 Just Dough It v3.0
        </Text>
        <Text style={[styles.aboutText, { color: colors.espresso }]}>
          Auto-detects your location, local temperature, and water hardness
          to calculate exact ingredient weights and predict fermentation time
          dynamically based on the weather forecast.
        </Text>
        <Text style={[styles.aboutText, styles.aboutCredit, { color: colors.muted }]}>
          Flour catalogue: Shipton Mill + generics.{'\n'}
          Weather: Open-Meteo (free, no API key).{'\n'}
          Geocoding: OpenStreetMap Nominatim.
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: colors.espresso }]}>⚙️  Settings</Text>
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
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  scrollContentDesktop: {
    alignItems: 'center',
  },
  header: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: FontSize.xs,
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
  },
  saveBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  saveBtnText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  resetBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resetBtnText: {
    fontSize: FontSize.sm,
  },
  aboutCard: {
    marginTop: Spacing.md,
  },
  aboutText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  aboutCredit: {
    fontSize: FontSize.xs,
  },
  themeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeChip: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeChipText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
});
