export const ERROR_DISPLAY = 'Error';

const MAX_TOTAL_DIGITS = 15;
const MAX_DECIMAL_DIGITS = 10;

const ERROR_VALUES = ['Error', 'Infinity', '-Infinity', 'NaN'] as const;

/**
 * Safely converts a display string back to a number.
 * Handles edge cases like empty string, trailing decimal, invalid chars.
 */
export function parseDisplayValue(displayValue: string): number {
  if (displayValue === '' || displayValue === '-' || displayValue === '.') {
    return 0;
  }

  if (isErrorDisplay(displayValue)) {
    return NaN;
  }

  const cleaned = displayValue.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Checks if a display string represents an error state.
 */
export function isErrorDisplay(value: string): boolean {
  return (ERROR_VALUES as readonly string[]).includes(value);
}

/**
 * Checks if the calculator is in an error state.
 */
export function hasError(state: { displayValue: string; error: string | null }): boolean {
  return state.error !== null || isErrorDisplay(state.displayValue);
}

/**
 * Formats a numeric result for the calculator display.
 *
 * - NaN / Infinity → 'Error'
 * - Very large/small → exponential notation (6 decimal places)
 * - Otherwise → fixed notation with trailing zeros removed
 * - Caps total digits at 15
 *
 * @param value - The raw numeric result
 * @returns A safe display string
 */
export function formatDisplayValue(value: number): string {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return ERROR_DISPLAY;
  }

  const absValue = Math.abs(value);

  if (absValue >= 1e15 || (absValue > 0 && absValue < 1e-10)) {
    return value.toExponential(6);
  }

  const fixed = value.toFixed(MAX_DECIMAL_DIGITS);
  const trimmed = removeTrailingZeros(fixed);

  if (trimmed.length > MAX_TOTAL_DIGITS) {
    return value.toExponential(6);
  }

  return trimmed;
}

/**
 * Strips trailing zeros after the decimal point.
 * '1.5000' → '1.5', '1.0000' → '1'
 */
function removeTrailingZeros(value: string): string {
  if (!value.includes('.')) return value;

  const trimmed = value.replace(/\.?0+$/, '');
  return trimmed === '' || trimmed === '-' ? trimmed + '0' : trimmed;
}

/**
 * Limits digit input to prevent overflow.
 * Validates character count and prevents leading zeros.
 */
export function sanitizeDigitInput(currentDisplay: string, digit: string): string {
  if (currentDisplay === ERROR_DISPLAY) {
    return digit;
  }

  if (currentDisplay.length >= MAX_TOTAL_DIGITS) {
    return currentDisplay;
  }

  if (currentDisplay === '0' && digit !== '.') {
    return digit;
  }

  return currentDisplay + digit;
}
