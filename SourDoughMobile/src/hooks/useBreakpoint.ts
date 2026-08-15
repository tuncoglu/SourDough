import { useWindowDimensions } from 'react-native';

/**
 * Responsive breakpoints for adapting layout between mobile, tablet, and desktop.
 *
 *   mobile  < 1024px  — phones AND tablets, single-column behaviour
 *   desktop ≥ 1024px  — sidebar, multi-column, dropdowns instead of modals
 *
 * (Tablets currently share the mobile layout; a dedicated 768–1024
 * side-by-side layout would be a future enhancement.)
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
    isDesktop: w >= DESKTOP_MIN,
  };
}
