// Calculation engine: tokeniser → parser → evaluator

export type CalcError = { error: true; message: string };
export type CalcResult = number | CalcError;

export function isCalcError(val: unknown): val is CalcError {
  return typeof val === 'object' && val !== null && (val as CalcError).error === true;
}

function calcError(message: string): CalcError {
  return { error: true, message };
}

// ─── Tokeniser ───────────────────────────────────────────────────────────────

type TokenType =
  | 'NUMBER'
  | 'PLUS'
  | 'MINUS'
  | 'STAR'
  | 'SLASH'
  | 'CARET'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'IDENT'
  | 'EOF';

interface Token {
  type: TokenType;
  value: string;
}

function tokenise(expr: string): Token[] | CalcError {
  const tokens: Token[] = [];
  let i = 0;
  const src = expr.trim();

  while (i < src.length) {
    const ch = src[i];

    if (ch === ' ' || ch === '\t') { i++; continue; }

    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      let num = '';
      while (i < src.length && /[0-9.]/.test(src[i])) num += src[i++];
      if ((num.match(/\./g) ?? []).length > 1) return calcError('Invalid number: ' + num);
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    if (/[a-zA-Zπ]/.test(ch)) {
      let ident = '';
      while (i < src.length && /[a-zA-Zπ_0-9]/.test(src[i])) ident += src[i++];
      tokens.push({ type: 'IDENT', value: ident });
      continue;
    }

    switch (ch) {
      case '+': tokens.push({ type: 'PLUS', value: '+' }); break;
      case '-': tokens.push({ type: 'MINUS', value: '-' }); break;
      case '*': tokens.push({ type: 'STAR', value: '*' }); break;
      case '/': tokens.push({ type: 'SLASH', value: '/' }); break;
      case '^': tokens.push({ type: 'CARET', value: '^' }); break;
      case '(': tokens.push({ type: 'LPAREN', value: '(' }); break;
      case ')': tokens.push({ type: 'RPAREN', value: ')' }); break;
      case ',': tokens.push({ type: 'COMMA', value: ',' }); break;
      default: return calcError('Unknown character: ' + ch);
    }
    i++;
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
}

// ─── Parser / Evaluator (recursive descent) ──────────────────────────────────

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  private expect(type: TokenType): Token | CalcError {
    const tok = this.peek();
    if (tok.type !== type) return calcError(`Expected ${type} but got ${tok.type} ('${tok.value}')`);
    return this.consume();
  }

  parse(): CalcResult {
    const result = this.parseExpr();
    if (isCalcError(result)) return result;
    if (this.peek().type !== 'EOF') return calcError('Unexpected token: ' + this.peek().value);
    return result;
  }

  // expr = term (('+' | '-') term)*
  private parseExpr(): CalcResult {
    let left = this.parseTerm();
    if (isCalcError(left)) return left;

    while (this.peek().type === 'PLUS' || this.peek().type === 'MINUS') {
      const op = this.consume().type;
      const right = this.parseTerm();
      if (isCalcError(right)) return right;
      left = op === 'PLUS' ? (left as number) + right : (left as number) - right;
    }
    return left;
  }

  // term = unary (('*' | '/') unary)*
  private parseTerm(): CalcResult {
    let left = this.parseUnary();
    if (isCalcError(left)) return left;

    while (this.peek().type === 'STAR' || this.peek().type === 'SLASH') {
      const op = this.consume().type;
      const right = this.parseUnary();
      if (isCalcError(right)) return right;
      if (op === 'SLASH') {
        if (right === 0) return calcError('Division by zero');
        left = (left as number) / right;
      } else {
        left = (left as number) * right;
      }
    }
    return left;
  }

  // unary = '-' unary | power
  private parseUnary(): CalcResult {
    if (this.peek().type === 'MINUS') {
      this.consume();
      const val = this.parseUnary();
      if (isCalcError(val)) return val;
      return -(val as number);
    }
    if (this.peek().type === 'PLUS') {
      this.consume();
      return this.parseUnary();
    }
    return this.parsePower();
  }

  // power = primary ('^' unary)?
  private parsePower(): CalcResult {
    const base = this.parsePrimary();
    if (isCalcError(base)) return base;

    if (this.peek().type === 'CARET') {
      this.consume();
      const exp = this.parseUnary();
      if (isCalcError(exp)) return exp;
      return Math.pow(base as number, exp as number);
    }
    return base;
  }

  // primary = NUMBER | IDENT | IDENT '(' args ')' | '(' expr ')'
  private parsePrimary(): CalcResult {
    const tok = this.peek();

    if (tok.type === 'NUMBER') {
      this.consume();
      return parseFloat(tok.value);
    }

    if (tok.type === 'IDENT') {
      // constant: π or pi or e
      if (tok.value === 'π' || tok.value === 'pi') {
        this.consume();
        return Math.PI;
      }
      if (tok.value === 'e') {
        this.consume();
        // peek — if next is not LPAREN it's the constant
        if (this.peek().type !== 'LPAREN') return Math.E;
        // else fall through to function call
        this.pos--; // rewind — but we already consumed IDENT, so just handle as fn
      }

      const name = tok.value;
      this.consume();

      // function call
      const lp = this.expect('LPAREN');
      if (isCalcError(lp)) return lp;

      const args: number[] = [];
      if (this.peek().type !== 'RPAREN') {
        const first = this.parseExpr();
        if (isCalcError(first)) return first;
        args.push(first as number);
        while (this.peek().type === 'COMMA') {
          this.consume();
          const arg = this.parseExpr();
          if (isCalcError(arg)) return arg;
          args.push(arg as number);
        }
      }

      const rp = this.expect('RPAREN');
      if (isCalcError(rp)) return rp;

      return applyFunction(name, args);
    }

    if (tok.type === 'LPAREN') {
      this.consume();
      const inner = this.parseExpr();
      if (isCalcError(inner)) return inner;
      const rp = this.expect('RPAREN');
      if (isCalcError(rp)) return rp;
      return inner;
    }

    if (tok.type === 'EOF') return calcError('Unexpected end of expression');
    return calcError('Unexpected token: ' + tok.value);
  }
}

