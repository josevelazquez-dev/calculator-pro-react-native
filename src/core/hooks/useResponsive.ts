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
    const isDesktopWeb = isDesktop && isWeb;
    const isLandscape = width > height;

    const displayMinHeight = isDesktopWeb ? 160 : 120;
    const displayMaxHeight = isDesktopWeb ? 280 : 220;

    const displayFlex = isDesktopWeb ? 2.5 : 2;
    const keypadFlex = isDesktopWeb ? 5.5 : 6;
    const headerFlex = 1;
    const totalFlex = displayFlex + keypadFlex + headerFlex;

    const calculatorMaxWidth = isDesktop
      ? Math.min(Math.round(width * (isWeb ? 0.4 : 0.45)), isWeb ? 600 : 500)
      : isTablet
        ? Math.min(Math.round(width * 0.6), 500)
        : width;

    return {
      width,
      height,
      breakpoint,
      isMobile,
      isTablet,
      isDesktop,
      isWeb,
      isDesktopWeb,
      isLandscape,
      displayMinHeight,
      displayMaxHeight,
      displayFlex,
      keypadFlex,
      headerFlex,
      totalFlex,
      calculatorMaxWidth,
    };
  }, [width, height]);
}
