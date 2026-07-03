import { calculatorReducer, initialState } from '../hooks/calculatorReducer';
import { CalculatorState } from '../types';

describe('calculatorReducer', () => {
  describe('DIGIT', () => {
    it('replaces 0 with a non-zero digit', () => {
      const state = calculatorReducer(initialState, { type: 'DIGIT', payload: '5' });
      expect(state.currentInput).toBe('5');
    });

    it('appends a digit to existing input', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '3' });
      const s2 = calculatorReducer(s1, { type: 'DIGIT', payload: '7' });
      expect(s2.currentInput).toBe('37');
    });

    it('allows a leading decimal point', () => {
      const state = calculatorReducer(initialState, { type: 'DIGIT', payload: '.' });
      expect(state.currentInput).toBe('0.');
    });

    it('prevents duplicate decimal points', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '1' });
      const s2 = calculatorReducer(s1, { type: 'DIGIT', payload: '.' });
      const s3 = calculatorReducer(s2, { type: 'DIGIT', payload: '.' });
      expect(s3.currentInput).toBe('1.');
    });

    it('overwrites current input when overwrite flag is true', () => {
      const stateWithOverwrite: CalculatorState = {
        ...initialState,
        currentInput: '42',
        overwrite: true,
      };
      const state = calculatorReducer(stateWithOverwrite, { type: 'DIGIT', payload: '9' });
      expect(state.currentInput).toBe('9');
      expect(state.overwrite).toBe(false);
    });
  });

  describe('OPERATOR', () => {
    it('sets operator and stores previousInput', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '5' });
      const s2 = calculatorReducer(s1, { type: 'OPERATOR', payload: '+' });
      expect(s2.operator).toBe('+');
      expect(s2.previousInput).toBe('5');
      expect(s2.overwrite).toBe(true);
    });

    it('evaluates pending operation when second operator is pressed', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '3' });
      const s2 = calculatorReducer(s1, { type: 'OPERATOR', payload: '+' });
      const s3 = calculatorReducer(s2, { type: 'DIGIT', payload: '4' });
      const s4 = calculatorReducer(s3, { type: 'OPERATOR', payload: '*' });
      expect(s4.currentInput).toBe('7');
      expect(s4.operator).toBe('*');
    });
  });

  describe('EQUALS', () => {
    it('evaluates the expression', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '8' });
      const s2 = calculatorReducer(s1, { type: 'OPERATOR', payload: '/' });
      const s3 = calculatorReducer(s2, { type: 'DIGIT', payload: '2' });
      const s4 = calculatorReducer(s3, { type: 'EQUALS' });
      expect(s4.currentInput).toBe('4');
      expect(s4.operator).toBeNull();
      expect(s4.previousInput).toBe('');
    });

    it('returns Error on division by zero', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '5' });
      const s2 = calculatorReducer(s1, { type: 'OPERATOR', payload: '/' });
      const s3 = calculatorReducer(s2, { type: 'DIGIT', payload: '0' });
      const s4 = calculatorReducer(s3, { type: 'EQUALS' });
      expect(s4.currentInput).toBe('Error');
    });

    it('does nothing when no operator is set', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '5' });
      const s2 = calculatorReducer(s1, { type: 'EQUALS' });
      expect(s2.currentInput).toBe('5');
    });

    it('handles subtraction', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '9' });
      const s2 = calculatorReducer(s1, { type: 'OPERATOR', payload: '-' });
      const s3 = calculatorReducer(s2, { type: 'DIGIT', payload: '3' });
      const s4 = calculatorReducer(s3, { type: 'EQUALS' });
      expect(s4.currentInput).toBe('6');
    });

    it('handles multiplication', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '6' });
      const s2 = calculatorReducer(s1, { type: 'OPERATOR', payload: '*' });
      const s3 = calculatorReducer(s2, { type: 'DIGIT', payload: '7' });
      const s4 = calculatorReducer(s3, { type: 'EQUALS' });
      expect(s4.currentInput).toBe('42');
    });
  });

  describe('CLEAR', () => {
    it('resets to initial state', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '9' });
      const s2 = calculatorReducer(s1, { type: 'OPERATOR', payload: '+' });
      const s3 = calculatorReducer(s2, { type: 'DIGIT', payload: '1' });
      const cleared = calculatorReducer(s3, { type: 'CLEAR' });
      expect(cleared).toEqual(initialState);
    });
  });

  describe('BACKSPACE', () => {
    it('removes the last character', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '1' });
      const s2 = calculatorReducer(s1, { type: 'DIGIT', payload: '2' });
      const s3 = calculatorReducer(s2, { type: 'BACKSPACE' });
      expect(s3.currentInput).toBe('1');
    });

    it('falls back to 0 when only one character remains', () => {
      const s1 = calculatorReducer(initialState, { type: 'DIGIT', payload: '5' });
      const s2 = calculatorReducer(s1, { type: 'BACKSPACE' });
      expect(s2.currentInput).toBe('0');
    });

    it('does nothing when overwrite is true', () => {
      const stateWithOverwrite: CalculatorState = {
        ...initialState,
        currentInput: '99',
        overwrite: true,
      };
      const state = calculatorReducer(stateWithOverwrite, { type: 'BACKSPACE' });
      expect(state.currentInput).toBe('99');
    });
  });
});
