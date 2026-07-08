const { add, subtract, power } = require('../src/calculator');

test('add', () => { expect(add(2, 3)).toBe(5); });
test('subtract', () => { expect(subtract(5, 2)).toBe(3); });
test('power - positive exponent', () => { expect(power(2, 3)).toBe(8); });
test('power - zero exponent',     () => { expect(power(2, 0)).toBe(1); });
test('power - negative exponent', () => { expect(power(2, -2)).toBe(0.25); });
