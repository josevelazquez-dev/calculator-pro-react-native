import { createContext, useContext, useReducer, useMemo, type ReactNode } from 'react';
import type { CalculatorState } from '@/domain/entities';
import { Operator } from '@/domain/entities';
import {
  evaluateBinaryOperation,
  evaluatePercentage,
  evaluateToggleSign,
  evaluateUnaryFunction,
} from '@/domain/usecases';
import { formatDisplayValue, parseDisplayValue, sanitizeDigitInput } from '@/core/utils';

type CalculatorAction =
  | { type: 'INPUT_DIGIT'; digit: string }
  | { type: 'INPUT_DECIMAL' }
  | { type: 'SET_OPERATOR'; operator: Operator }
  | { type: 'CALCULATE' }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ENTRY' }
  | { type: 'PERCENTAGE' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'MEMORY_RECALL' }
  | { type: 'MEMORY_CLEAR' }
  | { type: 'MEMORY_ADD' }
  | { type: 'MEMORY_SUBTRACT' }
  | { type: 'TOGGLE_MODE' }
  | { type: 'SCIENTIFIC_FUNCTION'; fn: string }
  | { type: 'INPUT_PAREN'; paren: '(' | ')' }
  | { type: 'INPUT_CONSTANT'; constant: 'π' | 'e' }
  | { type: 'INPUT_RANDOM' };

const initialState: CalculatorState = {
  displayValue: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  memory: 0,
  expression: '',
  error: null,
  mode: 'basic',
  openParenCount: 0,
};

function resetState(): CalculatorState {
  return { ...initialState, mode: initialState.mode };
}

function formatExpression(
  previousValue: number | null,
  operator: Operator | null,
  currentDisplay: string,
): string {
  if (previousValue === null || operator === null) return '';
  const prev = Number.isInteger(previousValue)
    ? previousValue.toString()
    : formatDisplayValue(previousValue);
  return `${prev} ${operator} ${currentDisplay}`;
}

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'INPUT_DIGIT':
      return handleInputDigit(state, action);
    case 'INPUT_DECIMAL':
      return handleInputDecimal(state);
    case 'SET_OPERATOR':
      return handleSetOperator(state, action);
    case 'CALCULATE':
      return handleCalculate(state);
    case 'CLEAR':
      return resetState();
    case 'CLEAR_ENTRY':
      return handleClearEntry(state);
    case 'PERCENTAGE':
      return handlePercentage(state);
    case 'TOGGLE_SIGN':
      return handleToggleSign(state);
    case 'MEMORY_RECALL':
      return handleMemoryRecall(state);
    case 'MEMORY_CLEAR':
      return { ...state, memory: 0 };
    case 'MEMORY_ADD':
      return {
        ...state,
        memory: state.memory + parseDisplayValue(state.displayValue),
        waitingForOperand: true,
      };
    case 'MEMORY_SUBTRACT':
      return {
        ...state,
        memory: state.memory - parseDisplayValue(state.displayValue),
        waitingForOperand: true,
      };
    case 'TOGGLE_MODE':
      return { ...state, mode: state.mode === 'basic' ? 'scientific' : 'basic' };
    case 'SCIENTIFIC_FUNCTION':
      return handleScientificFunction(state, action);
    case 'INPUT_PAREN':
      return handleInputParen(state, action);
    case 'INPUT_CONSTANT':
      return handleInputConstant(state, action);
    case 'INPUT_RANDOM':
      return handleInputRandom(state);
    default:
      return state;
  }
}

/* ─── Digit input ───────────────────────────────────── */
function handleInputDigit(state: CalculatorState, action: { digit: string }): CalculatorState {
  if (state.error) {
    return {
      ...initialState,
      displayValue: action.digit,
      expression: action.digit,
      mode: state.mode,
    };
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      displayValue: action.digit,
      expression: formatExpression(state.previousValue, state.operator, action.digit),
      waitingForOperand: false,
    };
  }

  const newDisplay = sanitizeDigitInput(state.displayValue, action.digit);
  if (newDisplay === state.displayValue) return state;

  return {
    ...state,
    displayValue: newDisplay,
    expression: formatExpression(state.previousValue, state.operator, newDisplay),
  };
}

/* ── Decimal point ──────────────────────────────────── */
function handleInputDecimal(state: CalculatorState): CalculatorState {
  if (state.error) return state;

  if (state.waitingForOperand) {
    return {
      ...state,
      displayValue: '0.',
      expression: formatExpression(state.previousValue, state.operator, '0.'),
      waitingForOperand: false,
    };
  }

  if (state.displayValue.includes('.')) return state;

  const newDisplay = state.displayValue + '.';
  return {
    ...state,
    displayValue: newDisplay,
    expression: formatExpression(state.previousValue, state.operator, newDisplay),
  };
}

/* ── Operator ───────────────────────────────────────── */
function handleSetOperator(
  state: CalculatorState,
  action: { operator: Operator },
): CalculatorState {
  if (state.error) return state;

  const currentValue = parseDisplayValue(state.displayValue);

  if (state.operator && !state.waitingForOperand && state.previousValue !== null) {
    const { result, error } = evaluateBinaryOperation(
      state.previousValue,
      currentValue,
      state.operator,
    );
    if (error) {
      return {
        ...state,
        displayValue: 'Error',
        error,
        previousValue: null,
        operator: null,
        waitingForOperand: true,
      };
    }
    const display = formatDisplayValue(result);
    return {
      ...state,
      displayValue: display,
      previousValue: result,
      operator: action.operator,
      waitingForOperand: true,
      error: null,
      expression: formatExpression(result, action.operator, ''),
    };
  }

  return {
    ...state,
    previousValue: parseDisplayValue(state.displayValue),
    operator: action.operator,
    waitingForOperand: true,
    expression: formatExpression(parseDisplayValue(state.displayValue), action.operator, ''),
  };
}

