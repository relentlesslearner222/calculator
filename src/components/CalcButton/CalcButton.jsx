import styles from './CalcButton.module.css';

export default function CalcButton({
  label,
  ariaLabel,
  onClick,
  variant = 'default',
  isActive = false,
  span = 1,
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]}`}
      aria-label={ariaLabel || label}
      data-active={isActive ? 'true' : undefined}
      onClick={onClick}
      style={span > 1 ? { gridColumn: `span ${span}` } : undefined}
    >
      {label}
    </button>
  );
}
