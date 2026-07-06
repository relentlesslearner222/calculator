import styles from './AngleToggle.module.css';

export default function AngleToggle({ angleUnit, onSetAngleUnit }) {
  return (
    <div className={styles.toggle} role="group" aria-label="Angle unit">
      <button
        type="button"
        className={`${styles.btn} ${angleUnit === 'deg' ? styles.active : ''}`}
        aria-pressed={angleUnit === 'deg'}
        onClick={() => onSetAngleUnit('deg')}
      >
        DEG
      </button>
      <button
        type="button"
        className={`${styles.btn} ${angleUnit === 'rad' ? styles.active : ''}`}
        aria-pressed={angleUnit === 'rad'}
        onClick={() => onSetAngleUnit('rad')}
      >
        RAD
      </button>
    </div>
  );
}
