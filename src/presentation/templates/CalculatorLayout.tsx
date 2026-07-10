import { lazy, Suspense, memo, useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CalculatorDisplay } from '@/presentation/organisms';
import { Keypad } from '@/presentation/organisms';
import { useTheme, useCalculator } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { borderRadius, spacing } from '@/core/theme';

const ScientificKeypad = lazy(() =>
  import('@/presentation/organisms/ScientificKeypad').then((m) => ({
    default: m.ScientificKeypad,
  })),
);

const CalculatorLayout = memo(function CalculatorLayout() {
  const { colors } = useTheme();
  const { state, dispatch } = useCalculator();
  const { isDesktop, isTablet, calculatorMaxWidth } = useResponsive();
  const isWide = isDesktop || isTablet;
  const isScientific = state.mode === 'scientific';

  const rootStyle = useMemo(() => ({ backgroundColor: colors.background }), [colors.background]);

  const calcStyle = useMemo(
    () => ({
      maxWidth: calculatorMaxWidth,
      ...(isWide
        ? {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }
        : {}),
    }),
    [calculatorMaxWidth, isWide, colors.surface, colors.border],
  );

  const modeTabStyle = useMemo(
    () => ({ backgroundColor: colors.surfaceVariant }),
    [colors.surfaceVariant],
  );

  const modeTabTextStyle = useMemo(() => ({ color: colors.textSecondary }), [colors.textSecondary]);

  const toggleMode = useCallback(() => dispatch({ type: 'TOGGLE_MODE' }), [dispatch]);

  return (
    <View style={[styles.root, rootStyle, isWide && styles.rootWide]}>
      <View
        style={[
          styles.calculator,
          calcStyle,
          isWide && styles.calculatorCard,
          isScientific && styles.calculatorScientific,
        ]}
      >
        <View style={styles.displayArea}>
          <CalculatorDisplay />
        </View>

        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeTab, modeTabStyle]}
            onPress={toggleMode}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeTabText, modeTabTextStyle]}>
              {isScientific ? 'Basic' : 'Scientific'}
            </Text>
          </TouchableOpacity>
        </View>

        {isScientific ? (
          <View style={styles.scienceContainer}>
            <Suspense fallback={null}>
              <ScientificKeypad />
            </Suspense>
          </View>
        ) : (
          <Keypad />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  rootWide: {
    paddingBottom: 8,
  },
  calculator: {
    width: '100%',
    alignSelf: 'center',
  },
  calculatorScientific: {
    flex: 1,
  },
  calculatorCard: {
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  displayArea: {
    flex: 0,
    justifyContent: 'flex-end',
    minHeight: 80,
  },
  modeRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  modeTab: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.lg,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scienceContainer: {
    flex: 1,
  },
});

export { CalculatorLayout };
