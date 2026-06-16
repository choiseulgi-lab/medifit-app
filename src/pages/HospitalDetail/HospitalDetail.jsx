import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, CheckCircle2, CalendarDays, Star, ThumbsUp, ArrowUp } from 'lucide-react';
import { TopBar } from '../../components';
import { DOCTORS, HOSPITAL_REVIEWS } from '../../data/mock';
import styles from './HospitalDetail.module.css';

const HOURS = [
  { day: '오늘 (월)', time: '09:00 – 18:00', today: true },
  { day: '화요일',   time: '09:00 – 18:00' },
  { day: '수요일',   time: '09:00 – 18:00' },
  { day: '목요일',   time: '09:00 – 18:00' },
  { day: '금요일',   time: '09:00 – 17:00' },
  { day: '토요일',   time: '09:00 – 13:00' },
  { day: '일요일',   time: '휴진' },
];

const SORT_OPTIONS = ['최신순', '추천순'];

function StarRow({ rating, size = 14 }) {
  return (
    <span className={styles.starRow}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={size}
          strokeWidth={1.5}
          color="var(--color-accent)"
          fill={n <= rating ? 'var(--color-accent)' : 'none'}
        />
      ))}
    </span>
  );
}

export default function HospitalDetail({ hospital, onBack, onBook }) {
  const h = hospital ?? {
    name: '강남 연세내과의원', dept: '내과',
    address: '서울 강남구 역삼동 123', phone: '02-1234-5678',
    waitCount: 3, waitTime: 15, rating: 4.8, reviewCount: 312,
  };

  const doctorsByHospital = DOCTORS.filter(d => d.hospitalId === hospital?.id);
  const doctors = (doctorsByHospital.length > 0 ? doctorsByHospital : DOCTORS).slice(0, 3);

  const rawReviews = HOSPITAL_REVIEWS.filter(r => r.hospitalId === (hospital?.id ?? 1));
  const avgRating  = rawReviews.length
    ? (rawReviews.reduce((s, r) => s + r.rating, 0) / rawReviews.length).toFixed(1)
    : h.rating ?? 4.8;

  const [sort, setSort]         = useState('최신순');
  const [showTop, setShowTop]   = useState(false);
  const pageRef                 = useRef(null);

  const sortedReviews = [...rawReviews].sort((a, b) =>
    sort === '추천순'
      ? b.likes - a.likes
      : new Date(b.date) - new Date(a.date)
  );

  /* ── 스크롤 감지 → Top 버튼 표시 ── */
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 350);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <TopBar title={h.name} onBack={onBack} />
      <div className={styles.page} ref={pageRef}>

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

        {/* 의료진 */}
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

        {/* 리뷰 */}
        <div className={styles.section}>
          {/* 헤더 */}
          <div className={styles.reviewHeader}>
            <div className={styles.reviewTitleWrap}>
              <p className={styles.secTitle}>리뷰</p>
              <div className={styles.reviewSummary}>
                <Star size={15} color="var(--color-accent)" fill="var(--color-accent)" />
                <span className={styles.reviewAvg}>{avgRating}</span>
                <span className={styles.reviewTotal}>({h.reviewCount ?? rawReviews.length})</span>
              </div>
            </div>

            {/* 정렬 */}
            {rawReviews.length > 0 && (
              <div className={styles.sortRow}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    className={[styles.sortBtn, sort === opt && styles.sortBtnActive].filter(Boolean).join(' ')}
                    onClick={() => setSort(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {rawReviews.length === 0 ? (
            <p className={styles.reviewEmpty}>아직 리뷰가 없어요. 첫 리뷰를 남겨보세요!</p>
          ) : (
            <div className={styles.reviewList}>
              {sortedReviews.map(r => (
                <div key={r.id} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <div className={styles.reviewAuthorWrap}>
                      <span className={styles.reviewAuthor}>{r.author}</span>
                      <span className={styles.reviewDate}>{r.date}</span>
                    </div>
                    <StarRow rating={r.rating} />
                  </div>
                  <div className={styles.reviewTags}>
                    {r.tags.map(t => (
                      <span key={t} className={styles.reviewTag}>{t}</span>
                    ))}
                  </div>
                  <p className={styles.reviewContent}>{r.content}</p>
                  <div className={styles.reviewFooter}>
                    <button className={styles.likeBtn}>
                      <ThumbsUp size={13} strokeWidth={1.8} />
                      도움돼요 {r.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Top 버튼 */}
      {showTop && (
        <button className={styles.topBtn} onClick={scrollToTop}>
          <ArrowUp size={18} strokeWidth={2.5} />
        </button>
      )}

      <div className={styles.sticky}>
        <button className={styles.bookBtn} onClick={onBook}>
          <CalendarDays size={20} /> 예약하기
        </button>
      </div>
    </>
  );
}
