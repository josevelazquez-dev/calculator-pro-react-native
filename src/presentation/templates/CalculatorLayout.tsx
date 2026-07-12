import { lazy, Suspense, memo, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { CalculatorDisplay } from '@/presentation/organisms';
import { Keypad } from '@/presentation/organisms';
import { useTheme, useCalculator } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';

const ScientificKeypad = lazy(() =>
  import('@/presentation/organisms/ScientificKeypad').then((m) => ({
    default: m.ScientificKeypad,
  })),
);

const CalculatorLayout = memo(function CalculatorLayout() {
  const { colors } = useTheme();
  const { state, dispatch } = useCalculator();
  const { isDesktop, isTablet, calculatorMaxWidth, headerFlex, keypadFlex } = useResponsive();
  const isWide = isDesktop || isTablet;
  const isScientific = state.mode === 'scientific';

  const toggleMode = useCallback(() => dispatch({ type: 'TOGGLE_MODE' }), [dispatch]);

  const innerStyle = useMemo(
    () => ({
      flex: 1,
      maxWidth: calculatorMaxWidth,
      alignSelf: 'center' as const,
      width: '100%' as const,
      backgroundColor: isWide ? colors.surface : undefined,
      borderColor: isWide ? colors.border : undefined,
      borderWidth: isWide ? 1 : 0,
      borderRadius: isWide ? 24 : 0,
      overflow: 'hidden' as const,
      ...(isWide
        ? Platform.select({
            web: { boxShadow: '0px 4px 24px rgba(0,0,0,0.12)' },
            default: {
              shadowOffset: { width: 0, height: 4 } as const,
              shadowOpacity: 0.12,
              shadowRadius: 24,
            },
          })
        : {}),
      ...(isWide ? { elevation: 8 } : {}),
    }),
    [isWide, colors.surface, colors.border, calculatorMaxWidth],
  );

  const headerStyle = useMemo(
    () => ({
      flex: headerFlex,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'flex-end' as const,
      paddingHorizontal: 16,
      minHeight: 32,
    }),
    [headerFlex],
  );

  const tabStyle = useMemo(
    () => ({
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 14,
    }),
    [colors.surfaceVariant],
  );

  const tabTextStyle = useMemo(
    () => ({
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    }),
    [colors.textSecondary],
  );

  return (
    <View style={innerStyle}>
      <View style={headerStyle}>
        <TouchableOpacity style={tabStyle} onPress={toggleMode} activeOpacity={0.7}>
          <Text style={tabTextStyle}>{isScientific ? 'Basic' : 'Scientific'}</Text>
        </TouchableOpacity>
      </View>

      <CalculatorDisplay />

      <View style={{ flex: keypadFlex }}>
        {isScientific ? (
          <Suspense fallback={null}>
            <ScientificKeypad />
          </Suspense>
        ) : (
          <Keypad />
        )}
      </View>
    </View>
  );
});

export { CalculatorLayout };
