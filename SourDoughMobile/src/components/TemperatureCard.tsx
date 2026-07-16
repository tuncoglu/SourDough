import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';
import { TempRow } from './TempRow';

interface Props {
  ambientTemp: string;
  flourTemp: string;
  waterTemp: string;
  starterTemp: string;
  isLocationAuto: boolean;
  setAmbientTemp: (v: string) => void;
  setFlourTemp: (v: string) => void;
  setWaterTemp: (v: string) => void;
  setStarterTemp: (v: string) => void;
}

export function TemperatureCard({
  ambientTemp, flourTemp, waterTemp, starterTemp,
  isLocationAuto,
  setAmbientTemp, setFlourTemp, setWaterTemp, setStarterTemp,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>TEMPERATURES</Text>
      <TempRow label="Ambient" value={ambientTemp} onChangeText={setAmbientTemp} isAuto={isLocationAuto} />
      <TempRow label="Flour" value={flourTemp} onChangeText={setFlourTemp} />
      <TempRow label="Water" value={waterTemp} onChangeText={setWaterTemp} isAuto={isLocationAuto} />
      <TempRow label="Starter" value={starterTemp} onChangeText={setStarterTemp} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.xs, fontWeight: '700', color: Colors.muted,
    letterSpacing: 0.5, marginBottom: Spacing.sm,
  },
});