/* ── Calculate (equals) ─────────────────────────────── */
function handleCalculate(state: CalculatorState): CalculatorState {
  if (state.error) return state;
  if (state.operator === null || state.previousValue === null) return state;

  const currentValue = parseDisplayValue(state.displayValue);
  const { result, error } = evaluateBinaryOperation(
    state.previousValue,
    currentValue,
    state.operator,
  );

  if (error) {
    return {
      ...state,
      displayValue: 'Error',
      error,
      previousValue: null,
      operator: null,
      waitingForOperand: true,
      expression: `${formatDisplayValue(state.previousValue)} ${state.operator} ${currentValue} =`,
    };
  }

  const display = formatDisplayValue(result);
  return {
    ...state,
    displayValue: display,
    previousValue: result,
    operator: null,
    waitingForOperand: true,
    error: null,
    expression: `${formatDisplayValue(state.previousValue)} ${state.operator} ${currentValue} =`,
  };
}

/* ── Clear entry ────────────────────────────────────── */
function handleClearEntry(state: CalculatorState): CalculatorState {
  return {
    ...state,
    displayValue: '0',
    error: null,
    expression: formatExpression(state.previousValue, state.operator, '0'),
  };
}

/* ── Percentage ─────────────────────────────────────── */
function handlePercentage(state: CalculatorState): CalculatorState {
  if (state.error) return state;
  const currentValue = parseDisplayValue(state.displayValue);
  const { result, error } = evaluatePercentage(currentValue);
  if (error) return { ...state, displayValue: 'Error', error };
  return { ...state, displayValue: formatDisplayValue(result), error: null };
}

/* ── Toggle sign ────────────────────────────────────── */
function handleToggleSign(state: CalculatorState): CalculatorState {
  if (state.error) return state;
  const currentValue = parseDisplayValue(state.displayValue);
  const { result, error } = evaluateToggleSign(currentValue);
  if (error) return { ...state, displayValue: 'Error', error };
  return { ...state, displayValue: formatDisplayValue(result), error: null };
}

/* ── Memory ─────────────────────────────────────────── */
function handleMemoryRecall(state: CalculatorState): CalculatorState {
  return { ...state, displayValue: formatDisplayValue(state.memory), waitingForOperand: true };
}

/* ── Scientific function (unary) ────────────────────── */
function handleScientificFunction(state: CalculatorState, action: { fn: string }): CalculatorState {
  if (state.error) return state;

  const currentValue = parseDisplayValue(state.displayValue);
  const { result, error } = evaluateUnaryFunction(action.fn, currentValue);

  if (error) {
    return { ...state, displayValue: 'Error', error };
  }

  const display = formatDisplayValue(result);
  const fnLabel = action.fn;
  return {
    ...state,
    displayValue: display,
    expression: `${fnLabel}(${state.displayValue}) =`,
    waitingForOperand: true,
    error: null,
  };
}

/* ── Parentheses ────────────────────────────────────── */
function handleInputParen(state: CalculatorState, action: { paren: '(' | ')' }): CalculatorState {
  if (state.error) return state;

  if (action.paren === '(') {
    return {
      ...state,
      openParenCount: state.openParenCount + 1,
      expression: state.expression ? `${state.expression} (` : '(',
      waitingForOperand: true,
    };
  }

  if (state.openParenCount === 0) return state;

  let next = { ...state, openParenCount: state.openParenCount - 1 };

  if (state.operator && state.previousValue !== null) {
    const currentValue = parseDisplayValue(state.displayValue);
    const { result, error } = evaluateBinaryOperation(
      state.previousValue,
      currentValue,
      state.operator,
    );
    if (error) {
      return { ...next, displayValue: 'Error', error, previousValue: null, operator: null };
    }
    const display = formatDisplayValue(result);
    next = {
      ...next,
      displayValue: display,
      previousValue: result,
      operator: null,
      error: null,
    };
  }

  return {
    ...next,
    expression: `${state.expression} )`,
    waitingForOperand: true,
  };
}

/* ── Constants ──────────────────────────────────────── */
function handleInputConstant(
  state: CalculatorState,
  action: { constant: 'π' | 'e' },
): CalculatorState {
  const value = action.constant === 'π' ? Math.PI : Math.E;
  const display = formatDisplayValue(value);
  return {
    ...state,
    displayValue: display,
    expression: state.expression ? `${state.expression} ${action.constant}` : action.constant,
    waitingForOperand: true,
  };
}

/* ── Random ─────────────────────────────────────────── */
function handleInputRandom(state: CalculatorState): CalculatorState {
  const value = Math.random();
  const display = formatDisplayValue(value);
  return {
    ...state,
    displayValue: display,
    expression: 'Rand',
    waitingForOperand: true,
  };
}

/* ── Context ────────────────────────────────────────── */
interface CalculatorContextValue {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}

export function useCalculator(): CalculatorContextValue {
  const context = useContext(CalculatorContext);
  if (!context) throw new Error('useCalculator must be used within CalculatorProvider');
  return context;
}
