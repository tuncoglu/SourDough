import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getSettings } from '../store/settingsCache';
import { useLocation } from './useLocation';
import { chooseRoomTemp } from '../lib/roomTemp';

/**
 * The kitchen temperature for the starter: the one set in Settings if there
 * is one, otherwise today's outdoor reading from the location (a kitchen is
 * usually warmer, which the screen says), otherwise 22 °C.
 */
export function useKitchenTemp(): {
  tempC: number;
  source: 'settings' | 'forecast' | 'default';
} {
  const { locationData } = useLocation();
  const [setTemp, setSetTemp] = useState(0);

  useFocusEffect(useCallback(() => {
    getSettings().then((s) => setSetTemp(s.fermTempOverride ?? 0)).catch(() => {});
  }, []));

  const choice = chooseRoomTemp(setTemp, locationData?.ambientTemp);
  return {
    tempC: choice.tempC,
    source: choice.source === 'outdoor' ? 'forecast' : choice.source,
  };
}
