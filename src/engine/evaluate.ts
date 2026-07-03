export class EvaluationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EvaluationError';
  }
}

/**
 * Tokeniser + recursive-descent parser for arithmetic expressions.
 * Supports: +, -, *, /, decimal numbers, parentheses, operator precedence.
 * No raw eval used.
 */
export function evaluateExpression(expression: string): string {
  const input = expression.trim();
  if (!input) {
    throw new EvaluationError('Empty expression');
  }

  const tokens = tokenise(input);
  if (tokens.length === 0) {
    throw new EvaluationError('Empty expression');
  }

  const parser = new Parser(tokens);
  const result = parser.parseExpression();

  if (!parser.isAtEnd()) {
    throw new EvaluationError('Unexpected token: ' + parser.peek());
  }

  if (!isFinite(result)) {
    throw new EvaluationError('Division by zero');
  }

  // Format: remove trailing zeros after decimal
  const formatted = parseFloat(result.toPrecision(12)).toString();
  return formatted;
}

type Token = { type: 'number'; value: number } | { type: 'op'; value: string } | { type: 'lparen' } | { type: 'rparen' };

function tokenise(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (ch === ' ' || ch === '\t') {
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }

    if ('+-*/'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let numStr = '';
      while (i < input.length && ((input[i] >= '0' && input[i] <= '9') || input[i] === '.')) {
        numStr += input[i];
        i++;
      }
      const num = parseFloat(numStr);
      if (isNaN(num)) {
        throw new EvaluationError('Invalid number: ' + numStr);
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    throw new EvaluationError('Invalid character: ' + ch);
  }

  return tokens;
}

class Parser {
  private tokens: Token[];
  private pos: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  isAtEnd(): boolean {
    return this.pos >= this.tokens.length;
  }

  peek(): string {
    if (this.isAtEnd()) return 'EOF';
    const t = this.tokens[this.pos];
    if (t.type === 'number') return t.value.toString();
    if (t.type === 'op') return t.value;
    if (t.type === 'lparen') return '(';
    return ')';
  }

  private current(): Token {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  // expression = term (('+' | '-') term)*
  parseExpression(): number {
    let left = this.parseTerm();

    while (!this.isAtEnd()) {
      const t = this.current();
      if (t.type !== 'op' || (t.value !== '+' && t.value !== '-')) break;
      this.consume();
      const right = this.parseTerm();
      if (t.value === '+') left += right;
      else left -= right;
    }

    return left;
  }

  // term = unary (('*' | '/') unary)*
  private parseTerm(): number {
    let left = this.parseUnary();

    while (!this.isAtEnd()) {
      const t = this.current();
      if (t.type !== 'op' || (t.value !== '*' && t.value !== '/')) break;
      this.consume();
      const right = this.parseUnary();
      if (t.value === '*') left *= right;
      else {
        if (right === 0) throw new EvaluationError('Division by zero');
        left /= right;
      }
    }

    return left;
  }

  // unary = '-' unary | primary
  private parseUnary(): number {
    if (!this.isAtEnd() && this.current().type === 'op') {
      const t = this.current();
      if (t.type === 'op' && t.value === '-') {
        this.consume();
        return -this.parseUnary();
      }
      if (t.type === 'op' && t.value === '+') {
        this.consume();
        return this.parseUnary();
      }
    }
    return this.parsePrimary();
  }

  // primary = number | '(' expression ')'
  private parsePrimary(): number {
    if (this.isAtEnd()) {
      throw new EvaluationError('Unexpected end of expression');
    }

    const t = this.current();

    if (t.type === 'number') {
      this.consume();
      return t.value;
    }

    if (t.type === 'lparen') {
      this.consume();
      const val = this.parseExpression();
      if (this.isAtEnd() || this.current().type !== 'rparen') {
        throw new EvaluationError('Missing closing parenthesis');
      }
      this.consume();
      return val;
    }

    throw new EvaluationError('Unexpected token: ' + this.peek());
  }
}
