import { lazy, Suspense, memo, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { CalculatorDisplay } from '@/presentation/organisms';
import { Keypad } from '@/presentation/organisms';
import { useTheme, useCalculator, useLanguage } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';

const ScientificKeypad = lazy(() =>
  import('@/presentation/organisms/ScientificKeypad').then((m) => ({
    default: m.ScientificKeypad,
  })),
);

const CalculatorLayout = memo(function CalculatorLayout() {
  const { colors } = useTheme();
  const { state, dispatch } = useCalculator();
  const { t } = useLanguage();
  const { isDesktop, isTablet, isDesktopWeb, calculatorMaxWidth, headerFlex, keypadFlex } =
    useResponsive();
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
            web: {
              boxShadow: isDesktopWeb
                ? '0px 8px 32px rgba(0,0,0,0.15)'
                : '0px 4px 24px rgba(0,0,0,0.12)',
            },
            default: {
              shadowOffset: { width: 0, height: 4 } as const,
              shadowOpacity: 0.12,
              shadowRadius: 24,
            },
          })
        : {}),
      ...(isWide ? { elevation: 8 } : {}),
    }),
    [isWide, isDesktopWeb, colors.surface, colors.border, calculatorMaxWidth],
  );

  const headerStyle = useMemo(
    () => ({
      flex: headerFlex,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: isDesktopWeb ? ('space-between' as const) : ('flex-end' as const),
      paddingHorizontal: isDesktopWeb ? 20 : 16,
      minHeight: isDesktopWeb ? 40 : 32,
    }),
    [headerFlex, isDesktopWeb],
  );

  const tabStyle = useMemo(
    () => ({
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: isDesktopWeb ? 18 : 14,
      paddingVertical: isDesktopWeb ? 8 : 6,
      borderRadius: isDesktopWeb ? 16 : 14,
    }),
    [colors.surfaceVariant, isDesktopWeb],
  );

  const tabTextStyle = useMemo(
    () => ({
      color: colors.textSecondary,
      fontSize: isDesktopWeb ? 13 : 11,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    }),
    [colors.textSecondary, isDesktopWeb],
  );

  return (
    <View style={innerStyle}>
      <View style={headerStyle}>
        {isDesktopWeb ? (
          <Text
            style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '500', opacity: 0.6 }}
          >
            Calculator Pro
          </Text>
        ) : null}
        <TouchableOpacity style={tabStyle} onPress={toggleMode} activeOpacity={0.7}>
          <Text style={tabTextStyle}>
            {isScientific ? t('calculator.basic') : t('calculator.scientific')}
          </Text>
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
