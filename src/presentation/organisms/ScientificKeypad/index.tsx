import { useCallback, memo } from 'react';
import { View } from 'react-native';
import { CalculatorButton } from '@/presentation/molecules';
import { useCalculator } from '@/presentation/providers';
import { Operator, ScientificFunction } from '@/domain/entities';

const GAP = 2;

const ScientificKeypad = memo(function ScientificKeypad() {
  const { dispatch } = useCalculator();

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

  const rows: {
    label: string;
    variant?: 'number' | 'operator' | 'function' | 'utility';
    size?: 'normal' | 'double';
    onPress: () => void;
  }[][] = [
    [
      { label: 'sin', variant: 'function', onPress: onSin },
      { label: 'cos', variant: 'function', onPress: onCos },
      { label: 'tan', variant: 'function', onPress: onTan },
      { label: 'Rand', variant: 'utility', onPress: random },
    ],
    [
      { label: 'asin', variant: 'function', onPress: onAsin },
      { label: 'acos', variant: 'function', onPress: onAcos },
      { label: 'atan', variant: 'function', onPress: onAtan },
      { label: 'exp', variant: 'utility', onPress: onExp },
    ],
    [
      { label: 'x²', variant: 'function', onPress: onX2 },
      { label: 'x³', variant: 'function', onPress: onX3 },
      { label: 'xʸ', variant: 'operator', onPress: onPower },
      { label: '√', variant: 'function', onPress: onSqrt },
    ],
    [
      { label: '10ˣ', variant: 'function', onPress: on10x },
      { label: 'eˣ', variant: 'function', onPress: onEx },
      { label: 'ln', variant: 'function', onPress: onLn },
      { label: 'log', variant: 'function', onPress: onLog },
    ],
    [
      { label: 'π', variant: 'utility', onPress: onPi },
      { label: 'e', variant: 'utility', onPress: onE },
      { label: 'n!', variant: 'function', onPress: onFact },
      { label: 'mod', variant: 'operator', onPress: onMod },
    ],
    [
      { label: '(', variant: 'utility', onPress: onLParen },
      { label: ')', variant: 'utility', onPress: onRParen },
      { label: '|x|', variant: 'function', onPress: onAbs },
      { label: 'MC', variant: 'utility', onPress: onMC },
    ],
    [
      { label: 'MR', variant: 'utility', onPress: onMR },
      { label: 'M+', variant: 'utility', onPress: onMPlus },
      { label: 'M-', variant: 'utility', onPress: onMMinus },
      { label: '÷', variant: 'operator', onPress: onDivide },
    ],
    [
      { label: '7', onPress: on7 },
      { label: '8', onPress: on8 },
      { label: '9', onPress: on9 },
      { label: '×', variant: 'operator', onPress: onMultiply },
    ],
    [
      { label: '4', onPress: on4 },
      { label: '5', onPress: on5 },
      { label: '6', onPress: on6 },
      { label: '-', variant: 'operator', onPress: onSubtract },
    ],
    [
      { label: '1', onPress: on1 },
      { label: '2', onPress: on2 },
      { label: '3', onPress: on3 },
      { label: '+', variant: 'operator', onPress: onAdd },
    ],
    [
      { label: 'C', variant: 'function', onPress: onClear },
      { label: 'CE', variant: 'function', onPress: onClearEntry },
      { label: '%', variant: 'function', onPress: onPercent },
      { label: '=', variant: 'operator', onPress: onCalc },
    ],
    [
      { label: '±', variant: 'utility', onPress: onToggleSign },
      { label: '0', size: 'double', onPress: on0 },
      { label: '.', onPress: onDecimal },
    ],
  ];

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingBottom: 4 }}>
      {rows.map((row, ri) => (
        <View
          key={ri}
          style={{
            flex: 1,
            flexDirection: 'row',
            marginBottom: ri < rows.length - 1 ? GAP : 0,
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

export { ScientificKeypad };
