import { useReducer, useEffect, useCallback } from 'react';
import { calculatorReducer, initialState, ACTIONS } from '../engine/calculatorReducer.js';

const KEY_MAP = {
  '0': { type: ACTIONS.INPUT_DIGIT, payload: '0' },
  '1': { type: ACTIONS.INPUT_DIGIT, payload: '1' },
  '2': { type: ACTIONS.INPUT_DIGIT, payload: '2' },
  '3': { type: ACTIONS.INPUT_DIGIT, payload: '3' },
  '4': { type: ACTIONS.INPUT_DIGIT, payload: '4' },
  '5': { type: ACTIONS.INPUT_DIGIT, payload: '5' },
  '6': { type: ACTIONS.INPUT_DIGIT, payload: '6' },
  '7': { type: ACTIONS.INPUT_DIGIT, payload: '7' },
  '8': { type: ACTIONS.INPUT_DIGIT, payload: '8' },
  '9': { type: ACTIONS.INPUT_DIGIT, payload: '9' },
  '.': { type: ACTIONS.INPUT_DECIMAL },
  '+': { type: ACTIONS.INPUT_OPERATOR, payload: '+' },
  '-': { type: ACTIONS.INPUT_OPERATOR, payload: '-' },
  '*': { type: ACTIONS.INPUT_OPERATOR, payload: '*' },
  '/': { type: ACTIONS.INPUT_OPERATOR, payload: '/' },
  '%': { type: ACTIONS.PERCENTAGE },
  '^': { type: ACTIONS.INPUT_OPERATOR, payload: '^' },
  'Enter': { type: ACTIONS.EVALUATE },
  '=': { type: ACTIONS.EVALUATE },
  'Backspace': { type: ACTIONS.BACKSPACE },
  'Delete': { type: ACTIONS.CLEAR },
  'Escape': { type: ACTIONS.CLEAR },
  '(': { type: ACTIONS.OPEN_PAREN },
  ')': { type: ACTIONS.CLOSE_PAREN },
};

export function useCalculator() {
  const savedMode = (() => {
    try { return localStorage.getItem('calc-mode') || 'basic'; } catch { return 'basic'; }
  })();

  const [state, dispatch] = useReducer(calculatorReducer, {
    ...initialState,
    mode: savedMode,
  });

  const handleKeyDown = useCallback(
    (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const action = KEY_MAP[e.key];
      if (action) {
        e.preventDefault();
        dispatch(action);
        dispatch({ type: ACTIONS.SET_ACTIVE_KEY, payload: e.key });
      }
    },
    []
  );

  const handleKeyUp = useCallback(
    (e) => {
      if (KEY_MAP[e.key]) {
        dispatch({ type: ACTIONS.SET_ACTIVE_KEY, payload: null });
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { state, dispatch };
}
