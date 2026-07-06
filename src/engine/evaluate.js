import { TOKEN_TYPES, CONSTANTS } from './tokens.js';
import { applyFunc } from './sciFunctions.js';

/**
 * Evaluate an array of tokens using the shunting-yard algorithm.
 * Returns a number or the string 'Error'.
 *
 * @param {Array<{type: string, value: string}>} tokens
 * @param {string} angleUnit - 'deg' | 'rad'
 * @returns {number|string}
 */
export function evaluate(tokens, angleUnit = 'deg') {
  try {
    const postfix = toPostfix(tokens);
    const result = evalPostfix(postfix, angleUnit);
    if (!isFinite(result) || isNaN(result)) return 'Error';
    // Round to avoid floating-point noise (14 significant digits)
    const rounded = parseFloat(result.toPrecision(14));
    return rounded;
  } catch {
    return 'Error';
  }
}

function precedence(op) {
  if (op === '+' || op === '-') return 1;
  if (op === '×' || op === '÷' || op === 'mod') return 2;
  if (op === '^') return 3;
  return 0;
}

function isRightAssoc(op) {
  return op === '^';
}

/**
 * Convert infix token array to postfix (RPN) using shunting-yard.
 */
function toPostfix(tokens) {
  const output = [];
  const opStack = [];

  for (const token of tokens) {
    const { type, value } = token;

    if (type === TOKEN_TYPES.NUM) {
      output.push(token);
    } else if (type === TOKEN_TYPES.CONST) {
      output.push(token);
    } else if (type === TOKEN_TYPES.FUNC) {
      opStack.push(token);
    } else if (type === TOKEN_TYPES.OP) {
      // Handle unary minus: if op stack is empty or last output is not a number/rparen/const,
      // treat '-' as unary
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1];
        if (
          top.type === TOKEN_TYPES.FUNC ||
          (top.type === TOKEN_TYPES.OP &&
            (precedence(top.value) > precedence(value) ||
              (precedence(top.value) === precedence(value) && !isRightAssoc(value))) &&
            top.type !== TOKEN_TYPES.LPAREN)
        ) {
          output.push(opStack.pop());
        } else {
          break;
        }
      }
      opStack.push(token);
    } else if (type === TOKEN_TYPES.LPAREN) {
      opStack.push(token);
    } else if (type === TOKEN_TYPES.RPAREN) {
      while (opStack.length > 0 && opStack[opStack.length - 1].type !== TOKEN_TYPES.LPAREN) {
        output.push(opStack.pop());
      }
      if (opStack.length === 0) throw new Error('Mismatched parentheses');
      opStack.pop(); // remove LPAREN
      // If top of stack is a function, pop it
      if (opStack.length > 0 && opStack[opStack.length - 1].type === TOKEN_TYPES.FUNC) {
        output.push(opStack.pop());
      }
    }
  }

  while (opStack.length > 0) {
    const top = opStack.pop();
    if (top.type === TOKEN_TYPES.LPAREN || top.type === TOKEN_TYPES.RPAREN) {
      throw new Error('Mismatched parentheses');
    }
    output.push(top);
  }

  return output;
}

/**
 * Evaluate a postfix (RPN) token array.
 */
function evalPostfix(tokens, angleUnit) {
  const stack = [];

  for (const token of tokens) {
    const { type, value } = token;

    if (type === TOKEN_TYPES.NUM) {
      stack.push(parseFloat(value));
    } else if (type === TOKEN_TYPES.CONST) {
      stack.push(CONSTANTS[value] ?? NaN);
    } else if (type === TOKEN_TYPES.OP) {
      if (stack.length < 2) throw new Error('Insufficient operands');
      const b = stack.pop();
      const a = stack.pop();
      stack.push(applyOp(value, a, b));
    } else if (type === TOKEN_TYPES.FUNC) {
      if (stack.length < 1) throw new Error('Insufficient operands for function');
      const x = stack.pop();
      stack.push(applyFunc(value, x, angleUnit));
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0];
}

function applyOp(op, a, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷':
      if (b === 0) return NaN;
      return a / b;
    case '^': return Math.pow(a, b);
    case 'mod': return a % b;
    default: throw new Error(`Unknown operator: ${op}`);
  }
}
