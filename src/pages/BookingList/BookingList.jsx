import { CalendarDays, Clock, CalendarPlus } from 'lucide-react';
import { TopBar } from '../../components';
import styles from './BookingList.module.css';

export default function BookingList({ bookings = [], onBack, onNewBooking }) {
  const scheduled = bookings.filter(b => b.status === 'scheduled');

  return (
    <>
      <TopBar title="예약 관리" onBack={onBack} />

      <div className={styles.page}>
        <div className={styles.list}>
          {scheduled.length === 0 ? (
            <div className={styles.empty}>
              <CalendarPlus size={40} color="var(--color-text-disabled)" strokeWidth={1.5} />
              <p className={styles.emptyTitle}>예정된 예약이 없어요</p>
              <p className={styles.emptySub}>병원 예약을 해보세요</p>
              <button className={styles.emptyBtn} onClick={onNewBooking}>
                예약하기
              </button>
            </div>
          ) : (
            scheduled.map(b => (
              <div key={b.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={`${styles.statusBadge} ${styles.status_scheduled}`}>
                    예약 완료
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
                  <div className={styles.actions}>
                    <button className={styles.actionBtn}>변경</button>
                    <button className={`${styles.actionBtn} ${styles.actionBtnCancel}`}>취소</button>
                  </div>
                </div>

                {b.waitCount != null && b.waitCount > 0 && (
                  <div className={styles.waitInfo}>
                    현재 대기 {b.waitCount}명 · 약 {b.waitTime}분
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
