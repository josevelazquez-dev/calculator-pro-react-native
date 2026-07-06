export { ScientificFunction } from './ScientificFunction';

export enum Operator {
  Add = '+',
  Subtract = '−',
  Multiply = '×',
  Divide = '÷',
  Percent = '%',
  Equals = '=',
  Power = 'xʸ',
  Mod = 'mod',
}

export interface CalculationEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type CalculatorMode = 'basic' | 'scientific';

/**
 * Represents the complete state of the calculator.
 */
export type CalculatorState = {
  displayValue: string;
  previousValue: number | null;
  operator: Operator | null;
  waitingForOperand: boolean;
  memory: number;
  expression: string;
  error: string | null;
  mode: CalculatorMode;
  openParenCount: number;
};
