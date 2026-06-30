import { describe, it, expect } from 'vitest';
import { formatResult, formatExpression } from '../utils/format';

describe('formatResult', () => {
  it('formats integer', () => {
    expect(formatResult(42)).toBe('42');
  });

  it('formats decimal stripping trailing zeros', () => {
    expect(formatResult(3.5)).toBe('3.5');
  });

  it('formats zero', () => {
    expect(formatResult(0)).toBe('0');
  });

  it('uses exponential for very large numbers', () => {
    const r = formatResult(1e16);
    expect(r).toMatch(/e/);
  });

  it('uses exponential for very small numbers', () => {
    const r = formatResult(0.0000001);
    expect(r).toMatch(/e/);
  });
});

describe('formatExpression', () => {
  it('replaces * with ×', () => {
    expect(formatExpression('3*4')).toBe('3×4');
  });

  it('replaces / with ÷', () => {
    expect(formatExpression('8/2')).toBe('8÷2');
  });

  it('replaces sqrt( with √(', () => {
    expect(formatExpression('sqrt(9)')).toBe('√(9)');
  });
});
