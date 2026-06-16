import {
  MapPin, ChevronDown, Bell, Search,
  Heart, Baby, Sparkles, Bone, Eye, Ear,
  CalendarDays, ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { MY_BOOKINGS } from '../../data/mock';
import styles from './Home.module.css';

const DEPARTMENTS = [
  { label: '내과',       Icon: Heart,    bg: '#EFF6FF', color: '#2563EB' },
  { label: '소아과',     Icon: Baby,     bg: '#FFF7ED', color: '#EA580C' },
  { label: '피부과',     Icon: Sparkles, bg: '#FDF4FF', color: '#9333EA' },
  { label: '정형외과',   Icon: Bone,     bg: '#F0FDF4', color: '#16A34A' },
  { label: '안과',       Icon: Eye,      bg: '#FEFCE8', color: '#CA8A04' },
  { label: '이비인후과', Icon: Ear,      bg: '#FFF1F2', color: '#E11D48' },
];

const TIPS = [
  { tag: '예방', title: '환절기 면역력\n관리법', desc: '일교차가 큰 요즘, 면역력을 높이는 생활 습관을 알아보세요.', bg: '#EFF6FF', color: '#1E3A5F' },
  { tag: '건강팁', title: '충분한 수면이\n건강의 기본', desc: '성인 권장 수면 시간은 7~9시간. 숙면의 조건을 확인하세요.', bg: '#F0FDF4', color: '#14532D' },
  { tag: '영양', title: '비타민D 부족\n확인하기', desc: '실내 생활이 많은 현대인에게 부족하기 쉬운 비타민D.', bg: '#FFF7ED', color: '#7C2D12' },
  { tag: '운동', title: '하루 30분 걷기의\n놀라운 효과', desc: '심혈관 건강부터 정신 건강까지, 걷기의 효과를 알아보세요.', bg: '#FDF4FF', color: '#3B0764' },
];

/* 가장 가까운 예정 예약 */
const nextBooking = MY_BOOKINGS.find(b => b.status === 'scheduled');

export default function Home({ onBookingClick, onDeptClick }) {
  return (
    <>
      {/* ── 헤더 ── */}
      <header className={styles.header}>
        <button className={styles.location}>
          <MapPin size={16} color="var(--color-primary)" strokeWidth={2.5} />
          <span className={styles.locationName}>서울 강남구</span>
          <ChevronDown size={15} color="var(--color-text-muted)" />
        </button>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn}>
            <Search size={22} />
          </button>
          <button className={styles.iconBtn}>
            <Bell size={22} />
            <span className={styles.notiDot} />
          </button>
        </div>
      </header>

      <div className={styles.page}>

        {/* ── Hero ── */}
        <section className={styles.hero}>
          <p className={styles.greeting}>오늘도 건강한 하루</p>
          <h2 className={styles.heroTitle}>
            어디가 <em>불편</em>하신가요?<br />
            AI가 진료과를 추천해드려요
          </h2>
          <button className={styles.ctaBtn} onClick={onBookingClick}>
            <Search size={20} strokeWidth={2.5} />
            지금 예약하기
          </button>
        </section>

        {/* ── 빠른 진료과 ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>빠른 진료과</span>
            <button className={styles.sectionMore}>
              전체보기 <ChevronRight size={14} />
            </button>
          </div>
          <div className={styles.deptGrid}>
            {DEPARTMENTS.map(({ label, Icon, bg, color }) => (
              <button
                key={label}
                className={styles.deptItem}
                onClick={() => onDeptClick?.(label)}
              >
                <span className={styles.deptIcon} style={{ backgroundColor: bg }}>
                  <Icon size={22} color={color} strokeWidth={1.8} />
                </span>
                <span className={styles.deptLabel}>{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── 내 예약 ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>내 예약</span>
            <button className={styles.sectionMore}>
              전체보기 <ChevronRight size={14} />
            </button>
          </div>

          {nextBooking ? (
            <div className={styles.bookingCard}>
              <div className={styles.bookingTop}>
                <div>
                  <p className={styles.bookingHospital}>{nextBooking.hospital}</p>
                  <p className={styles.bookingMeta}>{nextBooking.dept} · {nextBooking.doctor}</p>
                </div>
                {nextBooking.dDay && (
                  <span className={styles.dDayBadge}>{nextBooking.dDay}</span>
                )}
              </div>
              <div className={styles.bookingDivider} />
              <div className={styles.bookingBottom}>
                <div className={styles.bookingDateTime}>
                  <CalendarDays size={15} color="var(--color-primary)" />
                  {nextBooking.date} {nextBooking.time}
                </div>
                <div className={styles.bookingActions}>
                  <button className={styles.bookingActionBtn}>변경</button>
                  <button className={styles.bookingActionBtn}>취소</button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyBooking}>
              <p className={styles.emptyText}>예정된 예약이 없어요</p>
              <button className={styles.emptyBtn} onClick={onBookingClick}>예약하기</button>
            </div>
          )}
        </section>

        {/* ── 실시간 대기 현황 ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>실시간 대기 현황</span>
            <button className={styles.sectionMore}>
              최근 방문 <ChevronRight size={14} />
            </button>
          </div>
          <div className={styles.waitCard}>
            <div className={styles.waitTop}>
              <div>
                <p className={styles.waitHospital}>강남연세의원</p>
                <p className={styles.waitMeta}>내과 · 강남구 역삼동</p>
              </div>
              <span className={styles.waitLiveBadge}>
                <span className={styles.liveDot} />LIVE
              </span>
            </div>
            <div className={styles.waitStats}>
              <div className={styles.waitStat}>
                <span className={styles.waitStatValue}>3</span>
                <span className={styles.waitStatUnit}>대기 인원</span>
              </div>
              <div className={styles.waitStat}>
                <span className={styles.waitStatValue}>15</span>
                <span className={styles.waitStatUnit}>예상 대기(분)</span>
              </div>
              <div className={styles.waitStat}>
                <span className={styles.waitStatValue}>4</span>
                <span className={styles.waitStatUnit}>내 순번</span>
              </div>
            </div>
            <div className={styles.waitGoodBadge}>
              <CheckCircle2 size={15} />
              지금 방문하기 좋은 시간이에요
            </div>
          </div>
        </section>

        {/* ── 건강 팁 ── */}
        <section>
          <div className={styles.sectionHeader} style={{ padding: '0 var(--spacing-4)', marginBottom: 'var(--spacing-4)', marginTop: 'var(--spacing-5)' }}>
            <span className={styles.sectionTitle}>건강 팁</span>
            <button className={styles.sectionMore}>더보기 <ChevronRight size={14} /></button>
          </div>
          <div className={styles.tipScroll}>
            {TIPS.map((tip) => (
              <div key={tip.title} className={styles.tipCard} style={{ backgroundColor: tip.bg, color: tip.color }}>
                <span className={styles.tipTag}>{tip.tag}</span>
                <p className={styles.tipTitle} style={{ whiteSpace: 'pre-line' }}>{tip.title}</p>
                <p className={styles.tipDesc}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
