import { CalendarDays, Clock, ChevronRight } from 'lucide-react';
import { TopBar } from '../../components';
import { MY_BOOKINGS } from '../../data/mock';
import styles from './BookingList.module.css';

const STATUS_MAP = {
  scheduled: { label: '예약 완료', cls: 'scheduled' },
  completed:  { label: '진료 완료', cls: 'completed' },
  cancelled:  { label: '취소됨',   cls: 'cancelled' },
};

const TABS = ['전체', '예정', '완료/취소'];

export default function BookingList({ onBack }) {
  return (
    <>
      <TopBar title="예약 관리" onBack={onBack} />

      <div className={styles.page}>
        <div className={styles.tabRow}>
          {TABS.map((t, i) => (
            <button key={t} className={[styles.tab, i === 0 && styles.tabActive].filter(Boolean).join(' ')}>
              {t}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {MY_BOOKINGS.map(b => {
            const status = STATUS_MAP[b.status];
            return (
              <div key={b.id} className={[styles.card, b.status === 'cancelled' && styles.cardCancelled].filter(Boolean).join(' ')}>
                <div className={styles.cardTop}>
                  <span className={`${styles.statusBadge} ${styles[`status_${status.cls}`]}`}>
                    {status.label}
                  </span>
                  {b.dDay && <span className={styles.dDayBadge}>{b.dDay}</span>}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.hospitalRow}>
                    <p className={styles.hospitalName}>{b.hospital}</p>
                    {b.memberName && (
                      <span
                        className={styles.memberBadge}
                        style={{ background: b.memberBg, color: b.memberColor }}
                      >
                        {b.memberName} · {b.memberRelation}
                      </span>
                    )}
                  </div>
                  <p className={styles.doctorMeta}>{b.dept} · {b.doctor}</p>
                </div>

                <div className={styles.cardDivider} />

                <div className={styles.cardBottom}>
                  <div className={styles.dateTime}>
                    <span className={styles.dateItem}>
                      <CalendarDays size={13} color="var(--color-primary)" />
                      {b.date}
                    </span>
                    <span className={styles.dot} />
                    <span className={styles.dateItem}>
                      <Clock size={13} color="var(--color-primary)" />
                      {b.time}
                    </span>
                  </div>

                  {b.status === 'scheduled' && (
                    <div className={styles.actions}>
                      <button className={styles.actionBtn}>변경</button>
                      <button className={`${styles.actionBtn} ${styles.actionBtnCancel}`}>취소</button>
                    </div>
                  )}

                  {b.status === 'completed' && (
                    <button className={styles.reviewBtn}>
                      리뷰 작성 <ChevronRight size={13} />
                    </button>
                  )}
                </div>

                {b.status === 'scheduled' && b.waitCount != null && (
                  <div className={styles.waitInfo}>
                    현재 대기 {b.waitCount}명 · 약 {b.waitTime}분
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
