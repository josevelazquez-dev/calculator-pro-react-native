import { useEffect, memo, useMemo } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme, LanguageProvider } from '@/presentation/providers';
import { registerServiceWorker, ensureManifestLink } from '@/core/pwa/registerSW';
import { ErrorBoundary } from '@/presentation/atoms/ErrorBoundary';

const RootLayoutContent = memo(function RootLayoutContent() {
  const { colors, isDark } = useTheme();

  const stackScreenOptions = useMemo(
    () => ({
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
      animation: 'fade' as const,
    }),
    [colors.background],
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    ensureManifestLink();
    registerServiceWorker();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack screenOptions={stackScreenOptions} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
});

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
