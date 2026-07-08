/**
 * keyboardMapping.js
 * Pure key-to-action mapping logic (exported for testability).
 */

/**
 * Standard key map (always active)
 * Returns an action descriptor or null.
 *
 * @typedef {{ type: 'digit'|'operator'|'evaluate'|'delete'|'clear'|'decimal'|'percent'|'scientific', value?: string }} Action
 *
 * @param {KeyboardEvent|{key: string}} event
 * @returns {Action|null}
 */
function mapKeyToAction(event) {
  const key = event.key;

  // Digits 0-9
  if (/^[0-9]$/.test(key)) {
    return { type: 'digit', value: key };
  }

  // Operators
  if (key === '+') return { type: 'operator', value: '+' };
  if (key === '-') return { type: 'operator', value: '-' };
  if (key === '*') return { type: 'operator', value: '*' };
  if (key === '/') return { type: 'operator', value: '/' };

  // Evaluate
  if (key === 'Enter' || key === '=') return { type: 'evaluate' };

  // Backspace / delete last char
  if (key === 'Backspace') return { type: 'delete' };

  // Escape / clear
  if (key === 'Escape') return { type: 'clear' };

  // Decimal
  if (key === '.') return { type: 'decimal' };

  // Percent
  if (key === '%') return { type: 'percent' };

  return null;
}

/**
 * Scientific key map (active only in Scientific mode)
 *
 * @param {KeyboardEvent|{key: string}} event
 * @returns {Action|null}
 */
function mapKeyToScientificAction(event) {
  const key = event.key;

  if (key === 's') return { type: 'scientific', value: 'sin' };
  if (key === 'c') return { type: 'scientific', value: 'cos' };
  if (key === 't') return { type: 'scientific', value: 'tan' };
  if (key === 'l') return { type: 'scientific', value: 'log' };
  if (key === 'n') return { type: 'scientific', value: 'ln' };
  if (key === '^') return { type: 'scientific', value: 'pow' };
  if (key === 'r') return { type: 'scientific', value: 'sqrt' };

  return null;
}

module.exports = { mapKeyToAction, mapKeyToScientificAction };
