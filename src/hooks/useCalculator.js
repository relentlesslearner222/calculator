import { useReducer, useEffect, useCallback } from 'react';
import { calculatorReducer, initialState, ACTIONS } from '../engine/calculatorReducer.js';

export function useCalculator() {
  const savedMode =
    typeof window !== 'undefined' ? localStorage.getItem('calc_mode') : null;
  const savedAngleUnit =
    typeof window !== 'undefined' ? localStorage.getItem('calc_angle_unit') : null;

  const [state, dispatch] = useReducer(calculatorReducer, {
    ...initialState,
    mode: savedMode === 'scientific' ? 'scientific' : 'basic',
    angleUnit: savedAngleUnit === 'rad' ? 'rad' : 'deg',
  });

  // Persist mode & angleUnit
  useEffect(() => {
    localStorage.setItem('calc_mode', state.mode);
  }, [state.mode]);

  useEffect(() => {
    localStorage.setItem('calc_angle_unit', state.angleUnit);
  }, [state.angleUnit]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key;

      let activeKey = null;
      let actionDispatched = false;

      if (key >= '0' && key <= '9') {
        dispatch({ type: ACTIONS.INPUT_DIGIT, payload: key });
        activeKey = key;
        actionDispatched = true;
      } else if (key === '.') {
        dispatch({ type: ACTIONS.INPUT_DECIMAL });
        activeKey = '.';
        actionDispatched = true;
      } else if (key === '+') {
        dispatch({ type: ACTIONS.INPUT_OPERATOR, payload: '+' });
        activeKey = '+';
        actionDispatched = true;
      } else if (key === '-') {
        dispatch({ type: ACTIONS.INPUT_OPERATOR, payload: '-' });
        activeKey = '-';
        actionDispatched = true;
      } else if (key === '*') {
        dispatch({ type: ACTIONS.INPUT_OPERATOR, payload: '\u00d7' });
        activeKey = '\u00d7';
        actionDispatched = true;
      } else if (key === '/') {
        e.preventDefault();
        dispatch({ type: ACTIONS.INPUT_OPERATOR, payload: '\u00f7' });
        activeKey = '\u00f7';
        actionDispatched = true;
      } else if (key === 'Enter' || key === '=') {
        dispatch({ type: ACTIONS.EVALUATE });
        activeKey = '=';
        actionDispatched = true;
      } else if (key === 'Escape') {
        dispatch({ type: ACTIONS.CLEAR });
        activeKey = 'AC';
        actionDispatched = true;
      } else if (key === 'Backspace') {
        dispatch({ type: ACTIONS.BACKSPACE });
        activeKey = '\u232b';
        actionDispatched = true;
      } else if (key === '(') {
        dispatch({ type: ACTIONS.OPEN_PAREN });
        activeKey = '(';
        actionDispatched = true;
      } else if (key === ')') {
        dispatch({ type: ACTIONS.CLOSE_PAREN });
        activeKey = ')';
        actionDispatched = true;
      } else if (key === '%') {
        dispatch({ type: ACTIONS.PERCENTAGE });
        activeKey = '%';
        actionDispatched = true;
      } else if (key === '^') {
        dispatch({ type: ACTIONS.INPUT_OPERATOR, payload: '^' });
        activeKey = '^';
        actionDispatched = true;
      }

      if (actionDispatched) {
        dispatch({ type: ACTIONS.SET_ACTIVE_KEY, payload: activeKey });
      }
    },
    [dispatch]
  );

  const handleKeyUp = useCallback(() => {
    dispatch({ type: ACTIONS.SET_ACTIVE_KEY, payload: null });
  }, [dispatch]);

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
