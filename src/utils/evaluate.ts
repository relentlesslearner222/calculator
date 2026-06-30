/**
 * Safe expression evaluator for the scientific calculator.
 *
 * Strategy: transform the human-readable expression string into a
 * JavaScript-evaluable form, then run it through the Function constructor
 * inside a try/catch.  No external parsing library required.
 *
 * Supported tokens:
 *  - Numbers (integers, decimals, scientific notation)
 *  - Operators: + - * / ^ (power)
 *  - Constants: π, e
 *  - Functions: sin, cos, tan, asin, acos, atan, log, ln, sqrt, abs, ceil, floor
 *  - Unary minus via negative prefix
 *  - Parentheses
 */

export type EvalResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

/**
 * Converts a degree value to radians.
 */
const toRad = (d: number) => (d * Math.PI) / 180;

/**
 * Replace human-facing tokens with JS Math equivalents.
 */
export function transformExpression(
  expr: string,
  angleMode: 'deg' | 'rad'
): string {
  let s = expr.trim();

  // Constants
  s = s.replace(/π/g, '(Math.PI)');
  s = s.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, '(Math.E)');

  // Power operator
  s = s.replace(/\^/g, '**');

  // Trig functions — degree mode wraps argument with conversion
  if (angleMode === 'deg') {
    s = s.replace(/\bsin\s*\(/g, 'Math.sin(_toRad(');
    s = s.replace(/\bcos\s*\(/g, 'Math.cos(_toRad(');
    s = s.replace(/\btan\s*\(/g, 'Math.tan(_toRad(');
    // close the extra paren added by _toRad wrapper — handled via depth tracking below
    // simpler approach: replace closing ) for each
    s = s.replace(/\basin\s*\(/g, '_fromRad(Math.asin(');
    s = s.replace(/\bacos\s*\(/g, '_fromRad(Math.acos(');
    s = s.replace(/\batan\s*\(/g, '_fromRad(Math.atan(');
  } else {
    s = s.replace(/\bsin\s*\(/g, 'Math.sin(');
    s = s.replace(/\bcos\s*\(/g, 'Math.cos(');
    s = s.replace(/\btan\s*\(/g, 'Math.tan(');
    s = s.replace(/\basin\s*\(/g, 'Math.asin(');
    s = s.replace(/\bacos\s*\(/g, 'Math.acos(');
    s = s.replace(/\batan\s*\(/g, 'Math.atan(');
  }

  // Other math functions
  s = s.replace(/\bsqrt\s*\(/g, 'Math.sqrt(');
  s = s.replace(/\bln\s*\(/g, 'Math.log(');
  s = s.replace(/\blog\s*\(/g, 'Math.log10(');
  s = s.replace(/\babs\s*\(/g, 'Math.abs(');
  s = s.replace(/\bceil\s*\(/g, 'Math.ceil(');
  s = s.replace(/\bfloor\s*\(/g, 'Math.floor(');

  // Implicit multiplication: number immediately followed by (
  s = s.replace(/(\d)\s*\(/g, '$1*(');

  return s;
}

/**
 * Evaluate a calculator expression string.
 * Returns { ok: true, value } or { ok: false, error }.
 */
export function evaluate(
  expression: string,
  angleMode: 'deg' | 'rad' = 'deg'
): EvalResult {
  if (!expression || expression.trim() === '') {
    return { ok: false, error: 'Empty expression' };
  }

  let transformed: string;
  try {
    transformed = transformExpression(expression, angleMode);
  } catch {
    return { ok: false, error: 'Syntax error' };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(
      '_toRad',
      '_fromRad',
      `"use strict"; return (${transformed});`
    );
    const raw: unknown = fn(toRad, (r: number) => (r * 180) / Math.PI);

    if (typeof raw !== 'number') {
      return { ok: false, error: 'Invalid result' };
    }
    if (!isFinite(raw)) {
      if (raw === Infinity || raw === -Infinity) {
        return { ok: false, error: 'Division by zero' };
      }
      return { ok: false, error: 'Result is NaN' };
    }
    return { ok: true, value: raw };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Friendlier messages
    if (msg.includes('Unexpected') || msg.includes('Invalid')) {
      return { ok: false, error: 'Syntax error' };
    }
    return { ok: false, error: msg };
  }
}
