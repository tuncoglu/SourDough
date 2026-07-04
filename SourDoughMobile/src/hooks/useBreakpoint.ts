import { useWindowDimensions } from 'react-native';

/**
 * Responsive breakpoints for adapting layout between mobile, tablet, and desktop.
 *
 *   mobile  < 768px   — phone, current single-column behaviour
 *   tablet  768–1024  — intermediate (side-by-side where it fits)
 *   desktop ≥ 1024px  — sidebar, multi-column, dropdowns instead of modals
 *
 * On web, useWindowDimensions may return 0×0 during SSR/hydration. We clamp to
 * a reasonable phone viewport (375×812) so the first render matches the final
 * mobile layout, avoiding a flash/remount when real dimensions arrive.
 */
const TABLET_MIN = 768;
const DESKTOP_MIN = 1024;
const FALLBACK_WIDTH = 375;
const FALLBACK_HEIGHT = 812;

export interface BreakpointInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useBreakpoint(): BreakpointInfo {
  const { width, height } = useWindowDimensions();

  // Clamp 0×0 (SSR/hydration) to a phone viewport so layout decisions are
  // stable from the first render — no navigator remount on web.
  const w = width > 0 ? width : FALLBACK_WIDTH;
  const h = height > 0 ? height : FALLBACK_HEIGHT;

  return {
    width: w,
    height: h,
    isMobile: w < TABLET_MIN,
    isTablet: w >= TABLET_MIN && w < DESKTOP_MIN,
    isDesktop: w >= DESKTOP_MIN,
  };
}