// ─── Function application ─────────────────────────────────────────────────────

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function applyFunction(name: string, args: number[]): CalcResult {
  const a = args[0];
  const b = args[1];
  switch (name.toLowerCase()) {
    case 'sin':  return Math.sin(toRad(a));
    case 'cos':  return Math.cos(toRad(a));
    case 'tan':  return Math.tan(toRad(a));
    case 'asin': return toDeg(Math.asin(a));
    case 'acos': return toDeg(Math.acos(a));
    case 'atan': return toDeg(Math.atan(a));
    case 'log':  return Math.log10(a);
    case 'ln':   return Math.log(a);
    case 'sqrt': return Math.sqrt(a);
    case 'sq':   return a * a;
    case 'pow':  return Math.pow(a, b ?? 2);
    case 'inv':  return a === 0 ? calcError('Division by zero') : 1 / a;
    case 'fact': return factorial(Math.round(a));
    case 'abs':  return Math.abs(a);
    case 'ceil': return Math.ceil(a);
    case 'floor': return Math.floor(a);
    case 'round': return Math.round(a);
    case 'max':  return Math.max(...args);
    case 'min':  return Math.min(...args);
    case 'mod':  return a % b;
    default:     return calcError('Unknown function: ' + name);
  }
}

function toRad(deg: number): number { return (deg * Math.PI) / 180; }
function toDeg(rad: number): number { return (rad * 180) / Math.PI; }

// ─── Public API ───────────────────────────────────────────────────────────────

export function evaluate(expression: string): CalcResult {
  if (!expression.trim()) return calcError('Empty expression');

  // pre-process: replace π with the token
  const processed = expression
    .replace(/π/g, 'π')
    .replace(/×/g, '*')
    .replace(/÷/g, '/');

  const tokens = tokenise(processed);
  if (isCalcError(tokens)) return tokens;

  const parser = new Parser(tokens);
  return parser.parse();
}

export function formatResult(val: CalcResult): string {
  if (isCalcError(val)) return val.message;
  if (!isFinite(val)) return val > 0 ? 'Infinity' : '-Infinity';
  if (isNaN(val)) return 'Error';
  // avoid floating point noise
  const rounded = parseFloat(val.toPrecision(12));
  return String(rounded);
}
