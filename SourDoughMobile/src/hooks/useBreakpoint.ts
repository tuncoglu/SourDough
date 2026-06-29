import { useWindowDimensions } from 'react-native';

/**
 * Responsive breakpoints for adapting layout between mobile, tablet, and desktop.
 *
 *   mobile  < 768px   — phone, current single-column behaviour
 *   tablet  768–1024  — intermediate (side-by-side where it fits)
 *   desktop ≥ 1024px  — sidebar, multi-column, dropdowns instead of modals
 */
const TABLET_MIN = 768;
const DESKTOP_MIN = 1024;

export interface BreakpointInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useBreakpoint(): BreakpointInfo {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isMobile: width < TABLET_MIN,
    isTablet: width >= TABLET_MIN && width < DESKTOP_MIN,
    isDesktop: width >= DESKTOP_MIN,
  };
}
