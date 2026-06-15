import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'l',
  fullWidth = true,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        !fullWidth && styles.auto,
        loading && styles.loading,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
}
