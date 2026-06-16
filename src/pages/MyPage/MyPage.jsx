import {
  User, Bell, Heart, Star, FileText,
  ChevronRight, Shield, HelpCircle, LogOut,
  CalendarDays, Hospital, Edit3,
} from 'lucide-react';
import { MY_BOOKINGS } from '../../data/mock';
import styles from './MyPage.module.css';

/* ── 더미 유저 프로필 ── */
const PROFILE = {
  name: '최슬기',
  email: 'kcmcom8282@gmail.com',
  phone: '010-1234-5678',
  birthYear: 1992,
  gender: '여성',
  bloodType: 'A+',
};

/* ── 통계 계산 ── */
const totalBookings  = MY_BOOKINGS.length;
const doneBookings   = MY_BOOKINGS.filter(b => b.status === 'completed').length;
const uniqueHospitals = [...new Set(MY_BOOKINGS.map(b => b.hospital))].length;

/* ── 메뉴 그룹 ── */
const MENUS = [
  {
    group: '건강 관리',
    items: [
      { Icon: Heart,    label: '건강 정보 관리',   sub: '혈액형, 알레르기, 복용 약물' },
      { Icon: FileText, label: '진료 기록',         sub: `총 ${doneBookings}건 방문` },
      { Icon: Star,     label: '즐겨찾기 병원',     sub: '자주 가는 병원 바로 예약' },
    ],
  },
  {
    group: '알림·설정',
    items: [
      { Icon: Bell,    label: '알림 설정',   sub: '예약 알림, 건강 팁' },
      { Icon: Shield,  label: '개인정보 관리', sub: '정보 수정 및 보안' },
      { Icon: HelpCircle, label: '고객센터', sub: '문의 및 도움말' },
    ],
  },
];

export default function MyPage() {
  return (
    <div className={styles.page}>

      {/* ── 프로필 헤더 ── */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            <User size={36} color="var(--color-primary)" strokeWidth={1.5} />
          </div>
          <button className={styles.editBtn}>
            <Edit3 size={13} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        <div className={styles.profileInfo}>
          <p className={styles.profileName}>{PROFILE.name}</p>
          <p className={styles.profileEmail}>{PROFILE.email}</p>
        </div>

        <button className={styles.profileEditBtn}>프로필 수정</button>
      </div>

      {/* ── 이용 통계 ── */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <CalendarDays size={18} color="var(--color-primary)" strokeWidth={1.8} />
          <span className={styles.statNum}>{totalBookings}</span>
          <span className={styles.statLabel}>총 예약</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <Hospital size={18} color="var(--color-secondary)" strokeWidth={1.8} />
          <span className={styles.statNum}>{uniqueHospitals}</span>
          <span className={styles.statLabel}>방문 병원</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <Star size={18} color="var(--color-accent)" strokeWidth={1.8} fill="var(--color-accent)" />
          <span className={styles.statNum}>{doneBookings}</span>
          <span className={styles.statLabel}>진료 완료</span>
        </div>
      </div>

      {/* ── 건강 정보 카드 ── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>내 건강 정보</p>
        <div className={styles.healthCard}>
          {[
            { label: '생년',    value: `${PROFILE.birthYear}년생` },
            { label: '성별',    value: PROFILE.gender },
            { label: '혈액형',  value: PROFILE.bloodType },
            { label: '연락처',  value: PROFILE.phone },
          ].map(({ label, value }) => (
            <div key={label} className={styles.healthRow}>
              <span className={styles.healthLabel}>{label}</span>
              <span className={styles.healthValue}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 메뉴 목록 ── */}
      {MENUS.map(({ group, items }) => (
        <div key={group} className={styles.section}>
          <p className={styles.sectionTitle}>{group}</p>
          <div className={styles.menuCard}>
            {items.map(({ Icon, label, sub }, i) => (
              <button key={label} className={styles.menuRow}>
                <span className={styles.menuIcon}>
                  <Icon size={18} strokeWidth={1.8} color="var(--color-primary)" />
                </span>
                <div className={styles.menuText}>
                  <span className={styles.menuLabel}>{label}</span>
                  {sub && <span className={styles.menuSub}>{sub}</span>}
                </div>
                <ChevronRight size={16} color="var(--color-text-muted)" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* ── 로그아웃 ── */}
      <div className={styles.section}>
        <button className={styles.logoutBtn}>
          <LogOut size={16} strokeWidth={1.8} />
          로그아웃
        </button>
        <p className={styles.versionText}>MEDIFIT v1.0.0</p>
      </div>

    </div>
  );
}
