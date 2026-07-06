import { type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { useResponsive } from '@/core/hooks';

interface ContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
}

/**
 * Responsive container.
 * - Mobile:  flex:1, ocupa todo el ancho
 * - Tablet+: centrado con maxWidth
 */
export function Container({ children, style, maxWidth }: ContainerProps) {
  const { contentMaxWidth, isMobile } = useResponsive();
  const limit = maxWidth ?? contentMaxWidth;

  if (isMobile) {
    return <View style={[{ flex: 1 }, style]}>{children}</View>;
  }

  return (
    <View
      style={[{ flex: 1, width: '100%', maxWidth: limit, alignSelf: 'center' as const }, style]}
    >
      {children}
    </View>
  );
}
