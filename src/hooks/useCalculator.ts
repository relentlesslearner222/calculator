import { useReducer } from 'react';
import { evaluate, formatResult, isCalcError } from '../utils/calculator';

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type CalcAction =
  | { type: 'APPEND'; value: string }
  | { type: 'EVALUATE' }
  | { type: 'CLEAR' }
  | { type: 'BACKSPACE' }
  | { type: 'RESTORE_HISTORY'; expression: string; result: string }
  | { type: 'CLEAR_HISTORY' };

interface CalcState {
  expression: string;
  display: string;
  history: HistoryEntry[];
  justEvaluated: boolean;
}

const initialState: CalcState = {
  expression: '',
  display: '0',
  history: [],
  justEvaluated: false,
};

function reducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'APPEND': {
      const expr = state.justEvaluated && /[0-9.(πa-z]/.test(action.value)
        ? action.value
        : state.expression + action.value;
      return { ...state, expression: expr, display: expr || '0', justEvaluated: false };
    }

    case 'EVALUATE': {
      if (!state.expression) return state;
      const result = evaluate(state.expression);
      const resultStr = formatResult(result);
      const isError = isCalcError(result);
      const entry: HistoryEntry = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        expression: state.expression,
        result: resultStr,
        timestamp: Date.now(),
      };
      return {
        ...state,
        display: resultStr,
        expression: isError ? state.expression : resultStr,
        history: isError ? state.history : [entry, ...state.history].slice(0, 50),
        justEvaluated: !isError,
      };
    }

    case 'CLEAR':
      return { ...state, expression: '', display: '0', justEvaluated: false };

    case 'BACKSPACE': {
      if (state.justEvaluated) return { ...state, expression: '', display: '0', justEvaluated: false };
      const newExpr = state.expression.slice(0, -1);
      return { ...state, expression: newExpr, display: newExpr || '0' };
    }

    case 'RESTORE_HISTORY':
      return {
        ...state,
        expression: action.expression,
        display: action.result,
        justEvaluated: true,
      };

    case 'CLEAR_HISTORY':
      return { ...state, history: [] };

    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { ...state, dispatch };
}
