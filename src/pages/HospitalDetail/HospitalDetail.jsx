import { MapPin, Phone, CheckCircle2, CalendarDays } from 'lucide-react';
import { TopBar } from '../../components';
import { DOCTORS } from '../../data/mock';
import styles from './HospitalDetail.module.css';

const HOURS = [
  { day: '오늘 (월)', time: '09:00 – 18:00', today: true },
  { day: '화요일', time: '09:00 – 18:00' },
  { day: '수요일', time: '09:00 – 18:00' },
  { day: '목요일', time: '09:00 – 18:00' },
  { day: '금요일', time: '09:00 – 17:00' },
  { day: '토요일', time: '09:00 – 13:00' },
  { day: '일요일', time: '휴진' },
];

export default function HospitalDetail({ hospital, onBack, onBook }) {
  const h = hospital ?? { name: '강남 연세내과의원', dept: '내과', address: '서울 강남구 역삼동 123', phone: '02-1234-5678', waitCount: 3, waitTime: 15 };
  const doctors = DOCTORS.filter(d => d.hospitalId === 1).slice(0, 3);

  return (
    <>
      <TopBar title={h.name} onBack={onBack} />
      <div className={styles.page}>

        <div className={styles.heroBox}>
          <span className={styles.heroEmoji}>🏥</span>
        </div>

        <div className={styles.info}>
          <p className={styles.name}>{h.name}</p>
          <p className={styles.addr}><MapPin size={13} />{h.address}</p>
          <p className={styles.addr}><Phone size={13} />{h.phone}</p>
        </div>

        {/* 실시간 대기 */}
        <div className={styles.section}>
          <p className={styles.secTitle}>실시간 대기 현황</p>
          <div className={styles.waitCard}>
            <div className={styles.waitTop}>
              <span style={{ fontSize: 'var(--font-size-body2)', fontWeight: 600 }}>현재 대기 현황</span>
              <span className={styles.liveChip}><span className={styles.liveDot} />LIVE</span>
            </div>
            <div className={styles.waitStats}>
              <div className={styles.stat}><div className={styles.statNum}>{h.waitCount ?? 3}</div><div className={styles.statUnit}>대기 인원</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{h.waitTime ?? 15}</div><div className={styles.statUnit}>예상 대기(분)</div></div>
              <div className={styles.stat}><div className={styles.statNum}>4</div><div className={styles.statUnit}>진료 중 번호</div></div>
            </div>
            {(h.waitCount ?? 3) <= 3 && (
              <div className={styles.goodBadge}><CheckCircle2 size={15} />지금 방문하기 좋은 시간이에요</div>
            )}
          </div>
        </div>

        {/* 운영시간 */}
        <div className={styles.section}>
          <p className={styles.secTitle}>운영시간</p>
          <div className={styles.hours}>
            {HOURS.map(r => (
              <div key={r.day} className={styles.hourRow}>
                <span className={`${styles.hourDay} ${r.today ? styles.hourToday : ''}`}>{r.day}</span>
                <span className={`${styles.hourTime} ${r.today ? styles.hourToday : ''}`}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 의사 목록 */}
        <div className={styles.section}>
          <p className={styles.secTitle}>의료진</p>
          {doctors.map(d => (
            <div key={d.id} className={styles.doctorRow}>
              <div className={styles.avatar}>👨‍⚕️</div>
              <div style={{ flex: 1 }}>
                <p className={styles.doctorName}>{d.name} {d.title}</p>
                <p className={styles.doctorSpec}>{d.specialty.join(' · ')}</p>
              </div>
              {d.available && <span className={styles.availChip}>예약 가능</span>}
            </div>
          ))}
        </div>

      </div>

      <div className={styles.sticky}>
        <button className={styles.bookBtn} onClick={onBook}>
          <CalendarDays size={20} /> 예약하기
        </button>
      </div>
    </>
  );
}
