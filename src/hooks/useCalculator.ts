import { useReducer, useCallback } from 'react';
import { evaluate } from '../utils/evaluate';
import { formatResult } from '../utils/format';
import type { CalcState, HistoryEntry, AngleMode } from '../types/calculator';

// ---------------------------------------------------------------------------
// State & Actions
// ---------------------------------------------------------------------------

type Action =
  | { type: 'APPEND'; payload: string }
  | { type: 'OPERATOR'; payload: string }
  | { type: 'FUNCTION'; payload: string }
  | { type: 'EVALUATE' }
  | { type: 'CLEAR' }
  | { type: 'BACKSPACE' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENT' }
  | { type: 'MEMORY_STORE' }
  | { type: 'MEMORY_RECALL' }
  | { type: 'MEMORY_CLEAR' }
  | { type: 'MEMORY_ADD' }
  | { type: 'MEMORY_SUB' }
  | { type: 'TOGGLE_ANGLE' }
  | { type: 'RESTORE_HISTORY'; payload: HistoryEntry }
  | { type: 'CLEAR_HISTORY' };

const MAX_HISTORY = 20;
const MAX_EXPR_LENGTH = 200;

const initialState: CalcState = {
  expression: '',
  result: '0',
  error: null,
  memory: 0,
  history: [],
  angleMode: 'deg',
  isResultDisplayed: false,
};

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function calcReducer(state: CalcState, action: Action): CalcState {
  switch (action.type) {
    case 'APPEND': {
      if (state.expression.length >= MAX_EXPR_LENGTH) return state;
      // If a result is displayed and user types a digit, start fresh
      const base =
        state.isResultDisplayed &&
        !isNaN(Number(action.payload)) &&
        action.payload !== '('
          ? ''
          : state.isResultDisplayed && ['+', '-', '*', '/', '^'].includes(action.payload)
          ? state.result
          : state.expression;
      return {
        ...state,
        expression: base + action.payload,
        error: null,
        isResultDisplayed: false,
      };
    }

    case 'OPERATOR': {
      if (state.expression.length >= MAX_EXPR_LENGTH) return state;
      const base = state.isResultDisplayed ? state.result : state.expression;
      // Avoid double operators (except minus for negation)
      const last = base.slice(-1);
      const isOp = ['+', '*', '/', '^'].includes(last);
      const expr = isOp && action.payload !== '-' ? base.slice(0, -1) + action.payload : base + action.payload;
      return {
        ...state,
        expression: expr,
        error: null,
        isResultDisplayed: false,
      };
    }

    case 'FUNCTION': {
      if (state.expression.length >= MAX_EXPR_LENGTH) return state;
      const base = state.isResultDisplayed ? '' : state.expression;
      return {
        ...state,
        expression: base + action.payload,
        error: null,
        isResultDisplayed: false,
      };
    }

    case 'EVALUATE': {
      if (!state.expression) return state;
      const res = evaluate(state.expression, state.angleMode);
      if (!res.ok) {
        return { ...state, error: res.error, result: 'Error', isResultDisplayed: true };
      }
      const formatted = formatResult(res.value);
      const entry: HistoryEntry = {
        id: genId(),
        expression: state.expression,
        result: formatted,
        timestamp: Date.now(),
      };
      return {
        ...state,
        result: formatted,
        error: null,
        history: [entry, ...state.history].slice(0, MAX_HISTORY),
        isResultDisplayed: true,
      };
    }

    case 'CLEAR':
      return { ...initialState, memory: state.memory, history: state.history, angleMode: state.angleMode };

    case 'BACKSPACE': {
      if (state.isResultDisplayed) {
        return { ...state, expression: '', result: '0', isResultDisplayed: false };
      }
      const next = state.expression.slice(0, -1);
      return { ...state, expression: next, error: null };
    }

    case 'TOGGLE_SIGN': {
      if (state.expression.startsWith('-')) {
        return { ...state, expression: state.expression.slice(1) };
      }
      if (state.expression) {
        return { ...state, expression: '-' + state.expression };
      }
      return state;
    }

    case 'PERCENT': {
      const res = evaluate(state.expression, state.angleMode);
      if (!res.ok) return state;
      const pct = formatResult(res.value / 100);
      return { ...state, expression: pct, result: pct, isResultDisplayed: true };
    }

    case 'MEMORY_STORE': {
      const res = evaluate(
        state.isResultDisplayed ? state.result : state.expression,
        state.angleMode
      );
      if (!res.ok) return state;
      return { ...state, memory: res.value };
    }

    case 'MEMORY_RECALL': {
      const memStr = formatResult(state.memory);
      return {
        ...state,
        expression: state.isResultDisplayed ? memStr : state.expression + memStr,
        isResultDisplayed: false,
      };
    }

    case 'MEMORY_CLEAR':
      return { ...state, memory: 0 };

    case 'MEMORY_ADD': {
      const res = evaluate(
        state.isResultDisplayed ? state.result : state.expression,
        state.angleMode
      );
      if (!res.ok) return state;
      return { ...state, memory: state.memory + res.value };
    }

    case 'MEMORY_SUB': {
      const res = evaluate(
        state.isResultDisplayed ? state.result : state.expression,
        state.angleMode
      );
      if (!res.ok) return state;
      return { ...state, memory: state.memory - res.value };
    }

    case 'TOGGLE_ANGLE':
      return { ...state, angleMode: state.angleMode === 'deg' ? 'rad' : 'deg' };

    case 'RESTORE_HISTORY':
      return {
        ...state,
        expression: action.payload.expression,
        result: action.payload.result,
        error: null,
        isResultDisplayed: true,
      };

    case 'CLEAR_HISTORY':
      return { ...state, history: [] };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCalculator() {
  const [state, dispatch] = useReducer(calcReducer, initialState);

  const append = useCallback((val: string) => dispatch({ type: 'APPEND', payload: val }), []);
  const operator = useCallback((op: string) => dispatch({ type: 'OPERATOR', payload: op }), []);
  const fn = useCallback((f: string) => dispatch({ type: 'FUNCTION', payload: f }), []);
  const evaluate_ = useCallback(() => dispatch({ type: 'EVALUATE' }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const backspace = useCallback(() => dispatch({ type: 'BACKSPACE' }), []);
  const toggleSign = useCallback(() => dispatch({ type: 'TOGGLE_SIGN' }), []);
  const percent = useCallback(() => dispatch({ type: 'PERCENT' }), []);
  const memStore = useCallback(() => dispatch({ type: 'MEMORY_STORE' }), []);
  const memRecall = useCallback(() => dispatch({ type: 'MEMORY_RECALL' }), []);
  const memClear = useCallback(() => dispatch({ type: 'MEMORY_CLEAR' }), []);
  const memAdd = useCallback(() => dispatch({ type: 'MEMORY_ADD' }), []);
  const memSub = useCallback(() => dispatch({ type: 'MEMORY_SUB' }), []);
  const toggleAngle = useCallback(() => dispatch({ type: 'TOGGLE_ANGLE' }), []);
  const restoreHistory = useCallback(
    (entry: HistoryEntry) => dispatch({ type: 'RESTORE_HISTORY', payload: entry }),
    []
  );
  const clearHistory = useCallback(() => dispatch({ type: 'CLEAR_HISTORY' }), []);

  return {
    state,
    actions: {
      append,
      operator,
      fn,
      evaluate: evaluate_,
      clear,
      backspace,
      toggleSign,
      percent,
      memStore,
      memRecall,
      memClear,
      memAdd,
      memSub,
      toggleAngle,
      restoreHistory,
      clearHistory,
    },
  };
}
