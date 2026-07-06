import { Operator } from '@/domain/entities';

export interface EvaluationResult {
  result: number;
  error: string | null;
}

const ERROR_MESSAGES = {
  DIVISION_BY_ZERO: 'Division by zero',
  INVALID_RESULT: 'Invalid result',
  OVERFLOW: 'Number too large',
} as const;

const MAX_SAFE_RESULT = 1e308;
const MIN_SAFE_RESULT = -1e308;

/**
 * Pure function that evaluates a binary arithmetic operation.
 * No side effects, no external dependencies.
 *
 * @param previousValue - The left operand
 * @param currentValue  - The right operand
 * @param operator      - The arithmetic operator
 *
 * @returns EvaluationResult with result number and optional error string
 *
 * Edge cases handled:
 *  - Division by zero       → error: 'Division by zero'
 *  - NaN result             → error: 'Invalid result'
 *  - Infinity result        → error: 'Invalid result'
 *  - Overflow (beyond ±1e308) → error: 'Number too large'
 */
export function evaluateBinaryOperation(
  previousValue: number,
  currentValue: number,
  operator: Operator,
): EvaluationResult {
  let result: number;

  switch (operator) {
    case Operator.Add:
      result = previousValue + currentValue;
      break;

    case Operator.Subtract:
      result = previousValue - currentValue;
      break;

    case Operator.Multiply:
      result = previousValue * currentValue;
      break;

    case Operator.Divide:
      if (currentValue === 0) {
        return { result: NaN, error: ERROR_MESSAGES.DIVISION_BY_ZERO };
      }
      result = previousValue / currentValue;
      break;

    case Operator.Power:
      result = Math.pow(previousValue, currentValue);
      break;

    case Operator.Mod:
      if (currentValue === 0) {
        return { result: NaN, error: ERROR_MESSAGES.DIVISION_BY_ZERO };
      }
      result = previousValue % currentValue;
      break;

    default:
      return { result: NaN, error: ERROR_MESSAGES.INVALID_RESULT };
  }

  return validateCalculationResult(result);
}

/**
 * Validates whether a numeric result is safe to display.
 *
 * @param value - The number to validate
 * @returns EvaluationResult with the value if valid, or an error message
 */
export function validateCalculationResult(value: number): EvaluationResult {
  if (!Number.isFinite(value)) {
    return { result: NaN, error: ERROR_MESSAGES.INVALID_RESULT };
  }

  if (Number.isNaN(value)) {
    return { result: NaN, error: ERROR_MESSAGES.INVALID_RESULT };
  }

  if (value > MAX_SAFE_RESULT || value < MIN_SAFE_RESULT) {
    return { result: NaN, error: ERROR_MESSAGES.OVERFLOW };
  }

  return { result: value, error: null };
}

/**
 * Evaluates a unary percentage operation (divide by 100).
 */
export function evaluatePercentage(value: number): EvaluationResult {
  return validateCalculationResult(value / 100);
}

/**
 * Evaluates a unary sign toggle (multiply by -1).
 */
export function evaluateToggleSign(value: number): EvaluationResult {
  return validateCalculationResult(value * -1);
}

/**
 * Evaluates a unary scientific function.
 */
export function evaluateUnaryFunction(name: string, value: number): EvaluationResult {
  const toDeg = (v: number) => (v * 180) / Math.PI;
  const fromDeg = (v: number) => (v * Math.PI) / 180;

  let result: number;

  switch (name) {
    case 'sin':
      result = Math.sin(fromDeg(value));
      break;
    case 'cos':
      result = Math.cos(fromDeg(value));
      break;
    case 'tan':
      result = Math.tan(fromDeg(value));
      break;
    case 'asin': {
      if (value < -1 || value > 1) {
        return { result: NaN, error: 'Domain error' };
      }
      result = toDeg(Math.asin(value));
      break;
    }
    case 'acos': {
      if (value < -1 || value > 1) {
        return { result: NaN, error: 'Domain error' };
      }
      result = toDeg(Math.acos(value));
      break;
    }
    case 'atan':
      result = toDeg(Math.atan(value));
      break;
    case 'sqrt': {
      if (value < 0) {
        return { result: NaN, error: 'Domain error' };
      }
      result = Math.sqrt(value);
      break;
    }
    case 'x²':
      result = value * value;
      break;
    case 'x³':
      result = value * value * value;
      break;
    case '10ˣ':
      result = Math.pow(10, value);
      break;
    case 'eˣ':
    case 'exp':
      result = Math.exp(value);
      break;
    case 'ln': {
      if (value <= 0) {
        return { result: NaN, error: 'Domain error' };
      }
      result = Math.log(value);
      break;
    }
    case 'log': {
      if (value <= 0) {
        return { result: NaN, error: 'Domain error' };
      }
      result = Math.log10(value);
      break;
    }
    case 'abs':
      result = Math.abs(value);
      break;
    case 'n!': {
      if (value < 0 || !Number.isInteger(value)) {
        return { result: NaN, error: 'Domain error' };
      }
      if (value > 170) {
        return { result: NaN, error: 'Number too large' };
      }
      result = factorial(value);
      break;
    }
    default:
      return { result: NaN, error: 'Unknown function' };
  }

  return validateCalculationResult(result);
}

function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
