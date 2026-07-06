import { View, StyleSheet, ScrollView } from 'react-native';
import { CalculatorButton } from '@/presentation/molecules';
import { useCalculator } from '@/presentation/providers';
import { Operator } from '@/domain/entities';
import { useResponsive } from '@/core/hooks';
import { spacing } from '@/core/theme';

export function ScientificKeypad() {
  const { dispatch } = useCalculator();
  const { isDesktop, isTablet } = useResponsive();
  const isWide = isDesktop || isTablet;

  const fn = (name: string) => dispatch({ type: 'SCIENTIFIC_FUNCTION', fn: name });
  const paren = (p: '(' | ')') => dispatch({ type: 'INPUT_PAREN', paren: p });
  const constant = (c: 'π' | 'e') => dispatch({ type: 'INPUT_CONSTANT', constant: c });
  const random = () => dispatch({ type: 'INPUT_RANDOM' });
  const op = (o: Operator) => dispatch({ type: 'SET_OPERATOR', operator: o });
  const digit = (d: string) => dispatch({ type: 'INPUT_DIGIT', digit: d });

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, isWide && styles.contentWide]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* Row 1 — Trig */}
      <View style={styles.row}>
        <CalculatorButton label="sin" variant="function" onPress={() => fn('sin')} />
        <CalculatorButton label="cos" variant="function" onPress={() => fn('cos')} />
        <CalculatorButton label="tan" variant="function" onPress={() => fn('tan')} />
        <CalculatorButton label="Rand" variant="utility" onPress={random} />
      </View>

      {/* Row 2 — Inverse trig */}
      <View style={styles.row}>
        <CalculatorButton label="asin" variant="function" onPress={() => fn('asin')} />
        <CalculatorButton label="acos" variant="function" onPress={() => fn('acos')} />
        <CalculatorButton label="atan" variant="function" onPress={() => fn('atan')} />
        <CalculatorButton label="exp" variant="utility" onPress={() => fn('exp')} />
      </View>

      {/* Row 3 — Powers */}
      <View style={styles.row}>
        <CalculatorButton label="x²" variant="function" onPress={() => fn('x²')} />
        <CalculatorButton label="x³" variant="function" onPress={() => fn('x³')} />
        <CalculatorButton label="xʸ" variant="operator" onPress={() => op(Operator.Power)} />
        <CalculatorButton label="√" variant="function" onPress={() => fn('sqrt')} />
      </View>

      {/* Row 4 — Logs */}
      <View style={styles.row}>
        <CalculatorButton label="10ˣ" variant="function" onPress={() => fn('10ˣ')} />
        <CalculatorButton label="eˣ" variant="function" onPress={() => fn('eˣ')} />
        <CalculatorButton label="ln" variant="function" onPress={() => fn('ln')} />
        <CalculatorButton label="log" variant="function" onPress={() => fn('log')} />
      </View>

      {/* Row 5 — Constants & misc */}
      <View style={styles.row}>
        <CalculatorButton label="π" variant="utility" onPress={() => constant('π')} />
        <CalculatorButton label="e" variant="utility" onPress={() => constant('e')} />
        <CalculatorButton label="n!" variant="function" onPress={() => fn('n!')} />
        <CalculatorButton label="mod" variant="operator" onPress={() => op(Operator.Mod)} />
      </View>

      {/* Row 6 — Parens, abs */}
      <View style={styles.row}>
        <CalculatorButton label="(" variant="utility" onPress={() => paren('(')} />
        <CalculatorButton label=")" variant="utility" onPress={() => paren(')')} />
        <CalculatorButton label="|x|" variant="function" onPress={() => fn('abs')} />
        <CalculatorButton
          label="MC"
          variant="utility"
          onPress={() => dispatch({ type: 'MEMORY_CLEAR' })}
        />
      </View>

      {/* Row 7 — Memory + ÷ */}
      <View style={styles.row}>
        <CalculatorButton
          label="MR"
          variant="utility"
          onPress={() => dispatch({ type: 'MEMORY_RECALL' })}
        />
        <CalculatorButton
          label="M+"
          variant="utility"
          onPress={() => dispatch({ type: 'MEMORY_ADD' })}
        />
        <CalculatorButton
          label="M-"
          variant="utility"
          onPress={() => dispatch({ type: 'MEMORY_SUBTRACT' })}
        />
        <CalculatorButton
          label={Operator.Divide}
          variant="operator"
          onPress={() => op(Operator.Divide)}
        />
      </View>

      {/* Row 8 — 7 8 9 × */}
      <View style={styles.row}>
        <CalculatorButton label="7" onPress={() => digit('7')} />
        <CalculatorButton label="8" onPress={() => digit('8')} />
        <CalculatorButton label="9" onPress={() => digit('9')} />
        <CalculatorButton
          label={Operator.Multiply}
          variant="operator"
          onPress={() => op(Operator.Multiply)}
        />
      </View>

      {/* Row 9 — 4 5 6 – */}
      <View style={styles.row}>
        <CalculatorButton label="4" onPress={() => digit('4')} />
        <CalculatorButton label="5" onPress={() => digit('5')} />
        <CalculatorButton label="6" onPress={() => digit('6')} />
        <CalculatorButton
          label={Operator.Subtract}
          variant="operator"
          onPress={() => op(Operator.Subtract)}
        />
      </View>

      {/* Row 10 — 1 2 3 + */}
      <View style={styles.row}>
        <CalculatorButton label="1" onPress={() => digit('1')} />
        <CalculatorButton label="2" onPress={() => digit('2')} />
        <CalculatorButton label="3" onPress={() => digit('3')} />
        <CalculatorButton
          label={Operator.Add}
          variant="operator"
          onPress={() => op(Operator.Add)}
        />
      </View>

      {/* Row 11 — C CE % = */}
      <View style={styles.row}>
        <CalculatorButton
          label="C"
          variant="function"
          onPress={() => dispatch({ type: 'CLEAR' })}
        />
        <CalculatorButton
          label="CE"
          variant="function"
          onPress={() => dispatch({ type: 'CLEAR_ENTRY' })}
        />
        <CalculatorButton
          label="%"
          variant="function"
          onPress={() => dispatch({ type: 'PERCENTAGE' })}
        />
        <CalculatorButton
          label="="
          variant="operator"
          onPress={() => dispatch({ type: 'CALCULATE' })}
        />
      </View>

      {/* Row 12 — ± 0 . */}
      <View style={styles.row}>
        <CalculatorButton
          label="±"
          variant="utility"
          onPress={() => dispatch({ type: 'TOGGLE_SIGN' })}
        />
        <CalculatorButton label="0" size="double" onPress={() => digit('0')} />
        <CalculatorButton label="." onPress={() => dispatch({ type: 'INPUT_DECIMAL' })} />
      </View>
    </ScrollView>
  );
}

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
