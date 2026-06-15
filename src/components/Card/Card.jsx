import styles from './Card.module.css';

export default function Card({
  children,
  onClick,
  selected = false,
  flat = false,
  className = '',
  style,
}) {
  return (
    <div
      className={[
        styles.card,
        onClick && styles.clickable,
        selected && styles.selected,
        flat && styles.flat,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
