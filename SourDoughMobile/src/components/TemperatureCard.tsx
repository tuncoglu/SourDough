import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyle, sectionTitleStyle } from '../theme';
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
  const { colors } = useAppTheme();
  return (
    <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[sectionTitleStyle, { color: colors.muted }]}>TEMPERATURES</Text>
      <TempRow label="Ambient" value={ambientTemp} onChangeText={setAmbientTemp} isAuto={isLocationAuto} />
      <TempRow label="Flour" value={flourTemp} onChangeText={setFlourTemp} />
      <TempRow label="Water" value={waterTemp} onChangeText={setWaterTemp} isAuto={isLocationAuto} />
      <TempRow label="Starter" value={starterTemp} onChangeText={setStarterTemp} />
    </View>
  );
}

const styles = StyleSheet.create({});
