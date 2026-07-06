import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CalculatorDisplay } from '@/presentation/organisms';
import { ScientificKeypad } from '@/presentation/organisms';
import { Keypad } from '@/presentation/organisms';
import { useTheme, useCalculator } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { borderRadius, spacing } from '@/core/theme';

export function CalculatorLayout() {
  const { colors } = useTheme();
  const { state, dispatch } = useCalculator();
  const { isDesktop, isTablet, calculatorMaxWidth } = useResponsive();
  const isWide = isDesktop || isTablet;
  const isScientific = state.mode === 'scientific';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }, isWide && styles.rootWide]}>
      <View
        style={[
          styles.calculator,
          { maxWidth: calculatorMaxWidth },
          isWide && styles.calculatorCard,
          isWide && { backgroundColor: colors.surface, borderColor: colors.border },
          isScientific && styles.calculatorScientific,
        ]}
      >
        <View style={styles.displayArea}>
          <CalculatorDisplay />
        </View>

        {/* Mode toggle */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeTab, { backgroundColor: colors.surfaceVariant }]}
            onPress={() => dispatch({ type: 'TOGGLE_MODE' })}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeTabText, { color: colors.textSecondary }]}>
              {isScientific ? 'Basic' : 'Scientific'}
            </Text>
          </TouchableOpacity>
        </View>

        {isScientific ? (
          <View style={styles.scienceContainer}>
            <ScientificKeypad />
          </View>
        ) : (
          <Keypad />
        )}
      </View>
    </View>
  );
}

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
