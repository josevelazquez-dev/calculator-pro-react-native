import { useCallback, memo } from 'react';
import { View } from 'react-native';
import { CalculatorButton } from '@/presentation/molecules';
import { useCalculator } from '@/presentation/providers';
import { Operator } from '@/domain/entities';

interface KeypadButton {
  label: string;
  variant?: 'number' | 'operator' | 'function' | 'utility';
  size?: 'normal' | 'double';
  onPress: () => void;
}

const GAP = 4;

const Keypad = memo(function Keypad() {
  const { dispatch } = useCalculator();

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

  const rows: KeypadButton[][] = [
    [
      { label: 'C', variant: 'function', onPress: clear },
      { label: 'CE', variant: 'function', onPress: clearEntry },
      { label: '%', variant: 'function', onPress: percentage },
      { label: Operator.Divide, variant: 'operator', onPress: onDivide },
    ],
    [
      { label: '7', onPress: on7 },
      { label: '8', onPress: on8 },
      { label: '9', onPress: on9 },
      { label: Operator.Multiply, variant: 'operator', onPress: onMultiply },
    ],
    [
      { label: '4', onPress: on4 },
      { label: '5', onPress: on5 },
      { label: '6', onPress: on6 },
      { label: Operator.Subtract, variant: 'operator', onPress: onSubtract },
    ],
    [
      { label: '1', onPress: on1 },
      { label: '2', onPress: on2 },
      { label: '3', onPress: on3 },
      { label: Operator.Add, variant: 'operator', onPress: onAdd },
    ],
    [
      { label: '±', variant: 'utility', onPress: toggleSign },
      { label: '0', size: 'double', onPress: on0 },
      { label: '.', onPress: inputDecimal },
      { label: '=', variant: 'operator', onPress: calculate },
    ],
  ];

  return (
    <View style={{ flex: 1, paddingHorizontal: 12, paddingBottom: 8 }}>
      {rows.map((row, ri) => (
        <View
          key={ri}
          style={{
            flex: 1,
            flexDirection: 'row',
            marginBottom: ri < 4 ? GAP : 0,
            gap: GAP,
          }}
        >
          {row.map((btn, ci) => (
            <CalculatorButton
              key={ci}
              label={btn.label}
              variant={btn.variant}
              size={btn.size}
              onPress={btn.onPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
});

export { Keypad };
