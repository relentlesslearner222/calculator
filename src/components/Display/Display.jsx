import styles from './Display.module.css';

export default function Display({ expression, display }) {
  return (
    <div
      className={styles.display}
      role="status"
      aria-live="polite"
      aria-label={`Expression: ${expression || ''}. Result: ${display}`}
    >
      <div className={styles.expression} aria-hidden="true">
        {expression || '\u00A0'}
      </div>
      <div className={styles.value} aria-hidden="true">
        {display}
      </div>
    </div>
  );
}
