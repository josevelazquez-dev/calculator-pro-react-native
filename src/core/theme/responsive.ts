import type { Breakpoint } from '@/core/hooks/useResponsive';

/**
 * Returns spacing values that scale with the current breakpoint.
 * Larger screens get more generous spacing.
 */
export function getResponsiveSpacing(breakpoint: Breakpoint) {
  const multiplier = breakpoint === 'desktop' ? 1.5 : breakpoint === 'tablet' ? 1.25 : 1;

  return {
    padding: Math.round(16 * multiplier),
    gap: Math.round(8 * multiplier),
    radius: Math.round(20 * multiplier),
  };
}

/**
 * Returns font-size scale for the given breakpoint.
 */
export function getResponsiveFontScale(breakpoint: Breakpoint): number {
  if (breakpoint === 'desktop') return 1.15;
  if (breakpoint === 'tablet') return 1.08;
  return 1;
}
