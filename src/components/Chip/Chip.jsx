import styles from './Chip.module.css';

export default function Chip({ label, active = false, onClick, icon, className = '' }) {
  return (
    <button
      type="button"
      className={[styles.chip, active && styles.active, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {icon && icon}
      {label}
    </button>
  );
}
