import { ChevronLeft } from 'lucide-react';
import styles from './TopBar.module.css';

export default function TopBar({
  title,
  titleAlign = 'center',
  onBack,
  right,
  className = '',
}) {
  return (
    <header className={[styles.topBar, className].filter(Boolean).join(' ')}>
      {onBack ? (
        <button className={styles.backBtn} onClick={onBack}>
          <ChevronLeft size={24} />
        </button>
      ) : (
        <div style={{ width: 40 }} />
      )}

      <h1 className={[styles.title, titleAlign === 'left' && styles.titleLeft].filter(Boolean).join(' ')}>
        {title}
      </h1>

      <div className={styles.right}>
        {right ?? <div style={{ width: 40 }} />}
      </div>
    </header>
  );
}

export function TopBarIconBtn({ children, onClick }) {
  return (
    <button className={styles.iconBtn} onClick={onClick}>
      {children}
    </button>
  );
}
