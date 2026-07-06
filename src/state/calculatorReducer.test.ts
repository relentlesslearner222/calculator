import { describe, it, expect } from 'vitest';
import { calculatorReducer, initialState, CalculatorState, Action } from './calculatorReducer';

// Helper to run a sequence of actions from initialState
function run(actions: Action[]): CalculatorState {
  return actions.reduce(
    (state, action) => calculatorReducer(state, action),
    initialState
  );
}

describe('calculatorReducer', () => {
  describe('CLEAR', () => {
    it('resets to initial state', () => {
      const state = run([
        { type: 'DIGIT', payload: '5' },
        { type: 'CLEAR' },
      ]);
      expect(state).toEqual(initialState);
    });
  });

  describe('DIGIT', () => {
    it('replaces leading zero with digit', () => {
      const state = run([{ type: 'DIGIT', payload: '5' }]);
      expect(state.displayValue).toBe('5');
    });

    it('appends digits', () => {
      const state = run([
        { type: 'DIGIT', payload: '1' },
        { type: 'DIGIT', payload: '2' },
        { type: 'DIGIT', payload: '3' },
      ]);
      expect(state.displayValue).toBe('123');
    });

    it('handles decimal input', () => {
      const state = run([
        { type: 'DIGIT', payload: '3' },
        { type: 'DIGIT', payload: '.' },
        { type: 'DIGIT', payload: '1' },
        { type: 'DIGIT', payload: '4' },
      ]);
      expect(state.displayValue).toBe('3.14');
    });

    it('prevents multiple decimal points', () => {
      const state = run([
        { type: 'DIGIT', payload: '1' },
        { type: 'DIGIT', payload: '.' },
        { type: 'DIGIT', payload: '.' },
        { type: 'DIGIT', payload: '5' },
      ]);
      expect(state.displayValue).toBe('1.5');
    });

    it('starts fresh after operator press', () => {
      const state = run([
        { type: 'DIGIT', payload: '5' },
        { type: 'OPERATOR', payload: '+' },
        { type: 'DIGIT', payload: '3' },
      ]);
      expect(state.displayValue).toBe('3');
    });
  });

  describe('OPERATOR', () => {
    it('stores pendingOperand and operator', () => {
      const state = run([
        { type: 'DIGIT', payload: '7' },
        { type: 'OPERATOR', payload: '+' },
      ]);
      expect(state.pendingOperand).toBe(7);
      expect(state.operator).toBe('+');
      expect(state.awaitingOperand).toBe(true);
    });

    it('evaluates chained operations', () => {
      // 3 + 4 * → should compute 3+4=7 first, then await * operand
      const state = run([
        { type: 'DIGIT', payload: '3' },
        { type: 'OPERATOR', payload: '+' },
        { type: 'DIGIT', payload: '4' },
        { type: 'OPERATOR', payload: '*' },
      ]);
      expect(state.displayValue).toBe('7');
      expect(state.pendingOperand).toBe(7);
      expect(state.operator).toBe('*');
    });
  });

  describe('EQUALS', () => {
    it('computes addition', () => {
      const state = run([
        { type: 'DIGIT', payload: '5' },
        { type: 'OPERATOR', payload: '+' },
        { type: 'DIGIT', payload: '3' },
        { type: 'EQUALS' },
      ]);
      expect(state.displayValue).toBe('8');
      expect(state.operator).toBeNull();
      expect(state.pendingOperand).toBeNull();
    });

    it('computes subtraction', () => {
      const state = run([
        { type: 'DIGIT', payload: '1' },
        { type: 'DIGIT', payload: '0' },
        { type: 'OPERATOR', payload: '-' },
        { type: 'DIGIT', payload: '3' },
        { type: 'EQUALS' },
      ]);
      expect(state.displayValue).toBe('7');
    });

    it('computes multiplication', () => {
      const state = run([
        { type: 'DIGIT', payload: '6' },
        { type: 'OPERATOR', payload: '*' },
        { type: 'DIGIT', payload: '7' },
        { type: 'EQUALS' },
      ]);
      expect(state.displayValue).toBe('42');
    });

    it('computes division', () => {
      const state = run([
        { type: 'DIGIT', payload: '9' },
        { type: 'DIGIT', payload: '9' },
        { type: 'OPERATOR', payload: '/' },
        { type: 'DIGIT', payload: '9' },
        { type: 'EQUALS' },
      ]);
      expect(state.displayValue).toBe('11');
    });

    it('does nothing without an operator', () => {
      const state = run([
        { type: 'DIGIT', payload: '5' },
        { type: 'EQUALS' },
      ]);
      expect(state.displayValue).toBe('5');
    });
  });

  describe('PERCENT', () => {
    it('standalone: divides by 100 (50% = 0.5)', () => {
      const state = run([
        { type: 'DIGIT', payload: '5' },
        { type: 'DIGIT', payload: '0' },
        { type: 'PERCENT' },
      ]);
      expect(state.displayValue).toBe('0.5');
    });

    it('additive +: 200 + 10% = 220', () => {
      const state = run([
        { type: 'DIGIT', payload: '2' },
        { type: 'DIGIT', payload: '0' },
        { type: 'DIGIT', payload: '0' },
        { type: 'OPERATOR', payload: '+' },
        { type: 'DIGIT', payload: '1' },
        { type: 'DIGIT', payload: '0' },
        { type: 'PERCENT' },
        { type: 'EQUALS' },
      ]);
      expect(state.displayValue).toBe('220');
    });

    it('additive -: 200 - 10% = 180', () => {
      const state = run([
        { type: 'DIGIT', payload: '2' },
        { type: 'DIGIT', payload: '0' },
        { type: 'DIGIT', payload: '0' },
        { type: 'OPERATOR', payload: '-' },
        { type: 'DIGIT', payload: '1' },
        { type: 'DIGIT', payload: '0' },
        { type: 'PERCENT' },
        { type: 'EQUALS' },
      ]);
      expect(state.displayValue).toBe('180');
    });

    it('multiplicative *: 200 * 20% = 40', () => {
      const state = run([
        { type: 'DIGIT', payload: '2' },
        { type: 'DIGIT', payload: '0' },
        { type: 'DIGIT', payload: '0' },
        { type: 'OPERATOR', payload: '*' },
        { type: 'DIGIT', payload: '2' },
        { type: 'DIGIT', payload: '0' },
        { type: 'PERCENT' },
        { type: 'EQUALS' },
      ]);
      expect(state.displayValue).toBe('40');
    });

    it('multiplicative /: 200 / 20% = 1000', () => {
      const state = run([
        { type: 'DIGIT', payload: '2' },
        { type: 'DIGIT', payload: '0' },
        { type: 'DIGIT', payload: '0' },
        { type: 'OPERATOR', payload: '/' },
        { type: 'DIGIT', payload: '2' },
        { type: 'DIGIT', payload: '0' },
        { type: 'PERCENT' },
        { type: 'EQUALS' },
      ]);
      expect(state.displayValue).toBe('1000');
    });
  });
});
