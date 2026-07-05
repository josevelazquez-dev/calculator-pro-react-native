export enum Operator {
  Add = '+',
  Subtract = '−',
  Multiply = '×',
  Divide = '÷',
  Percent = '%',
  Equals = '=',
}

export interface CalculationEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type CalculatorState = {
  displayValue: string;
  previousValue: number | null;
  operator: Operator | null;
  waitingForOperand: boolean;
  memory: number;
  expression: string;
};
