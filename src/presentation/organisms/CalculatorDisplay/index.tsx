import { View, StyleSheet } from 'react-native';
import { DisplayRow } from '@/presentation/molecules';
import { useCalculator } from '@/presentation/providers';

export function CalculatorDisplay() {
  const { state } = useCalculator();

  return (
    <View style={styles.container}>
      <DisplayRow expression={state.expression} value={state.displayValue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
});
