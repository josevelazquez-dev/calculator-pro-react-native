import {
  formatDisplayValue,
  parseDisplayValue,
  sanitizeDigitInput,
  isErrorDisplay,
  hasError,
} from '@/core/utils/math';

describe('parseDisplayValue', () => {
  it('parses a normal number string', () => {
    expect(parseDisplayValue('42')).toBe(42);
  });

  it('parses a decimal string', () => {
    expect(parseDisplayValue('3.14')).toBeCloseTo(3.14);
  });

  it('returns 0 for empty string', () => {
    expect(parseDisplayValue('')).toBe(0);
  });

  it('returns 0 for just a minus sign', () => {
    expect(parseDisplayValue('-')).toBe(0);
  });

  it('returns 0 for just a decimal', () => {
    expect(parseDisplayValue('.')).toBe(0);
  });

  it('returns NaN for Error string', () => {
    expect(parseDisplayValue('Error')).toBeNaN();
  });

  it('cleans invalid characters', () => {
    expect(parseDisplayValue('12abc34')).toBe(1234);
  });

  it('returns 0 for completely invalid strings after cleaning', () => {
    expect(parseDisplayValue('abc')).toBe(0);
  });
});

describe('formatDisplayValue', () => {
  it('formats a normal integer', () => {
    expect(formatDisplayValue(42)).toBe('42');
  });

  it('formats a decimal', () => {
    expect(formatDisplayValue(3.14)).toBe('3.14');
  });

  it('removes trailing zeros', () => {
    expect(formatDisplayValue(5)).toBe('5');
  });

  it('returns Error for NaN', () => {
    expect(formatDisplayValue(NaN)).toBe('Error');
  });

  it('returns Error for Infinity', () => {
    expect(formatDisplayValue(Infinity)).toBe('Error');
  });

  it('returns Error for -Infinity', () => {
    expect(formatDisplayValue(-Infinity)).toBe('Error');
  });

  it('uses exponential for very large numbers', () => {
    const result = formatDisplayValue(1e20);
    expect(result).toContain('e');
  });

  it('uses exponential for very small positive numbers', () => {
    const result = formatDisplayValue(1e-12);
    expect(result).toContain('e');
  });

  it('handles zero', () => {
    expect(formatDisplayValue(0)).toBe('0');
  });

  it('handles negative numbers', () => {
    expect(formatDisplayValue(-42)).toBe('-42');
  });
});

describe('sanitizeDigitInput', () => {
  it('appends digit to normal display', () => {
    expect(sanitizeDigitInput('12', '3')).toBe('123');
  });

  it('replaces leading zero', () => {
    expect(sanitizeDigitInput('0', '5')).toBe('5');
  });

  it('allows decimal after zero', () => {
    expect(sanitizeDigitInput('0', '.')).toBe('0.');
  });

  it('replaces Error display with digit', () => {
    expect(sanitizeDigitInput('Error', '5')).toBe('5');
  });

  it('rejects input beyond max length', () => {
    const longDisplay = '123456789012345';
    expect(sanitizeDigitInput(longDisplay, '9')).toBe(longDisplay);
  });
});

describe('isErrorDisplay', () => {
  it('detects Error', () => {
    expect(isErrorDisplay('Error')).toBe(true);
  });

  it('detects Infinity', () => {
    expect(isErrorDisplay('Infinity')).toBe(true);
  });

  it('detects NaN', () => {
    expect(isErrorDisplay('NaN')).toBe(true);
  });

  it('returns false for normal values', () => {
    expect(isErrorDisplay('42')).toBe(false);
  });
});

describe('hasError', () => {
  it('returns true when error is not null', () => {
    expect(hasError({ displayValue: '5', error: 'Division by zero' })).toBe(true);
  });

  it('returns true when displayValue is Error', () => {
    expect(hasError({ displayValue: 'Error', error: null })).toBe(true);
  });

  it('returns false when no error', () => {
    expect(hasError({ displayValue: '42', error: null })).toBe(false);
  });
});
