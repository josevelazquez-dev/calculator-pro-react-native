import { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTheme, HistoryProvider } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';

export default function TabLayout() {
  const { colors } = useTheme();
  const { isDesktop, isTablet, calculatorMaxWidth } = useResponsive();
  const isWide = isDesktop || isTablet;

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: 48,
        paddingBottom: 4,
        paddingTop: 4,
        elevation: 8,
        ...(Platform.select({
          web: { boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' },
          default: {
            shadowOffset: { width: 0, height: -2 } as const,
            shadowOpacity: 0.06,
            shadowRadius: 8,
          },
        }) as object),
        maxWidth: isWide ? calculatorMaxWidth : undefined,
        alignSelf: isWide ? 'center' as const : undefined,
        borderTopLeftRadius: isWide ? 24 : 0,
        borderTopRightRadius: isWide ? 24 : 0,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '600' as const,
        letterSpacing: 0.3,
      },
      tabBarIconStyle: {
        marginBottom: -2,
      },
    }),
    [colors, isWide, calculatorMaxWidth],
  );

  return (
    <HistoryProvider>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Calculator',
            tabBarLabel: 'Calc',
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
    </HistoryProvider>
  );
}
