import styles from './AngleToggle.module.css';

export default function AngleToggle({ angleUnit, onToggle }) {
  return (
    <div className={styles.toggle} role="group" aria-label="Angle unit">
      <button
        type="button"
        className={[styles.btn, angleUnit === 'deg' ? styles.active : ''].join(' ')}
        onClick={() => onToggle('deg')}
        aria-pressed={angleUnit === 'deg'}
      >
        DEG
      </button>
      <button
        type="button"
        className={[styles.btn, angleUnit === 'rad' ? styles.active : ''].join(' ')}
        onClick={() => onToggle('rad')}
        aria-pressed={angleUnit === 'rad'}
      >
        RAD
      </button>
    </div>
  );
}
