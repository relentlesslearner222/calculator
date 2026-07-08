import { describe, it, expect } from 'vitest';
import { add, subtract } from '../src/lib/calculator';

describe('calculator (regression)', () => {
  it('add', () => { expect(add(2, 3)).toBe(5); });
  it('subtract', () => { expect(subtract(5, 2)).toBe(3); });
});
