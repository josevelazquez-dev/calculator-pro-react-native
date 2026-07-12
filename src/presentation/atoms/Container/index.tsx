import { memo, useMemo, type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { useResponsive } from '@/core/hooks';

interface ContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
}

const Container = memo(function Container({ children, style, maxWidth }: ContainerProps) {
  const { calculatorMaxWidth, isMobile } = useResponsive();
  const limit = maxWidth ?? calculatorMaxWidth;

  const mobileStyle = useMemo(() => [{ flex: 1 } as const, style], [style]);
  const desktopStyle = useMemo(
    () => [
      { flex: 1, width: '100%' as const, maxWidth: limit, alignSelf: 'center' as const },
      style,
    ],
    [style, limit],
  );

  if (isMobile) {
    return <View style={mobileStyle}>{children}</View>;
  }

  return <View style={desktopStyle}>{children}</View>;
});

export { Container };
