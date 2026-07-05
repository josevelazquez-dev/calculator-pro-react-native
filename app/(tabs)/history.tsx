import { View, Text, StyleSheet } from 'react-native';
import { ScreenLayout } from '@/presentation/templates';
import { useTheme } from '@/presentation/providers';
import { typography } from '@/core/theme';

export default function HistoryScreen() {
  const { colors } = useTheme();

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        <Text style={[styles.empty, { color: colors.textSecondary }]}>No calculations yet</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    ...typography.displaySmall,
    marginBottom: 24,
  },
  empty: {
    ...typography.body,
    textAlign: 'center',
    marginTop: 40,
  },
});
