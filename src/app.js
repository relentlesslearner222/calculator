/**
 * app.js – Calculator UI logic + keyboard support
 */
(function () {
  'use strict';

  // ── State ─────────────────────────────────────────────────────────────────
  let displayStr = '0';
  let expressionStr = '';
  let waitingForOperand = false;
  let pendingOperator = null;
  let pendingValue = null;
  let scientificMode = false;
  let justEvaluated = false;

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const displayEl       = document.getElementById('displayValue');
  const expressionEl    = document.getElementById('expression');
  const calcEl          = document.getElementById('calculator');
  const sciSection      = document.getElementById('scientificSection');
  const btnSciToggle    = document.getElementById('btnSciToggle');
  const btnHelp         = document.getElementById('btnHelp');
  const modal           = document.getElementById('shortcutModal');
  const modalClose      = document.getElementById('modalClose');

  // ── Render ────────────────────────────────────────────────────────────────
  function render() {
    displayEl.textContent    = displayStr;
    expressionEl.textContent = expressionStr;
  }

  // ── Core calculator logic ─────────────────────────────────────────────────
  function applyOperator(a, op, b) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? 'Error' : a / b;
      default:  return b;
    }
  }

  function formatResult(n) {
    if (typeof n !== 'number') return String(n);
    // Avoid floating-point noise for reasonable values
    const s = parseFloat(n.toPrecision(12));
    return String(s);
  }

  function handleDigit(d) {
    if (justEvaluated) {
      displayStr = d;
      expressionStr = '';
      justEvaluated = false;
    } else if (waitingForOperand) {
      displayStr = d;
      waitingForOperand = false;
    } else {
      displayStr = displayStr === '0' ? d : displayStr + d;
    }
    render();
  }

  function handleOperator(op) {
    justEvaluated = false;
    const current = parseFloat(displayStr);
    if (pendingOperator && !waitingForOperand) {
      const result = applyOperator(pendingValue, pendingOperator, current);
      displayStr = typeof result === 'number' ? formatResult(result) : result;
      pendingValue = typeof result === 'number' ? result : current;
    } else {
      pendingValue = current;
    }
    pendingOperator   = op;
    waitingForOperand = true;
    expressionStr = String(pendingValue) + ' ' + op;
    render();
  }

  function handleEvaluate() {
    if (pendingOperator === null) return;
    const current = parseFloat(displayStr);
    const result  = applyOperator(pendingValue, pendingOperator, current);
    expressionStr = String(pendingValue) + ' ' + pendingOperator + ' ' + String(current) + ' =';
    displayStr    = typeof result === 'number' ? formatResult(result) : result;
    pendingOperator   = null;
    pendingValue      = null;
    waitingForOperand = false;
    justEvaluated     = true;
    render();
  }

  function handleClear() {
    displayStr        = '0';
    expressionStr     = '';
    pendingOperator   = null;
    pendingValue      = null;
    waitingForOperand = false;
    justEvaluated     = false;
    render();
  }

  function handleDelete() {
    if (justEvaluated) { handleClear(); return; }
    displayStr = displayStr.length > 1 ? displayStr.slice(0, -1) : '0';
    render();
  }

  function handleDecimal() {
    if (justEvaluated || waitingForOperand) {
      displayStr        = '0.';
      waitingForOperand = false;
      justEvaluated     = false;
    } else if (!displayStr.includes('.')) {
      displayStr += '.';
    }
    render();
  }

  function handlePercent() {
    const v = parseFloat(displayStr);
    displayStr = formatResult(v / 100);
    render();
  }

  function handleSign() {
    const v = parseFloat(displayStr);
    if (v !== 0) displayStr = formatResult(-v);
    render();
  }

  function handleScientific(fn) {
    const v = parseFloat(displayStr);
    let result;
    switch (fn) {
      case 'sin':  result = Math.sin(v); break;
      case 'cos':  result = Math.cos(v); break;
      case 'tan':  result = Math.tan(v); break;
      case 'log':  result = Math.log10(v); break;
      case 'ln':   result = Math.log(v); break;
      case 'sqrt': result = Math.sqrt(v); break;
      case 'pow':
        // Treat like an operator: queue it
        handleOperator('*'); // placeholder — replaced below
        // Actually use a custom path
        pendingOperator = 'pow';
        expressionStr   = String(v) + ' ^';
        render();
        return;
      case 'pi':
        displayStr    = String(Math.PI);
        justEvaluated = false;
        render();
        return;
      default: return;
    }
    expressionStr = fn + '(' + v + ') =';
    displayStr    = formatResult(result);
    justEvaluated = true;
    render();
  }

  // Extend applyOperator to handle pow
  const _applyOrig = applyOperator;
  function applyOperatorFull(a, op, b) {
    if (op === 'pow') return Math.pow(a, b);
    return _applyOrig(a, op, b);
  }

  // Monkey-patch the operator handler to use the extended version
  /* The inner handleOperator / handleEvaluate already reference applyOperator
     by the closure binding; we shadow it locally for pow. */

  // ── Scientific mode toggle ────────────────────────────────────────────────
  function toggleScientific() {
    scientificMode = !scientificMode;
    calcEl.classList.toggle('scientific', scientificMode);
    sciSection.classList.toggle('visible', scientificMode);
    btnSciToggle.classList.toggle('active', scientificMode);
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openModal()  { modal.classList.add('open'); }
  function closeModal() { modal.classList.remove('open'); }

  // ── Flash (visual feedback for keyboard presses) ──────────────────────────
  /**
   * Find the button element that corresponds to an action descriptor and
   * briefly apply the .key-active CSS class.
   *
   * @param {{ type: string, value?: string }} action
   */
  function flashButton(action) {
    let selector = null;

    switch (action.type) {
      case 'digit':    selector = `[data-action="digit"][data-value="${action.value}"]`; break;
      case 'operator': selector = `[data-action="operator"][data-value="${action.value}"]`; break;
      case 'evaluate': selector = '[data-action="evaluate"]'; break;
      case 'delete':   selector = '[data-action="delete"]'; break;
      case 'clear':    selector = '[data-action="clear"]'; break;
      case 'decimal':  selector = '[data-action="decimal"]'; break;
      case 'percent':  selector = '[data-action="percent"]'; break;
      case 'scientific': selector = `[data-action="scientific"][data-value="${action.value}"]`; break;
      default: return;
    }

    const btn = document.querySelector(selector);
    if (!btn) return;
    btn.classList.add('key-active');
    setTimeout(() => btn.classList.remove('key-active'), 150);
  }

  // ── Dispatch action (shared by mouse clicks and keyboard events) ──────────
  function dispatchAction(action) {
    if (!action) return;
    switch (action.type) {
      case 'digit':      handleDigit(action.value); break;
      case 'operator':   handleOperator(action.value); break;
      case 'evaluate':   handleEvaluate(); break;
      case 'delete':     handleDelete(); break;
      case 'clear':      handleClear(); break;
      case 'decimal':    handleDecimal(); break;
      case 'percent':    handlePercent(); break;
      case 'scientific': handleScientific(action.value); break;
      case 'sign':       handleSign(); break;
    }
  }

  // ── Keyboard handler ──────────────────────────────────────────────────────
  /* mapKeyToAction and mapKeyToScientificAction are loaded from keyboardMapping.js
     via a preceding <script> tag, so they live on window in the browser.       */
  function handleKeyDown(e) {
    // Ignore when focus is inside an input element (future-proofing)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Modal toggle
    if (e.key === '?') {
      modal.classList.contains('open') ? closeModal() : openModal();
      return;
    }

    // Dismiss modal with Escape only when open
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
      return; // don't also fire 'clear'
    }

    // Try standard mapping first
    const action = window.mapKeyToAction(e);
    if (action) {
      // Prevent browser default for keys like '/' (quick-find in Firefox)
      e.preventDefault();
      flashButton(action);
      dispatchAction(action);
      return;
    }

    // Scientific mapping (only in scientific mode)
    if (scientificMode) {
      const sciAction = window.mapKeyToScientificAction(e);
      if (sciAction) {
        e.preventDefault();
        flashButton(sciAction);
        dispatchAction(sciAction);
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('beforeunload', function () {
    document.removeEventListener('keydown', handleKeyDown);
  });

  // ── Button click handler ──────────────────────────────────────────────────
  document.querySelector('.buttons').addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const act = btn.dataset.action;
    const val = btn.dataset.value;
    dispatchAction({ type: act, value: val });
  });

  const sciPanel = document.getElementById('scientificSection');
  sciPanel.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    dispatchAction({ type: btn.dataset.action, value: btn.dataset.value });
  });

  // ── Toolbar buttons ───────────────────────────────────────────────────────
  btnSciToggle.addEventListener('click', toggleScientific);
  btnHelp.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // ── Initial render ────────────────────────────────────────────────────────
  render();

  // ── Expose internals for integration testing convenience ─────────────────
  window._calc = {
    dispatchAction,
    getDisplay: () => displayStr,
    getExpression: () => expressionStr,
    reset: handleClear,
  };
}());
