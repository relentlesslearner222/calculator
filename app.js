'use strict';

const state = {
  currentValue: '0',
  previousValue: null,
  operator: null,
  shouldResetCurrent: false,
  expression: '',
  history: [],
};

const resultEl      = document.getElementById('result');
const expressionEl  = document.getElementById('expression');
const historyListEl = document.getElementById('history-list');
const clearHistBtn  = document.getElementById('clear-history');

function formatNumber(num) {
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';
  if (isNaN(num))     return 'Error';
  const rounded = parseFloat(num.toPrecision(12));
  const str     = String(rounded);
  return str.length > 15 ? num.toExponential(6) : str;
}

function flashResult() {
  resultEl.classList.add('result--updated');
  setTimeout(() => resultEl.classList.remove('result--updated'), 300);
}

function showToast(msg) {
  let toast = document.querySelector('.sf-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'sf-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function updateDisplay() {
  resultEl.textContent     = state.currentValue;
  expressionEl.textContent = state.expression;
  const len = state.currentValue.length;
  if      (len > 14) resultEl.style.fontSize = '22px';
  else if (len > 10) resultEl.style.fontSize = '30px';
  else if (len > 7)  resultEl.style.fontSize = '36px';
  else               resultEl.style.fontSize = '';
}

function loadHistory() {
  try {
    const stored = localStorage.getItem('sf-calc-history');
    if (stored) state.history = JSON.parse(stored);
  } catch { state.history = []; }
  renderHistory();
}

function saveHistory() {
  try { localStorage.setItem('sf-calc-history', JSON.stringify(state.history.slice(0, 50))); }
  catch {}
}

function addHistoryEntry(expression, result) {
  const entry = {
    expression,
    result,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  state.history.unshift(entry);
  if (state.history.length > 50) state.history.pop();
  saveHistory();
  renderHistory();
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderHistory() {
  if (state.history.length === 0) {
    historyListEl.innerHTML = '<li class="history-list__empty">No calculations yet.</li>';
    return;
  }
  historyListEl.innerHTML = state.history.map((entry, idx) => `|
    <li class="history-list__item" data-index="${idx}" title="Click to reuse result">
      <span class="history-item__expression">${escapeHtml(entry.expression)}</span>
      <span class="history-item__result">${escapeHtml(String(entry.result))}</span>
      <span class="history-item__timestamp">${entry.timestamp}</span>
    </li>`).join('');
}

function calculate(a, op, b) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  switch (op) {
    case '+': return numA + numB;
    case '-': return numA - numB;
    case '*': return numA * numB;
    case '/':
      if (numB === 0) { showToast('Cannot divide by zero'); return NaN; }
      return numA / numB;
    default: return numB;
  }
}

function handleNumber(digit) {
  if (state.shouldResetCurrent) {
    state.currentValue      = digit;
    state.shouldResetCurrent = false;
  } else {
    if (state.currentValue === '0' && digit !== '.') {
      state.currentValue = digit;
    } else if (state.currentValue.length < 15) {
      state.currentValue += digit;
    }
  }
  updateDisplay();
}

function handleDecimal() {
  if (state.shouldResetCurrent) {
    state.currentValue       = '0.';
    state.shouldResetCurrent = false;
    updateDisplay(); return;
  }
  if (!state.currentValue.includes('.')) {
    state.currentValue += '.';
    updateDisplay();
  }
}

function getOpSymbol(op) {
  return { '+': '+', '-': '\u2212', '*': '\u00d7', '/': '\u00f7' }[op] || op;
}

function handleOperator(op) {
  if (state.operator && !state.shouldResetCurrent) {
    const result = calculate(state.previousValue, state.operator, state.currentValue);
    state.currentValue = formatNumber(result);
    flashResult();
  }
  state.previousValue       = state.currentValue;
  state.operator            = op;
  state.shouldResetCurrent  = true;
  state.expression          = `${state.previousValue} ${getOpSymbol(op)}`;
  updateDisplay();
  document.querySelectorAll('.calc-btn--operator').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === op);
  });
}

function handleEquals() {
  if (!state.operator || state.previousValue === null) return;
  const exprFull = `${state.previousValue} ${getOpSymbol(state.operator)} ${state.currentValue}`;
  const result   = calculate(state.previousValue, state.operator, state.currentValue);
  if (isNaN(result)) {
    state.currentValue = 'Error';
    state.expression   = exprFull + ' =';
  } else {
    const formatted            = formatNumber(result);
    addHistoryEntry(`${exprFull} =`, formatted);
    state.expression           = `${exprFull} =`;
    state.currentValue         = formatted;
    flashResult();
  }
  state.operator           = null;
  state.previousValue      = null;
  state.shouldResetCurrent = true;
  updateDisplay();
  document.querySelectorAll('.calc-btn--operator').forEach(b => b.classList.remove('active'));
}

function handleClear() {
  state.currentValue       = '0';
  state.previousValue      = null;
  state.operator           = null;
  state.shouldResetCurrent = false;
  state.expression         = '';
  updateDisplay();
  document.querySelectorAll('.calc-btn--operator').forEach(b => b.classList.remove('active'));
}

function handleToggleSign() {
  const val = parseFloat(state.currentValue);
  if (!isNaN(val) && val !== 0) {
    state.currentValue = formatNumber(val * -1);
    updateDisplay();
  }
}

function handlePercent() {
  const val = parseFloat(state.currentValue);
  if (!isNaN(val)) {
    state.currentValue = formatNumber(val / 100);
    updateDisplay();
  }
}

document.querySelector('.calc-grid').addEventListener('click', (e) => {
  const btn    = e.target.closest('.calc-btn');
  if (!btn) return;
  const action = btn.dataset.action;
  const value  = btn.dataset.value;
  switch (action) {
    case 'number':      handleNumber(value);   break;
    case 'decimal':     handleDecimal();       break;
    case 'operator':    handleOperator(value); break;
    case 'equals':      handleEquals();        break;
    case 'clear':       handleClear();         break;
    case 'toggle-sign': handleToggleSign();    break;
    case 'percent':     handlePercent();       break;
  }
});

historyListEl.addEventListener('click', (e) => {
  const item = e.target.closest('.history-list__item');
  if (!item) return;
  const idx = parseInt(item.dataset.index, 10);
  const entry = state.history[idx];
  if (entry) {
    state.currentValue       = String(entry.result);
    state.shouldResetCurrent = true;
    state.expression         = `\u2190 ${entry.expression}`;
    updateDisplay();
    showToast(`Loaded: ${entry.result}`);
  }
});

clearHistBtn.addEventListener('click', () => {
  state.history = [];
  saveHistory();
  renderHistory();
  showToast('History cleared');
});

document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key >= '0' && key <= '9')     { handleNumber(key);     return; }
  if (key === '.')                   { handleDecimal();        return; }
  if (key === '+')                   { handleOperator('+');   return; }
  if (key === '-')                   { handleOperator('-');   return; }
  if (key === '*')                   { handleOperator('*');   return; }
  if (key === '/')  { e.preventDefault(); handleOperator('/'); return; }
  if (key === 'Enter' || key === '=') { handleEquals();      return; }
  if (key === 'Escape' || key === 'c' || key === 'C') { handleClear(); return; }
  if (key === 'Backspace') {
    if (state.currentValue.length > 1 && !state.shouldResetCurrent) {
      state.currentValue = state.currentValue.slice(0, -1) || '0';
    } else {
      state.currentValue = '0';
    }
    updateDisplay(); return;
  }
  if (key === '%') { handlePercent(); return; }
});

loadHistory();
updateDisplay();
showToast('Welcome to Salesforce Calculator');