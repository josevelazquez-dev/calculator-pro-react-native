import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ScreenLayout } from '@/presentation/templates';
import { useTheme } from '@/presentation/providers';
import { spacing, borderRadius } from '@/core/theme';

export default function HistoryScreen() {
  const { colors } = useTheme();

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        <View
          style={[
            styles.emptyState,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Animated.View entering={FadeIn.duration(400).springify()}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No calculations yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              Your calculation history will appear here
            </Text>
          </Animated.View>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xxxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    marginBottom: spacing.xxxl,
  },
  emptyState: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.huge,
  },
  emptyIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
