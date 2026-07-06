import { View, StyleSheet } from 'react-native';
import { DisplayRow } from '@/presentation/molecules';
import { useCalculator, useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { borderRadius, spacing } from '@/core/theme';

export function CalculatorDisplay() {
  const { state } = useCalculator();
  const { colors } = useTheme();
  const { isDesktop, isTablet } = useResponsive();
  const isWide = isDesktop || isTablet;

  const isError = state.error !== null || state.displayValue === 'Error';

  return (
    <View style={[styles.container, isWide && styles.containerWide]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <DisplayRow expression={state.expression} value={state.displayValue} isError={isError} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  containerWide: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.xxxl,
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    paddingVertical: spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
});
