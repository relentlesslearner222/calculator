import { CalculatorAction, CalculatorState } from '../types';

export const initialState: CalculatorState = {
  currentInput: '0',
  previousInput: '',
  operator: null,
  overwrite: false,
};

function evaluate(prev: string, curr: string, operator: string): string {
  const a = parseFloat(prev);
  const b = parseFloat(curr);
  if (isNaN(a) || isNaN(b)) return '0';
  let result: number;
  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      if (b === 0) return 'Error';
      result = a / b;
      break;
    default:
      return curr;
  }
  // Avoid floating point noise for simple cases
  const str = result.toPrecision(12);
  return String(parseFloat(str));
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case 'DIGIT': {
      const { payload } = action;
      // Prevent multiple decimal points
      if (payload === '.' && state.currentInput.includes('.') && !state.overwrite) {
        return state;
      }
      if (state.overwrite) {
        return {
          ...state,
          currentInput: payload === '.' ? '0.' : payload,
          overwrite: false,
        };
      }
      if (state.currentInput === '0' && payload !== '.') {
        return { ...state, currentInput: payload };
      }
      return {
        ...state,
        currentInput: state.currentInput + payload,
      };
    }
    case 'OPERATOR': {
      const { payload } = action;
      // If there's a pending operation, evaluate first
      if (
        state.operator !== null &&
        state.previousInput !== '' &&
        !state.overwrite
      ) {
        const result = evaluate(state.previousInput, state.currentInput, state.operator);
        return {
          currentInput: result,
          previousInput: result,
          operator: payload,
          overwrite: true,
        };
      }
      return {
        ...state,
        previousInput: state.currentInput,
        operator: payload,
        overwrite: true,
      };
    }
    case 'EQUALS': {
      if (state.operator === null || state.previousInput === '') {
        return state;
      }
      const result = evaluate(state.previousInput, state.currentInput, state.operator);
      return {
        currentInput: result,
        previousInput: '',
        operator: null,
        overwrite: true,
      };
    }
    case 'CLEAR': {
      return { ...initialState };
    }
    case 'BACKSPACE': {
      if (state.overwrite) return state;
      if (state.currentInput.length <= 1) {
        return { ...state, currentInput: '0' };
      }
      return {
        ...state,
        currentInput: state.currentInput.slice(0, -1),
      };
    }
    default:
      return state;
  }
}
