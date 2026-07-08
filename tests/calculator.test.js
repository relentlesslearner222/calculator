const { add, subtract } = require('../src/calculator');

test('add', () => { expect(add(2, 3)).toBe(5); });
test('subtract', () => { expect(subtract(5, 2)).toBe(3); });

