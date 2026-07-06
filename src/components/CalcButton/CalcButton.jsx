import styles from './CalcButton.module.css';

export default function CalcButton({ label, ariaLabel, onClick, variant = 'default', wide, active }) {
  return (
    <button
      className={[
        styles.button,
        styles[variant],
        wide ? styles.wide : '',
        active ? styles.active : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      aria-label={ariaLabel || label}
      data-active={active ? 'true' : undefined}
      type="button"
    >
      {label}
    </button>
  );
}
