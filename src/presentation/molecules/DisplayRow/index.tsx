import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/presentation/providers';
import { typography, spacing } from '@/core/theme';

interface DisplayRowProps {
  expression: string;
  value: string;
}

export function DisplayRow({ expression, value }: DisplayRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.expression, { color: colors.textSecondary }]} numberOfLines={1}>
        {expression}
      </Text>
      <Text style={[styles.value, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'flex-end',
  },
  expression: {
    ...typography.body,
    minHeight: 22,
  },
  value: {
    ...typography.display,
  },
});
