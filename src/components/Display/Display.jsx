import styles from './Display.module.css';

export default function Display({ expression, display }) {
  const isError = display === 'Error';
  return (
    <div
      className={styles.display}
      role="status"
      aria-live="polite"
      aria-label={`Result: ${display}`}
    >
      <div className={styles.expression} aria-hidden="true">
        {expression || '\u00a0'}
      </div>
      <div className={`${styles.value} ${isError ? styles.error : ''}`}>
        {display}
      </div>
    </div>
  );
}
