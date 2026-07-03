import { CalculatorAction } from '../types';

export const keyMap: Record<string, CalculatorAction> = {
  '0': { type: 'DIGIT', payload: '0' },
  '1': { type: 'DIGIT', payload: '1' },
  '2': { type: 'DIGIT', payload: '2' },
  '3': { type: 'DIGIT', payload: '3' },
  '4': { type: 'DIGIT', payload: '4' },
  '5': { type: 'DIGIT', payload: '5' },
  '6': { type: 'DIGIT', payload: '6' },
  '7': { type: 'DIGIT', payload: '7' },
  '8': { type: 'DIGIT', payload: '8' },
  '9': { type: 'DIGIT', payload: '9' },
  '.': { type: 'DIGIT', payload: '.' },
  '+': { type: 'OPERATOR', payload: '+' },
  '-': { type: 'OPERATOR', payload: '-' },
  '*': { type: 'OPERATOR', payload: '*' },
  '/': { type: 'OPERATOR', payload: '/' },
  'Enter': { type: 'EQUALS' },
  '=': { type: 'EQUALS' },
  'Escape': { type: 'CLEAR' },
  'Backspace': { type: 'BACKSPACE' },
};
