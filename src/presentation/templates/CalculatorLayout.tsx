import { View, StyleSheet } from 'react-native';
import { CalculatorDisplay } from '@/presentation/organisms';
import { Keypad } from '@/presentation/organisms';

export function CalculatorLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.displayArea}>
        <CalculatorDisplay />
      </View>
      <View style={styles.keypadArea}>
        <Keypad />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  displayArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keypadArea: {},
});
