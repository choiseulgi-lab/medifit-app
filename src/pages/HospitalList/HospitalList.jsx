import { useState } from 'react';
import { Star, Clock, MapPin, List, Map } from 'lucide-react';
import { TopBar, Chip } from '../../components';
import { HOSPITALS } from '../../data/mock';
import styles from './HospitalList.module.css';

const SORTS = ['거리순', '별점순', '대기 적음'];

function WaitBadge({ count, isOpen }) {
  if (!isOpen) return <span className={`${styles.waitBadge} ${styles.waitBadgeClosed}`}>진료 종료</span>;
  if (count === 0) return <span className={`${styles.waitBadge} ${styles.waitBadgeLow}`}>대기 없음</span>;
  if (count <= 3)  return <span className={`${styles.waitBadge} ${styles.waitBadgeLow}`}>대기 {count}명</span>;
  if (count <= 6)  return <span className={`${styles.waitBadge} ${styles.waitBadgeMid}`}>대기 {count}명</span>;
  return              <span className={`${styles.waitBadge} ${styles.waitBadgeHigh}`}>대기 {count}명</span>;
}

export default function HospitalList({ dept = '내과', onBack, onSelect }) {
  const [sort, setSort]   = useState('거리순');
  const [view, setView]   = useState('list');

  const sorted = [...HOSPITALS].sort((a, b) => {
    if (sort === '별점순')   return b.rating - a.rating;
    if (sort === '대기 적음') return (a.isOpen ? a.waitCount : 99) - (b.isOpen ? b.waitCount : 99);
    return parseFloat(a.distance) - parseFloat(b.distance);
  });

  return (
    <>
      <TopBar
        title="병원 선택"
        onBack={onBack}
        right={
          <div style={{ display: 'flex' }}>
            <button
              onClick={() => setView('list')}
              style={{ padding: 8, color: view === 'list' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
            ><List size={20} /></button>
            <button
              onClick={() => setView('map')}
              style={{ padding: 8, color: view === 'map' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
            ><Map size={20} /></button>
          </div>
        }
      />

      <div className={styles.header}>
        <p className={styles.deptLabel}>선택한 진료과</p>
        <p className={styles.deptName}>{dept} 병원</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.sortChips}>
          {SORTS.map(s => <Chip key={s} label={s} active={sort === s} onClick={() => setSort(s)} />)}
        </div>
      </div>

      {view === 'map' ? (
        <div className={styles.mapPlaceholder}>
          <Map size={40} color="var(--color-primary-light)" />
          지도 뷰 (Google Maps 연동 예정)
        </div>
      ) : (
        <div className={styles.list}>
          {sorted.map(h => (
            <div
              key={h.id}
              className={`${styles.card} ${!h.isOpen ? styles.closedOverlay : ''}`}
              onClick={() => h.isOpen && onSelect(h)}
            >
              <div className={styles.cardTop}>
                <div>
                  <p className={styles.cardName}>{h.name}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}><MapPin size={11} />{h.distance}</span>
                    <span className={styles.dot} />
                    <span className={styles.metaItem}><Star size={11} fill="var(--color-accent)" color="var(--color-accent)" />{h.rating} ({h.reviewCount})</span>
                    <span className={styles.dot} />
                    <span className={styles.metaItem}>{h.dept}</span>
                  </div>
                </div>
                {h.nights && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#1E293B', color: '#fff', fontWeight: 600 }}>야간</span>}
              </div>

              <div className={styles.cardDivider} />

              <div className={styles.cardBottom}>
                <div className={styles.waitInfo}>
                  <WaitBadge count={h.waitCount} isOpen={h.isOpen} />
                  {h.isOpen && h.waitTime > 0 && (
                    <span className={styles.waitTime}><Clock size={11} /> 약 {h.waitTime}분</span>
                  )}
                </div>
                {h.isOpen && (
                  <button className={styles.bookBtn} onClick={e => { e.stopPropagation(); onSelect(h); }}>
                    예약하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
