import { View, Text, StyleSheet, Switch } from 'react-native';
import { ScreenLayout } from '@/presentation/templates';
import { useTheme } from '@/presentation/providers';
import { typography, spacing } from '@/core/theme';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.surface, true: colors.primary }}
            thumbColor={colors.buttonText}
          />
        </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  label: {
    ...typography.body,
  },
});
