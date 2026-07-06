import { View, Text, StyleSheet, Switch } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ScreenLayout } from '@/presentation/templates';
import { useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { spacing, borderRadius } from '@/core/theme';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { isDesktop, isTablet } = useResponsive();
  const isWide = isDesktop || isTablet;

  return (
    <ScreenLayout>
      <View style={[styles.container, isWide && styles.containerWide]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <Animated.View
          entering={FadeIn.duration(300).springify()}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                Toggle dark appearance
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={colors.border}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(400).springify().delay(100)}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>About</Text>
              <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                Calculator Pro v1.0.0
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xxxl,
  },
  containerWide: {
    padding: spacing.huge,
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    marginBottom: spacing.xxxl,
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flex: 1,
    marginRight: spacing.xl,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: spacing.xxs,
  },
});
