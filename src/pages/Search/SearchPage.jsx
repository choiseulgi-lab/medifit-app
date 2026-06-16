import { useState, useRef, useEffect } from 'react';
import {
  Search, X, Clock, TrendingUp,
  MapPin, Star, Clock3, ChevronRight,
  Heart, Baby, Sparkles, Bone, Eye, Ear, Brain, Stethoscope,
} from 'lucide-react';
import { HOSPITALS, DEPT_MAP } from '../../data/mock';
import styles from './SearchPage.module.css';

/* ── 진료과 ── */
const DEPTS = [
  { label: '내과',       Icon: Heart,       bg: '#EFF6FF', color: '#2563EB' },
  { label: '소아과',     Icon: Baby,        bg: '#FFF7ED', color: '#EA580C' },
  { label: '피부과',     Icon: Sparkles,    bg: '#FDF4FF', color: '#9333EA' },
  { label: '정형외과',   Icon: Bone,        bg: '#F0FDF4', color: '#16A34A' },
  { label: '안과',       Icon: Eye,         bg: '#FEFCE8', color: '#CA8A04' },
  { label: '이비인후과', Icon: Ear,         bg: '#FFF1F2', color: '#E11D48' },
  { label: '신경과',     Icon: Brain,       bg: '#ECFEFF', color: '#0891B2' },
  { label: '가정의학과', Icon: Stethoscope, bg: '#F0FDF4', color: '#15803D' },
];

/* ── 인기 검색어 ── */
const TRENDING = ['두통', '감기', '피부과', '소화불량', '내과', '허리 통증', '안과', '이비인후과'];

/* ── 병원 검색 함수 ── */
function searchHospitals(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return HOSPITALS.filter(
    h => h.name.toLowerCase().includes(q) || h.dept.toLowerCase().includes(q) || h.address.toLowerCase().includes(q)
  );
}

/* ── 로컬 최근 검색어 (메모리) ── */
const recentStore = { list: [] };

export default function SearchPage({ onSelectHospital, onSelectDept }) {
  const [query, setQuery]     = useState('');
  const [focused, setFocused] = useState(false);
  const [recent, setRecent]   = useState(recentStore.list);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = searchHospitals(query);

  const handleSearch = (q) => {
    setQuery(q);
    if (q.trim() && !recentStore.list.includes(q.trim())) {
      recentStore.list = [q.trim(), ...recentStore.list].slice(0, 8);
      setRecent([...recentStore.list]);
    }
  };

  const removeRecent = (word, e) => {
    e.stopPropagation();
    recentStore.list = recentStore.list.filter(w => w !== word);
    setRecent([...recentStore.list]);
  };

  const clearRecent = () => {
    recentStore.list = [];
    setRecent([]);
  };

  const pickWord = (word) => {
    handleSearch(word);
    inputRef.current?.blur();
  };

  return (
    <div className={styles.page}>

      {/* ── 검색창 ── */}
      <div className={styles.searchBar}>
        <div className={[styles.inputWrap, focused && styles.inputFocused].filter(Boolean).join(' ')}>
          <Search size={18} color={focused ? 'var(--color-primary)' : 'var(--color-text-muted)'} strokeWidth={2} />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="병원명, 진료과, 증상으로 검색"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
          />
          {query && (
            <button className={styles.clearBtn} onMouseDown={e => { e.preventDefault(); setQuery(''); }}>
              <X size={15} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* ── 검색 결과 ── */}
      {query.trim() ? (
        <div className={styles.results}>
          {results.length > 0 ? (
            <>
              <p className={styles.resultCount}>
                <span className={styles.resultHighlight}>"{query}"</span> 검색 결과 {results.length}건
              </p>
              {results.map(h => (
                <button
                  key={h.id}
                  className={styles.resultCard}
                  onClick={() => onSelectHospital?.(h)}
                >
                  <div className={styles.resultLeft}>
                    <span
                      className={styles.resultDeptDot}
                      style={{ background: DEPT_MAP[h.dept]?.color ?? 'var(--color-primary)' }}
                    />
                    <div>
                      <p className={styles.resultName}>{highlight(h.name, query)}</p>
                      <div className={styles.resultMeta}>
                        <span className={styles.metaChip}
                          style={{
                            background: DEPT_MAP[h.dept]?.bg ?? 'var(--color-primary-light)',
                            color: DEPT_MAP[h.dept]?.color ?? 'var(--color-primary)',
                          }}
                        >{h.dept}</span>
                        <span className={styles.metaItem}><MapPin size={11} />{h.distance}</span>
                        <span className={styles.metaItem}><Star size={11} fill="var(--color-accent)" color="var(--color-accent)" />{h.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.resultRight}>
                    {h.isOpen
                      ? <span className={styles.openBadge}><span className={styles.openDot} />진료중</span>
                      : <span className={styles.closedBadge}>종료</span>
                    }
                    <ChevronRight size={14} color="var(--color-text-muted)" />
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className={styles.empty}>
              <Search size={40} color="var(--color-text-disabled)" strokeWidth={1.5} />
              <p className={styles.emptyTitle}>검색 결과가 없어요</p>
              <p className={styles.emptySub}>다른 키워드로 검색하거나 진료과를 선택해보세요</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ── 최근 검색어 ── */}
          {recent.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>최근 검색어</span>
                <button className={styles.clearAll} onClick={clearRecent}>전체 삭제</button>
              </div>
              <div className={styles.recentList}>
                {recent.map(word => (
                  <button key={word} className={styles.recentItem} onClick={() => pickWord(word)}>
                    <Clock size={13} color="var(--color-text-muted)" />
                    <span className={styles.recentWord}>{word}</span>
                    <button className={styles.recentRemove} onClick={e => removeRecent(word, e)}>
                      <X size={12} strokeWidth={2.5} color="var(--color-text-muted)" />
                    </button>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ── 인기 검색어 ── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>인기 검색어</span>
              <span className={styles.sectionSub}><Clock3 size={11} /> 오늘 기준</span>
            </div>
            <div className={styles.trendingGrid}>
              {TRENDING.map((word, i) => (
                <button key={word} className={styles.trendingItem} onClick={() => pickWord(word)}>
                  <span className={[styles.trendingRank, i < 3 && styles.trendingRankTop].filter(Boolean).join(' ')}>
                    {i + 1}
                  </span>
                  <span className={styles.trendingWord}>{word}</span>
                  <TrendingUp size={12} color="var(--color-text-muted)" />
                </button>
              ))}
            </div>
          </section>

          {/* ── 진료과 빠른 선택 ── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>진료과 선택</span>
            </div>
            <div className={styles.deptGrid}>
              {DEPTS.map(({ label, Icon, bg, color }) => (
                <button
                  key={label}
                  className={styles.deptItem}
                  onClick={() => onSelectDept?.(label)}
                >
                  <span className={styles.deptIcon} style={{ backgroundColor: bg }}>
                    <Icon size={22} color={color} strokeWidth={1.8} />
                  </span>
                  <span className={styles.deptLabel}>{label}</span>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ── 검색어 하이라이트 ── */
function highlight(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 2 }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
