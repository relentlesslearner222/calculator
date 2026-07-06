import styles from './ModeToggle.module.css';

export default function ModeToggle({ mode, onSetMode }) {
  return (
    <div className={styles.toggle} role="group" aria-label="Calculator mode">
      <button
        type="button"
        className={`${styles.btn} ${mode === 'basic' ? styles.active : ''}`}
        aria-pressed={mode === 'basic'}
        onClick={() => onSetMode('basic')}
      >
        Basic
      </button>
      <button
        type="button"
        className={`${styles.btn} ${mode === 'scientific' ? styles.active : ''}`}
        aria-pressed={mode === 'scientific'}
        onClick={() => onSetMode('scientific')}
      >
        Scientific
      </button>
    </div>
  );
}
