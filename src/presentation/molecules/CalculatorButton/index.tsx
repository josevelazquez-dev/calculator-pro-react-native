import { Button } from '@/presentation/atoms';

type ButtonVariant = 'number' | 'operator' | 'function' | 'utility';

interface CalculatorButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: 'normal' | 'double';
  onPress?: () => void;
  disabled?: boolean;
}

export function CalculatorButton({
  label,
  variant = 'number',
  size = 'normal',
  onPress,
  disabled,
}: CalculatorButtonProps) {
  return (
    <Button label={label} variant={variant} size={size} onPress={onPress} disabled={disabled} />
  );
}
