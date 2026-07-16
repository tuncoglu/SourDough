/**
 * Just Dough It — warm bakery color palette
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode } from '../models/types';

const THEME_MODE_KEY = 'sourdough_theme_mode';

export const LightColors = {
  // Base
  cream: '#FFF5ED',
  white: '#FFFFFF',
  card: '#FFFCF7',

  // Text
  espresso: '#3E2723',
  muted: '#998B82',
  lightText: '#BFB5AD',

  // Accent
  terracotta: '#C1784B',
  terracottaDark: '#A86435',
  olive: '#6B8E4D',
  oliveLight: '#8CB369',

  // Semantic
  cold: '#4A90D9',
  cool: '#6BA5C4',
  ideal: '#6B8E4D',
  warm: '#E8A040',
  hot: '#C44536',

  // Misc
  border: '#E8DDD4',
  disabled: '#C9C0B8',
  disabledBg: '#F0EBE5',
  error: '#C44536',
  success: '#6B8E4D',
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
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: LightColors,
  themeMode: 'system',
  setThemeMode: () => {},
  isDark: false,
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Load persisted theme preference
  useEffect(() => {
    AsyncStorage.getItem(THEME_MODE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeModeState(stored);
      }
    });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_MODE_KEY, mode);
  }, []);

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  return React.createElement(
    ThemeContext.Provider,
    { value: { colors, themeMode, setThemeMode, isDark } },
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
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  title: 28,
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
