/**
 * Format a number for display in the calculator result area.
 * Rules:
 *  - Up to MAX_DISPLAY_DIGITS significant digits
 *  - Switch to exponential notation when |value| >= 1e15 or (|value| < 1e-6 and value ≠ 0)
 *  - Strip trailing zeros after decimal
 *  - Show up to 10 decimal places for ordinary numbers
 */

const MAX_SIG_DIGITS = 12;

export function formatResult(value: number): string {
  if (!isFinite(value)) return value > 0 ? '∞' : '-∞';
  if (value === 0) return '0';

  const abs = Math.abs(value);

  if (abs >= 1e15 || (abs < 1e-6 && abs > 0)) {
    // Exponential notation
    let s = value.toExponential(MAX_SIG_DIGITS - 1);
    // Remove trailing zeros in the mantissa
    s = s.replace(/(\.[0-9]*?)0+(e)/, '$1$2').replace(/\.e/, 'e');
    return s;
  }

  // Fixed notation with up to 10 decimal places
  let s = value.toPrecision(MAX_SIG_DIGITS);
  // toPrecision may produce exponential for large numbers — convert back
  if (s.includes('e')) {
    return value.toExponential(MAX_SIG_DIGITS - 1);
  }
  // Remove trailing zeros
  if (s.includes('.')) {
    s = s.replace(/0+$/, '').replace(/\.$/, '');
  }
  return s;
}

export function formatExpression(expr: string): string {
  // Replace internal tokens with display-friendly versions
  return expr
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/sqrt\(/g, '√(')
    .replace(/asin\(/g, 'sin⁻¹(')
    .replace(/acos\(/g, 'cos⁻¹(')
    .replace(/atan\(/g, 'tan⁻¹(');
}
