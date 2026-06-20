/**
 * calculator/app.js
 * Fully functional calculator - arithmetic, chained ops, edge-cases.
 */

'use strict';

/* ┌ State └└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└ */
const state = {
  currentValue:   '0',   // number being entered
  previousValue:  '',    // left-hand operand (stored as string)
  operator:       null,  // pending operator: + - * /
  waitingForSecond: false, // true right after an operator is pressed
  justEvaluated:  false, // true right after = is pressed
  expression:     '',    // text shown in the top (smaller) display row
};

/* ┌ DOM refs └└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└ */
const resultEl     = document.getElementById('result');
const expressionEl = document.getElementById('expression');
const calcEl       = document.querySelector('.calculator');
const displayEl    = document.querySelector('.display');

/* ┌ Rendering └└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└ */
function render() {
  resultEl.textContent     = formatDisplay(state.currentValue);
  expressionEl.textContent = state.expression || '\u00a0';

  // Responsive text sizing
  const len = resultEl.textContent.length;
  resultEl.classList.toggle('medium', len > 10 && len <= 16);
  resultEl.classList.toggle('small',  len > 16);
}

/**
 * Format a numeric string for the result display.
 * Handles: Infinity, NaN, large numbers (exponential), trailing dot removal.
 */
function formatDisplay(value) {
  if (value === 'Error' || value === 'Infinity' || value === '-Infinity') {
    return value;
  }
  // While the user is actively typing, show raw (preserve trailing dot / zeros after dot)
  if (!state.justEvaluated && !state.waitingForSecond) {
    return value;
  }
  // After evaluation: pretty-print the number
  const num = parseFloat(value);
  if (isNaN(num)) return 'Error';
  // If the number is too large or too small for standard notation, use toPrecision
  if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-7 && num !== 0)) {
    return parseFloat(num.toPrecision(10)).toString();
  }
  // Remove floating-point noise (e.g. 0.1 + 0.2 = 0.30000000004 => 0.3)
  const rounded = parseFloat(num.toPrecision(12));
  return rounded.toString();
}

/* ┌ Core operations └└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└ */
const OPERATORS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => {
    if (b === 0) return null; // signal division-by-zero
    return a / b;
  },
};

const OPERATOR_SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function calculate(a, op, b) {
  const fn = OPERATORS[op];
  if (!fn) return a;
  const result = fn(a, b);
  if (result === null) return null; // div-by-zero
  return result;
}

/* ┌ Actions └└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└ */

function handleNumber(digit) {
  clearError();

  if (state.waitingForSecond) {
    state.currentValue    = digit;
    state.waitingForSecond = false;
    render();
    return;
  }

  if (state.justEvaluated) {
    state.currentValue   = digit;
    state.previousValue  = '';
    state.operator       = null;
    state.expression     = '';
    state.justEvaluated  = false;
    render();
    return;
  }

  if (state.currentValue === '0' && digit !== '.') {
    state.currentValue = digit;
  } else if (state.currentValue.length < 18) {
    state.currentValue += digit;
  }
  render();
}

function handleDecimal() {
  clearError();

  if (state.waitingForSecond) {
    state.currentValue    = '0.';
    state.waitingForSecond = false;
    render();
    return;
  }
  if (state.justEvaluated) {
    state.currentValue   = '0.';
    state.previousValue  = '';
    state.operator       = null;
    state.expression     = '';
    state.justEvaluated  = false;
    render();
    return;
  }
  if (!state.currentValue.includes('.')) {
    state.currentValue += '.';
  }
  render();
}

function handleOperator(op) {
  clearError();
  const current = parseFloat(state.currentValue);

  if (state.operator && !state.waitingForSecond && !state.justEvaluated) {
    const prev   = parseFloat(state.previousValue);
    const result = calculate(prev, state.operator, current);

    if (result === null) {
      showError('Cannot divide by zero');
      return;
    }
    if (!isFinite(result)) {
      showError('Overflow');
      return;
    }
    state.currentValue  = String(parseFloat(result.toPrecision(12)));
    state.previousValue = state.currentValue;
    state.expression    = `${formatDisplay(state.currentValue)} ${OPERATOR_SYMBOLS[op]}`;
  } else {
    state.previousValue = state.currentValue;
    state.expression    = `${formatDisplay(state.currentValue)} ${OPERATOR_SYMBOLS[op]}`;
  }

  state.operator        = op;
  state.waitingForSecond = true;
  state.justEvaluated   = false;
  render();
}

