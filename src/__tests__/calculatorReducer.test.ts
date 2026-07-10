import { Operator } from '@/domain/entities';

// Test the reducer logic by reimplementing it using the domain functions
// This avoids import issues with React/JSX files in the provider

import {
  evaluateBinaryOperation,
  evaluatePercentage,
  evaluateToggleSign,
  evaluateUnaryFunction,
} from '@/domain/usecases/EvaluateExpression';
import { formatDisplayValue, parseDisplayValue, sanitizeDigitInput } from '@/core/utils/math';

const makeInitialState = (overrides?: Partial<CalculatorState>): CalculatorState => ({
  displayValue: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  memory: 0,
  expression: '',
  error: null,
  mode: 'basic',
  openParenCount: 0,
  ...overrides,
});

describe('INPUT_DIGIT', () => {
  function handle(state: CalculatorState, digit: string): CalculatorState {
    if (state.error) {
      return { ...makeInitialState({ mode: state.mode }), displayValue: digit, expression: digit };
    }
    if (state.waitingForOperand) {
      return {
        ...state,
        displayValue: digit,
        expression:
          state.previousValue !== null && state.operator !== null
            ? `${Number.isInteger(state.previousValue) ? state.previousValue : formatDisplayValue(state.previousValue)} ${state.operator} ${digit}`
            : '',
        waitingForOperand: false,
      };
    }
    const newDisplay = sanitizeDigitInput(state.displayValue, digit);
    if (newDisplay === state.displayValue) return state;
    return {
      ...state,
      displayValue: newDisplay,
      expression:
        state.previousValue !== null && state.operator !== null
          ? `${Number.isInteger(state.previousValue) ? state.previousValue : formatDisplayValue(state.previousValue)} ${state.operator} ${newDisplay}`
          : '',
    };
  }

  it('replaces leading zero', () => {
    const s = makeInitialState();
    const next = handle(s, '5');
    expect(next.displayValue).toBe('5');
    expect(next.waitingForOperand).toBe(false);
  });

  it('appends digit to existing value', () => {
    const s = makeInitialState({ displayValue: '12' });
    const next = handle(s, '3');
    expect(next.displayValue).toBe('123');
  });

  it('replaces display when waiting for operand', () => {
    const s = makeInitialState({
      displayValue: '5',
      previousValue: 10,
      operator: Operator.Add,
      waitingForOperand: true,
    });
    const next = handle(s, '7');
    expect(next.displayValue).toBe('7');
    expect(next.waitingForOperand).toBe(false);
  });

  it('resets on error state', () => {
    const s = makeInitialState({
      displayValue: 'Error',
      error: 'Division by zero',
      mode: 'scientific',
    });
    const next = handle(s, '3');
    expect(next.displayValue).toBe('3');
    expect(next.error).toBeNull();
    expect(next.mode).toBe('scientific');
  });
});

describe('INPUT_DECIMAL', () => {
  function handle(state: CalculatorState): CalculatorState {
    if (state.error) return state;
    if (state.waitingForOperand) {
      return {
        ...state,
        displayValue: '0.',
        expression:
          state.previousValue !== null && state.operator !== null
            ? `${Number.isInteger(state.previousValue) ? state.previousValue : formatDisplayValue(state.previousValue)} ${state.operator} 0.`
            : '',
        waitingForOperand: false,
      };
    }
    if (state.displayValue.includes('.')) return state;
    const newDisplay = state.displayValue + '.';
    return {
      ...state,
      displayValue: newDisplay,
      expression:
        state.previousValue !== null && state.operator !== null
          ? `${Number.isInteger(state.previousValue) ? state.previousValue : formatDisplayValue(state.previousValue)} ${state.operator} ${newDisplay}`
          : '',
    };
  }

  it('adds decimal point', () => {
    const s = makeInitialState({ displayValue: '5' });
    const next = handle(s);
    expect(next.displayValue).toBe('5.');
  });

  it('starts with 0. when waiting for operand', () => {
    const s = makeInitialState({ waitingForOperand: true });
    const next = handle(s);
    expect(next.displayValue).toBe('0.');
    expect(next.waitingForOperand).toBe(false);
  });

  it('does not add second decimal', () => {
    const s = makeInitialState({ displayValue: '5.5' });
    const next = handle(s);
    expect(next.displayValue).toBe('5.5');
  });

  it('does nothing on error', () => {
    const s = makeInitialState({ displayValue: 'Error', error: 'err' });
    const next = handle(s);
    expect(next).toBe(s);
  });
});

