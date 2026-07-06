import { TokenType, Operators, CONSTANTS } from './tokens.js';
import {
  sinDeg, cosDeg, tanDeg, asinDeg, acosDeg, atanDeg,
  sinRad, cosRad, tanRad, asinRad, acosRad, atanRad,
  log10, ln, sqrt, square, exp, abs, factorial,
} from './sciFunctions.js';

const PRECEDENCE = {
  [Operators.ADD]: 1,
  [Operators.SUB]: 1,
  [Operators.MUL]: 2,
  [Operators.DIV]: 2,
  [Operators.MOD]: 2,
  [Operators.POW]: 3,
};

const RIGHT_ASSOC = new Set([Operators.POW]);

function applyOp(op, b, a) {
  switch (op) {
    case Operators.ADD: return a + b;
    case Operators.SUB: return a - b;
    case Operators.MUL: return a * b;
    case Operators.DIV: return b === 0 ? NaN : a / b;
    case Operators.MOD: return b === 0 ? NaN : a % b;
    case Operators.POW: return Math.pow(a, b);
    default: return NaN;
  }
}

function applyFunc(name, arg, angleUnit) {
  switch (name) {
    case 'sin':   return angleUnit === 'deg' ? sinDeg(arg) : sinRad(arg);
    case 'cos':   return angleUnit === 'deg' ? cosDeg(arg) : cosRad(arg);
    case 'tan':   return angleUnit === 'deg' ? tanDeg(arg) : tanRad(arg);
    case 'asin':  return angleUnit === 'deg' ? asinDeg(arg) : asinRad(arg);
    case 'acos':  return angleUnit === 'deg' ? acosDeg(arg) : acosRad(arg);
    case 'atan':  return angleUnit === 'deg' ? atanDeg(arg) : atanRad(arg);
    case 'log':   return log10(arg);
    case 'ln':    return ln(arg);
    case 'sqrt':  return sqrt(arg);
    case 'sq':    return square(arg);
    case 'exp':   return exp(arg);
    case 'abs':   return abs(arg);
    case 'fact':  return factorial(arg);
    default: return NaN;
  }
}

/**
 * Evaluates an array of Token objects using shunting-yard algorithm.
 * Returns a number or 'Error'.
 */
export function evaluate(tokens, angleUnit = 'deg') {
  try {
    const output = [];
    const opStack = [];

    for (const token of tokens) {
      if (token.type === TokenType.NUMBER) {
        output.push(parseFloat(token.value));
      } else if (token.type === TokenType.CONSTANT) {
        const val = CONSTANTS[token.value];
        if (val === undefined) return 'Error';
        output.push(val);
      } else if (token.type === TokenType.FUNCTION) {
        opStack.push(token);
      } else if (token.type === TokenType.OPERATOR) {
        while (
          opStack.length > 0 &&
          opStack[opStack.length - 1].type === TokenType.OPERATOR &&
          (
            PRECEDENCE[opStack[opStack.length - 1].value] > PRECEDENCE[token.value] ||
            (
              PRECEDENCE[opStack[opStack.length - 1].value] === PRECEDENCE[token.value] &&
              !RIGHT_ASSOC.has(token.value)
            )
          )
        ) {
          const op = opStack.pop();
          const b = output.pop();
          const a = output.pop();
          if (a === undefined || b === undefined) return 'Error';
          output.push(applyOp(op.value, b, a));
        }
        opStack.push(token);
      } else if (token.type === TokenType.LPAREN) {
        opStack.push(token);
      } else if (token.type === TokenType.RPAREN) {
        while (
          opStack.length > 0 &&
          opStack[opStack.length - 1].type !== TokenType.LPAREN
        ) {
          const top = opStack.pop();
          if (top.type === TokenType.OPERATOR) {
            const b = output.pop();
            const a = output.pop();
            if (a === undefined || b === undefined) return 'Error';
            output.push(applyOp(top.value, b, a));
          }
        }
        if (opStack.length === 0) return 'Error'; // mismatched parens
        opStack.pop(); // remove LPAREN
        // if function is on top of stack, apply it
        if (opStack.length > 0 && opStack[opStack.length - 1].type === TokenType.FUNCTION) {
          const fn = opStack.pop();
          const arg = output.pop();
          if (arg === undefined) return 'Error';
          output.push(applyFunc(fn.value, arg, angleUnit));
        }
      }
    }

    while (opStack.length > 0) {
      const top = opStack.pop();
      if (top.type === TokenType.LPAREN || top.type === TokenType.RPAREN) return 'Error';
      if (top.type === TokenType.OPERATOR) {
        const b = output.pop();
        const a = output.pop();
        if (a === undefined || b === undefined) return 'Error';
        output.push(applyOp(top.value, b, a));
      } else if (top.type === TokenType.FUNCTION) {
        const arg = output.pop();
        if (arg === undefined) return 'Error';
        output.push(applyFunc(top.value, arg, angleUnit));
      }
    }

    if (output.length !== 1) return 'Error';
    const result = output[0];
    if (!isFinite(result) || isNaN(result)) return 'Error';
    return result;
  } catch {
    return 'Error';
  }
}

/**
 * Build a display string from tokens array.
 */
export function tokensToExpression(tokens) {
  return tokens
    .map((t) => {
      if (t.type === TokenType.CONSTANT) {
        return t.value === 'PI' ? '\u03C0' : t.value === 'E' ? 'e' : t.value;
      }
      if (t.type === TokenType.FUNCTION) {
        const names = { sin: 'sin', cos: 'cos', tan: 'tan', asin: 'sin\u207B\u00B9', acos: 'cos\u207B\u00B9', atan: 'tan\u207B\u00B9', log: 'log', ln: 'ln', sqrt: '\u221A', sq: 'x\u00B2', exp: 'exp', abs: 'abs', fact: 'n!' };
        return (names[t.value] || t.value) + '(';
      }
      if (t.type === TokenType.OPERATOR) {
        const symbols = { '*': '\u00D7', '/': '\u00F7', '+': '+', '-': '-', '%': 'mod', '^': '^' };
        return symbols[t.value] || t.value;
      }
      return t.value;
    })
    .join(' ');
}
