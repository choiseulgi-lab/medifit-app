import { useState } from 'react';
import {
  ChevronRight, CalendarDays, FileText,
  Plus, CheckCircle2, Clock, UserPlus,
  Stethoscope, Pill,
} from 'lucide-react';
import { FAMILY_MEMBERS, FAMILY_RECORDS, DEPT_MAP } from '../../data/mock';
import styles from './HealthPage.module.css';

const TABS = ['진료이력', '가족관리'];

/* ──────────────────────────────
   공통: 구성원 아바타
────────────────────────────── */
function Avatar({ member, size = 40 }) {
  return (
    <span
      className={styles.avatar}
      style={{
        width: size, height: size,
        background: member.bg,
        color: member.color,
        fontSize: size * 0.38,
      }}
    >
      {member.initial}
    </span>
  );
}

/* ──────────────────────────────
   탭 1 · 진료이력
────────────────────────────── */
function RecordsTab() {
  const [selectedId, setSelectedId] = useState('all');
  const [openId, setOpenId]         = useState(null);

  const filtered = selectedId === 'all'
    ? FAMILY_RECORDS
    : FAMILY_RECORDS.filter(r => r.memberId === selectedId);

  return (
    <div className={styles.tabContent}>

      {/* 구성원 필터 */}
      <div className={styles.filterScroll}>
        <button
          className={[styles.filterChip, selectedId === 'all' && styles.filterChipActive].filter(Boolean).join(' ')}
          onClick={() => setSelectedId('all')}
        >
          전체
        </button>
        {FAMILY_MEMBERS.map(m => (
          <button
            key={m.id}
            className={[styles.filterChip, selectedId === m.id && styles.filterChipActive].filter(Boolean).join(' ')}
            style={selectedId === m.id ? { background: m.color, borderColor: m.color } : {}}
            onClick={() => setSelectedId(m.id)}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* 진료 건수 요약 */}
      <p className={styles.recordCount}>
        총 <strong>{filtered.length}건</strong>의 진료이력
      </p>

      {/* 진료 목록 */}
      {filtered.map(r => {
        const member  = FAMILY_MEMBERS.find(m => m.id === r.memberId);
        const deptMeta = DEPT_MAP[r.dept];
        const isOpen  = openId === r.id;

        return (
          <div key={r.id} className={styles.recordCard}>
            <button
              className={styles.recordHeader}
              onClick={() => setOpenId(isOpen ? null : r.id)}
            >
              {/* 구성원 아바타 */}
              <Avatar member={member} size={36} />

              <div className={styles.recordMain}>
                <div className={styles.recordTopRow}>
                  <span className={styles.memberName}>{r.memberName}</span>
                  <span className={styles.memberRelation}
                    style={{ color: member.color, background: member.bg }}>
                    {member.relation}
                  </span>
                </div>
                <p className={styles.recordHospital}>{r.hospital}</p>
                <div className={styles.recordMeta}>
                  <CalendarDays size={11} color="var(--color-text-muted)" />
                  <span>{r.date}</span>
                  <span className={styles.dot} />
                  <span
                    className={styles.deptChip}
                    style={{ color: deptMeta?.color, background: deptMeta?.bg }}
                  >{r.dept}</span>
                </div>
              </div>

              <ChevronRight
                size={16}
                color="var(--color-text-muted)"
                style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: '0.2s', flexShrink: 0 }}
              />
            </button>

            {isOpen && (
              <div className={styles.recordDetail}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>진단명</span>
                  <span className={styles.detailValue}>{r.diagnosis}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>처방약</span>
                  <span className={styles.detailValue}>{r.prescription.join(', ')}</span>
                </div>
                <div className={styles.memoBox}>
                  <FileText size={13} color="var(--color-text-muted)" />
                  <p className={styles.memoText}>{r.memo}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

    </div>
  );
}

/* ──────────────────────────────
   탭 2 · 가족관리
────────────────────────────── */
function FamilyTab() {
  return (
    <div className={styles.tabContent}>

      {/* 안내 배너 */}
      <div className={styles.familyBanner}>
        <div className={styles.bannerIcon}>
          <Stethoscope size={22} color="var(--color-primary)" strokeWidth={1.8} />
        </div>
        <div>
          <p className={styles.bannerTitle}>가족 통합 건강관리</p>
          <p className={styles.bannerSub}>
            하나의 계정으로 가족 모두의 진료·예약·복약을 관리해요
          </p>
        </div>
      </div>

      {/* 구성원 카드 */}
      <p className={styles.sectionLabel}>등록된 가족 구성원 {FAMILY_MEMBERS.length}명</p>

      {FAMILY_MEMBERS.map(m => {
        const myRecords = FAMILY_RECORDS.filter(r => r.memberId === m.id);
        const age = 2026 - m.birthYear;

        return (
          <div key={m.id} className={styles.memberCard}>
            {/* 카드 헤더 */}
            <div className={styles.memberCardHeader}>
              <Avatar member={m} size={52} />
              <div className={styles.memberCardInfo}>
                <div className={styles.memberNameRow}>
                  <span className={styles.memberCardName}>{m.name}</span>
                  <span className={styles.memberCardRelation}
                    style={{ color: m.color, background: m.bg }}>
                    {m.relation}
                  </span>
                </div>
                <p className={styles.memberCardSub}>{age}세 · {m.gender}</p>
              </div>
            </div>

            <div className={styles.memberCardDivider} />

            {/* 통계 행 */}
            <div className={styles.memberStats}>
              <div className={styles.memberStat}>
                <FileText size={14} color={m.color} strokeWidth={1.8} />
                <span className={styles.memberStatNum}>{myRecords.length}</span>
                <span className={styles.memberStatLabel}>진료이력</span>
              </div>
              <div className={styles.memberStatDivider} />
              <div className={styles.memberStat}>
                <Pill size={14} color={m.color} strokeWidth={1.8} />
                <span className={styles.memberStatNum}>{m.medications}</span>
                <span className={styles.memberStatLabel}>복약중</span>
              </div>
              <div className={styles.memberStatDivider} />
              <div className={styles.memberStat}>
                <CalendarDays size={14} color={m.color} strokeWidth={1.8} />
                <span className={styles.memberStatNum}>{m.nextBooking ? 1 : 0}</span>
                <span className={styles.memberStatLabel}>예정 예약</span>
              </div>
            </div>

            {/* 최근 방문 */}
            <div className={styles.memberLastVisit}>
              <Clock size={12} color="var(--color-text-muted)" />
              <span>최근 방문: {m.lastVisit} · {m.lastHospital}</span>
            </div>

            {/* 예정 예약 */}
            {m.nextBooking && (
              <div className={styles.memberNextBooking}>
                <CheckCircle2 size={14} color="var(--color-secondary)" />
                <span>
                  {m.nextBooking.date} {m.nextBooking.time} · {m.nextBooking.hospital}
                </span>
              </div>
            )}

            {/* 건강 지표 요약 */}
            <div className={styles.memberVitals}>
              {[
                { label: '혈압', value: m.vitals.bp, unit: 'mmHg' },
                { label: '체중', value: m.vitals.weight, unit: 'kg' },
                { label: '혈당', value: m.vitals.sugar, unit: 'mg/dL' },
              ].map(v => (
                <div key={v.label} className={styles.vitalPill}>
                  <span className={styles.vitalPillLabel}>{v.label}</span>
                  <span className={styles.vitalPillValue} style={{ color: m.color }}>
                    {v.value}
                  </span>
                  {v.value !== '-' && (
                    <span className={styles.vitalPillUnit}>{v.unit}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* 구성원 추가 버튼 */}
      <button className={styles.addMemberBtn}>
        <UserPlus size={18} color="var(--color-primary)" strokeWidth={1.8} />
        가족 구성원 추가하기
      </button>

      <p className={styles.familyNotice}>
        구성원당 별도 동의가 필요합니다. 만 14세 미만 자녀는 보호자 동의로 등록할 수 있어요.
      </p>

    </div>
  );
}

/* ──────────────────────────────
   메인
────────────────────────────── */
export default function HealthPage() {
  const [tab, setTab] = useState(0);

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <p className={styles.headerTitle}>건강기록</p>
      </div>

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
      </div>

      {tab === 0 && <RecordsTab />}
      {tab === 1 && <FamilyTab />}
    </div>
  );
}
