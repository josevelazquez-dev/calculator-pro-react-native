import { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';

interface DisplayRowProps {
  expression: string;
  value: string;
  isError?: boolean;
}

const DisplayRow = memo(function DisplayRow({ expression, value, isError }: DisplayRowProps) {
  const { colors } = useTheme();
  const { width } = useResponsive();

  const displayScale = useSharedValue(1);

  const animatedValueStyle = useAnimatedStyle(() => ({
    transform: [{ scale: displayScale.value }],
  }));

  const { valueFontSize, exprFontSize } = useMemo(() => {
    const base = width < 400 ? 44 : width < 500 ? 52 : 64;
    return {
      valueFontSize: isError ? 36 : base,
      exprFontSize: width < 400 ? 16 : width < 500 ? 18 : 20,
    };
  }, [width, isError]);

  return (
    <View style={styles.container}>
      {expression ? (
        <Animated.View entering={FadeInDown.duration(200).springify()}>
          <Text
            style={[styles.expression, { color: colors.textTertiary, fontSize: exprFontSize }]}
            numberOfLines={1}
          >
            {expression}
          </Text>
        </Animated.View>
      ) : (
        <View style={{ height: exprFontSize + 4 }} />
      )}
      <Animated.View style={animatedValueStyle}>
        <Text
          style={[
            styles.value,
            {
              color: isError ? colors.error : colors.text,
              fontSize: valueFontSize,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.4}
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
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  expression: {
    fontWeight: '400',
    marginBottom: 2,
    opacity: 0.7,
  },
  value: {
    fontWeight: '200',
    textAlign: 'right',
    lineHeight: undefined,
    letterSpacing: -1.5,
  },
});
