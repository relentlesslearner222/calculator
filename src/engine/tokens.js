export const TOKEN_TYPES = {
  NUM: 'NUM',
  OP: 'OP',
  FUNC: 'FUNC',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  CONST: 'CONST',
};

/**
 * @param {string} type - TOKEN_TYPES value
 * @param {string} value - string representation
 */
export function makeToken(type, value) {
  return { type, value };
}

export function isNum(token) {
  return token?.type === TOKEN_TYPES.NUM;
}

export function isOp(token) {
  return token?.type === TOKEN_TYPES.OP;
}

export function isFunc(token) {
  return token?.type === TOKEN_TYPES.FUNC;
}

export function isLParen(token) {
  return token?.type === TOKEN_TYPES.LPAREN;
}

export function isRParen(token) {
  return token?.type === TOKEN_TYPES.RPAREN;
}

export const OPERATORS = ['+', '-', '×', '÷', '^', 'mod'];
export const FUNCTIONS = [
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'log', 'ln', 'sqrt', 'abs', 'exp', 'fact',
];
export const CONSTANTS = { PI: Math.PI, E: Math.E };
