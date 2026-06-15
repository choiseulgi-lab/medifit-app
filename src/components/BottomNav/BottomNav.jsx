import { Home, Search, CalendarDays, HeartPulse, User } from 'lucide-react';
import styles from './BottomNav.module.css';

const TABS = [
  { key: 'home',     label: '홈',       Icon: Home },
  { key: 'search',   label: '검색',     Icon: Search },
  { key: 'bookings', label: '예약관리', Icon: CalendarDays },
  { key: 'health',   label: '건강기록', Icon: HeartPulse },
  { key: 'mypage',   label: '마이페이지', Icon: User },
];

export default function BottomNav({ active, onChange, badges = {} }) {
  return (
    <nav className={styles.nav}>
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          className={[styles.item, active === key && styles.active].filter(Boolean).join(' ')}
          onClick={() => onChange?.(key)}
        >
          <span className={styles.iconWrap}>
            <Icon size={22} strokeWidth={active === key ? 2 : 1.5} />
            {badges[key] && <span className={styles.dot} />}
          </span>
          {label}
        </button>
      ))}
    </nav>
  );
}
