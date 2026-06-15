import { useState } from 'react';
import { Search, X, Sparkles, MapPin } from 'lucide-react';
import { TopBar } from '../../components';
import BodyDiagram from './BodyDiagram';
import styles from './SymptomPage.module.css';

/* ── 신체 부위별 증상 ── */
const BODY_SYMPTOMS = {
  // 앞면
  head:       { label: '머리·얼굴', list: ['두통', '편두통', '어지러움', '발열', '안면 통증', '기억력 저하'] },
  throat:     { label: '목·인후',   list: ['인후통', '기침', '가래', '목 쉼', '삼킴 곤란', '목 결림'] },
  chest:      { label: '가슴',      list: ['흉통', '두근거림', '호흡곤란', '기침', '가슴 답답함', '가슴 두근거림'] },
  abdomen:    { label: '복부·소화기', list: ['복통', '소화불량', '메스꺼움', '구토', '설사', '변비', '복부팽만'] },
  left_arm:   { label: '팔·손 (왼)', list: ['관절통', '저림', '부종', '근육통', '손목 통증', '팔꿈치 통증'] },
  right_arm:  { label: '팔·손 (오)', list: ['관절통', '저림', '부종', '근육통', '손목 통증', '팔꿈치 통증'] },
  hip:        { label: '허리·골반',  list: ['요통', '허리 통증', '골반통', '좌골신경통', '서혜부 통증'] },
  left_leg:   { label: '다리·발 (왼)', list: ['무릎 통증', '발목 통증', '저림', '부종', '종아리 경련', '발바닥 통증'] },
  right_leg:  { label: '다리·발 (오)', list: ['무릎 통증', '발목 통증', '저림', '부종', '종아리 경련', '발바닥 통증'] },
  // 뒷면
  neck_back:  { label: '목·어깨',   list: ['목 결림', '어깨 결림', '승모근 통증', '어깨 통증', '경추 통증'] },
  upper_back: { label: '등 위',     list: ['등 통증', '견갑골 통증', '날개뼈 통증', '근육 뭉침'] },
  lower_back: { label: '허리',      list: ['요통', '척추 통증', '허리 디스크', '좌골신경통', '근육 경직'] },
};

const POPULAR = ['두통', '발열', '기침', '복통', '인후통', '어지러움', '피로감', '메스꺼움', '관절통', '피부 발진'];
const DURATIONS = ['오늘', '2~3일', '1주일', '1개월 이상'];
const MAX = 3;

const INTENSITY_LABEL = { 1: '매우 약함', 2: '약함', 3: '보통', 4: '강함', 5: '매우 강함' };

