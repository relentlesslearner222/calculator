const { add, subtract, multiply } = require('../src/calculator');

test('add', () => { expect(add(2, 3)).toBe(5); });
test('subtract', () => { expect(subtract(5, 2)).toBe(3); });
test('multiply: 3 * 4 = 12', () => { expect(multiply(3, 4)).toBe(12); });
test('multiply: -2 * 5 = -10', () => { expect(multiply(-2, 5)).toBe(-10); });
test('multiply: 0 * 99 = 0', () => { expect(multiply(0, 99)).toBe(0); });
