import { TokenType, makeNumber, makeOperator, makeFunction, makeConstant, makeLParen, makeRParen } from './tokens.js';
import { evaluate, tokensToExpression } from './evaluate.js';

export const ACTIONS = {
  INPUT_DIGIT: 'INPUT_DIGIT',
  INPUT_DECIMAL: 'INPUT_DECIMAL',
  INPUT_OPERATOR: 'INPUT_OPERATOR',
  INPUT_FUNCTION: 'INPUT_FUNCTION',
  EVALUATE: 'EVALUATE',
  CLEAR: 'CLEAR',
  BACKSPACE: 'BACKSPACE',
  TOGGLE_SIGN: 'TOGGLE_SIGN',
  PERCENTAGE: 'PERCENTAGE',
  OPEN_PAREN: 'OPEN_PAREN',
  CLOSE_PAREN: 'CLOSE_PAREN',
  INPUT_CONSTANT: 'INPUT_CONSTANT',
  SET_MODE: 'SET_MODE',
  SET_ANGLE_UNIT: 'SET_ANGLE_UNIT',
  SET_ACTIVE_KEY: 'SET_ACTIVE_KEY',
};

export const initialState = {
  tokens: [],
  display: '0',
  expression: '',
  mode: 'basic',
  angleUnit: 'deg',
  isResult: false,
  activeKey: null,
};

function getLastToken(tokens) {
  return tokens.length > 0 ? tokens[tokens.length - 1] : null;
}

function isLastTokenNumber(tokens) {
  const last = getLastToken(tokens);
  return last !== null && last.type === TokenType.NUMBER;
}

function isLastTokenOperatorOrParen(tokens) {
  const last = getLastToken(tokens);
  if (!last) return true; // start of expression
  return last.type === TokenType.OPERATOR || last.type === TokenType.LPAREN;
}

