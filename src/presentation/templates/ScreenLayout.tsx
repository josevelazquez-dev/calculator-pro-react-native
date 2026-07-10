import { memo, useMemo, type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { Container } from '@/presentation/atoms';

interface ScreenLayoutProps {
  children: ReactNode;
}

const ScreenLayout = memo(function ScreenLayout({ children }: ScreenLayoutProps) {
  const { colors } = useTheme();
  const { isMobile, screenPadding } = useResponsive();
  const insets = useSafeAreaInsets();

  const screenStyle = useMemo(
    () => ({
      backgroundColor: colors.background,
      paddingTop: isMobile ? insets.top : screenPadding,
      paddingBottom: insets.bottom,
    }),
    [colors.background, isMobile, insets.top, screenPadding, insets.bottom],
  );

  return (
    <View style={[styles.screen, screenStyle]}>
      <Container>{children}</Container>
    </View>
  );
});

export { ScreenLayout };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
