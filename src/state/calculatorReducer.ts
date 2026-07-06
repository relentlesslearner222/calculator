export type CalculatorState = {
  displayValue: string;
  pendingOperand: number | null;
  operator: '+' | '-' | '*' | '/' | null;
  awaitingOperand: boolean;
};

export type Action =
  | { type: 'DIGIT'; payload: string }
  | { type: 'OPERATOR'; payload: '+' | '-' | '*' | '/' }
  | { type: 'PERCENT' }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' };

export const initialState: CalculatorState = {
  displayValue: '0',
  pendingOperand: null,
  operator: null,
  awaitingOperand: false,
};

function calculate(
  left: number,
  right: number,
  operator: '+' | '-' | '*' | '/'
): number {
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
  }
}

function formatResult(value: number): string {
  // Avoid floating point noise by using toPrecision then parsing back
  const str = parseFloat(value.toPrecision(12)).toString();
  return str;
}

export function calculatorReducer(
  state: CalculatorState,
  action: Action
): CalculatorState {
  switch (action.type) {
    case 'DIGIT': {
      const { payload } = action;

      // Prevent multiple decimals
      if (payload === '.' && state.displayValue.includes('.') && !state.awaitingOperand) {
        return state;
      }

      if (state.awaitingOperand) {
        return {
          ...state,
          displayValue: payload === '.' ? '0.' : payload,
          awaitingOperand: false,
        };
      }

      // Don't prepend zeros
      if (state.displayValue === '0' && payload !== '.') {
        return { ...state, displayValue: payload };
      }

      return {
        ...state,
        displayValue: state.displayValue + payload,
      };
    }

    case 'OPERATOR': {
      const currentValue = parseFloat(state.displayValue);

      // If there's a pending operation and we haven't started a new operand, evaluate first
      if (state.operator !== null && !state.awaitingOperand) {
        const left = state.pendingOperand ?? currentValue;
        const result = calculate(left, currentValue, state.operator);
        return {
          displayValue: formatResult(result),
          pendingOperand: result,
          operator: action.payload,
          awaitingOperand: true,
        };
      }

      return {
        ...state,
        pendingOperand: currentValue,
        operator: action.payload,
        awaitingOperand: true,
      };
    }

    case 'PERCENT': {
      const currentValue = parseFloat(state.displayValue);

      if (state.operator === null || state.pendingOperand === null) {
        // Standalone: just divide by 100
        return {
          ...state,
          displayValue: formatResult(currentValue / 100),
        };
      }

      if (state.operator === '+' || state.operator === '-') {
        // Percentage of the left-hand side
        const percentValue = state.pendingOperand * (currentValue / 100);
        return {
          ...state,
          displayValue: formatResult(percentValue),
          awaitingOperand: false,
        };
      }

      // Multiplicative: just divide by 100
      return {
        ...state,
        displayValue: formatResult(currentValue / 100),
        awaitingOperand: false,
      };
    }

    case 'EQUALS': {
      if (state.operator === null || state.pendingOperand === null) {
        return state;
      }

      const currentValue = parseFloat(state.displayValue);
      const result = calculate(state.pendingOperand, currentValue, state.operator);

      return {
        displayValue: formatResult(result),
        pendingOperand: null,
        operator: null,
        awaitingOperand: true,
      };
    }

    case 'CLEAR': {
      return { ...initialState };
    }

    default:
      return state;
  }
}
