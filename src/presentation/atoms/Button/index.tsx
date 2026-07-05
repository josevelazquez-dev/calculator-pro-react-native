import { type ComponentProps } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme } from '@/presentation/providers';
import { typography, spacing } from '@/core/theme';

interface ButtonProps extends ComponentProps<typeof TouchableOpacity> {
  label: string;
  variant?: 'number' | 'operator' | 'function' | 'utility';
  size?: 'normal' | 'double';
  textStyle?: TextStyle;
}

export function Button({
  label,
  variant = 'number',
  size = 'normal',
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();

  const bgColor = {
    number: colors.button,
    operator: colors.buttonOperator,
    function: colors.surface,
    utility: colors.surface,
  }[variant];

  const textColor = {
    number: colors.text,
    operator: colors.buttonText,
    function: colors.primary,
    utility: colors.text,
  }[variant];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor: bgColor },
        size === 'double' && styles.double,
        style as ViewStyle,
      ]}
      activeOpacity={0.6}
      {...rest}
    >
      <Text
        style={[
          styles.label,
          { color: textColor },
          variant === 'operator' && styles.operatorLabel,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.xs / 2,
  },
  double: {
    aspectRatio: 2,
  },
  label: {
    ...typography.button,
  },
  operatorLabel: {
    fontSize: 32,
  },
});
