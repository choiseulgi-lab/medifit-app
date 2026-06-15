import { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { TopBar } from '../../components';
import { AI_RECOMMENDATIONS, DEPT_MAP } from '../../data/mock';
import styles from './RecommendPage.module.css';

const ALL_DEPTS = ['내과', '외과', '소아과', '피부과', '정형외과', '안과', '이비인후과', '신경과', '정신건강의학과', '산부인과', '비뇨기과', '가정의학과'];

export default function RecommendPage({ symptoms = [], onBack, onSelect }) {
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const key = symptoms.find(s => AI_RECOMMENDATIONS[s]) ?? 'default';
  const recs = AI_RECOMMENDATIONS[key] ?? AI_RECOMMENDATIONS.default;
  const [first, ...others] = recs;

  return (
    <>
      <TopBar title="AI 진료과 추천" onBack={onBack} />

      <div className={styles.page}>
        {loading ? (
          <div className={styles.analyzing}>
            <div className={styles.spinner} />
            <Sparkles size={22} color="var(--color-primary)" />
            <p className={styles.analyzeText}>
              선택하신 증상을 분석하고 있어요<br />
              <strong>잠시만 기다려주세요</strong>
            </p>
          </div>
        ) : (
          <>
            {/* 선택된 증상 태그 */}
            {symptoms.length > 0 && (
              <div className={styles.symptomRow}>
                {symptoms.map(s => <span key={s} className={styles.symptomTag}>#{s}</span>)}
              </div>
            )}

            <p className={styles.sectionTitle}>AI 추천 진료과</p>

            {/* 1순위 카드 */}
            <div className={styles.firstCard} onClick={() => onSelect(first.dept)}>
              <div className={styles.firstBadge}>
                <Sparkles size={12} /> AI 1순위 추천
              </div>
              <p className={styles.firstDept}>{first.dept}</p>
              <p className={styles.firstReason}>{first.reason}</p>
              <div className={styles.matchBar}>
                <span className={styles.matchLabel}>증상 일치도</span>
                <div className={styles.matchTrack}>
                  <div className={styles.matchFill} style={{ width: `${first.match}%` }} />
                </div>
                <span className={styles.matchPct}>{first.match}%</span>
              </div>
              <button className={styles.firstCta}>
                이 진료과 병원 보기 <ArrowRight size={16} />
              </button>
            </div>

            {/* 2·3순위 */}
            <div className={styles.otherCards}>
              {others.map(r => (
                <div key={r.rank} className={styles.otherCard} onClick={() => onSelect(r.dept)}>
                  <span className={styles.rankBadge}>{r.rank}</span>
                  <div className={styles.otherInfo}>
                    <p className={styles.otherDept}>{r.dept}</p>
                    <p className={styles.otherReason}>{r.reason}</p>
                  </div>
                  <ChevronRight size={18} color="var(--color-text-muted)" />
                </div>
              ))}
            </div>

            {/* 전체 진료과 accordion */}
            <div className={styles.accordion}>
              <button className={styles.accordionBtn} onClick={() => setShowAll(v => !v)}>
                다른 진료과 직접 선택하기
                {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showAll && (
                <div className={styles.allDepts}>
                  {ALL_DEPTS.map(d => (
                    <button key={d} className={styles.deptChip} onClick={() => onSelect(d)}>{d}</button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
