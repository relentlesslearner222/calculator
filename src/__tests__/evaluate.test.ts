import { describe, it, expect } from 'vitest';
import { evaluate, transformExpression } from '../utils/evaluate';

describe('transformExpression', () => {
  it('replaces π with Math.PI', () => {
    expect(transformExpression('π', 'deg')).toContain('Math.PI');
  });

  it('replaces ^ with **', () => {
    expect(transformExpression('2^3', 'deg')).toBe('2**3');
  });

  it('wraps sin with toRad in degree mode', () => {
    const t = transformExpression('sin(30)', 'deg');
    expect(t).toContain('_toRad(');
  });

  it('does not wrap sin in radian mode', () => {
    const t = transformExpression('sin(1)', 'rad');
    expect(t).toBe('Math.sin(1)');
  });

  it('replaces sqrt( with Math.sqrt(', () => {
    expect(transformExpression('sqrt(4)', 'deg')).toContain('Math.sqrt(');
  });

  it('replaces ln( with Math.log(', () => {
    expect(transformExpression('ln(1)', 'deg')).toContain('Math.log(');
  });

  it('replaces log( with Math.log10(', () => {
    expect(transformExpression('log(100)', 'deg')).toContain('Math.log10(');
  });
});

describe('evaluate — basic arithmetic', () => {
  it('adds two numbers', () => {
    const r = evaluate('1+2', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(3);
  });

  it('subtracts', () => {
    const r = evaluate('10-4', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(6);
  });

  it('multiplies', () => {
    const r = evaluate('3*4', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(12);
  });

  it('divides', () => {
    const r = evaluate('8/2', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(4);
  });

  it('handles parentheses', () => {
    const r = evaluate('(2+3)*4', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(20);
  });

  it('handles power', () => {
    const r = evaluate('2^10', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(1024);
  });

  it('returns error for division by zero', () => {
    const r = evaluate('1/0', 'deg');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/zero/i);
  });

  it('returns error for empty expression', () => {
    const r = evaluate('', 'deg');
    expect(r.ok).toBe(false);
  });

  it('returns error for syntax error', () => {
    const r = evaluate('2++3', 'deg');
    expect(r.ok).toBe(false);
  });
});

describe('evaluate — scientific functions (degree mode)', () => {
  it('sin(90) ≈ 1', () => {
    const r = evaluate('sin(90)', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(1, 10);
  });

  it('cos(0) = 1', () => {
    const r = evaluate('cos(0)', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(1, 10);
  });

  it('tan(45) ≈ 1', () => {
    const r = evaluate('tan(45)', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(1, 10);
  });

  it('sqrt(9) = 3', () => {
    const r = evaluate('sqrt(9)', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(3);
  });

  it('log(100) = 2', () => {
    const r = evaluate('log(100)', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(2, 10);
  });

  it('ln(e) ≈ 1 (using literal e)', () => {
    const r = evaluate('ln(e)', 'deg');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(1, 10);
  });
});

describe('evaluate — scientific functions (radian mode)', () => {
  it('sin(π/2) ≈ 1', () => {
    const r = evaluate('sin(π/2)', 'rad');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(1, 10);
  });

  it('cos(π) ≈ -1', () => {
    const r = evaluate('cos(π)', 'rad');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(-1, 10);
  });
});
