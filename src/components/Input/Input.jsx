import styles from './Input.module.css';

export default function Input({
  label,
  required = false,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputWrap}>
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            styles.input,
            error && styles.error,
            leftIcon && styles.hasLeft,
            rightIcon && styles.hasRight,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />

        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
      {!error && helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
}