function handleEquals() {
  clearError();
  if (!state.operator || state.waitingForSecond) return;

  const a      = parseFloat(state.previousValue);
  const b      = parseFloat(state.currentValue);
  const result = calculate(a, state.operator, b);

  const exprSymbol = OPERATOR_SYMBOLS[state.operator];
  const exprStr    = `${formatDisplay(state.previousValue)} ${exprSymbol} ${formatDisplay(state.currentValue)} =`;

  if (result === null) {
    showError('Cannot divide by zero');
    state.expression = exprStr;
    render();
    return;
  }
  if (!isFinite(result)) {
    showError('Overflow');
    state.expression = exprStr;
    render();
    return;
  }

  state.expression    = exprStr;
  state.currentValue  = String(parseFloat(result.toPrecision(12)));
  state.previousValue = '';
  state.operator      = null;
  state.justEvaluated = true;
  state.waitingForSecond = false;
  render();
}

function handleClear() {
  state.currentValue     = '0';
  state.previousValue    = '';
  state.operator         = null;
  state.waitingForSecond = false;
  state.justEvaluated    = false;
  state.expression       = '';
  clearError();
  render();
}

function handleBackspace() {
  clearError();

  if (state.justEvaluated) {
    handleClear();
    return;
  }
  if (state.waitingForSecond) return;

  if (state.currentValue.length > 1) {
    state.currentValue = state.currentValue.slice(0, -1);
  } else {
    state.currentValue = '0';
  }
  render();
}

/* ┌ Error helpers └└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└ */
function showError(msg) {
  state.currentValue  = msg;
  state.previousValue = '';
  state.operator      = null;
  state.waitingForSecond = false;
  state.justEvaluated    = false;
  displayEl.classList.add('display--error');
  render();
}

function clearError() {
  displayEl.classList.remove('display--error');
}

/* ┌ Button click handler └└└└└└└└└└└└└└└└└└└└└└└└└└└ */
calcEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);

  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  switch (action) {
    case 'number':    handleNumber(value);   break;
    case 'decimal':   handleDecimal();        break;
    case 'operator':  handleOperator(value);  break;
    case 'equals':    handleEquals();         break;
    case 'clear':     handleClear();          break;
    case 'backspace': handleBackspace();      break;
  }
});

/* ┌ Keyboard support └└└└└└└└└└└└└└└└└└└└└└└└└└└└└ */
const KEY_MAP = {
  '0': () => handleNumber('0'),
  '1': () => handleNumber('1'),
  '2': () => handleNumber('2'),
  '3': () => handleNumber('3'),
  '4': () => handleNumber('4'),
  '5': () => handleNumber('5'),
  '6': () => handleNumber('6'),
  '7': () => handleNumber('7'),
  '8': () => handleNumber('8'),
  '9': () => handleNumber('9'),
  '.': () => handleDecimal(),
  ',': () => handleDecimal(),
  '+': () => handleOperator('+'),
  '-': () => handleOperator('-'),
  '*': () => handleOperator('*'),
  'x': () => handleOperator('*'),
  'X': () => handleOperator('*'),
  '/': () => handleOperator('/'),
  'Enter':     () => handleEquals(),
  '=':         () => handleEquals(),
  'Backspace': () => handleBackspace(),
  'Delete':    () => handleClear(),
  'Escape':    () => handleClear(),
  'c':         () => handleClear(),
  'C':         () => handleClear(),
};

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const handler = KEY_MAP[e.key];
  if (handler) {
    e.preventDefault();
    handler();

    const selector = [...document.querySelectorAll('.btn')].find(
      b => b.textContent.trim() === e.key           ||
           b.dataset.value === e.key                ||
           (e.key === 'Enter' && b.dataset.action === 'equals') ||
           (e.key === 'Backspace' && b.dataset.action === 'backspace') ||
           ((e.key === 'Escape' || e.key === 'Delete' || e.key === 'c' || e.key === 'C') && b.dataset.action === 'clear')
    );
    if (selector) {
      selector.classList.add('pressed');
      setTimeout(() => selector.classList.remove('pressed'), 120);
    }
  }
});

/* ┌ Init └└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└└ */
render();