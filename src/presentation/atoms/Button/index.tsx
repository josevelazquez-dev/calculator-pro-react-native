import { useState, type ComponentProps } from 'react';
import { Text, StyleSheet, type TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { typography, spacing, borderRadius } from '@/core/theme';
import { getResponsiveFontScale } from '@/core/theme/responsive';

interface ButtonProps extends ComponentProps<typeof Animated.View> {
  label: string;
  variant?: 'number' | 'operator' | 'function' | 'utility';
  size?: 'normal' | 'double';
  textStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
}

export function Button({
  label,
  variant = 'number',
  size = 'normal',
  style,
  textStyle,
  onPress,
  disabled,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const { isWeb, isDesktop, isTablet } = useResponsive();
  const isWide = isDesktop || isTablet;
  const [hovered, setHovered] = useState(false);

  const scale = useSharedValue(1);
  const elevated = useSharedValue(0);

  const bgColor = {
    number: colors.buttonNumber,
    operator: colors.buttonOperator,
    function: colors.buttonFunction,
    utility: colors.buttonUtility,
  }[variant];

  const textColor = {
    number: colors.buttonNumberText,
    operator: colors.buttonOperatorText,
    function: colors.buttonFunctionText,
    utility: colors.buttonUtilityText,
  }[variant];

  const disabledBg = {
    number: colors.surfaceVariant,
    operator: colors.surfaceVariant,
    function: colors.surfaceVariant,
    utility: colors.surfaceVariant,
  }[variant];

  const disabledText = colors.textTertiary;

  const gesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(0.92, { damping: 20, stiffness: 300, mass: 0.5 });
      elevated.value = withTiming(1, { duration: 60 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 20, stiffness: 300, mass: 0.5 });
      elevated.value = withTiming(0, { duration: 100 });
    })
    .onEnd((_event, success) => {
      if (success) onPress?.();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: disabled ? 1 : scale.value }],
    shadowOpacity: disabled
      ? 0
      : variant === 'operator'
        ? 0.2 + elevated.value * 0.15
        : 0.1 + elevated.value * 0.08,
  }));

  const webHoverProps = isWeb
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      }
    : {};

  const hoverScale = hovered && !disabled ? 1.04 : 1;
  const fontScale = getResponsiveFontScale(isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile');

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.base,
          size === 'double' && styles.double,
          {
            backgroundColor: disabled ? disabledBg : bgColor,
            borderColor: disabled
              ? 'transparent'
              : variant === 'number'
                ? colors.buttonNumberBorder
                : 'transparent',
            transform: [{ scale: hoverScale }],
            aspectRatio: isWide ? (size === 'double' ? 3.6 : 1.8) : size === 'double' ? 2.1 : 1,
          },
          variant === 'operator' && !disabled && styles.operatorShadow,
          isDesktop && styles.desktopButton,
          animatedStyle,
          style,
        ]}
        {...webHoverProps}
        {...rest}
      >
        <Text
          style={[
            styles.label,
            { fontSize: (typography.button.fontSize as number) * fontScale },
            { color: disabled ? disabledText : textColor },
            variant === 'operator' && styles.operatorLabel,
            variant === 'function' && styles.functionLabel,
            size === 'double' && styles.doubleLabel,
            textStyle,
          ]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {label}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: borderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.xs,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
  },
  operatorShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  double: {
    aspectRatio: 2.1,
    alignItems: 'flex-start',
    paddingLeft: spacing.xxxl,
  },
  desktopButton: {
    cursor: 'pointer',
  },
  label: {
    ...typography.button,
  },
  operatorLabel: {
    ...typography.buttonLarge,
  },
  functionLabel: {
    ...typography.buttonSmall,
  },
  doubleLabel: {
    ...typography.button,
  },
});
