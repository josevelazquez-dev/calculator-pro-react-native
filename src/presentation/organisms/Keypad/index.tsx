import { View, StyleSheet } from 'react-native';
import { CalculatorButton, useCalculatorActions } from '@/presentation/molecules';
import { Operator } from '@/domain/entities';

export function Keypad() {
  const {
    inputDigit,
    inputDecimal,
    setOperator,
    calculate,
    clear,
    clearEntry,
    toggleSign,
    percentage,
  } = useCalculatorActions();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <CalculatorButton label="C" variant="function" action={clear} />
        <CalculatorButton label="CE" variant="function" action={clearEntry} />
        <CalculatorButton label="%" variant="function" action={percentage} />
        <CalculatorButton
          label={Operator.Divide}
          variant="operator"
          action={() => setOperator(Operator.Divide)}
        />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="7" action={() => inputDigit('7')} />
        <CalculatorButton label="8" action={() => inputDigit('8')} />
        <CalculatorButton label="9" action={() => inputDigit('9')} />
        <CalculatorButton
          label={Operator.Multiply}
          variant="operator"
          action={() => setOperator(Operator.Multiply)}
        />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="4" action={() => inputDigit('4')} />
        <CalculatorButton label="5" action={() => inputDigit('5')} />
        <CalculatorButton label="6" action={() => inputDigit('6')} />
        <CalculatorButton
          label={Operator.Subtract}
          variant="operator"
          action={() => setOperator(Operator.Subtract)}
        />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="1" action={() => inputDigit('1')} />
        <CalculatorButton label="2" action={() => inputDigit('2')} />
        <CalculatorButton label="3" action={() => inputDigit('3')} />
        <CalculatorButton
          label={Operator.Add}
          variant="operator"
          action={() => setOperator(Operator.Add)}
        />
      </View>
      <View style={styles.row}>
        <CalculatorButton label="±" variant="utility" action={toggleSign} />
        <CalculatorButton label="0" action={() => inputDigit('0')} />
        <CalculatorButton label="." action={inputDecimal} />
        <CalculatorButton
          label={Operator.Equals}
          variant="operator"
          action={calculate}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});
