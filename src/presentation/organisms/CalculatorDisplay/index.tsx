import { memo, useMemo } from 'react';
import { View, Platform } from 'react-native';
import { DisplayRow } from '@/presentation/molecules';
import { useCalculator, useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';

const CalculatorDisplay = memo(function CalculatorDisplay() {
  const { state } = useCalculator();
  const { colors } = useTheme();
  const { isDesktop, isTablet, displayMinHeight, displayMaxHeight, displayFlex } = useResponsive();
  const isWide = isDesktop || isTablet;

  const isError = state.error !== null || state.displayValue === 'Error';

  const containerStyle = useMemo(
    () => ({
      flex: displayFlex,
      minHeight: displayMinHeight,
      maxHeight: displayMaxHeight,
      justifyContent: 'flex-end' as const,
      paddingHorizontal: isWide ? 24 : 16,
      paddingTop: 8,
      paddingBottom: 12,
    }),
    [displayFlex, displayMinHeight, displayMaxHeight, isWide],
  );

  const cardStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 20,
      paddingVertical: 10,
      ...Platform.select({
        web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' },
        default: {
          shadowOffset: { width: 0, height: 2 } as const,
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
      }),
      elevation: 1,
    }),
    [colors.surface, colors.border],
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
