import { useReducer, useCallback } from 'react';
import { CalculatorState, HistoryEntry } from '../types/calculator';
import { evaluate } from '../utils/mathEngine';

type Action =
  | { type: 'APPEND_DIGIT'; digit: string }
  | { type: 'APPEND_OPERATOR'; operator: string }
  | { type: 'APPEND_FUNCTION'; func: string }
  | { type: 'APPEND_CONSTANT'; constant: string; value: string }
  | { type: 'DECIMAL' }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'BACKSPACE' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'TOGGLE_ANGLE_MODE' }
  | { type: 'MEMORY_STORE' }
  | { type: 'MEMORY_RECALL' }
  | { type: 'MEMORY_CLEAR' }
  | { type: 'MEMORY_ADD' }
  | { type: 'PERCENT' };

const initialState: CalculatorState = {
  display: '0',
  expression: '',
  angleMode: 'deg',
  isError: false,
  waitingForOperand: false,
  memory: 0,
  history: [],
};

function calculatorReducer(state: CalculatorState, action: Action): CalculatorState {
  if (action.type === 'CLEAR') {
    return { ...initialState, angleMode: state.angleMode, memory: state.memory, history: state.history };
  }

  if (action.type === 'CLEAR_HISTORY') {
    return { ...state, history: [] };
  }

  if (state.isError && action.type !== 'TOGGLE_ANGLE_MODE') {
    if (action.type === 'MEMORY_RECALL' || action.type === 'MEMORY_STORE' ||
        action.type === 'MEMORY_CLEAR' || action.type === 'MEMORY_ADD') {
      // allow memory ops even after error
    } else if (action.type === 'APPEND_DIGIT') {
      // Reset to clean state then handle the digit
      const resetState = { ...initialState, angleMode: state.angleMode, memory: state.memory, history: state.history };
      return {
        ...resetState,
        display: action.digit,
        expression: action.digit,
        isError: false,
        waitingForOperand: false,
      };
    } else {
      return { ...initialState, angleMode: state.angleMode, memory: state.memory, history: state.history };
    }
  }

  switch (action.type) {
    case 'APPEND_DIGIT': {
      if (state.waitingForOperand) {
        return {
          ...state,
          display: action.digit,
          expression: state.expression + action.digit,
          waitingForOperand: false,
        };
      }
      const newDisplay = state.display === '0' ? action.digit : state.display + action.digit;
      return {
        ...state,
        display: newDisplay,
        expression: state.expression === '' || state.expression === '0'
          ? action.digit
          : state.expression + action.digit,
      };
    }

    case 'DECIMAL': {
      if (state.waitingForOperand) {
        return {
          ...state,
          display: '0.',
          expression: state.expression + '0.',
          waitingForOperand: false,
        };
      }
      if (state.display.includes('.')) return state;
      return {
        ...state,
        display: state.display + '.',
        expression: state.expression + '.',
      };
    }

    case 'APPEND_OPERATOR': {
      const expr = state.expression.trimEnd();
      // Replace trailing operator if user changes mind
      const replaced = expr.replace(/[+\-*/^]$/, '');
      return {
        ...state,
        expression: replaced + action.operator,
        waitingForOperand: true,
      };
    }

    case 'APPEND_FUNCTION': {
      return {
        ...state,
        expression: state.expression + action.func + '(',
        display: action.func + '(',
        waitingForOperand: false,
      };
    }

    case 'APPEND_CONSTANT': {
      if (state.waitingForOperand) {
        return {
          ...state,
          display: action.constant,
          expression: state.expression + action.value,
          waitingForOperand: false,
        };
      }
      return {
        ...state,
        display: action.constant,
        expression: state.expression + action.value,
      };
    }

    case 'EQUALS': {
      if (!state.expression) return state;
      try {
        const result = evaluate(state.expression, state.angleMode);
        const display = formatResult(result);
        const entry: HistoryEntry = { expression: state.expression, result: display };
        return {
          ...state,
          display,
          expression: display,
          waitingForOperand: true,
          isError: false,
          history: [...state.history, entry],
        };
      } catch (err) {
        return {
          ...state,
          display: err instanceof Error ? err.message : 'Error',
          isError: true,
          waitingForOperand: false,
        };
      }
    }

    case 'BACKSPACE': {
      if (state.waitingForOperand || state.display.length <= 1) {
        return { ...state, display: '0', expression: state.expression.slice(0, -1) };
      }
      return {
        ...state,
        display: state.display.slice(0, -1),
        expression: state.expression.slice(0, -1),
      };
    }

    case 'TOGGLE_SIGN': {
      if (state.display === '0' || state.display === '') return state;
      const toggled = state.display.startsWith('-')
        ? state.display.slice(1)
        : '-' + state.display;
      // Also update expression
      const newExpr = state.expression.endsWith(state.display)
        ? state.expression.slice(0, -state.display.length) + toggled
        : state.expression;
      return { ...state, display: toggled, expression: newExpr };
    }

    case 'TOGGLE_ANGLE_MODE': {
      return { ...state, angleMode: state.angleMode === 'deg' ? 'rad' : 'deg' };
    }

    case 'PERCENT': {
      const num = parseFloat(state.display);
      if (isNaN(num)) return state;
      const pct = num / 100;
      const display = formatResult(pct);
      return {
        ...state,
        display,
        expression: state.expression.endsWith(state.display)
          ? state.expression.slice(0, -state.display.length) + display
          : display,
      };
    }

    case 'MEMORY_STORE': {
      const val = parseFloat(state.display);
      return { ...state, memory: isNaN(val) ? state.memory : val };
    }

    case 'MEMORY_RECALL': {
      const display = formatResult(state.memory);
      return {
        ...state,
        display,
        expression: state.waitingForOperand
          ? state.expression + display
          : display,
        waitingForOperand: false,
      };
    }

    case 'MEMORY_CLEAR': {
      return { ...state, memory: 0 };
    }

    case 'MEMORY_ADD': {
      const val = parseFloat(state.display);
      return { ...state, memory: state.memory + (isNaN(val) ? 0 : val) };
    }

    default:
      return state;
  }
}

