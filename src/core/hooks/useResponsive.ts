import { useWindowDimensions, Platform } from 'react-native';

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Responsive breakpoint & derived layout values.
 *
 * Mobile:  <768 px   (phone-first)
 * Tablet:  768–1023  (phablet / small desktop)
 * Desktop: 1024+     (full desktop, max-width centered)
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const breakpoint: Breakpoint =
    width >= BREAKPOINTS.desktop ? 'desktop' : width >= BREAKPOINTS.tablet ? 'tablet' : 'mobile';

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';
  const isWeb = Platform.OS === 'web';

  /** Max width for content containers on large screens */
  const contentMaxWidth = isDesktop ? 950 : isTablet ? 750 : width;

  /** Horizontal padding that scales with screen size */
  const screenPadding = isDesktop ? 48 : isTablet ? 32 : 16;

  /** Calculator card width cap – fits within viewport height */
  const maxWidthByHeight = Math.round((height - 370) * 1.4);
  const calculatorMaxWidth = isDesktop
    ? Math.min(650, maxWidthByHeight)
    : isTablet
      ? Math.min(500, maxWidthByHeight)
      : width;

  return {
    width,
    height,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isWeb,
    contentMaxWidth,
    screenPadding,
    calculatorMaxWidth,
  };
}
