import { type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { Container } from '@/presentation/atoms';

interface ScreenLayoutProps {
  children: ReactNode;
}

export function ScreenLayout({ children }: ScreenLayoutProps) {
  const { colors } = useTheme();
  const { isMobile, screenPadding } = useResponsive();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: isMobile ? insets.top : screenPadding,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Container>{children}</Container>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
