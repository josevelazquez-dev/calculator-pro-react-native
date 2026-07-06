import { Tabs } from 'expo-router';
import { useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { spacing, borderRadius } from '@/core/theme';

export default function TabLayout() {
  const { colors } = useTheme();
  const { isDesktop, isTablet, calculatorMaxWidth } = useResponsive();
  const isWide = isDesktop || isTablet;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
          height: isWide ? 72 : 64,
          elevation: 8,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          maxWidth: isWide ? calculatorMaxWidth : undefined,
          alignSelf: isWide ? 'center' : undefined,
          borderTopLeftRadius: isWide ? borderRadius.xxl : 0,
          borderTopRightRadius: isWide ? borderRadius.xxl : 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: isWide ? 13 : 10,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calculator',
          tabBarLabel: 'Calculator',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarLabel: 'History',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tabs>
  );
}
