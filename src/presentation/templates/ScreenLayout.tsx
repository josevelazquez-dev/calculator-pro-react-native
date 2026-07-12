import { memo, useMemo, type ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/presentation/providers';

interface ScreenLayoutProps {
  children: ReactNode;
}

const ScreenLayout = memo(function ScreenLayout({ children }: ScreenLayoutProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const screenStyle = useMemo(
    () => ({
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }),
    [colors.background, insets.top, insets.bottom],
  );

  return <View style={screenStyle}>{children}</View>;
});

export { ScreenLayout };
