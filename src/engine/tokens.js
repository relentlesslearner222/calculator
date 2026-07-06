export const TokenType = {
  NUMBER: 'NUMBER',
  OPERATOR: 'OPERATOR',
  FUNCTION: 'FUNCTION',
  CONSTANT: 'CONSTANT',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
};

export const Operators = {
  ADD: '+',
  SUB: '-',
  MUL: '*',
  DIV: '/',
  MOD: '%',
  POW: '^',
};

export const CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
};

export function makeToken(type, value) {
  return { type, value };
}

export function makeNumber(value) {
  return makeToken(TokenType.NUMBER, value);
}

export function makeOperator(op) {
  return makeToken(TokenType.OPERATOR, op);
}

export function makeFunction(name) {
  return makeToken(TokenType.FUNCTION, name);
}

export function makeConstant(name) {
  return makeToken(TokenType.CONSTANT, name);
}

export function makeLParen() {
  return makeToken(TokenType.LPAREN, '(');
}

export function makeRParen() {
  return makeToken(TokenType.RPAREN, ')');
}

export function isOperator(token) {
  return token.type === TokenType.OPERATOR;
}

export function isNumber(token) {
  return token.type === TokenType.NUMBER;
}
