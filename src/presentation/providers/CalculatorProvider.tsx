import { createContext, useContext, useReducer, useMemo, type ReactNode } from 'react';
import type { CalculatorState } from '@/domain/entities';
import { Operator } from '@/domain/entities';

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
  | { type: 'MEMORY_SUBTRACT' };

const initialState: CalculatorState = {
  displayValue: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  memory: 0,
  expression: '',
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'INPUT_DIGIT': {
      if (state.waitingForOperand) {
        return {
          ...state,
          displayValue: action.digit,
          waitingForOperand: false,
          expression: state.expression + action.digit,
        };
      }
      const newValue = state.displayValue === '0' ? action.digit : state.displayValue + action.digit;
      return { ...state, displayValue: newValue, expression: state.expression + action.digit };
    }
    case 'INPUT_DECIMAL': {
      if (state.waitingForOperand) {
        return {
          ...state,
          displayValue: '0.',
          waitingForOperand: false,
          expression: state.expression + '0.',
        };
      }
      if (state.displayValue.includes('.')) return state;
      return { ...state, displayValue: state.displayValue + '.' };
    }
    case 'SET_OPERATOR': {
      if (state.operator && !state.waitingForOperand) {
        return state;
      }
      return {
        ...state,
        previousValue: parseFloat(state.displayValue),
        operator: action.operator,
        waitingForOperand: true,
        expression: state.displayValue + ' ' + action.operator + ' ',
      };
    }
    case 'CALCULATE': {
      if (!state.operator || state.previousValue === null) return state;
      const current = parseFloat(state.displayValue);
      const prev = state.previousValue;
      let result = 0;
      switch (state.operator) {
        case Operator.Add:
          result = prev + current;
          break;
        case Operator.Subtract:
          result = prev - current;
          break;
        case Operator.Multiply:
          result = prev * current;
          break;
        case Operator.Divide:
          result = current === 0 ? NaN : prev / current;
          break;
        default:
          return state;
      }
      return {
        ...state,
        displayValue: String(result),
        previousValue: result,
        operator: null,
        waitingForOperand: true,
        expression: state.expression + current + ' =',
      };
    }
    case 'CLEAR':
      return initialState;
    case 'CLEAR_ENTRY':
      return { ...state, displayValue: '0' };
    case 'TOGGLE_SIGN':
      return { ...state, displayValue: String(parseFloat(state.displayValue) * -1) };
    case 'PERCENTAGE':
      return { ...state, displayValue: String(parseFloat(state.displayValue) / 100) };
    case 'MEMORY_RECALL':
      return { ...state, displayValue: String(state.memory), waitingForOperand: true };
    case 'MEMORY_CLEAR':
      return { ...state, memory: 0 };
    case 'MEMORY_ADD':
      return { ...state, memory: state.memory + parseFloat(state.displayValue) };
    case 'MEMORY_SUBTRACT':
      return { ...state, memory: state.memory - parseFloat(state.displayValue) };
    default:
      return state;
  }
}

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
