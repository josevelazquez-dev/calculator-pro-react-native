import { useEffect, memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  cancelAnimation,
  FadeInDown,
} from 'react-native-reanimated';
import { useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { spacing } from '@/core/theme';

interface DisplayRowProps {
  expression: string;
  value: string;
  isError?: boolean;
}

const DisplayRow = memo(function DisplayRow({ expression, value, isError }: DisplayRowProps) {
  const { colors } = useTheme();
  const { isDesktop, isTablet } = useResponsive();
  const isWide = isDesktop || isTablet;

  const displayScale = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(displayScale);
    displayScale.value = withSequence(
      withTiming(1.04, { duration: 60 }),
      withTiming(1, { duration: 120 }),
    );
  }, [value, displayScale]);

  const animatedValueStyle = useAnimatedStyle(() => ({
    transform: [{ scale: displayScale.value }],
  }));

  const fontSize = useMemo(
    () => ({
      value: isWide ? (isDesktop ? 80 : 72) : 64,
      expression: isWide ? 26 : 22,
    }),
    [isWide, isDesktop],
  );

  return (
    <View style={styles.container}>
      {expression ? (
        <Animated.View entering={FadeInDown.duration(200).springify()}>
          <Text
            style={[
              styles.expression,
              { color: colors.textTertiary, fontSize: fontSize.expression },
            ]}
            numberOfLines={1}
          >
            {expression}
          </Text>
        </Animated.View>
      ) : (
        <View style={styles.expressionPlaceholder} />
      )}
      <Animated.View style={[styles.valueRow, animatedValueStyle]}>
        <Text
          style={[
            styles.value,
            {
              color: isError ? colors.error : colors.text,
              fontSize: isError ? 36 : fontSize.value,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          {value}
        </Text>
      </Animated.View>
    </View>
  );
});

export { DisplayRow };

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    alignItems: 'flex-end',
  },
  expression: {
    fontWeight: '400',
    marginBottom: spacing.xs,
    opacity: 0.7,
    lineHeight: 30,
  },
  expressionPlaceholder: {
    height: 30,
    marginBottom: spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontWeight: '200',
    textAlign: 'right',
    flexShrink: 1,
    lineHeight: 80,
    letterSpacing: -1.5,
  },
});