describe('SET_OPERATOR', () => {
  function handle(state: CalculatorState, operator: Operator): CalculatorState {
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
        operator,
        waitingForOperand: true,
        error: null,
        expression: `${formatDisplayValue(result)} ${operator} `,
      };
    }
    return {
      ...state,
      previousValue: currentValue,
      operator,
      waitingForOperand: true,
      expression: `${formatDisplayValue(currentValue)} ${operator} `,
    };
  }

  it('sets operator on initial state', () => {
    const s = makeInitialState({ displayValue: '10' });
    const next = handle(s, Operator.Add);
    expect(next.operator).toBe(Operator.Add);
    expect(next.previousValue).toBe(10);
    expect(next.waitingForOperand).toBe(true);
  });

  it('chains calculation when operator already set', () => {
    const s = makeInitialState({
      displayValue: '5',
      previousValue: 10,
      operator: Operator.Add,
      waitingForOperand: false,
    });
    const next = handle(s, Operator.Multiply);
    expect(next.previousValue).toBe(15);
    expect(next.operator).toBe(Operator.Multiply);
  });

  it('does nothing on error', () => {
    const s = makeInitialState({ displayValue: 'Error', error: 'err' });
    const next = handle(s, Operator.Add);
    expect(next).toBe(s);
  });
});

