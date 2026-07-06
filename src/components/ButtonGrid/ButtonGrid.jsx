import CalcButton from '../CalcButton/CalcButton.jsx';
import styles from './ButtonGrid.module.css';
import { ACTIONS } from '../../engine/calculatorReducer.js';

const BASIC_BUTTONS = [
  // Row 1
  { label: 'AC', ariaLabel: 'Clear all', action: { type: ACTIONS.CLEAR }, variant: 'danger' },
  { label: '+/-', ariaLabel: 'Toggle sign', action: { type: ACTIONS.TOGGLE_SIGN }, variant: 'default' },
  { label: '%', ariaLabel: 'Percentage', action: { type: ACTIONS.PERCENTAGE }, variant: 'default' },
  { label: '\u00F7', ariaLabel: 'Divide', action: { type: ACTIONS.INPUT_OPERATOR, payload: '/' }, variant: 'operator' },
  // Row 2
  { label: '7', action: { type: ACTIONS.INPUT_DIGIT, payload: '7' } },
  { label: '8', action: { type: ACTIONS.INPUT_DIGIT, payload: '8' } },
  { label: '9', action: { type: ACTIONS.INPUT_DIGIT, payload: '9' } },
  { label: '\u00D7', ariaLabel: 'Multiply', action: { type: ACTIONS.INPUT_OPERATOR, payload: '*' }, variant: 'operator' },
  // Row 3
  { label: '4', action: { type: ACTIONS.INPUT_DIGIT, payload: '4' } },
  { label: '5', action: { type: ACTIONS.INPUT_DIGIT, payload: '5' } },
  { label: '6', action: { type: ACTIONS.INPUT_DIGIT, payload: '6' } },
  { label: '\u2212', ariaLabel: 'Subtract', action: { type: ACTIONS.INPUT_OPERATOR, payload: '-' }, variant: 'operator' },
  // Row 4
  { label: '1', action: { type: ACTIONS.INPUT_DIGIT, payload: '1' } },
  { label: '2', action: { type: ACTIONS.INPUT_DIGIT, payload: '2' } },
  { label: '3', action: { type: ACTIONS.INPUT_DIGIT, payload: '3' } },
  { label: '+', ariaLabel: 'Add', action: { type: ACTIONS.INPUT_OPERATOR, payload: '+' }, variant: 'operator' },
  // Row 5
  { label: '0', ariaLabel: 'Zero', action: { type: ACTIONS.INPUT_DIGIT, payload: '0' }, wide: true },
  { label: '.', ariaLabel: 'Decimal point', action: { type: ACTIONS.INPUT_DECIMAL } },
  { label: '=', ariaLabel: 'Equals', action: { type: ACTIONS.EVALUATE }, variant: 'primary' },
];

const SCI_BUTTONS = [
  { label: 'sin', ariaLabel: 'Sine', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'sin' }, variant: 'sci' },
  { label: 'cos', ariaLabel: 'Cosine', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'cos' }, variant: 'sci' },
  { label: 'tan', ariaLabel: 'Tangent', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'tan' }, variant: 'sci' },
  { label: 'sin\u207B\u00B9', ariaLabel: 'Arcsine', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'asin' }, variant: 'sci' },
  { label: 'cos\u207B\u00B9', ariaLabel: 'Arccosine', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'acos' }, variant: 'sci' },
  { label: 'tan\u207B\u00B9', ariaLabel: 'Arctangent', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'atan' }, variant: 'sci' },
  { label: 'log', ariaLabel: 'Logarithm base 10', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'log' }, variant: 'sci' },
  { label: 'ln', ariaLabel: 'Natural logarithm', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'ln' }, variant: 'sci' },
  { label: '\u221A', ariaLabel: 'Square root', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'sqrt' }, variant: 'sci' },
  { label: 'x\u00B2', ariaLabel: 'Square', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'sq' }, variant: 'sci' },
  { label: 'x\u02B8', ariaLabel: 'Power', action: { type: ACTIONS.INPUT_OPERATOR, payload: '^' }, variant: 'sci' },
  { label: 'n!', ariaLabel: 'Factorial', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'fact' }, variant: 'sci' },
  { label: '\u03C0', ariaLabel: 'Pi', action: { type: ACTIONS.INPUT_CONSTANT, payload: 'PI' }, variant: 'sci' },
  { label: 'e', ariaLabel: "Euler's number", action: { type: ACTIONS.INPUT_CONSTANT, payload: 'E' }, variant: 'sci' },
  { label: 'exp', ariaLabel: 'Exponential', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'exp' }, variant: 'sci' },
  { label: 'abs', ariaLabel: 'Absolute value', action: { type: ACTIONS.INPUT_FUNCTION, payload: 'abs' }, variant: 'sci' },
  { label: '(', ariaLabel: 'Open parenthesis', action: { type: ACTIONS.OPEN_PAREN }, variant: 'sci' },
  { label: ')', ariaLabel: 'Close parenthesis', action: { type: ACTIONS.CLOSE_PAREN }, variant: 'sci' },
];

export default function ButtonGrid({ mode, dispatch, activeKey }) {
  const keyLabelMap = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '+': '+', '-': '\u2212', '*': '\u00D7', '/': '\u00F7',
    'Enter': '=', '=': '=', 'Backspace': '\u232B', '.': '.',
    'Escape': 'AC', 'Delete': 'AC', '%': '%', '^': 'x\u02B8',
    '(': '(', ')': ')',
  };
  const activeLabel = activeKey ? keyLabelMap[activeKey] : null;

  return (
    <div className={styles.container}>
      {mode === 'scientific' && (
        <div className={styles.sciGrid}>
          {SCI_BUTTONS.map((btn) => (
            <CalcButton
              key={btn.label}
              label={btn.label}
              ariaLabel={btn.ariaLabel}
              variant={btn.variant}
              active={activeLabel === btn.label}
              onClick={() => dispatch(btn.action)}
            />
          ))}
        </div>
      )}
      <div className={styles.basicGrid}>
        {BASIC_BUTTONS.map((btn) => (
          <CalcButton
            key={btn.label}
            label={btn.label}
            ariaLabel={btn.ariaLabel}
            variant={btn.variant || 'default'}
            wide={btn.wide}
            active={activeLabel === btn.label}
            onClick={() => dispatch(btn.action)}
          />
        ))}
      </div>
    </div>
  );
}
