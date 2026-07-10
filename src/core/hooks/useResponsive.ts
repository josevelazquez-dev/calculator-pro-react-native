import { useMemo } from 'react';
import { useWindowDimensions, Platform } from 'react-native';

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const breakpoint: Breakpoint =
      width >= BREAKPOINTS.desktop ? 'desktop' : width >= BREAKPOINTS.tablet ? 'tablet' : 'mobile';

    const isMobile = breakpoint === 'mobile';
    const isTablet = breakpoint === 'tablet';
    const isDesktop = breakpoint === 'desktop';
    const isWeb = Platform.OS === 'web';

    const contentMaxWidth = isDesktop ? 950 : isTablet ? 750 : width;
    const screenPadding = isDesktop ? 48 : isTablet ? 32 : 16;
    const maxWidthByHeight = Math.max(320, Math.round((height - 370) * 1.4));
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
  }, [width, height]);
}
