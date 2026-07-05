/**
 * Just Dough It — warm bakery color palette
 */

export const Colors = {
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
