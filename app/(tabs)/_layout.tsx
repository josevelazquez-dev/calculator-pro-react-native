import { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTheme, HistoryProvider, useLanguage } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { isDesktop, isTablet, isDesktopWeb, calculatorMaxWidth } = useResponsive();
  const isWide = isDesktop || isTablet;

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: isDesktopWeb ? 40 : 48,
        paddingBottom: isDesktopWeb ? 2 : 4,
        paddingTop: isDesktopWeb ? 2 : 4,
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
        fontSize: isDesktopWeb ? 11 : 10,
        fontWeight: '600' as const,
        letterSpacing: 0.3,
      },
      tabBarIconStyle: {
        marginBottom: isDesktopWeb ? -1 : -2,
      },
    }),
    [colors, isWide, calculatorMaxWidth, isDesktopWeb],
  );

  return (
    <HistoryProvider>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('nav.calculator'),
            tabBarLabel: t('nav.calculator'),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: t('nav.history'),
            tabBarLabel: t('nav.history'),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('nav.settings'),
            tabBarLabel: t('nav.settings'),
          }}
        />
      </Tabs>
    </HistoryProvider>
  );
}
