/**
 * Calculator App
 * Supports: addition, subtraction, multiplication, division,
 *           percentage, sign toggle, decimal input, chained operations.
 */

class Calculator {
  constructor(expressionEl, resultEl) {
    this.expressionEl = expressionEl;
    this.resultEl = resultEl;
    this.reset();
  }

  /** Restore calculator to initial state */
  reset() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operator = null;
    this.shouldResetScreen = false;
    this.justEvaluated = false;
    this.updateDisplay();
  }

  /** Append a digit or start fresh after evaluation */
  inputNumber(digit) {
    if (this.shouldResetScreen || this.justEvaluated) {
      this.currentValue = digit;
      this.shouldResetScreen = false;
      this.justEvaluated = false;
    } else {
      if (this.currentValue === '0' && digit !== '.') {
        this.currentValue = digit;
      } else {
        if (this.currentValue.replace('.', '').replace('-', '').length >= 12) return;
        this.currentValue += digit;
      }
    }
    this.updateDisplay();
  }

  /** Append decimal point (only once per number) */
  inputDecimal() {
    if (this.shouldResetScreen || this.justEvaluated) {
      this.currentValue = '0.';
      this.shouldResetScreen = false;
      this.justEvaluated = false;
      this.updateDisplay();
      return;
    }
    if (this.currentValue.includes('.')) return;
    this.currentValue += '.';
    this.updateDisplay();
  }

  /** Handle an operator button press */
  inputOperator(op) {
    if (this.operator && !this.shouldResetScreen && !this.justEvaluated) {
      this.evaluate(false);
    }
    this.previousValue = this.currentValue;
    this.operator = op;
    this.shouldResetScreen = true;
    this.justEvaluated = false;
    document.querySelectorAll('.btn--operator').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === op);
    });
    this.updateDisplay();
  }

  /** Toggle sign of current number */
  toggleSign() {
    if (this.currentValue === '0') return;
    this.currentValue = this.currentValue.startsWith('-')
      ? this.currentValue.slice(1)
      : '-' + this.currentValue;
    this.updateDisplay();
  }

  /** Convert current number to percentage */
  percent() {
    const val = parseFloat(this.currentValue);
    if (isNaN(val)) return;
    this.currentValue = String(val / 100);
    this.updateDisplay();
  }

  /** Evaluate the pending operation */
  evaluate(fromEqualsButton = true) {
    if (this.operator === null || this.previousValue === null) return;
    const prev = parseFloat(this.previousValue);
    const curr = parseFloat(this.currentValue);
    if (isNaN(prev) || isNaN(curr)) return;
    let result;
    switch (this.operator) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '*': result = prev * curr; break;
      case '/':
        if (curr === 0) {
          this.currentValue = 'Error';
          this.previousValue = null;
          this.operator = null;
          this.shouldResetScreen = true;
          this.updateDisplay();
          return;
        }
        result = prev / curr;
        break;
      default: return;
    }
    const opSymbol = { '+': '+', '-': '\u2212', '*': '\u00d7', '/': '\u00f7' }[this.operator];
    this.expressionEl.textContent =
      `${this.formatNumber(this.previousValue)} ${opSymbol} ${this.formatNumber(this.currentValue)} =`;
    result = parseFloat(result.toPrecision(10));
    this.currentValue = String(result);
    this.operator = null;
    this.previousValue = null;
    this.shouldResetScreen = true;
    this.justEvaluated = fromEqualsButton;
    document.querySelectorAll('.btn--operator').forEach(btn => btn.classList.remove('active'));
    this.updateDisplay(false);
  }

  /** Format a numeric string for display */
  formatNumber(numStr) {
    if (numStr === 'Error') return 'Error';
    const num = parseFloat(numStr);
    if (isNaN(num)) return numStr;
    const formatted = parseFloat(num.toFixed(8)).toLocaleString('en-US', {
      maximumFractionDigits: 8,
    });
    return numStr.endsWith('.') ? formatted + '.' : formatted;
  }

  /** Refresh both display lines */
  updateDisplay(updateExpression = true) {
    const displayText = this.formatNumber(this.currentValue);
    this.resultEl.textContent = displayText;
    this.resultEl.classList.toggle('small', displayText.replace(/[,.-]/g, '').length > 9);
    if (updateExpression && !this.justEvaluated) {
      if (this.operator && this.previousValue !== null) {
        const opSymbol = { '+': '+', '-': '\u2212', '*': '\u00d7', '/': '\u00f7' }[this.operator];
        this.expressionEl.textContent =
          `${this.formatNumber(this.previousValue)} ${opSymbol}`;
      } else if (!this.operator) {
        this.expressionEl.textContent = '';
      }
    }
  }
}

/* Bootstrap */
document.addEventListener('DOMContentLoaded', () => {
  const expressionEl = document.getElementById('expression');
  const resultEl = document.getElementById('result');
  const calc = new Calculator(expressionEl, resultEl);

  document.querySelector('.buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const value = btn.dataset.value;
    switch (action) {
      case 'number':   calc.inputNumber(value); break;
      case 'decimal':  calc.inputDecimal();      break;
      case 'operator': calc.inputOperator(value); break;
      case 'equals':   calc.evaluate(true);       break;
      case 'clear':    calc.reset();              break;
      case 'toggle-sign': calc.toggleSign();      break;
      case 'percent':  calc.percent();            break;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') calc.inputNumber(e.key);
    else if (e.key === '.') calc.inputDecimal();
    else if (e.key === '+') calc.inputOperator('+');
    else if (e.key === '-') calc.inputOperator('-');
    else if (e.key === '*') calc.inputOperator('*');
    else if (e.key === '/') { e.preventDefault(); calc.inputOperator('/'); }
    else if (e.key === 'Enter' || e.key === '=') calc.evaluate(true);
    else if (e.key === 'Escape') calc.reset();
    else if (e.key === '%') calc.percent();
    else if (e.key === 'Backspace') {
      if (calc.currentValue.length > 1) {
        calc.currentValue = calc.currentValue.slice(0, -1);
      } else {
        calc.currentValue = '0';
      }
      calc.updateDisplay();
    }
  });
});
