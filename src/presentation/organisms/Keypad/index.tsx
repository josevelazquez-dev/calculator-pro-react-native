import { View, StyleSheet } from 'react-native';
import { CalculatorButton } from '@/presentation/molecules';
import { useCalculator } from '@/presentation/providers';
import { Operator } from '@/domain/entities';
import { useResponsive } from '@/core/hooks';
import { spacing } from '@/core/theme';

export function Keypad() {
  const { dispatch } = useCalculator();
  const { isDesktop, isTablet } = useResponsive();
  const isWide = isDesktop || isTablet;

  const actions = {
    inputDigit: (digit: string) => dispatch({ type: 'INPUT_DIGIT', digit }),
    inputDecimal: () => dispatch({ type: 'INPUT_DECIMAL' }),
    setOperator: (operator: Operator) => dispatch({ type: 'SET_OPERATOR', operator }),
    calculate: () => dispatch({ type: 'CALCULATE' }),
    clear: () => dispatch({ type: 'CLEAR' }),
    clearEntry: () => dispatch({ type: 'CLEAR_ENTRY' }),
    toggleSign: () => dispatch({ type: 'TOGGLE_SIGN' }),
    percentage: () => dispatch({ type: 'PERCENTAGE' }),
  };

  return (
    <View style={[styles.container, isWide && styles.containerLarge]}>
      <View style={[styles.row, isWide && styles.rowLarge]}>
        <CalculatorButton label="C" variant="function" onPress={actions.clear} />
        <CalculatorButton label="CE" variant="function" onPress={actions.clearEntry} />
        <CalculatorButton label="%" variant="function" onPress={actions.percentage} />
        <CalculatorButton
          label={Operator.Divide}
          variant="operator"
          onPress={() => actions.setOperator(Operator.Divide)}
        />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="7" onPress={() => actions.inputDigit('7')} />
        <CalculatorButton label="8" onPress={() => actions.inputDigit('8')} />
        <CalculatorButton label="9" onPress={() => actions.inputDigit('9')} />
        <CalculatorButton
          label={Operator.Multiply}
          variant="operator"
          onPress={() => actions.setOperator(Operator.Multiply)}
        />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="4" onPress={() => actions.inputDigit('4')} />
        <CalculatorButton label="5" onPress={() => actions.inputDigit('5')} />
        <CalculatorButton label="6" onPress={() => actions.inputDigit('6')} />
        <CalculatorButton
          label={Operator.Subtract}
          variant="operator"
          onPress={() => actions.setOperator(Operator.Subtract)}
        />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="1" onPress={() => actions.inputDigit('1')} />
        <CalculatorButton label="2" onPress={() => actions.inputDigit('2')} />
        <CalculatorButton label="3" onPress={() => actions.inputDigit('3')} />
        <CalculatorButton
          label={Operator.Add}
          variant="operator"
          onPress={() => actions.setOperator(Operator.Add)}
        />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="±" variant="utility" onPress={actions.toggleSign} />
        <CalculatorButton label="0" size="double" onPress={() => actions.inputDigit('0')} />
        <CalculatorButton label="." onPress={actions.inputDecimal} />
        <CalculatorButton label={Operator.Equals} variant="operator" onPress={actions.calculate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  containerLarge: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  rowLarge: {
    marginBottom: spacing.md,
  },
});