function formatResult(n: number): string {
  if (!isFinite(n)) return 'Error';
  // Use up to 10 significant digits, trim trailing zeros
  const str = parseFloat(n.toPrecision(10)).toString();
  return str;
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const appendDigit = useCallback((digit: string) => dispatch({ type: 'APPEND_DIGIT', digit }), []);
  const appendOperator = useCallback((operator: string) => dispatch({ type: 'APPEND_OPERATOR', operator }), []);
  const appendFunction = useCallback((func: string) => dispatch({ type: 'APPEND_FUNCTION', func }), []);
  const appendConstant = useCallback((constant: string, value: string) =>
    dispatch({ type: 'APPEND_CONSTANT', constant, value }), []);
  const decimal = useCallback(() => dispatch({ type: 'DECIMAL' }), []);
  const equals = useCallback(() => dispatch({ type: 'EQUALS' }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const clearHistory = useCallback(() => dispatch({ type: 'CLEAR_HISTORY' }), []);
  const backspace = useCallback(() => dispatch({ type: 'BACKSPACE' }), []);
  const toggleSign = useCallback(() => dispatch({ type: 'TOGGLE_SIGN' }), []);
  const toggleAngleMode = useCallback(() => dispatch({ type: 'TOGGLE_ANGLE_MODE' }), []);
  const percent = useCallback(() => dispatch({ type: 'PERCENT' }), []);
  const memoryStore = useCallback(() => dispatch({ type: 'MEMORY_STORE' }), []);
  const memoryRecall = useCallback(() => dispatch({ type: 'MEMORY_RECALL' }), []);
  const memoryClear = useCallback(() => dispatch({ type: 'MEMORY_CLEAR' }), []);
  const memoryAdd = useCallback(() => dispatch({ type: 'MEMORY_ADD' }), []);

  return {
    state,
    appendDigit,
    appendOperator,
    appendFunction,
    appendConstant,
    decimal,
    equals,
    clear,
    clearHistory,
    backspace,
    toggleSign,
    toggleAngleMode,
    percent,
    memoryStore,
    memoryRecall,
    memoryClear,
    memoryAdd,
  };
}
