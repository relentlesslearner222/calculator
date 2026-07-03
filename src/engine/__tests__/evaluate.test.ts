import { evaluateExpression, EvaluationError } from '../evaluate';

describe('evaluateExpression', () => {
  describe('basic arithmetic', () => {
    it('adds two numbers', () => {
      expect(evaluateExpression('1 + 2')).toBe('3');
    });

    it('subtracts numbers', () => {
      expect(evaluateExpression('10 - 4')).toBe('6');
    });

    it('multiplies numbers', () => {
      expect(evaluateExpression('3 * 4')).toBe('12');
    });

    it('divides numbers', () => {
      expect(evaluateExpression('10 / 4')).toBe('2.5');
    });

    it('handles decimals', () => {
      expect(evaluateExpression('1.5 + 2.5')).toBe('4');
    });

    it('handles single number', () => {
      expect(evaluateExpression('42')).toBe('42');
    });
  });

  describe('operator precedence', () => {
    it('multiplication before addition', () => {
      expect(evaluateExpression('2 + 3 * 4')).toBe('14');
    });

    it('division before subtraction', () => {
      expect(evaluateExpression('10 - 6 / 2')).toBe('7');
    });

    it('parentheses override precedence', () => {
      expect(evaluateExpression('(2 + 3) * 4')).toBe('20');
    });

    it('nested parentheses', () => {
      expect(evaluateExpression('((2 + 3) * (1 + 1))')).toBe('10');
    });
  });

  describe('division by zero', () => {
    it('throws EvaluationError for division by zero', () => {
      expect(() => evaluateExpression('5 / 0')).toThrow(EvaluationError);
      expect(() => evaluateExpression('5 / 0')).toThrow('Division by zero');
    });
  });

  describe('invalid / empty expressions', () => {
    it('throws for empty string', () => {
      expect(() => evaluateExpression('')).toThrow(EvaluationError);
    });

    it('throws for whitespace only', () => {
      expect(() => evaluateExpression('   ')).toThrow(EvaluationError);
    });

    it('throws for invalid characters', () => {
      expect(() => evaluateExpression('1 & 2')).toThrow(EvaluationError);
    });

    it('throws for incomplete expression', () => {
      expect(() => evaluateExpression('1 +')).toThrow(EvaluationError);
    });

    it('throws for missing closing parenthesis', () => {
      expect(() => evaluateExpression('(1 + 2')).toThrow(EvaluationError);
    });
  });

  describe('unary minus', () => {
    it('handles leading negative number', () => {
      expect(evaluateExpression('-3 + 5')).toBe('2');
    });
  });

  describe('precision', () => {
    it('removes floating point noise', () => {
      const result = evaluateExpression('0.1 + 0.2');
      expect(parseFloat(result)).toBeCloseTo(0.3, 10);
    });
  });
});
