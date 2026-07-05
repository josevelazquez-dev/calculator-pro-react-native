export function formatNumber(value: number, maxDecimals = 10): string {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const str = String(value);
  if (str.includes('.') && str.split('.')[1]?.length > maxDecimals) {
    return value.toFixed(maxDecimals);
  }

  return str;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