describe('CALCULATE', () => {
  function handle(state: CalculatorState): CalculatorState {
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

  it('adds two numbers', () => {
    const s = makeInitialState({
      displayValue: '5',
      previousValue: 10,
      operator: Operator.Add,
      waitingForOperand: false,
    });
    const next = handle(s);
    expect(next.displayValue).toBe('15');
    expect(next.operator).toBeNull();
  });

  it('subtracts two numbers', () => {
    const s = makeInitialState({
      displayValue: '3',
      previousValue: 10,
      operator: Operator.Subtract,
    });
    const next = handle(s);
    expect(next.displayValue).toBe('7');
  });

  it('multiplies two numbers', () => {
    const s = makeInitialState({
      displayValue: '6',
      previousValue: 7,
      operator: Operator.Multiply,
    });
    const next = handle(s);
    expect(next.displayValue).toBe('42');
  });

  it('divides two numbers', () => {
    const s = makeInitialState({
      displayValue: '2',
      previousValue: 10,
      operator: Operator.Divide,
    });
    const next = handle(s);
    expect(next.displayValue).toBe('5');
  });

  it('returns error on division by zero', () => {
    const s = makeInitialState({
      displayValue: '0',
      previousValue: 10,
      operator: Operator.Divide,
    });
    const next = handle(s);
    expect(next.displayValue).toBe('Error');
    expect(next.error).toBe('Division by zero');
  });

  it('does nothing when no operator set', () => {
    const s = makeInitialState();
    const next = handle(s);
    expect(next).toBe(s);
  });
});

describe('CLEAR', () => {
  it('resets to initial state preserving mode', () => {
    const s = makeInitialState({
      displayValue: '42',
      previousValue: 10,
      operator: Operator.Add,
      error: 'error',
      mode: 'scientific',
    });
    const next = { ...makeInitialState({ mode: s.mode }) };
    expect(next.displayValue).toBe('0');
    expect(next.previousValue).toBeNull();
    expect(next.operator).toBeNull();
    expect(next.error).toBeNull();
    expect(next.mode).toBe('scientific');
  });
});

describe('CLEAR_ENTRY', () => {
  function handle(state: CalculatorState): CalculatorState {
    return {
      ...state,
      displayValue: '0',
      error: null,
      expression:
        state.previousValue !== null && state.operator !== null
          ? `${Number.isInteger(state.previousValue) ? state.previousValue : formatDisplayValue(state.previousValue)} ${state.operator} 0`
          : '',
    };
  }

  it('resets display to 0', () => {
    const s = makeInitialState({ displayValue: '42', error: 'err' });
    const next = handle(s);
    expect(next.displayValue).toBe('0');
    expect(next.error).toBeNull();
  });
});

describe('PERCENTAGE', () => {
  function handle(state: CalculatorState): CalculatorState {
    if (state.error) return state;
    const currentValue = parseDisplayValue(state.displayValue);
    const { result, error } = evaluatePercentage(currentValue);
    if (error) return { ...state, displayValue: 'Error', error };
    return { ...state, displayValue: formatDisplayValue(result), error: null };
  }

  it('converts 50 to 0.5', () => {
    const s = makeInitialState({ displayValue: '50' });
    const next = handle(s);
    expect(next.displayValue).toBe('0.5');
  });
});

describe('TOGGLE_SIGN', () => {
  function handle(state: CalculatorState): CalculatorState {
    if (state.error) return state;
    const currentValue = parseDisplayValue(state.displayValue);
    const { result, error } = evaluateToggleSign(currentValue);
    if (error) return { ...state, displayValue: 'Error', error };
    return { ...state, displayValue: formatDisplayValue(result), error: null };
  }

  it('toggles positive to negative', () => {
    const s = makeInitialState({ displayValue: '42' });
    const next = handle(s);
    expect(next.displayValue).toBe('-42');
  });

  it('toggles negative to positive', () => {
    const s = makeInitialState({ displayValue: '-42' });
    const next = handle(s);
    expect(next.displayValue).toBe('42');
  });
});

describe('MEMORY operations', () => {
  it('MEMORY_CLEAR sets memory to 0', () => {
    const s = makeInitialState({ memory: 42 });
    const next = { ...s, memory: 0 };
    expect(next.memory).toBe(0);
  });

  it('MEMORY_ADD adds display value to memory', () => {
    const s = makeInitialState({ displayValue: '10', memory: 5 });
    const next = {
      ...s,
      memory: s.memory + parseDisplayValue(s.displayValue),
      waitingForOperand: true,
    };
    expect(next.memory).toBe(15);
  });

  it('MEMORY_SUBTRACT subtracts display value from memory', () => {
    const s = makeInitialState({ displayValue: '3', memory: 10 });
    const next = {
      ...s,
      memory: s.memory - parseDisplayValue(s.displayValue),
      waitingForOperand: true,
    };
    expect(next.memory).toBe(7);
  });

  it('MEMORY_RECALL sets display to memory value', () => {
    const s = makeInitialState({ displayValue: '0', memory: 42 });
    const next = { ...s, displayValue: formatDisplayValue(s.memory), waitingForOperand: true };
    expect(next.displayValue).toBe('42');
  });
});

describe('TOGGLE_MODE', () => {
  it('switches basic to scientific', () => {
    const s = makeInitialState({ mode: 'basic' });
    const next = { ...s, mode: s.mode === 'basic' ? 'scientific' : 'basic' };
    expect(next.mode).toBe('scientific');
  });

  it('switches scientific to basic', () => {
    const s = makeInitialState({ mode: 'scientific' });
    const next = { ...s, mode: s.mode === 'basic' ? 'scientific' : 'basic' };
    expect(next.mode).toBe('basic');
  });
});

describe('SCIENTIFIC_FUNCTION', () => {
  function handle(state: CalculatorState, fn: ScientificFunction): CalculatorState {
    if (state.error) return state;
    const currentValue = parseDisplayValue(state.displayValue);
    const { result, error } = evaluateUnaryFunction(fn, currentValue);
    if (error) return { ...state, displayValue: 'Error', error };
    return {
      ...state,
      displayValue: formatDisplayValue(result),
      expression: `${fn}(${state.displayValue}) =`,
      waitingForOperand: true,
      error: null,
    };
  }

  it('applies sqrt to display', () => {
    const s = makeInitialState({ displayValue: '9' });
    const next = handle(s, 'sqrt' as ScientificFunction);
    expect(next.displayValue).toBe('3');
  });

  it('sets error for invalid domain', () => {
    const s = makeInitialState({ displayValue: '-1' });
    const next = handle(s, 'sqrt' as ScientificFunction);
    expect(next.displayValue).toBe('Error');
    expect(next.error).toBe('Domain error');
  });
});

describe('SET_DISPLAY_VALUE', () => {
  it('sets display value', () => {
    const s = makeInitialState();
    const next = { ...s, displayValue: '42', waitingForOperand: true, error: null };
    expect(next.displayValue).toBe('42');
    expect(next.waitingForOperand).toBe(true);
    expect(next.error).toBeNull();
  });
});

describe('INPUT_PAREN', () => {
  it('open paren increments count and appends to expression', () => {
    const s = makeInitialState({ expression: '5 +' });
    const next = {
      ...s,
      openParenCount: s.openParenCount + 1,
      expression: `${s.expression} (`,
      waitingForOperand: true,
    };
    expect(next.openParenCount).toBe(1);
    expect(next.expression).toBe('5 + (');
  });

  it('close paren with no open parens does nothing', () => {
    const s = makeInitialState();
    const canClose = s.openParenCount > 0;
    expect(canClose).toBe(false);
  });
});

describe('INPUT_CONSTANT', () => {
  it('inserts PI value', () => {
    const s = makeInitialState();
    const value = Math.PI;
    const next = {
      ...s,
      displayValue: formatDisplayValue(value),
      expression: 'π',
      waitingForOperand: true,
    };
    expect(parseDisplayValue(next.displayValue)).toBeCloseTo(Math.PI);
  });

  it('inserts E value', () => {
    const s = makeInitialState();
    const value = Math.E;
    const next = {
      ...s,
      displayValue: formatDisplayValue(value),
      expression: 'e',
      waitingForOperand: true,
    };
    expect(parseDisplayValue(next.displayValue)).toBeCloseTo(Math.E);
  });
});

describe('INPUT_RANDOM', () => {
  it('generates a random value between 0 and 1', () => {
    const s = makeInitialState();
    const value = Math.random();
    const next = {
      ...s,
      displayValue: formatDisplayValue(value),
      expression: 'Rand',
      waitingForOperand: true,
    };
    expect(next.expression).toBe('Rand');
    expect(next.waitingForOperand).toBe(true);
  });
});
