import styles from './ModeToggle.module.css';

export default function ModeToggle({ mode, onToggle }) {
  return (
    <div className={styles.toggle} role="group" aria-label="Calculator mode">
      <button
        type="button"
        className={[styles.btn, mode === 'basic' ? styles.active : ''].join(' ')}
        onClick={() => onToggle('basic')}
        aria-pressed={mode === 'basic'}
      >
        Basic
      </button>
      <button
        type="button"
        className={[styles.btn, mode === 'scientific' ? styles.active : ''].join(' ')}
        onClick={() => onToggle('scientific')}
        aria-pressed={mode === 'scientific'}
      >
        Scientific
      </button>
    </div>
  );
}
