import { TOKEN_TYPES, makeToken, CONSTANTS } from './tokens.js';
import { evaluate } from './evaluate.js';

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

// Build human-readable expression string from tokens
function tokensToExpression(tokens) {
  return tokens
    .map((t) => {
      if (t.type === TOKEN_TYPES.LPAREN) return '(';
      if (t.type === TOKEN_TYPES.RPAREN) return ')';
      if (t.type === TOKEN_TYPES.CONST) return t.value === 'PI' ? '\u03c0' : 'e';
      return t.value;
    })
    .join(' ');
}

export function calculatorReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.CLEAR:
      return { ...initialState, mode: state.mode, angleUnit: state.angleUnit };

    case ACTIONS.SET_MODE:
      return { ...state, mode: payload };

    case ACTIONS.SET_ANGLE_UNIT:
      return { ...state, angleUnit: payload };

    case ACTIONS.SET_ACTIVE_KEY:
      return { ...state, activeKey: payload };

    case ACTIONS.INPUT_DIGIT: {
      const digit = payload;
      // If we just got a result, start fresh unless it's after an operator
      if (state.isResult) {
        const newToken = makeToken(TOKEN_TYPES.NUM, digit);
        return {
          ...state,
          tokens: [newToken],
          display: digit,
          expression: '',
          isResult: false,
        };
      }

      // If last token is a NUM, append to it
      const lastToken = state.tokens[state.tokens.length - 1];
      if (lastToken && lastToken.type === TOKEN_TYPES.NUM) {
        // Limit display length
        if (lastToken.value.length >= 15) return state;
        const newValue = lastToken.value === '0' ? digit : lastToken.value + digit;
        const newTokens = [
          ...state.tokens.slice(0, -1),
          makeToken(TOKEN_TYPES.NUM, newValue),
        ];
        return {
          ...state,
          tokens: newTokens,
          display: newValue,
          expression: tokensToExpression(newTokens),
        };
      }

      // Otherwise start a new NUM token
      const newToken = makeToken(TOKEN_TYPES.NUM, digit);
      const newTokens = [...state.tokens, newToken];
      return {
        ...state,
        tokens: newTokens,
        display: digit,
        expression: tokensToExpression(newTokens),
      };
    }

    case ACTIONS.INPUT_DECIMAL: {
      if (state.isResult) {
        const token = makeToken(TOKEN_TYPES.NUM, '0.');
        return {
          ...state,
          tokens: [token],
          display: '0.',
          expression: '0.',
          isResult: false,
        };
      }
      const lastToken = state.tokens[state.tokens.length - 1];
      if (lastToken && lastToken.type === TOKEN_TYPES.NUM) {
        if (lastToken.value.includes('.')) return state; // already has decimal
        const newValue = lastToken.value + '.';
        const newTokens = [
          ...state.tokens.slice(0, -1),
          makeToken(TOKEN_TYPES.NUM, newValue),
        ];
        return {
          ...state,
          tokens: newTokens,
          display: newValue,
          expression: tokensToExpression(newTokens),
        };
      }
      // Start a new 0. token
      const token = makeToken(TOKEN_TYPES.NUM, '0.');
      const newTokens = [...state.tokens, token];
      return {
        ...state,
        tokens: newTokens,
        display: '0.',
        expression: tokensToExpression(newTokens),
      };
    }

    case ACTIONS.INPUT_OPERATOR: {
      const op = payload;
      // If result, continue with result as first operand
      let baseTokens = state.tokens;
      if (state.isResult && state.tokens.length === 0) {
        // display holds the result; rebuild with a NUM token
        baseTokens = [makeToken(TOKEN_TYPES.NUM, state.display)];
      }
      // Replace trailing operator if last token is OP
      const lastToken = baseTokens[baseTokens.length - 1];
      if (lastToken && lastToken.type === TOKEN_TYPES.OP) {
        const newTokens = [
          ...baseTokens.slice(0, -1),
          makeToken(TOKEN_TYPES.OP, op),
        ];
        return {
          ...state,
          tokens: newTokens,
          expression: tokensToExpression(newTokens),
          isResult: false,
        };
      }
      const newTokens = [...baseTokens, makeToken(TOKEN_TYPES.OP, op)];
      return {
        ...state,
        tokens: newTokens,
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.INPUT_FUNCTION: {
      const fnName = payload;
      // Functions expect a ( to follow
      const fnToken = makeToken(TOKEN_TYPES.FUNC, fnName);
      const lp = makeToken(TOKEN_TYPES.LPAREN, '(');
      let baseTokens = state.tokens;
      if (state.isResult) {
        baseTokens = [];
      }
      const newTokens = [...baseTokens, fnToken, lp];
      return {
        ...state,
        tokens: newTokens,
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.OPEN_PAREN: {
      let baseTokens = state.tokens;
      if (state.isResult) baseTokens = [];
      const newTokens = [...baseTokens, makeToken(TOKEN_TYPES.LPAREN, '(')];
      return {
        ...state,
        tokens: newTokens,
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.CLOSE_PAREN: {
      const newTokens = [...state.tokens, makeToken(TOKEN_TYPES.RPAREN, ')')];
      return {
        ...state,
        tokens: newTokens,
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.INPUT_CONSTANT: {
      const constName = payload; // 'PI' | 'E'
      let baseTokens = state.tokens;
      if (state.isResult) baseTokens = [];
      const newTokens = [...baseTokens, makeToken(TOKEN_TYPES.CONST, constName)];
      const displayVal = constName === 'PI' ? '\u03c0' : 'e';
      return {
        ...state,
        tokens: newTokens,
        display: String(CONSTANTS[constName]),
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.EVALUATE: {
      if (state.tokens.length === 0) return state;
      const result = evaluate(state.tokens, state.angleUnit);
      const displayResult = result === 'Error' ? 'Error' : String(result);
      return {
        ...state,
        tokens: [],
        display: displayResult,
        expression: tokensToExpression(state.tokens) + ' =',
        isResult: true,
      };
    }

    case ACTIONS.BACKSPACE: {
      if (state.isResult) {
        return { ...initialState, mode: state.mode, angleUnit: state.angleUnit };
      }
      if (state.tokens.length === 0) return state;
      const lastToken = state.tokens[state.tokens.length - 1];
      let newTokens;
      if (lastToken.type === TOKEN_TYPES.NUM && lastToken.value.length > 1) {
        const newValue = lastToken.value.slice(0, -1);
        newTokens = [
          ...state.tokens.slice(0, -1),
          makeToken(TOKEN_TYPES.NUM, newValue),
        ];
      } else {
        newTokens = state.tokens.slice(0, -1);
      }
      const prevToken = newTokens[newTokens.length - 1];
      const newDisplay =
        prevToken?.type === TOKEN_TYPES.NUM
          ? prevToken.value
          : prevToken?.type === TOKEN_TYPES.CONST
          ? String(CONSTANTS[prevToken.value])
          : '0';
      return {
        ...state,
        tokens: newTokens,
        display: newDisplay,
        expression: tokensToExpression(newTokens),
      };
    }

    case ACTIONS.TOGGLE_SIGN: {
      const lastToken = state.tokens[state.tokens.length - 1];
      if (!lastToken || lastToken.type !== TOKEN_TYPES.NUM) return state;
      const newValue = lastToken.value.startsWith('-')
        ? lastToken.value.slice(1)
        : '-' + lastToken.value;
      const newTokens = [
        ...state.tokens.slice(0, -1),
        makeToken(TOKEN_TYPES.NUM, newValue),
      ];
      return {
        ...state,
        tokens: newTokens,
        display: newValue,
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    case ACTIONS.PERCENTAGE: {
      const lastToken = state.tokens[state.tokens.length - 1];
      if (!lastToken || lastToken.type !== TOKEN_TYPES.NUM) return state;
      const pctValue = String(parseFloat(lastToken.value) / 100);
      const newTokens = [
        ...state.tokens.slice(0, -1),
        makeToken(TOKEN_TYPES.NUM, pctValue),
      ];
      return {
        ...state,
        tokens: newTokens,
        display: pctValue,
        expression: tokensToExpression(newTokens),
        isResult: false,
      };
    }

    default:
      return state;
  }
}
