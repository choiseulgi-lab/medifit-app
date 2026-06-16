import { useState } from 'react';
import { CheckCircle2, UserPlus } from 'lucide-react';
import { TopBar } from '../../components';
import { FAMILY_MEMBERS } from '../../data/mock';
import styles from './MemberSelect.module.css';

export default function MemberSelect({ onBack, onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <TopBar title="예약하기" onBack={onBack} />

      <div className={styles.page}>
        <div className={styles.heading}>
          <p className={styles.title}>누구의 예약인가요?</p>
          <p className={styles.sub}>진료받을 가족 구성원을 선택해주세요</p>
        </div>

        <div className={styles.list}>
          {FAMILY_MEMBERS.map(m => (
            <button
              key={m.id}
              className={[styles.card, selected?.id === m.id && styles.cardActive].filter(Boolean).join(' ')}
              style={selected?.id === m.id
                ? { borderColor: m.color, boxShadow: `0 0 0 3px ${m.bg}` }
                : {}}
              onClick={() => setSelected(m)}
            >
              <span className={styles.avatar} style={{ background: m.bg, color: m.color }}>
                {m.initial}
              </span>

              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <span className={styles.name}>{m.name}</span>
                  <span className={styles.relation} style={{ background: m.bg, color: m.color }}>
                    {m.relation}
                  </span>
                </div>
                <p className={styles.meta}>{2026 - m.birthYear}세 · {m.gender}</p>
              </div>

              {selected?.id === m.id
                ? <CheckCircle2 size={24} color={m.color} />
                : <span className={styles.emptyCheck} />
              }
            </button>
          ))}

          {/* 구성원 추가 */}
          <button className={styles.addCard}>
            <span className={styles.addIcon}>
              <UserPlus size={20} color="var(--color-primary)" strokeWidth={1.8} />
            </span>
            <span className={styles.addLabel}>가족 구성원 추가하기</span>
          </button>
        </div>
      </div>

      <div className={styles.bottomCta}>
        <button
          className={styles.ctaBtn}
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        >
          다음 단계 — 증상 선택
        </button>
      </div>
    </>
  );
}
