import { useCallback, memo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CalculatorButton } from '@/presentation/molecules';
import { useCalculator } from '@/presentation/providers';
import { Operator, ScientificFunction } from '@/domain/entities';
import { useResponsive } from '@/core/hooks';
import { spacing } from '@/core/theme';

const ScientificKeypad = memo(function ScientificKeypad() {
  const { dispatch } = useCalculator();
  const { isDesktop, isTablet } = useResponsive();
  const isWide = isDesktop || isTablet;

  const fn = useCallback(
    (name: ScientificFunction) => dispatch({ type: 'SCIENTIFIC_FUNCTION', fn: name }),
    [dispatch],
  );
  const paren = useCallback(
    (p: '(' | ')') => dispatch({ type: 'INPUT_PAREN', paren: p }),
    [dispatch],
  );
  const constant = useCallback(
    (c: 'π' | 'e') => dispatch({ type: 'INPUT_CONSTANT', constant: c }),
    [dispatch],
  );
  const random = useCallback(() => dispatch({ type: 'INPUT_RANDOM' }), [dispatch]);
  const op = useCallback(
    (o: Operator) => dispatch({ type: 'SET_OPERATOR', operator: o }),
    [dispatch],
  );
  const digit = useCallback((d: string) => dispatch({ type: 'INPUT_DIGIT', digit: d }), [dispatch]);

  const onSin = useCallback(() => fn(ScientificFunction.Sin), [fn]);
  const onCos = useCallback(() => fn(ScientificFunction.Cos), [fn]);
  const onTan = useCallback(() => fn(ScientificFunction.Tan), [fn]);
  const onAsin = useCallback(() => fn(ScientificFunction.Asin), [fn]);
  const onAcos = useCallback(() => fn(ScientificFunction.Acos), [fn]);
  const onAtan = useCallback(() => fn(ScientificFunction.Atan), [fn]);
  const onX2 = useCallback(() => fn(ScientificFunction.Square), [fn]);
  const onX3 = useCallback(() => fn(ScientificFunction.Cube), [fn]);
  const onSqrt = useCallback(() => fn(ScientificFunction.Sqrt), [fn]);
  const on10x = useCallback(() => fn(ScientificFunction.TenPower), [fn]);
  const onEx = useCallback(() => fn(ScientificFunction.Exp), [fn]);
  const onLn = useCallback(() => fn(ScientificFunction.Ln), [fn]);
  const onLog = useCallback(() => fn(ScientificFunction.Log), [fn]);
  const onExp = useCallback(() => fn(ScientificFunction.InvExp), [fn]);
  const onFact = useCallback(() => fn(ScientificFunction.Factorial), [fn]);
  const onAbs = useCallback(() => fn(ScientificFunction.Abs), [fn]);
  const onPi = useCallback(() => constant('π'), [constant]);
  const onE = useCallback(() => constant('e'), [constant]);
  const onLParen = useCallback(() => paren('('), [paren]);
  const onRParen = useCallback(() => paren(')'), [paren]);
  const onPower = useCallback(() => op(Operator.Power), [op]);
  const onMod = useCallback(() => op(Operator.Mod), [op]);
  const onDivide = useCallback(() => op(Operator.Divide), [op]);
  const onMultiply = useCallback(() => op(Operator.Multiply), [op]);
  const onSubtract = useCallback(() => op(Operator.Subtract), [op]);
  const onAdd = useCallback(() => op(Operator.Add), [op]);
  const onMC = useCallback(() => dispatch({ type: 'MEMORY_CLEAR' }), [dispatch]);
  const onMR = useCallback(() => dispatch({ type: 'MEMORY_RECALL' }), [dispatch]);
  const onMPlus = useCallback(() => dispatch({ type: 'MEMORY_ADD' }), [dispatch]);
  const onMMinus = useCallback(() => dispatch({ type: 'MEMORY_SUBTRACT' }), [dispatch]);
  const onClear = useCallback(() => dispatch({ type: 'CLEAR' }), [dispatch]);
  const onClearEntry = useCallback(() => dispatch({ type: 'CLEAR_ENTRY' }), [dispatch]);
  const onPercent = useCallback(() => dispatch({ type: 'PERCENTAGE' }), [dispatch]);
  const onCalc = useCallback(() => dispatch({ type: 'CALCULATE' }), [dispatch]);
  const onToggleSign = useCallback(() => dispatch({ type: 'TOGGLE_SIGN' }), [dispatch]);
  const onDecimal = useCallback(() => dispatch({ type: 'INPUT_DECIMAL' }), [dispatch]);
  const on7 = useCallback(() => digit('7'), [digit]);
  const on8 = useCallback(() => digit('8'), [digit]);
  const on9 = useCallback(() => digit('9'), [digit]);
  const on4 = useCallback(() => digit('4'), [digit]);
  const on5 = useCallback(() => digit('5'), [digit]);
  const on6 = useCallback(() => digit('6'), [digit]);
  const on1 = useCallback(() => digit('1'), [digit]);
  const on2 = useCallback(() => digit('2'), [digit]);
  const on3 = useCallback(() => digit('3'), [digit]);
  const on0 = useCallback(() => digit('0'), [digit]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, isWide && styles.contentWide]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={styles.row}>
        <CalculatorButton label="sin" variant="function" onPress={onSin} />
        <CalculatorButton label="cos" variant="function" onPress={onCos} />
        <CalculatorButton label="tan" variant="function" onPress={onTan} />
        <CalculatorButton label="Rand" variant="utility" onPress={random} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="asin" variant="function" onPress={onAsin} />
        <CalculatorButton label="acos" variant="function" onPress={onAcos} />
        <CalculatorButton label="atan" variant="function" onPress={onAtan} />
        <CalculatorButton label="exp" variant="utility" onPress={onExp} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="x²" variant="function" onPress={onX2} />
        <CalculatorButton label="x³" variant="function" onPress={onX3} />
        <CalculatorButton label="xʸ" variant="operator" onPress={onPower} />
        <CalculatorButton label="√" variant="function" onPress={onSqrt} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="10ˣ" variant="function" onPress={on10x} />
        <CalculatorButton label="eˣ" variant="function" onPress={onEx} />
        <CalculatorButton label="ln" variant="function" onPress={onLn} />
        <CalculatorButton label="log" variant="function" onPress={onLog} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="π" variant="utility" onPress={onPi} />
        <CalculatorButton label="e" variant="utility" onPress={onE} />
        <CalculatorButton label="n!" variant="function" onPress={onFact} />
        <CalculatorButton label="mod" variant="operator" onPress={onMod} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="(" variant="utility" onPress={onLParen} />
        <CalculatorButton label=")" variant="utility" onPress={onRParen} />
        <CalculatorButton label="|x|" variant="function" onPress={onAbs} />
        <CalculatorButton label="MC" variant="utility" onPress={onMC} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="MR" variant="utility" onPress={onMR} />
        <CalculatorButton label="M+" variant="utility" onPress={onMPlus} />
        <CalculatorButton label="M-" variant="utility" onPress={onMMinus} />
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
        <CalculatorButton label="C" variant="function" onPress={onClear} />
        <CalculatorButton label="CE" variant="function" onPress={onClearEntry} />
        <CalculatorButton label="%" variant="function" onPress={onPercent} />
        <CalculatorButton label="=" variant="operator" onPress={onCalc} />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="±" variant="utility" onPress={onToggleSign} />
        <CalculatorButton label="0" size="double" onPress={on0} />
        <CalculatorButton label="." onPress={onDecimal} />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  contentWide: {
    paddingHorizontal: spacing.xxxl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
});

export { ScientificKeypad };
