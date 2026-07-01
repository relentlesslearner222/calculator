import { useEffect } from 'react';
import { CalcAction } from './useCalculator';

type Dispatch = (action: CalcAction) => void;

export function useKeyboardInput(dispatch: Dispatch): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture when user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key;

      if (/^[0-9]$/.test(key) || key === '.') {
        dispatch({ type: 'APPEND', value: key });
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        dispatch({ type: 'APPEND', value: key });
      } else if (key === '(' || key === ')') {
        dispatch({ type: 'APPEND', value: key });
      } else if (key === '^') {
        dispatch({ type: 'APPEND', value: 'pow(' });
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        dispatch({ type: 'EVALUATE' });
      } else if (key === 'Backspace') {
        dispatch({ type: 'BACKSPACE' });
      } else if (key === 'Escape') {
        dispatch({ type: 'CLEAR' });
      } else if (key === 's') {
        dispatch({ type: 'APPEND', value: 'sin(' });
      } else if (key === 'c') {
        dispatch({ type: 'APPEND', value: 'cos(' });
      } else if (key === 't') {
        dispatch({ type: 'APPEND', value: 'tan(' });
      } else if (key === 'l') {
        dispatch({ type: 'APPEND', value: 'log(' });
      } else if (key === 'r') {
        dispatch({ type: 'APPEND', value: 'sqrt(' });
      } else if (key === 'p') {
        dispatch({ type: 'APPEND', value: 'π' });
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);
}
