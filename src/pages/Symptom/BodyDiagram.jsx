import { MapPin } from 'lucide-react';
import styles from './BodyDiagram.module.css';

/*
 * 이미지 원본: 178 × 333 px
 * 컨테이너:   160 × 300 px  (scale ≈ 0.90)
 * 핫스팟 좌표는 컨테이너 % 기준
 */

const FRONT_REGIONS = [
  {
    id: 'head',
    label: '머리·얼굴',
    pin: { top: '12%', left: '50%' },
    style: { top: '2.5%', left: '35%', width: '30%', height: '19%', borderRadius: '50%' },
  },
  {
    id: 'throat',
    label: '목·인후',
    pin: { top: '23%', left: '50%' },
    style: { top: '20%', left: '41%', width: '18%', height: '7%', borderRadius: '8px' },
  },
  {
    id: 'chest',
    label: '가슴',
    pin: { top: '35%', left: '50%' },
    style: { top: '26%', left: '26%', width: '48%', height: '20%', borderRadius: '8px' },
  },
  {
    id: 'abdomen',
    label: '복부',
    pin: { top: '52%', left: '50%' },
    style: { top: '45%', left: '28%', width: '44%', height: '18%', borderRadius: '8px' },
  },
  {
    id: 'left_arm',
    label: '왼팔·손',
    pin: { top: '44%', left: '14%' },
    style: { top: '25.5%', left: '5%', width: '22%', height: '42%', borderRadius: '24px' },
  },
  {
    id: 'right_arm',
    label: '오른팔·손',
    pin: { top: '44%', left: '86%' },
    style: { top: '25.5%', left: '73%', width: '22%', height: '42%', borderRadius: '24px' },
  },
  {
    id: 'hip',
    label: '허리·골반',
    pin: { top: '68%', left: '50%' },
    style: { top: '62.5%', left: '23%', width: '54%', height: '11%', borderRadius: '8px' },
  },
  {
    id: 'left_leg',
    label: '왼다리·발',
    pin: { top: '82%', left: '34%' },
    style: { top: '72.5%', left: '22%', width: '26%', height: '25%', borderRadius: '10px' },
  },
  {
    id: 'right_leg',
    label: '오른다리·발',
    pin: { top: '82%', left: '66%' },
    style: { top: '72.5%', left: '52%', width: '26%', height: '25%', borderRadius: '10px' },
  },
];

const BACK_REGIONS = [
  {
    id: 'head',
    label: '뒷머리',
    pin: { top: '12%', left: '50%' },
    style: { top: '2.5%', left: '35%', width: '30%', height: '19%', borderRadius: '50%' },
  },
  {
    id: 'neck_back',
    label: '목·어깨',
    pin: { top: '25%', left: '50%' },
    style: { top: '20%', left: '18%', width: '64%', height: '9%', borderRadius: '8px' },
  },
  {
    id: 'upper_back',
    label: '등 위',
    pin: { top: '37%', left: '50%' },
    style: { top: '28%', left: '26%', width: '48%', height: '17%', borderRadius: '8px' },
  },
  {
    id: 'lower_back',
    label: '허리',
    pin: { top: '52%', left: '50%' },
    style: { top: '44%', left: '28%', width: '44%', height: '18%', borderRadius: '8px' },
  },
  {
    id: 'left_arm',
    label: '왼팔',
    pin: { top: '44%', left: '14%' },
    style: { top: '25.5%', left: '5%', width: '22%', height: '42%', borderRadius: '24px' },
  },
  {
    id: 'right_arm',
    label: '오른팔',
    pin: { top: '44%', left: '86%' },
    style: { top: '25.5%', left: '73%', width: '22%', height: '42%', borderRadius: '24px' },
  },
  {
    id: 'hip',
    label: '엉덩이·골반',
    pin: { top: '68%', left: '50%' },
    style: { top: '62.5%', left: '23%', width: '54%', height: '11%', borderRadius: '8px' },
  },
  {
    id: 'left_leg',
    label: '왼다리',
    pin: { top: '82%', left: '34%' },
    style: { top: '72.5%', left: '22%', width: '26%', height: '25%', borderRadius: '10px' },
  },
  {
    id: 'right_leg',
    label: '오른다리',
    pin: { top: '82%', left: '66%' },
    style: { top: '72.5%', left: '52%', width: '26%', height: '25%', borderRadius: '10px' },
  },
];

export default function BodyDiagram({ front = true, selectedPart, onSelect }) {
  const regions = front ? FRONT_REGIONS : BACK_REGIONS;
  const active  = regions.find((r) => r.id === selectedPart);

  return (
    <div
      className={styles.wrapper}
      style={{ '--body-mask': `url(${import.meta.env.BASE_URL}body-silhouette.png)` }}
    >
      <div className={styles.container}>
        {/* ── 실루엣 (CSS 마스크) ── */}
        <div className={styles.silhouette} />

        {/* ── 핫스팟 오버레이 (마스크 내부에서 클리핑) ── */}
        <div className={styles.hotspots}>
          {regions.map(({ id, style }) => (
            <button
              key={id}
              className={[styles.region, selectedPart === id && styles.regionActive].filter(Boolean).join(' ')}
              style={style}
              onClick={() => onSelect(id === selectedPart ? null : id)}
              aria-label={id}
            />
          ))}
        </div>

        {/* ── 핀 도트 (마스크 밖, 항상 보임) ── */}
        <div className={styles.pins}>
          {regions.map(({ id, pin }) => (
            <span
              key={id}
              className={styles.pin}
              style={{ top: pin.top, left: pin.left }}
            >
              <span
                className={[styles.pinDot, selectedPart === id && styles.pinDotActive].filter(Boolean).join(' ')}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ── 선택된 부위 라벨 ── */}
      {active ? (
        <div className={styles.selectedLabel}>
          <MapPin size={12} />
          {active.label}
        </div>
      ) : (
        <p className={styles.emptyLabel}>부위를 탭해 증상을 선택하세요</p>
      )}
    </div>
  );
}
