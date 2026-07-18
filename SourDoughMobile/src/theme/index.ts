/**
 * Just Dough It — warm bakery color palette
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode, UnitSystem } from '../models/types';

const THEME_MODE_KEY = 'sourdough_theme_mode';
const UNIT_SYSTEM_KEY = 'sourdough_unit_system';

export const LightColors = {
  // Base
  cream: '#FFF5ED',
  white: '#FFFFFF',
  card: '#FFFCF7',

  // Text — well above WCAG AA 4.5:1 for readability at small sizes
  espresso: '#2D1B17',
  muted: '#5A4A44',
  lightText: '#5F524A',

  // Accent — ≥5:1 on cream/card
  terracotta: '#954D28',
  terracottaDark: '#7D3E1A',
  olive: '#4A672F',
  oliveLight: '#5E7D3F',

  // Semantic — ≥3:1 for large/bold labels
  cold: '#356EAD',
  cool: '#4E829E',
  ideal: '#4A672F',
  warm: '#A8681A',
  hot: '#9E3528',

  // Misc
  border: '#CFC0B4',
  disabled: '#82776E',
  disabledBg: '#F0EBE5',
  error: '#9E3528',
  success: '#4A672F',
} as const;

export const DarkColors = {
  // Base
  cream: '#1A1412',
  white: '#2A2420',
  card: '#2F2824',

  // Text
  espresso: '#F0E8E0',
  muted: '#A09890',
  lightText: '#6B6360',

  // Accent — slightly lightened for dark bg contrast
  terracotta: '#D48B5F',
  terracottaDark: '#C1784B',
  olive: '#8CB369',
  oliveLight: '#A0C985',

  // Semantic — kept mostly the same, they're semantic
  cold: '#5BA0E9',
  cool: '#7BB5D4',
  ideal: '#8CB369',
  warm: '#F0B860',
  hot: '#E06050',

  // Misc
  border: '#3D3530',
  disabled: '#5A524D',
  disabledBg: '#352E29',
  error: '#E06050',
  success: '#8CB369',
} as const;

// Legacy Colors alias — defaults to light for backward compat with static styles
export const Colors = LightColors;

export interface AppColors {
  cream: string;
  white: string;
  card: string;
  espresso: string;
  muted: string;
  lightText: string;
  terracotta: string;
  terracottaDark: string;
  olive: string;
  oliveLight: string;
  cold: string;
  cool: string;
  ideal: string;
  warm: string;
  hot: string;
  border: string;
  disabled: string;
  disabledBg: string;
  error: string;
  success: string;
}

interface ThemeContextValue {
  colors: AppColors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  unitSystem: UnitSystem;
  setUnitSystem: (s: UnitSystem) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: LightColors,
  themeMode: 'system',
  setThemeMode: () => {},
  isDark: false,
  unitSystem: 'metric',
  setUnitSystem: () => {},
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>('metric');

  // Load persisted preferences
  useEffect(() => {
    AsyncStorage.getItem(THEME_MODE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeModeState(stored);
      }
    });
    AsyncStorage.getItem(UNIT_SYSTEM_KEY).then((stored) => {
      if (stored === 'metric' || stored === 'imperial') {
        setUnitSystemState(stored);
      }
    });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_MODE_KEY, mode);
  }, []);

  const setUnitSystem = useCallback((s: UnitSystem) => {
    setUnitSystemState(s);
    AsyncStorage.setItem(UNIT_SYSTEM_KEY, s);
  }, []);

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  return React.createElement(
    ThemeContext.Provider,
    { value: { colors, themeMode, setThemeMode, isDark, unitSystem, setUnitSystem } },
    children,
  );
}

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 21,
  xxl: 25,
  title: 29,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
} as const;

/** Maximum content width for desktop layouts */
export const MaxWidth = {
  content: 1100,
  form: 600,
  sidebar: 220,
} as const;

/** Responsive breakpoint values (px) */
export const Breakpoints = {
  tablet: 768,
  desktop: 1024,
} as const;
