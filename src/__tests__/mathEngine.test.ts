import { evaluate, factorial, toRad, toDeg } from '../utils/mathEngine';

describe('toRad / toDeg', () => {
  it('converts 180 degrees to π radians', () => {
    expect(toRad(180)).toBeCloseTo(Math.PI);
  });

  it('converts π radians to 180 degrees', () => {
    expect(toDeg(Math.PI)).toBeCloseTo(180);
  });

  it('round-trips: toDeg(toRad(x)) === x', () => {
    expect(toDeg(toRad(45))).toBeCloseTo(45);
  });
});

describe('factorial', () => {
  it('0! = 1', () => expect(factorial(0)).toBe(1));
  it('1! = 1', () => expect(factorial(1)).toBe(1));
  it('5! = 120', () => expect(factorial(5)).toBe(120));
  it('10! = 3628800', () => expect(factorial(10)).toBe(3628800));
  it('throws for negative integers', () => {
    expect(() => factorial(-1)).toThrow();
  });
  it('throws for non-integers', () => {
    expect(() => factorial(2.5)).toThrow();
  });
  it('throws for n > 170 (overflow)', () => {
    expect(() => factorial(171)).toThrow();
  });
});

describe('evaluate — basic arithmetic', () => {
  it('adds two numbers', () => {
    expect(evaluate('2+3', 'deg')).toBe(5);
  });

  it('subtracts', () => {
    expect(evaluate('10-4', 'deg')).toBe(6);
  });

  it('multiplies', () => {
    expect(evaluate('3*4', 'deg')).toBe(12);
  });

  it('divides', () => {
    expect(evaluate('15/3', 'deg')).toBe(5);
  });

  it('handles operator precedence (2+3*4=14)', () => {
    expect(evaluate('2+3*4', 'deg')).toBe(14);
  });

  it('handles parentheses', () => {
    expect(evaluate('(2+3)*4', 'deg')).toBe(20);
  });

  it('throws on division by zero', () => {
    expect(() => evaluate('5/0', 'deg')).toThrow('Division by zero');
  });

  it('throws on empty expression', () => {
    expect(() => evaluate('', 'deg')).toThrow('Empty expression');
  });

  it('unary minus', () => {
    expect(evaluate('-5+3', 'deg')).toBe(-2);
  });

  it('exponentiation (right-associative)', () => {
    expect(evaluate('2^3', 'deg')).toBe(8);
    expect(evaluate('2^3^2', 'deg')).toBe(512); // 2^(3^2) = 2^9
  });
});

describe('evaluate — scientific functions (degree mode)', () => {
  it('sin(0) = 0', () => {
    expect(evaluate('sin(0)', 'deg')).toBeCloseTo(0);
  });

  it('sin(90) = 1 in degrees', () => {
    expect(evaluate('sin(90)', 'deg')).toBeCloseTo(1);
  });

  it('cos(0) = 1', () => {
    expect(evaluate('cos(0)', 'deg')).toBeCloseTo(1);
  });

  it('cos(90) ≈ 0 in degrees', () => {
    expect(evaluate('cos(90)', 'deg')).toBeCloseTo(0);
  });

  it('tan(45) = 1 in degrees', () => {
    expect(evaluate('tan(45)', 'deg')).toBeCloseTo(1);
  });

  it('log(100) = 2', () => {
    expect(evaluate('log(100)', 'deg')).toBeCloseTo(2);
  });

  it('ln(e) = 1', () => {
    expect(evaluate('ln(e)', 'deg')).toBeCloseTo(1);
  });

  it('sqrt(9) = 3', () => {
    expect(evaluate('sqrt(9)', 'deg')).toBeCloseTo(3);
  });

  it('sqrt of negative throws', () => {
    expect(() => evaluate('sqrt(-1)', 'deg')).toThrow();
  });

  it('log of non-positive throws', () => {
    expect(() => evaluate('log(0)', 'deg')).toThrow();
    expect(() => evaluate('log(-1)', 'deg')).toThrow();
  });

  it('asin domain error throws', () => {
    expect(() => evaluate('asin(2)', 'deg')).toThrow();
  });
});

describe('evaluate — scientific functions (radian mode)', () => {
  it('sin(π/2) = 1 in radians', () => {
    expect(evaluate('sin(π/2)', 'rad')).toBeCloseTo(1);
  });

  it('cos(π) = -1 in radians', () => {
    expect(evaluate('cos(π)', 'rad')).toBeCloseTo(-1);
  });

  it('asin result in radians', () => {
    expect(evaluate('asin(1)', 'rad')).toBeCloseTo(Math.PI / 2);
  });

  it('asin result in degrees', () => {
    expect(evaluate('asin(1)', 'deg')).toBeCloseTo(90);
  });
});

describe('evaluate — constants', () => {
  it('π evaluates to Math.PI', () => {
    expect(evaluate('π', 'deg')).toBeCloseTo(Math.PI);
  });

  it('e evaluates to Math.E', () => {
    expect(evaluate('e', 'deg')).toBeCloseTo(Math.E);
  });

  it('2*π is correct', () => {
    expect(evaluate('2*π', 'deg')).toBeCloseTo(2 * Math.PI);
  });
});

describe('evaluate — factorial in expression', () => {
  it('5! = 120', () => {
    expect(evaluate('5!', 'deg')).toBe(120);
  });

  it('(3+2)! = 120', () => {
    expect(evaluate('(3+2)!', 'deg')).toBe(120);
  });
});
