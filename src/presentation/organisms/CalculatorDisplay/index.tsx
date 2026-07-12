import { memo, useMemo } from 'react';
import { View, Platform } from 'react-native';
import { DisplayRow } from '@/presentation/molecules';
import { useCalculator, useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';

const CalculatorDisplay = memo(function CalculatorDisplay() {
  const { state } = useCalculator();
  const { colors } = useTheme();
  const { isDesktop, isTablet, isDesktopWeb, displayMinHeight, displayMaxHeight, displayFlex } =
    useResponsive();
  const isWide = isDesktop || isTablet;

  const isError = state.error !== null || state.displayValue === 'Error';

  const containerStyle = useMemo(
    () => ({
      flex: displayFlex,
      minHeight: displayMinHeight,
      maxHeight: displayMaxHeight,
      justifyContent: 'flex-end' as const,
      paddingHorizontal: isDesktopWeb ? 20 : isWide ? 24 : 16,
      paddingTop: isDesktopWeb ? 16 : 8,
      paddingBottom: isDesktopWeb ? 16 : 12,
    }),
    [displayFlex, displayMinHeight, displayMaxHeight, isWide, isDesktopWeb],
  );

  const cardStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: isDesktopWeb ? 24 : 20,
      paddingVertical: isDesktopWeb ? 14 : 10,
      ...Platform.select({
        web: {
          boxShadow: isDesktopWeb
            ? '0px 4px 16px rgba(0,0,0,0.08)'
            : '0px 2px 8px rgba(0,0,0,0.06)',
        },
        default: {
          shadowOffset: { width: 0, height: 2 } as const,
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
      }),
      elevation: 1,
    }),
    [colors.surface, colors.border, isDesktopWeb],
  );

  return (
    <View style={containerStyle}>
      <View style={cardStyle}>
        <DisplayRow expression={state.expression} value={state.displayValue} isError={isError} />
      </View>
    </View>
  );
});

export { CalculatorDisplay };
