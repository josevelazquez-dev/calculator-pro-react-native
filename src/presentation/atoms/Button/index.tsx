import { useMemo, memo, type ComponentProps } from 'react';
import { Text, StyleSheet, Platform, type TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { typography, borderRadius } from '@/core/theme';
import { getResponsiveFontScale } from '@/core/theme/responsive';

interface ButtonProps extends ComponentProps<typeof Animated.View> {
  label: string;
  variant?: 'number' | 'operator' | 'function' | 'utility';
  size?: 'normal' | 'double';
  textStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
}

const Button = memo(function Button({
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

  const scale = useSharedValue(1);
  const elevated = useSharedValue(0);
  const hoveredSV = useSharedValue(0);

  const colorsMemo = useMemo(
    () => ({
      bgColor: (
        {
          number: colors.buttonNumber,
          operator: colors.buttonOperator,
          function: colors.buttonFunction,
          utility: colors.buttonUtility,
        } as const
      )[variant],
      textColor: (
        {
          number: colors.buttonNumberText,
          operator: colors.buttonOperatorText,
          function: colors.buttonFunctionText,
          utility: colors.buttonUtilityText,
        } as const
      )[variant],
      disabledBg: (
        {
          number: colors.surfaceVariant,
          operator: colors.surfaceVariant,
          function: colors.surfaceVariant,
          utility: colors.surfaceVariant,
        } as const
      )[variant],
      disabledText: colors.textTertiary,
      borderColor: variant === 'number' ? colors.buttonNumberBorder : 'transparent',
    }),
    [colors, variant],
  );

  const gesture = useMemo(
    () =>
      Gesture.Tap()
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
        }),
    [disabled, onPress, scale, elevated],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: disabled ? 1 : scale.value * (hoveredSV.value ? 1.04 : 1) }],
    ...(isWeb
      ? {}
      : {
          shadowOpacity: disabled
            ? 0
            : variant === 'operator'
              ? 0.2 + elevated.value * 0.15
              : 0.1 + elevated.value * 0.08,
        }),
  }));

  const webHoverProps = isWeb
    ? {
        onMouseEnter: () => {
          hoveredSV.value = 1;
        },
        onMouseLeave: () => {
          hoveredSV.value = 0;
        },
      }
    : {};

  const fontScale = getResponsiveFontScale(isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile');

  const doubleStyle = useMemo(
    () => (size === 'double' ? { alignItems: 'flex-start' as const, paddingLeft: 20 } : null),
    [size],
  );

  const dynamicStyle = useMemo(
    () => ({
      backgroundColor: disabled ? colorsMemo.disabledBg : colorsMemo.bgColor,
      borderColor: disabled ? 'transparent' : colorsMemo.borderColor,
    }),
    [disabled, colorsMemo],
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.base,
          dynamicStyle,
          doubleStyle,
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
            { color: disabled ? colorsMemo.disabledText : colorsMemo.textColor },
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
});

const styles = StyleSheet.create({
  base: {
    flex: 1,
    borderRadius: borderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 2px 6px rgba(0,0,0,0.1)' },
      default: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
    }),
    elevation: 2,
    borderWidth: 1,
  },
  operatorShadow: {
    ...Platform.select({
      web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.15)' },
      default: { shadowOffset: { width: 0, height: 4 }, shadowRadius: 12 },
    }),
    elevation: 6,
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

export { Button };
