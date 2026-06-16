import { useState } from 'react';
import {
  Activity, Weight, Droplets, Footprints,
  Pill, CheckCircle2, Circle, ChevronRight,
  FileText, TrendingUp, TrendingDown, Minus,
  CalendarDays, AlertCircle,
} from 'lucide-react';
import { HEALTH_VITALS, MEDICATIONS, MEDICAL_RECORDS, DEPT_MAP } from '../../data/mock';
import styles from './HealthPage.module.css';

const TABS = ['건강 지표', '복약 관리', '진료 기록'];

/* ── 지표별 아이콘·색상 ── */
const VITAL_META = {
  bloodPressure: { Icon: Activity,   color: '#EF4444', bg: '#FEE2E2', label: '혈압',    unit: 'mmHg' },
  weight:        { Icon: Weight,     color: '#F59E0B', bg: '#FEF3C7', label: '체중',    unit: 'kg'   },
  bloodSugar:    { Icon: Droplets,   color: '#3B82F6', bg: '#DBEAFE', label: '혈당',    unit: 'mg/dL'},
  steps:         { Icon: Footprints, color: '#10B981', bg: '#D1FAE5', label: '걸음 수', unit: '걸음' },
};

/* ── 미니 막대 차트 ── */
function MiniBar({ values, color }) {
  const nums = values.map(v => (typeof v === 'object' ? v.sys : v));
  const max  = Math.max(...nums);
  const min  = Math.min(...nums);
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return (
    <div className={styles.miniBar}>
      {nums.map((v, i) => (
        <div key={i} className={styles.barCol}>
          <div
            className={styles.barFill}
            style={{
              height: `${((v - min) / (max - min + 1)) * 60 + 10}%`,
              background: color,
              opacity: i === nums.length - 1 ? 1 : 0.4,
            }}
          />
          <span className={styles.barDay}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── 건강 지표 탭 ── */
function VitalsTab() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className={styles.tabContent}>
      {/* 오늘 요약 배너 */}
      <div className={styles.summaryBanner}>
        <div className={styles.summaryLeft}>
          <p className={styles.summaryDate}>2026년 6월 16일 월요일</p>
          <p className={styles.summaryTitle}>전반적으로 <em>건강한</em> 하루예요</p>
          <p className={styles.summarySub}>4개 지표 모두 정상 범위입니다</p>
        </div>
        <div className={styles.summaryScore}>
          <span className={styles.scoreNum}>98</span>
          <span className={styles.scoreLabel}>건강점수</span>
        </div>
      </div>

      {/* 지표 카드 목록 */}
      {Object.entries(HEALTH_VITALS).map(([key, data]) => {
        const { Icon, color, bg } = VITAL_META[key];
        const isOpen = expanded === key;
        return (
          <button
            key={key}
            className={[styles.vitalCard, isOpen && styles.vitalCardOpen].filter(Boolean).join(' ')}
            onClick={() => setExpanded(isOpen ? null : key)}
          >
            <div className={styles.vitalTop}>
              <span className={styles.vitalIconWrap} style={{ background: bg }}>
                <Icon size={20} color={color} strokeWidth={1.8} />
              </span>
              <div className={styles.vitalInfo}>
                <span className={styles.vitalLabel}>{data.label}</span>
                <span className={styles.vitalValue}>
                  {data.current}
                  <span className={styles.vitalUnit}> {data.unit}</span>
                </span>
              </div>
              <span className={styles.vitalBadge} style={{ background: bg, color }}>정상</span>
            </div>

            {isOpen && (
              <div className={styles.vitalDetail}>
                <p className={styles.chartTitle}>최근 7일 추이</p>
                <MiniBar values={data.week} color={color} />
              </div>
            )}
          </button>
        );
      })}

      <p className={styles.hint}>카드를 탭하면 7일 추이를 볼 수 있어요</p>
    </div>
  );
}

/* ── 복약 관리 탭 ── */
function MedicationTab() {
  const [taken, setTaken] = useState(
    Object.fromEntries(MEDICATIONS.map(m => [m.id, m.taken]))
  );
  const doneCount = Object.values(taken).filter(Boolean).length;

  return (
    <div className={styles.tabContent}>
      {/* 오늘 복약 진행 */}
      <div className={styles.medProgress}>
        <div className={styles.medProgressTop}>
          <span className={styles.medProgressLabel}>오늘 복약 현황</span>
          <span className={styles.medProgressCount}>
            <em>{doneCount}</em> / {MEDICATIONS.length}
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${(doneCount / MEDICATIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 복약 목록 */}
      <p className={styles.sectionTitle}>오늘의 약</p>
      {MEDICATIONS.map(m => (
        <div key={m.id} className={styles.medCard}>
          <span className={styles.medDot} style={{ background: m.color }} />
          <div className={styles.medInfo}>
            <p className={styles.medName}>{m.name}</p>
            <p className={styles.medMeta}>{m.dose} · {m.times.join(', ')}</p>
          </div>
          <button
            className={[styles.medCheck, taken[m.id] && styles.medCheckDone].filter(Boolean).join(' ')}
            onClick={() => setTaken(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
          >
            {taken[m.id]
              ? <CheckCircle2 size={26} color="var(--color-secondary)" strokeWidth={2} />
              : <Circle size={26} color="var(--color-text-disabled)" strokeWidth={1.5} />
            }
          </button>
        </div>
      ))}

      {/* 안내 배너 */}
      <div className={styles.medNotice}>
        <AlertCircle size={15} color="var(--color-accent)" />
        <p className={styles.medNoticeText}>
          복약 알림은 마이페이지 → 알림 설정에서 변경할 수 있어요
        </p>
      </div>
    </div>
  );
}

/* ── 진료 기록 탭 ── */
function RecordsTab() {
  const [openId, setOpenId] = useState(null);
  return (
    <div className={styles.tabContent}>
      <p className={styles.sectionTitle}>최근 진료 기록</p>
      {MEDICAL_RECORDS.map(r => {
        const deptMeta = DEPT_MAP[r.dept];
        const isOpen   = openId === r.id;
        return (
          <div key={r.id} className={styles.recordCard}>
            <button
              className={styles.recordHeader}
              onClick={() => setOpenId(isOpen ? null : r.id)}
            >
              <div className={styles.recordLeft}>
                <span
                  className={styles.recordDeptChip}
                  style={{ background: deptMeta?.bg, color: deptMeta?.color }}
                >
                  {r.dept}
                </span>
                <div>
                  <p className={styles.recordHospital}>{r.hospital}</p>
                  <div className={styles.recordMeta}>
                    <CalendarDays size={11} color="var(--color-text-muted)" />
                    <span>{r.date}</span>
                    <span className={styles.dot} />
                    <span>{r.doctor}</span>
                  </div>
                </div>
              </div>
              <ChevronRight
                size={16}
                color="var(--color-text-muted)"
                style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: '0.2s' }}
              />
            </button>

            {isOpen && (
              <div className={styles.recordDetail}>
                <div className={styles.recordRow}>
                  <span className={styles.recordRowLabel}>진단명</span>
                  <span className={styles.recordRowValue}>{r.diagnosis}</span>
                </div>
                <div className={styles.recordRow}>
                  <span className={styles.recordRowLabel}>처방약</span>
                  <span className={styles.recordRowValue}>{r.prescription.join(', ')}</span>
                </div>
                <div className={styles.recordMemoBox}>
                  <FileText size={13} color="var(--color-text-muted)" />
                  <p className={styles.recordMemo}>{r.memo}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function HealthPage() {
  const [tab, setTab] = useState(0);

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <div className={styles.header}>
        <p className={styles.headerTitle}>건강기록</p>
      </div>

      {/* 탭 */}
      <div className={styles.tabBar}>
        {TABS.map((t, i) => (
          <button
            key={t}
            className={[styles.tabBtn, tab === i && styles.tabBtnActive].filter(Boolean).join(' ')}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
        <div className={styles.tabIndicator} style={{ left: `calc(${tab} * 33.333%)` }} />
      </div>

      {/* 탭 콘텐츠 */}
      {tab === 0 && <VitalsTab />}
      {tab === 1 && <MedicationTab />}
      {tab === 2 && <RecordsTab />}
    </div>
  );
}
