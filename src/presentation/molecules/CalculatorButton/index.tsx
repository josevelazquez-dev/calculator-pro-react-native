import { useCalculator } from '@/presentation/providers';
import { Button } from '@/presentation/atoms';
import { Operator } from '@/domain/entities';
import type { ComponentProps } from 'react';

type ButtonVariant = 'number' | 'operator' | 'function' | 'utility';

interface CalculatorButtonProps {
  label: string;
  action: () => void;
  variant?: ButtonVariant;
  size?: 'normal' | 'double';
}

export function CalculatorButton({
  label,
  action,
  variant = 'number',
  size = 'normal',
}: CalculatorButtonProps) {
  return <Button label={label} variant={variant} size={size} onPress={action} />;
}

export function useCalculatorActions() {
  const { dispatch } = useCalculator();

  return {
    inputDigit: (digit: string) => dispatch({ type: 'INPUT_DIGIT', digit }),
    inputDecimal: () => dispatch({ type: 'INPUT_DECIMAL' }),
    setOperator: (operator: Operator) => dispatch({ type: 'SET_OPERATOR', operator }),
    calculate: () => dispatch({ type: 'CALCULATE' }),
    clear: () => dispatch({ type: 'CLEAR' }),
    clearEntry: () => dispatch({ type: 'CLEAR_ENTRY' }),
    toggleSign: () => dispatch({ type: 'TOGGLE_SIGN' }),
    percentage: () => dispatch({ type: 'PERCENTAGE' }),
  };
}
