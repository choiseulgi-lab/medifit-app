import styles from './Badge.module.css';

const LABEL = {
  scheduled: '예정',
  completed: '완료',
  cancelled: '취소',
  waiting: '대기중',
  error: '오류',
};

export default function Badge({ variant = 'scheduled', label, className = '' }) {
  return (
    <span
      className={[styles.badge, styles[variant], className].filter(Boolean).join(' ')}
    >
      {label ?? LABEL[variant]}
    </span>
  );
}