export function calculatorReducer(state, action) {
  switch (action.type) {
    case ACTIONS.CLEAR:
      return { ...state, tokens: [], display: '0', expression: '', isResult: false };

    case ACTIONS.SET_ACTIVE_KEY:
      return { ...state, activeKey: action.payload };

    case ACTIONS.SET_MODE: {
      try { localStorage.setItem('calc-mode', action.payload); } catch {}
      return { ...state, mode: action.payload };
    }

    case ACTIONS.SET_ANGLE_UNIT:
      return { ...state, angleUnit: action.payload };

    case ACTIONS.INPUT_DIGIT: {
      const digit = action.payload;
      let newTokens;

      // If result is showing and we type a digit, start fresh
      if (state.isResult) {
        newTokens = [makeNumber(digit)];
      } else if (isLastTokenNumber(state.tokens)) {
        // Append to existing number
        const last = getLastToken(state.tokens);
        const newVal = last.value === '0' ? digit : last.value + digit;
        newTokens = [...state.tokens.slice(0, -1), makeNumber(newVal)];
      } else {
        newTokens = [...state.tokens, makeNumber(digit)];
      }

      const lastNum = getLastToken(newTokens);
      return {
        ...state,
        tokens: newTokens,
        display: lastNum ? lastNum.value : '0',
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.INPUT_DECIMAL: {
      let newTokens;
      if (state.isResult) {
        newTokens = [makeNumber('0.')];
      } else if (isLastTokenNumber(state.tokens)) {
        const last = getLastToken(state.tokens);
        if (last.value.includes('.')) return state; // already has decimal
        const newVal = last.value + '.';
        newTokens = [...state.tokens.slice(0, -1), makeNumber(newVal)];
      } else {
        newTokens = [...state.tokens, makeNumber('0.')];
      }
      const lastNum = getLastToken(newTokens);
      return {
        ...state,
        tokens: newTokens,
        display: lastNum ? lastNum.value : '0.',
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.INPUT_OPERATOR: {
      const op = action.payload;
      let baseTokens = state.tokens;

      // If last token is operator, replace it
      const last = getLastToken(baseTokens);
      if (last && last.type === TokenType.OPERATOR) {
        baseTokens = baseTokens.slice(0, -1);
      }

      // If no tokens and op is minus, start with 0 then minus
      if (baseTokens.length === 0 && op !== '-') return state;
      if (baseTokens.length === 0 && op === '-') {
        baseTokens = [makeNumber('0')];
      }

      const newTokens = [...baseTokens, makeOperator(op)];
      return {
        ...state,
        tokens: newTokens,
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.INPUT_FUNCTION: {
      const fnName = action.payload;
      // Handle postfix-style functions (sq, fact) vs prefix functions
      const postfix = ['sq', 'fact'];
      if (postfix.includes(fnName)) {
        // wrap last number in function(number)
        const last = getLastToken(state.tokens);
        if (last && last.type === TokenType.NUMBER) {
          const newTokens = [
            ...state.tokens.slice(0, -1),
            makeFunction(fnName),
            makeLParen(),
            last,
            makeRParen(),
          ];
          const result = evaluate(newTokens, state.angleUnit);
          return {
            ...state,
            tokens: newTokens,
            expression: tokensToExpression(newTokens),
            display: result === 'Error' ? 'Error' : String(result),
            isResult: false,
          };
        }
        return state;
      }
      // Prefix function: push function token and open paren
      const newTokens = [...state.tokens, makeFunction(fnName), makeLParen()];
      return {
        ...state,
        tokens: newTokens,
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.OPEN_PAREN: {
      const newTokens = [...state.tokens, makeLParen()];
      return {
        ...state,
        tokens: newTokens,
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.CLOSE_PAREN: {
      const newTokens = [...state.tokens, makeRParen()];
      return {
        ...state,
        tokens: newTokens,
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.INPUT_CONSTANT: {
      const constName = action.payload;
      let baseTokens = state.isResult ? [] : state.tokens;
      const newTokens = [...baseTokens, makeConstant(constName)];
      return {
        ...state,
        tokens: newTokens,
        expression: tokensToExpression(newTokens),
        display: constName === 'PI' ? '\u03C0' : constName === 'E' ? 'e' : constName,
        isResult: false,
      };
    }

    case ACTIONS.BACKSPACE: {
      if (state.isResult) {
        return { ...state, tokens: [], display: '0', expression: '', isResult: false };
      }
      if (state.tokens.length === 0) return state;

      const last = getLastToken(state.tokens);
      let newTokens;

      if (last.type === TokenType.NUMBER && last.value.length > 1) {
        const newVal = last.value.slice(0, -1);
        newTokens = [...state.tokens.slice(0, -1), makeNumber(newVal)];
      } else {
        newTokens = state.tokens.slice(0, -1);
      }

      const newLast = getLastToken(newTokens);
      const newDisplay = newLast
        ? newLast.type === TokenType.NUMBER
          ? newLast.value
          : tokensToExpression([newLast])
        : '0';

      return {
        ...state,
        tokens: newTokens,
        display: newDisplay,
        expression: tokensToExpression(newTokens),
      };
    }

    case ACTIONS.TOGGLE_SIGN: {
      if (state.tokens.length === 0) return state;
      const last = getLastToken(state.tokens);
      if (last.type === TokenType.NUMBER) {
        const newVal = last.value.startsWith('-')
          ? last.value.slice(1)
          : '-' + last.value;
        const newTokens = [...state.tokens.slice(0, -1), makeNumber(newVal)];
        return {
          ...state,
          tokens: newTokens,
          display: newVal,
          expression: tokensToExpression(newTokens),
        };
      }
      return state;
    }

    case ACTIONS.PERCENTAGE: {
      if (state.tokens.length === 0) return state;
      const last = getLastToken(state.tokens);
      if (last.type === TokenType.NUMBER) {
        const pctVal = String(parseFloat(last.value) / 100);
        const newTokens = [...state.tokens.slice(0, -1), makeNumber(pctVal)];
        return {
          ...state,
          tokens: newTokens,
          display: pctVal,
          expression: tokensToExpression(newTokens),
          isResult: false,
        };
      }
      return state;
    }

    case ACTIONS.EVALUATE: {
      if (state.tokens.length === 0) return state;
      const result = evaluate(state.tokens, state.angleUnit);
      const displayResult = result === 'Error'
        ? 'Error'
        : Number.isInteger(result)
          ? String(result)
          : parseFloat(result.toPrecision(12)).toString();
      return {
        ...state,
        expression: tokensToExpression(state.tokens) + ' =',
        display: displayResult,
        tokens: result === 'Error' ? [] : [makeNumber(displayResult)],
        isResult: true,
      };
    }

    default:
      return state;
  }
}
