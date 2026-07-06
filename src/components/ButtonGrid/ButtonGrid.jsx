import CalcButton from '../CalcButton/CalcButton.jsx';
import { ACTIONS } from '../../engine/calculatorReducer.js';
import styles from './ButtonGrid.module.css';

const BASIC_BUTTONS = [
  // Row 1: utility
  { label: 'AC', ariaLabel: 'All clear', action: ACTIONS.CLEAR, variant: 'clear' },
  { label: '\u00b1', ariaLabel: 'Toggle sign', action: ACTIONS.TOGGLE_SIGN, variant: 'secondary' },
  { label: '%', ariaLabel: 'Percent', action: ACTIONS.PERCENTAGE, variant: 'secondary' },
  { label: '\u00f7', ariaLabel: 'Divide', action: ACTIONS.INPUT_OPERATOR, payload: '\u00f7', variant: 'operator' },
  // Row 2
  { label: '7', action: ACTIONS.INPUT_DIGIT, payload: '7' },
  { label: '8', action: ACTIONS.INPUT_DIGIT, payload: '8' },
  { label: '9', action: ACTIONS.INPUT_DIGIT, payload: '9' },
  { label: '\u00d7', ariaLabel: 'Multiply', action: ACTIONS.INPUT_OPERATOR, payload: '\u00d7', variant: 'operator' },
  // Row 3
  { label: '4', action: ACTIONS.INPUT_DIGIT, payload: '4' },
  { label: '5', action: ACTIONS.INPUT_DIGIT, payload: '5' },
  { label: '6', action: ACTIONS.INPUT_DIGIT, payload: '6' },
  { label: '-', ariaLabel: 'Subtract', action: ACTIONS.INPUT_OPERATOR, payload: '-', variant: 'operator' },
  // Row 4
  { label: '1', action: ACTIONS.INPUT_DIGIT, payload: '1' },
  { label: '2', action: ACTIONS.INPUT_DIGIT, payload: '2' },
  { label: '3', action: ACTIONS.INPUT_DIGIT, payload: '3' },
  { label: '+', ariaLabel: 'Add', action: ACTIONS.INPUT_OPERATOR, payload: '+', variant: 'operator' },
  // Row 5
  { label: '0', action: ACTIONS.INPUT_DIGIT, payload: '0', span: 2 },
  { label: '.', ariaLabel: 'Decimal point', action: ACTIONS.INPUT_DECIMAL },
  { label: '=', ariaLabel: 'Equals', action: ACTIONS.EVALUATE, variant: 'equals' },
];

const SCI_BUTTONS = [
  { label: 'sin', ariaLabel: 'Sine', action: ACTIONS.INPUT_FUNCTION, payload: 'sin', variant: 'function' },
  { label: 'cos', ariaLabel: 'Cosine', action: ACTIONS.INPUT_FUNCTION, payload: 'cos', variant: 'function' },
  { label: 'tan', ariaLabel: 'Tangent', action: ACTIONS.INPUT_FUNCTION, payload: 'tan', variant: 'function' },
  { label: 'asin', ariaLabel: 'Arc sine', action: ACTIONS.INPUT_FUNCTION, payload: 'asin', variant: 'function' },
  { label: 'acos', ariaLabel: 'Arc cosine', action: ACTIONS.INPUT_FUNCTION, payload: 'acos', variant: 'function' },
  { label: 'atan', ariaLabel: 'Arc tangent', action: ACTIONS.INPUT_FUNCTION, payload: 'atan', variant: 'function' },
  { label: 'log', ariaLabel: 'Logarithm base 10', action: ACTIONS.INPUT_FUNCTION, payload: 'log', variant: 'function' },
  { label: 'ln', ariaLabel: 'Natural logarithm', action: ACTIONS.INPUT_FUNCTION, payload: 'ln', variant: 'function' },
  { label: 'sqrt', ariaLabel: 'Square root', action: ACTIONS.INPUT_FUNCTION, payload: 'sqrt', variant: 'function' },
  { label: 'x\u00b2', ariaLabel: 'Square', action: ACTIONS.INPUT_OPERATOR, payload: '^', variant: 'function' },
  { label: 'x^y', ariaLabel: 'Power', action: ACTIONS.INPUT_OPERATOR, payload: '^', variant: 'function' },
  { label: 'abs', ariaLabel: 'Absolute value', action: ACTIONS.INPUT_FUNCTION, payload: 'abs', variant: 'function' },
  { label: 'exp', ariaLabel: 'Exponential e to x', action: ACTIONS.INPUT_FUNCTION, payload: 'exp', variant: 'function' },
  { label: 'n!', ariaLabel: 'Factorial', action: ACTIONS.INPUT_FUNCTION, payload: 'fact', variant: 'function' },
  { label: '(', ariaLabel: 'Open parenthesis', action: ACTIONS.OPEN_PAREN, variant: 'secondary' },
  { label: ')', ariaLabel: 'Close parenthesis', action: ACTIONS.CLOSE_PAREN, variant: 'secondary' },
  { label: '\u03c0', ariaLabel: 'Pi constant', action: ACTIONS.INPUT_CONSTANT, payload: 'PI', variant: 'function' },
  { label: 'e', ariaLabel: 'Euler number constant', action: ACTIONS.INPUT_CONSTANT, payload: 'E', variant: 'function' },
];

export default function ButtonGrid({ mode, dispatch, activeKey }) {
  function handleClick(btn) {
    const actionPayload = btn.payload !== undefined ? btn.payload : btn.label;
    dispatch({ type: btn.action, payload: actionPayload });
  }

  return (
    <div className={styles.wrapper}>
      {mode === 'scientific' && (
        <div className={styles.sciGrid} aria-label="Scientific functions">
          {SCI_BUTTONS.map((btn) => (
            <CalcButton
              key={btn.label}
              label={btn.label}
              ariaLabel={btn.ariaLabel || btn.label}
              variant={btn.variant || 'default'}
              isActive={activeKey === btn.label}
              onClick={() => handleClick(btn)}
            />
          ))}
        </div>
      )}
      <div className={styles.basicGrid}>
        {BASIC_BUTTONS.map((btn) => (
          <CalcButton
            key={btn.label}
            label={btn.label}
            ariaLabel={btn.ariaLabel || btn.label}
            variant={btn.variant || 'default'}
            isActive={activeKey === btn.label}
            span={btn.span}
            onClick={() => handleClick(btn)}
          />
        ))}
      </div>
    </div>
  );
}
