import { memo, useMemo } from 'react';
import { Button } from '@/presentation/atoms';

type ButtonVariant = 'number' | 'operator' | 'function' | 'utility';

interface CalculatorButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: 'normal' | 'double';
  onPress?: () => void;
  disabled?: boolean;
}

const CalculatorButton = memo(function CalculatorButton({
  label,
  variant = 'number',
  size = 'normal',
  onPress,
  disabled,
}: CalculatorButtonProps) {
  const buttonStyle = useMemo(() => ({ flex: size === 'double' ? 2 : 1 }), [size]);

  return (
    <Button
      label={label}
      variant={variant}
      size={size}
      onPress={onPress}
      disabled={disabled}
      style={buttonStyle}
    />
  );
});

export { CalculatorButton };
