import {
  evaluateBinaryOperation,
  evaluatePercentage,
  evaluateToggleSign,
  evaluateUnaryFunction,
  validateCalculationResult,
} from '@/domain/usecases/EvaluateExpression';
import { Operator, ScientificFunction } from '@/domain/entities';

describe('validateCalculationResult', () => {
  it('returns valid result for finite numbers', () => {
    expect(validateCalculationResult(42)).toEqual({ result: 42, error: null });
    expect(validateCalculationResult(0)).toEqual({ result: 0, error: null });
    expect(validateCalculationResult(-3.14)).toEqual({ result: -3.14, error: null });
  });

  it('returns error for Infinity', () => {
    const r = validateCalculationResult(Infinity);
    expect(r.error).toBe('Number too large');
    expect(r.result).toBeNaN();
  });

  it('returns error for -Infinity', () => {
    const r = validateCalculationResult(-Infinity);
    expect(r.error).toBe('Number too large');
    expect(r.result).toBeNaN();
  });

  it('returns error for NaN', () => {
    const r = validateCalculationResult(NaN);
    expect(r.error).toBe('Invalid result');
    expect(r.result).toBeNaN();
  });
});

describe('evaluateBinaryOperation', () => {
  it('adds two numbers', () => {
    const r = evaluateBinaryOperation(10, 5, Operator.Add);
    expect(r).toEqual({ result: 15, error: null });
  });

  it('subtracts two numbers', () => {
    const r = evaluateBinaryOperation(10, 5, Operator.Subtract);
    expect(r).toEqual({ result: 5, error: null });
  });

  it('multiplies two numbers', () => {
    const r = evaluateBinaryOperation(10, 5, Operator.Multiply);
    expect(r).toEqual({ result: 50, error: null });
  });

  it('divides two numbers', () => {
    const r = evaluateBinaryOperation(10, 5, Operator.Divide);
    expect(r).toEqual({ result: 2, error: null });
  });

  it('returns error on division by zero', () => {
    const r = evaluateBinaryOperation(10, 0, Operator.Divide);
    expect(r.error).toBe('Division by zero');
    expect(r.result).toBeNaN();
  });

  it('computes power', () => {
    const r = evaluateBinaryOperation(2, 3, Operator.Power);
    expect(r).toEqual({ result: 8, error: null });
  });

  it('computes modulo', () => {
    const r = evaluateBinaryOperation(10, 3, Operator.Mod);
    expect(r).toEqual({ result: 1, error: null });
  });

  it('returns error on modulo by zero', () => {
    const r = evaluateBinaryOperation(10, 0, Operator.Mod);
    expect(r.error).toBe('Division by zero');
  });

  it('returns error for unknown operator', () => {
    const r = evaluateBinaryOperation(1, 1, '%' as Operator);
    expect(r.error).toBe('Invalid result');
  });
});

describe('evaluatePercentage', () => {
  it('divides value by 100', () => {
    const r = evaluatePercentage(50);
    expect(r).toEqual({ result: 0.5, error: null });
  });

  it('handles zero', () => {
    const r = evaluatePercentage(0);
    expect(r).toEqual({ result: 0, error: null });
  });
});

describe('evaluateToggleSign', () => {
  it('negates a positive number', () => {
    const r = evaluateToggleSign(42);
    expect(r).toEqual({ result: -42, error: null });
  });

  it('negates a negative number', () => {
    const r = evaluateToggleSign(-42);
    expect(r).toEqual({ result: 42, error: null });
  });
});

describe('evaluateUnaryFunction', () => {
  describe('trigonometric functions', () => {
    it('sin(0) = 0', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Sin, 0);
      expect(r.result).toBeCloseTo(0);
      expect(r.error).toBeNull();
    });

    it('sin(90) = 1', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Sin, 90);
      expect(r.result).toBeCloseTo(1);
    });

    it('cos(0) = 1', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Cos, 0);
      expect(r.result).toBeCloseTo(1);
    });

    it('tan(45) = 1', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Tan, 45);
      expect(r.result).toBeCloseTo(1);
    });

    it('asin(1) = 90', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Asin, 1);
      expect(r.result).toBeCloseTo(90);
    });

    it('asin domain error for value > 1', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Asin, 2);
      expect(r.error).toBe('Domain error');
    });

    it('acos(1) = 0', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Acos, 1);
      expect(r.result).toBeCloseTo(0);
    });

    it('acos domain error for value > 1', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Acos, 2);
      expect(r.error).toBe('Domain error');
    });

    it('atan(0) = 0', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Atan, 0);
      expect(r.result).toBeCloseTo(0);
    });
  });

  describe('power and root functions', () => {
    it('sqrt(4) = 2', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Sqrt, 4);
      expect(r).toEqual({ result: 2, error: null });
    });

    it('sqrt domain error for negative', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Sqrt, -1);
      expect(r.error).toBe('Domain error');
    });

    it('x² = square', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Square, 5);
      expect(r).toEqual({ result: 25, error: null });
    });

    it('x³ = cube', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Cube, 3);
      expect(r).toEqual({ result: 27, error: null });
    });

    it('10ˣ computes power of 10', () => {
      const r = evaluateUnaryFunction(ScientificFunction.TenPower, 2);
      expect(r).toEqual({ result: 100, error: null });
    });
  });

  describe('logarithmic functions', () => {
    it('ln(e) = 1', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Ln, Math.E);
      expect(r.result).toBeCloseTo(1);
    });

    it('ln domain error for <= 0', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Ln, 0);
      expect(r.error).toBe('Domain error');
    });

    it('log(100) = 2', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Log, 100);
      expect(r.result).toBeCloseTo(2);
    });

    it('log domain error for <= 0', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Log, -1);
      expect(r.error).toBe('Domain error');
    });
  });

  describe('exponential functions', () => {
    it('eˣ = exp(x)', () => {
      const r1 = evaluateUnaryFunction(ScientificFunction.Exp, 1);
      expect(r1.result).toBeCloseTo(Math.E);
    });

    it('exp alias also works', () => {
      const r = evaluateUnaryFunction(ScientificFunction.InvExp, 1);
      expect(r.result).toBeCloseTo(Math.E);
    });
  });

  describe('other functions', () => {
    it('abs(-5) = 5', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Abs, -5);
      expect(r).toEqual({ result: 5, error: null });
    });

    it('n! for small integer', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Factorial, 5);
      expect(r).toEqual({ result: 120, error: null });
    });

    it('n! domain error for negative', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Factorial, -1);
      expect(r.error).toBe('Domain error');
    });

    it('n! domain error for non-integer', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Factorial, 2.5);
      expect(r.error).toBe('Domain error');
    });

    it('n! number too large for > 170', () => {
      const r = evaluateUnaryFunction(ScientificFunction.Factorial, 171);
      expect(r.error).toBe('Number too large');
    });
  });
});
