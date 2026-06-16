import { useState } from 'react';
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TopBar } from '../../components';
import { DOCTORS, TIME_SLOTS, UNAVAILABLE_SLOTS } from '../../data/mock';
import styles from './BookingPage.module.css';

const STEPS = ['의사 선택', '날짜·시간', '예약 확인'];

/* ── 날짜 생성 (오늘부터 14일) ── */
function buildDates() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    dates.push({
      key: d.toISOString().slice(0, 10),
      month: d.getMonth() + 1,
      day: d.getDate(),
      weekday,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      isToday: i === 0,
    });
  }
  return dates;
}

const DATES = buildDates();

export default function BookingPage({ hospital, onBack, onDone }) {
  const h = hospital ?? { name: '강남 연세내과의원', dept: '내과' };
  const doctors = DOCTORS.filter(d => d.hospitalId === (hospital?.id ?? 1)).slice(0, 3);

  const [step, setStep]     = useState(0);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate]     = useState(null);
  const [time, setTime]     = useState(null);
  const [done, setDone]     = useState(false);

  const canNext = [
    !!doctor,
    !!(date && time),
    true,
  ][step];

  const handleNext = () => {
    if (step < 2) { setStep(s => s + 1); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div className={styles.donePage}>
        <div className={styles.doneIcon}><CheckCircle2 size={64} color="var(--color-secondary)" /></div>
        <p className={styles.doneTitle}>예약이 완료됐어요!</p>
        <p className={styles.doneSub}>
          {h.name}<br />
          {doctor?.name} {doctor?.title} · {date} {time}
        </p>
        <button className={styles.doneBtn} onClick={onDone}>예약 확인하기</button>
      </div>
    );
  }

  return (
    <>
      <TopBar title="예약하기" onBack={step === 0 ? onBack : () => setStep(s => s - 1)} />

      {/* 진행 단계 */}
      <div className={styles.stepper}>
        {STEPS.map((label, i) => (
          <div key={label} className={styles.stepItem}>
            <div className={[styles.stepDot, i <= step && styles.stepDotActive, i < step && styles.stepDotDone].filter(Boolean).join(' ')}>
              {i < step ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={[styles.stepLabel, i === step && styles.stepLabelActive].filter(Boolean).join(' ')}>{label}</span>
            {i < STEPS.length - 1 && <div className={[styles.stepLine, i < step && styles.stepLineDone].filter(Boolean).join(' ')} />}
          </div>
        ))}
      </div>

      <div className={styles.page}>

        {/* ── Step 0: 의사 선택 ── */}
        {step === 0 && (
          <div>
            <p className={styles.sectionTitle}>의사 선택</p>
            {doctors.map(d => (
              <button
                key={d.id}
                className={[styles.doctorCard, doctor?.id === d.id && styles.doctorCardActive, !d.available && styles.doctorCardDisabled].filter(Boolean).join(' ')}
                onClick={() => d.available && setDoctor(d)}
                disabled={!d.available}
              >
                <div className={styles.avatar}>👨‍⚕️</div>
                <div className={styles.doctorInfo}>
                  <p className={styles.doctorName}>{d.name} {d.title}</p>
                  <p className={styles.doctorSpec}>{d.specialty.join(' · ')}</p>
                  <div className={styles.doctorTags}>
                    {d.tags.slice(0, 2).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  </div>
                </div>
                <div className={styles.doctorRight}>
                  {d.available
                    ? <span className={styles.availBadge}>예약 가능</span>
                    : <span className={styles.unavailBadge}>예약 불가</span>}
                  {doctor?.id === d.id && <CheckCircle2 size={20} color="var(--color-primary)" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Step 1: 날짜·시간 ── */}
        {step === 1 && (
          <div>
            <p className={styles.sectionTitle}>날짜 선택</p>
            <div className={styles.dateScroll}>
              {DATES.map(d => (
                <button
                  key={d.key}
                  className={[styles.dateItem, d.isWeekend && styles.dateWeekend, date === d.key && styles.dateActive].filter(Boolean).join(' ')}
                  onClick={() => { setDate(d.key); setTime(null); }}
                >
                  <span className={styles.dateWeekdayLabel}>{d.isToday ? '오늘' : d.weekday}</span>
                  <span className={styles.dateDayNum}>{d.day}</span>
                  {d.isToday && <span className={styles.todayDot} />}
                </button>
              ))}
            </div>

            {date && (
              <>
                <p className={styles.sectionTitle} style={{ marginTop: 'var(--spacing-5)' }}>오전</p>
                <div className={styles.timeGrid}>
                  {TIME_SLOTS.AM.map(t => {
                    const unavail = UNAVAILABLE_SLOTS.includes(t);
                    return (
                      <button
                        key={t}
                        className={[styles.timeBtn, time === t && styles.timeBtnActive, unavail && styles.timeBtnUnavail].filter(Boolean).join(' ')}
                        onClick={() => !unavail && setTime(t)}
                        disabled={unavail}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>

                <p className={styles.sectionTitle} style={{ marginTop: 'var(--spacing-4)' }}>오후</p>
                <div className={styles.timeGrid}>
                  {TIME_SLOTS.PM.map(t => {
                    const unavail = UNAVAILABLE_SLOTS.includes(t);
                    return (
                      <button
                        key={t}
                        className={[styles.timeBtn, time === t && styles.timeBtnActive, unavail && styles.timeBtnUnavail].filter(Boolean).join(' ')}
                        onClick={() => !unavail && setTime(t)}
                        disabled={unavail}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                <div className={styles.timeLegend}>
                  <span className={styles.legendItem}><span className={styles.legendDotAvail} />예약 가능</span>
                  <span className={styles.legendItem}><span className={styles.legendDotUnavail} />예약 불가</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Step 2: 예약 확인 ── */}
        {step === 2 && (
          <div>
            <p className={styles.sectionTitle}>예약 내용 확인</p>
            <div className={styles.confirmCard}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>병원</span>
                <span className={styles.confirmValue}>{h.name}</span>
              </div>
              <div className={styles.confirmDivider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>진료과</span>
                <span className={styles.confirmValue}>{h.dept}</span>
              </div>
              <div className={styles.confirmDivider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>의사</span>
                <span className={styles.confirmValue}>{doctor?.name} {doctor?.title}</span>
              </div>
              <div className={styles.confirmDivider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>날짜</span>
                <span className={styles.confirmValue}>{date}</span>
              </div>
              <div className={styles.confirmDivider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>시간</span>
                <span className={styles.confirmValue}>{time}</span>
              </div>
            </div>

            <div className={styles.confirmNotice}>
              <p className={styles.noticeTitle}>예약 안내</p>
              <p className={styles.noticeText}>· 예약 취소는 방문 1시간 전까지 가능해요.</p>
              <p className={styles.noticeText}>· 진료 10분 전에 도착하시면 대기가 줄어들어요.</p>
              <p className={styles.noticeText}>· 초진이신 경우 신분증을 지참해 주세요.</p>
            </div>
          </div>
        )}

      </div>

      {/* 하단 CTA */}
      <div className={styles.bottomCta}>
        <button
          className={styles.ctaBtn}
          disabled={!canNext}
          onClick={handleNext}
        >
          <CalendarDays size={20} />
          {step === 2 ? '예약 확정하기' : '다음 단계'}
        </button>
      </div>
    </>
  );
}
