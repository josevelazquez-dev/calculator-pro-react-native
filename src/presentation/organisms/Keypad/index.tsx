import { useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { CalculatorButton } from '@/presentation/molecules';
import { useCalculator } from '@/presentation/providers';
import { Operator } from '@/domain/entities';
import { useResponsive } from '@/core/hooks';
import { spacing } from '@/core/theme';

const Keypad = memo(function Keypad() {
  const { dispatch } = useCalculator();
  const { isDesktop, isTablet } = useResponsive();
  const isWide = isDesktop || isTablet;

  const inputDigit = useCallback(
    (digit: string) => dispatch({ type: 'INPUT_DIGIT', digit }),
    [dispatch],
  );
  const setOperator = useCallback(
    (operator: Operator) => dispatch({ type: 'SET_OPERATOR', operator }),
    [dispatch],
  );
  const calculate = useCallback(() => dispatch({ type: 'CALCULATE' }), [dispatch]);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), [dispatch]);
  const clearEntry = useCallback(() => dispatch({ type: 'CLEAR_ENTRY' }), [dispatch]);
  const toggleSign = useCallback(() => dispatch({ type: 'TOGGLE_SIGN' }), [dispatch]);
  const inputDecimal = useCallback(() => dispatch({ type: 'INPUT_DECIMAL' }), [dispatch]);
  const percentage = useCallback(() => dispatch({ type: 'PERCENTAGE' }), [dispatch]);

  const onDivide = useCallback(() => setOperator(Operator.Divide), [setOperator]);
  const onMultiply = useCallback(() => setOperator(Operator.Multiply), [setOperator]);
  const onSubtract = useCallback(() => setOperator(Operator.Subtract), [setOperator]);
  const onAdd = useCallback(() => setOperator(Operator.Add), [setOperator]);
  const on7 = useCallback(() => inputDigit('7'), [inputDigit]);
  const on8 = useCallback(() => inputDigit('8'), [inputDigit]);
  const on9 = useCallback(() => inputDigit('9'), [inputDigit]);
  const on4 = useCallback(() => inputDigit('4'), [inputDigit]);
  const on5 = useCallback(() => inputDigit('5'), [inputDigit]);
  const on6 = useCallback(() => inputDigit('6'), [inputDigit]);
  const on1 = useCallback(() => inputDigit('1'), [inputDigit]);
  const on2 = useCallback(() => inputDigit('2'), [inputDigit]);
  const on3 = useCallback(() => inputDigit('3'), [inputDigit]);
  const on0 = useCallback(() => inputDigit('0'), [inputDigit]);

  return (
    <View style={[styles.container, isWide && styles.containerLarge]}>
      <View style={[styles.row, isWide && styles.rowLarge]}>
        <CalculatorButton label="C" variant="function" onPress={clear} />
        <CalculatorButton label="CE" variant="function" onPress={clearEntry} />
        <CalculatorButton label="%" variant="function" onPress={percentage} />
        <CalculatorButton label={Operator.Divide} variant="operator" onPress={onDivide} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="7" onPress={on7} />
        <CalculatorButton label="8" onPress={on8} />
        <CalculatorButton label="9" onPress={on9} />
        <CalculatorButton label={Operator.Multiply} variant="operator" onPress={onMultiply} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="4" onPress={on4} />
        <CalculatorButton label="5" onPress={on5} />
        <CalculatorButton label="6" onPress={on6} />
        <CalculatorButton label={Operator.Subtract} variant="operator" onPress={onSubtract} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="1" onPress={on1} />
        <CalculatorButton label="2" onPress={on2} />
        <CalculatorButton label="3" onPress={on3} />
        <CalculatorButton label={Operator.Add} variant="operator" onPress={onAdd} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="±" variant="utility" onPress={toggleSign} />
        <CalculatorButton label="0" size="double" onPress={on0} />
        <CalculatorButton label="." onPress={inputDecimal} />
        <CalculatorButton label={Operator.Equals} variant="operator" onPress={calculate} />
      </View>
    </View>
  );
});

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

export { Keypad };