export default function SymptomPage({ onBack, onNext }) {
  const [mode, setMode]           = useState('body');   // 'body' | 'search'
  const [front, setFront]         = useState(true);
  const [selectedPart, setPart]   = useState(null);
  const [selected, setSelected]   = useState([]);       // 선택된 증상 (max 3)
  const [query, setQuery]         = useState('');
  const [duration, setDuration]   = useState(null);
  const [intensity, setIntensity] = useState(3);

  /* ── 증상 토글 ── */
  const toggleSymptom = (s) => {
    setSelected((prev) => {
      if (prev.includes(s)) return prev.filter((x) => x !== s);
      if (prev.length >= MAX) return prev;
      return [...prev, s];
    });
  };

  /* ── 신체 부위 선택 ── */
  const handlePartSelect = (id) => {
    setPart((prev) => (prev === id ? null : id));
  };

  /* ── 검색 필터 ── */
  const searchResults = query
    ? POPULAR.filter((s) => s.includes(query))
    : POPULAR;

  /* ── 강도 슬라이더 fill ── */
  const fillPct = `${((intensity - 1) / 4) * 100}%`;

  return (
    <>
      <TopBar title="증상 선택" onBack={onBack} />

      {/* ── 진행 표시 ── */}
      <div className={styles.progress}>
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={styles.progressStep}>
            <div className={styles.progressFill} style={{ width: step === 1 ? '100%' : '0%' }} />
          </div>
        ))}
        <span className={styles.progressLabel}>1 / 4</span>
      </div>

      {/* ── 스크롤 본문 ── */}
      <div className={styles.page}>

        {/* ── 모드 탭 ── */}
        <div className={styles.modeToggle}>
          <button
            className={[styles.modeBtn, mode === 'body' && styles.modeBtnActive].filter(Boolean).join(' ')}
            onClick={() => setMode('body')}
          >
            신체 부위로 찾기
          </button>
          <button
            className={[styles.modeBtn, mode === 'search' && styles.modeBtnActive].filter(Boolean).join(' ')}
            onClick={() => setMode('search')}
          >
            직접 검색
          </button>
        </div>

        {/* ══ 신체 부위 모드 ══ */}
        {mode === 'body' && (
          <div className={styles.bodySection}>
            {/* 앞/뒷면 토글 */}
            <div className={styles.faceToggle}>
              <button
                className={[styles.faceBtn, front && styles.faceBtnActive].filter(Boolean).join(' ')}
                onClick={() => { setFront(true); setPart(null); }}
              >
                앞면
              </button>
              <button
                className={[styles.faceBtn, !front && styles.faceBtnActive].filter(Boolean).join(' ')}
                onClick={() => { setFront(false); setPart(null); }}
              >
                뒷면
              </button>
            </div>

            {/* 신체 SVG */}
            <BodyDiagram front={front} selectedPart={selectedPart} onSelect={handlePartSelect} />

            {/* 선택한 부위의 증상 목록 */}
            {selectedPart && BODY_SYMPTOMS[selectedPart] && (
              <div className={styles.symptomArea}>
                <p className={styles.symptomAreaLabel}>
                  <MapPin size={14} color="var(--color-primary)" />
                  {BODY_SYMPTOMS[selectedPart].label}
                </p>
                <div className={styles.symptomChips}>
                  {BODY_SYMPTOMS[selectedPart].list.map((s) => {
                    const isActive = selected.includes(s);
                    const isFull   = !isActive && selected.length >= MAX;
                    return (
                      <button
                        key={s}
                        className={[
                          styles.symptomChip,
                          isActive && styles.symptomChipActive,
                          isFull   && styles.symptomChipDisabled,
                        ].filter(Boolean).join(' ')}
                        onClick={() => !isFull && toggleSymptom(s)}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ 직접 검색 모드 ══ */}
        {mode === 'search' && (
          <div className={styles.searchSection}>
            <div className={styles.searchInputWrap}>
              <span className={styles.searchIcon}><Search size={18} /></span>
              <input
                className={styles.searchInput}
                placeholder="예: 두통, 기침, 발열..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <p className={styles.searchSectionTitle}>
              {query ? `"${query}" 검색 결과` : '자주 찾는 증상'}
            </p>

            <div className={styles.popularChips}>
              {searchResults.map((s) => {
                const isActive = selected.includes(s);
                const isFull   = !isActive && selected.length >= MAX;
                return (
                  <button
                    key={s}
                    className={[
                      styles.symptomChip,
                      isActive && styles.symptomChipActive,
                      isFull   && styles.symptomChipDisabled,
                    ].filter(Boolean).join(' ')}
                    onClick={() => !isFull && toggleSymptom(s)}
                  >
                    {s}
                  </button>
                );
              })}
              {query && searchResults.length === 0 && (
                <p style={{ fontSize: 'var(--font-size-body2)', color: 'var(--color-text-muted)' }}>
                  검색 결과가 없습니다. 다른 키워드를 입력해보세요.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── 구분선 ── */}
        <div className={styles.divider} />

        {/* ── 선택된 증상 ── */}
        <div className={styles.section}>
          <div className={styles.selectedWrap}>
            <div className={styles.selectedCount}>
              <span className={styles.selectedCountText}>선택된 증상</span>
              <span className={styles.selectedCountBadge}>
                <span>{selected.length}</span> / {MAX}
              </span>
            </div>

            {selected.length > 0 ? (
              <div className={styles.selectedTags}>
                {selected.map((s) => (
                  <div key={s} className={styles.selectedTag}>
                    {s}
                    <button className={styles.tagRemove} onClick={() => toggleSymptom(s)}>
                      <X size={11} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyTags}>
                <MapPin size={16} />
                신체 부위를 탭하거나 증상을 검색해 선택하세요 (최대 3개)
              </div>
            )}
          </div>
        </div>

        {/* ── 지속 기간 ── */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>증상 지속 기간</p>
          <div className={styles.durationChips}>
            {DURATIONS.map((d) => (
              <button
                key={d}
                className={[styles.durationChip, duration === d && styles.durationActive].filter(Boolean).join(' ')}
                onClick={() => setDuration(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* ── 증상 강도 ── */}
        <div className={styles.section}>
          <div className={styles.intensityWrap}>
            <div className={styles.intensityHeader}>
              <p className={styles.sectionTitle}>증상 강도</p>
              <span className={styles.intensityValue}>{INTENSITY_LABEL[intensity]}</span>
            </div>
            <input
              type="range"
              min="1" max="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className={styles.slider}
              style={{ '--fill': fillPct }}
            />
            <div className={styles.intensityLabels}>
              <span>매우 약함</span>
              <span>매우 강함</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── 하단 고정 CTA ── */}
      <div className={styles.bottomCta}>
        {selected.length > 0 && (
          <div className={styles.ctaSelectedPreview}>
            {selected.map((s) => (
              <span key={s} className={styles.ctaPreviewTag}>
                {s} <X size={10} strokeWidth={3} />
              </span>
            ))}
          </div>
        )}
        <button
          className={styles.ctaBtn}
          disabled={selected.length === 0}
          onClick={() => onNext?.({ symptoms: selected, duration, intensity })}
        >
          <Sparkles size={20} />
          AI 진료과 추천 받기
        </button>
      </div>
    </>
  );
}
