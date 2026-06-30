import { AngleMode } from '../types/calculator';

/**
 * Convert degrees to radians.
 */
export function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Convert radians to degrees.
 */
export function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Evaluate a mathematical expression string.
 * Supports: +, -, *, /, ^, !, sqrt, log, ln, sin, cos, tan, asin, acos, atan, π, e
 * Returns the numeric result or throws on invalid input.
 */
export function evaluate(expression: string, angleMode: AngleMode): number {
  if (!expression || expression.trim() === '') {
    throw new Error('Empty expression');
  }

  // Sanitise: only allow safe characters
  const sanitised = expression
    .replace(/\s+/g, '')
    .replace(/π/g, String(Math.PI))
    .replace(/\be\b/g, String(Math.E));

  const result = parseExpression(sanitised, angleMode);

  if (!isFinite(result)) {
    throw new Error('Result is not finite');
  }

  return result;
}

// ─── Recursive-descent parser ────────────────────────────────────────────────

interface ParserState {
  input: string;
  pos: number;
  angleMode: AngleMode;
}

function parseExpression(input: string, angleMode: AngleMode): number {
  const state: ParserState = { input, pos: 0, angleMode };
  const result = parseAddSub(state);
  if (state.pos < state.input.length) {
    throw new Error(`Unexpected token at position ${state.pos}: "${state.input[state.pos]}"`);
  }
  return result;
}

function parseAddSub(state: ParserState): number {
  let left = parseMulDiv(state);
  while (state.pos < state.input.length) {
    const ch = state.input[state.pos];
    if (ch === '+') {
      state.pos++;
      left += parseMulDiv(state);
    } else if (ch === '-') {
      state.pos++;
      left -= parseMulDiv(state);
    } else {
      break;
    }
  }
  return left;
}

function parseMulDiv(state: ParserState): number {
  let left = parsePower(state);
  while (state.pos < state.input.length) {
    const ch = state.input[state.pos];
    if (ch === '*') {
      state.pos++;
      left *= parsePower(state);
    } else if (ch === '/') {
      state.pos++;
      const divisor = parsePower(state);
      if (divisor === 0) throw new Error('Division by zero');
      left /= divisor;
    } else {
      break;
    }
  }
  return left;
}

function parsePower(state: ParserState): number {
  const base = parseUnary(state);
  if (state.pos < state.input.length && state.input[state.pos] === '^') {
    state.pos++;
    const exp = parsePower(state); // right-associative
    return Math.pow(base, exp);
  }
  return base;
}

function parseUnary(state: ParserState): number {
  if (state.pos < state.input.length && state.input[state.pos] === '-') {
    state.pos++;
    return -parsePostfix(state);
  }
  if (state.pos < state.input.length && state.input[state.pos] === '+') {
    state.pos++;
  }
  return parsePostfix(state);
}

function parsePostfix(state: ParserState): number {
  let value = parsePrimary(state);
  while (state.pos < state.input.length && state.input[state.pos] === '!') {
    state.pos++;
    value = factorial(value);
  }
  return value;
}

function parsePrimary(state: ParserState): number {
  // Parenthesised expression
  if (state.input[state.pos] === '(') {
    state.pos++; // consume '('
    const value = parseAddSub(state);
    if (state.input[state.pos] !== ')') {
      throw new Error('Missing closing parenthesis');
    }
    state.pos++; // consume ')'
    return value;
  }

  // Named functions and constants
  const funcMatch = state.input.slice(state.pos).match(
    /^(sqrt|log10|log2|log|ln|sin|cos|tan|asin|acos|atan|abs|ceil|floor|round)/
  );
  if (funcMatch) {
    const funcName = funcMatch[1];
    state.pos += funcName.length;
    if (state.input[state.pos] !== '(') {
      throw new Error(`Expected '(' after function ${funcName}`);
    }
    state.pos++; // consume '('
    const arg = parseAddSub(state);
    if (state.input[state.pos] !== ')') {
      throw new Error(`Missing closing parenthesis for ${funcName}`);
    }
    state.pos++; // consume ')'
    return applyFunction(funcName, arg, state.angleMode);
  }

  // Number literal (including decimals and scientific notation)
  const numMatch = state.input.slice(state.pos).match(/^[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/);
  if (numMatch) {
    state.pos += numMatch[0].length;
    return parseFloat(numMatch[0]);
  }

  throw new Error(`Unexpected character at position ${state.pos}: "${state.input[state.pos]}"`);
}

function applyFunction(name: string, arg: number, angleMode: AngleMode): number {
  const toAngle = (x: number) => (angleMode === 'deg' ? toRad(x) : x);
  const fromAngle = (x: number) => (angleMode === 'deg' ? toDeg(x) : x);

  switch (name) {
    case 'sqrt': {
      if (arg < 0) throw new Error('Square root of negative number');
      return Math.sqrt(arg);
    }
    case 'log':
    case 'log10': {
      if (arg <= 0) throw new Error('Logarithm of non-positive number');
      return Math.log10(arg);
    }
    case 'log2': {
      if (arg <= 0) throw new Error('Logarithm of non-positive number');
      return Math.log2(arg);
    }
    case 'ln': {
      if (arg <= 0) throw new Error('Logarithm of non-positive number');
      return Math.log(arg);
    }
    case 'sin': return Math.sin(toAngle(arg));
    case 'cos': return Math.cos(toAngle(arg));
    case 'tan': return Math.tan(toAngle(arg));
    case 'asin': {
      if (arg < -1 || arg > 1) throw new Error('asin domain error');
      return fromAngle(Math.asin(arg));
    }
    case 'acos': {
      if (arg < -1 || arg > 1) throw new Error('acos domain error');
      return fromAngle(Math.acos(arg));
    }
    case 'atan': return fromAngle(Math.atan(arg));
    case 'abs': return Math.abs(arg);
    case 'ceil': return Math.ceil(arg);
    case 'floor': return Math.floor(arg);
    case 'round': return Math.round(arg);
    default: throw new Error(`Unknown function: ${name}`);
  }
}

export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('Factorial is only defined for non-negative integers');
  }
  if (n > 170) throw new Error('Factorial overflow');
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
