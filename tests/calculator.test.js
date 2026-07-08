const { add, subtract, multiply, divide } = require('../src/calculator');

describe('calculator', () => {
  describe('add', () => {
    test('adds two numbers', () => {
      expect(add(2, 3)).toBe(5);
    });
    test('adds negative numbers', () => {
      expect(add(-1, -2)).toBe(-3);
    });
  });

  describe('subtract', () => {
    test('subtracts two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });
    test('subtracts negative numbers', () => {
      expect(subtract(-1, -2)).toBe(1);
    });
  });

  describe('multiply', () => {
    test('multiplies two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });
    test('multiplies by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    test('divides two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });
    test('divides resulting in a decimal', () => {
      expect(divide(1, 4)).toBe(0.25);
    });
    test('divides negative numbers', () => {
      expect(divide(-9, 3)).toBe(-3);
    });
    test('throws an error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });
});
