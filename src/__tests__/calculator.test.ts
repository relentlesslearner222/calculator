import { evaluate, isCalcError, formatResult } from '../utils/calculator';

describe('evaluate', () => {
  // Basic arithmetic
  test('addition', () => expect(evaluate('1+2')).toBe(3));
  test('subtraction', () => expect(evaluate('5-3')).toBe(2));
  test('multiplication', () => expect(evaluate('4*3')).toBe(12));
  test('division', () => expect(evaluate('10/4')).toBe(2.5));
  test('operator precedence: * before +', () => expect(evaluate('2+3*4')).toBe(14));
  test('parentheses override precedence', () => expect(evaluate('(2+3)*4')).toBe(20));
  test('unary minus', () => expect(evaluate('-5')).toBe(-5));
  test('unary minus in expression', () => expect(evaluate('10+-3')).toBe(7));
  test('floating point', () => expect(evaluate('1.5+2.5')).toBe(4));
  test('nested parens', () => expect(evaluate('((2+3))*2')).toBe(10));
  test('power via ^', () => expect(evaluate('2^10')).toBe(1024));

  // Scientific functions
  test('sqrt(4)', () => expect(evaluate('sqrt(4)')).toBe(2));
  test('sq(5)', () => expect(evaluate('sq(5)')).toBe(25));
  test('pow(2,8)', () => expect(evaluate('pow(2,8)')).toBe(256));
  test('log(100)', () => {
    const r = evaluate('log(100)');
    expect(isCalcError(r)).toBe(false);
    expect(r as number).toBeCloseTo(2, 10);
  });
  test('ln(e constant)', () => {
    const r = evaluate('ln(e)');
    expect(isCalcError(r)).toBe(false);
    expect(r as number).toBeCloseTo(1, 10);
  });
  test('sin(0)', () => {
    const r = evaluate('sin(0)');
    expect(isCalcError(r)).toBe(false);
    expect(r as number).toBeCloseTo(0, 10);
  });
  test('cos(0)', () => {
    const r = evaluate('cos(0)');
    expect(isCalcError(r)).toBe(false);
    expect(r as number).toBeCloseTo(1, 10);
  });
  test('fact(5)', () => expect(evaluate('fact(5)')).toBe(120));
  test('inv(4)', () => expect(evaluate('inv(4)')).toBe(0.25));

  // Constants
  test('π constant', () => {
    const r = evaluate('π');
    expect(isCalcError(r)).toBe(false);
    expect(r as number).toBeCloseTo(Math.PI, 10);
  });

  // Error cases
  test('division by zero', () => {
    const r = evaluate('1/0');
    expect(isCalcError(r)).toBe(true);
    if (isCalcError(r)) expect(r.message).toMatch(/zero/i);
  });
  test('empty expression', () => {
    const r = evaluate('');
    expect(isCalcError(r)).toBe(true);
  });
  test('unknown function', () => {
    const r = evaluate('foo(1)');
    expect(isCalcError(r)).toBe(true);
  });
  test('mismatched parens', () => {
    const r = evaluate('(1+2');
    expect(isCalcError(r)).toBe(true);
  });
  test('unknown character', () => {
    const r = evaluate('1@2');
    expect(isCalcError(r)).toBe(true);
  });
});

describe('formatResult', () => {
  test('formats integer', () => expect(formatResult(42)).toBe('42'));
  test('formats float', () => expect(formatResult(3.14)).toBe('3.14'));
  test('formats error', () => {
    expect(formatResult({ error: true, message: 'oops' })).toBe('oops');
  });
  test('formats Infinity', () => expect(formatResult(Infinity)).toBe('Infinity'));
  test('formats -Infinity', () => expect(formatResult(-Infinity)).toBe('-Infinity'));
});
