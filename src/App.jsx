import { useState } from 'react';
import { BottomNav } from './components';
import Home           from './pages/Home/Home';
import MemberSelect   from './pages/MemberSelect/MemberSelect';
import SymptomPage    from './pages/Symptom/SymptomPage';
import RecommendPage  from './pages/Recommend/RecommendPage';
import HospitalList   from './pages/HospitalList/HospitalList';
import HospitalDetail from './pages/HospitalDetail/HospitalDetail';
import BookingPage    from './pages/Booking/BookingPage';
import BookingList    from './pages/BookingList/BookingList';
import MyPage         from './pages/MyPage/MyPage';
import SearchPage     from './pages/Search/SearchPage';
import HealthPage     from './pages/Health/HealthPage';
import { MY_BOOKINGS } from './data/mock';
import './App.css';

const TABS_WITH_NAV = ['home', 'search', 'bookings', 'health', 'mypage'];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [tab, setTab]       = useState('home');

  const [bookings, setBookings]     = useState(MY_BOOKINGS);
  const [member, setMember]         = useState(null);
  const [memberNext, setMemberNext] = useState('symptom'); // MemberSelect 이후 목적지
  const [symptoms, setSymptoms]     = useState([]);
  const [duration, setDuration]     = useState(null);
  const [intensity, setIntensity]   = useState(3);
  const [dept, setDept]             = useState(null);
  const [hospital, setHospital]     = useState(null);

  const go = (next) => setScreen(next);

  const handleTabChange = (key) => {
    setTab(key);
    if (key === 'home')     go('home');
    if (key === 'search')   go('search');
    if (key === 'bookings') go('bookings');
    if (key === 'health')   go('health');
    if (key === 'mypage')   go('mypage');
  };

  /* MemberSelect에서 구성원 선택 후 목적지로 이동 */
  const handleMemberSelect = (m) => {
    setMember(m);
    go(memberNext);
  };

  const showNav = TABS_WITH_NAV.includes(screen);

  return (
    <>
      {screen === 'home' && (
        <Home
          /* AI 경로: 지금 예약하기 */
          onBookingClick={() => {
            setMemberNext('symptom');
            go('memberSelect');
          }}
          /* 빠른 진료과 경로 */
          onDeptClick={(d) => {
            setDept(d);
            setMemberNext('hospitalList');
            go('memberSelect');
          }}
        />
      )}

      {screen === 'memberSelect' && (
        <MemberSelect
          onBack={() => go('home')}
          onSelect={handleMemberSelect}
        />
      )}

      {screen === 'symptom' && (
        <SymptomPage
          member={member}
          onBack={() => go('memberSelect')}
          onNext={(data) => {
            setSymptoms(data.symptoms);
            setDuration(data.duration);
            setIntensity(data.intensity);
            go('recommend');
          }}
        />
      )}

      {screen === 'recommend' && (
        <RecommendPage
          symptoms={symptoms}
          onBack={() => go('symptom')}
          onSelect={(selectedDept) => {
            setDept(selectedDept);
            go('hospitalList');
          }}
        />
      )}

      {screen === 'hospitalList' && (
        <HospitalList
          dept={dept}
          onBack={() => go(memberNext === 'hospitalList' ? 'memberSelect' : 'recommend')}
          onSelect={(h) => {        // 카드 본문 클릭 → 상세
            setHospital(h);
            go('hospitalDetail');
          }}
          onBook={(h) => {          // 예약하기 버튼 → 바로 예약
            setHospital(h);
            go('booking');
          }}
        />
      )}

      {screen === 'hospitalDetail' && (
        <HospitalDetail
          hospital={hospital}
          onBack={() => go('hospitalList')}
          onBook={() => go('booking')}
        />
      )}

      {screen === 'booking' && (
        <BookingPage
          hospital={hospital}
          member={member}
          symptoms={symptoms}
          duration={duration}
          intensity={intensity}
          onBack={() => go('hospitalDetail')}
          onDone={(newBooking) => {
            setBookings(prev => [newBooking, ...prev]);
          }}
          onNavigateDone={() => {
            setTab('bookings');
            go('bookings');
          }}
        />
      )}

      {screen === 'bookings' && (
        <BookingList
          bookings={bookings}
          onBack={() => { setTab('home'); go('home'); }}
          onNewBooking={() => {
            setMemberNext('symptom');
            go('memberSelect');
          }}
        />
      )}

      {screen === 'search' && (
        <SearchPage
          onSelectHospital={(h) => {
            setHospital(h);
            go('hospitalDetail');
          }}
          onSelectDept={(d) => {
            setDept(d);
            go('hospitalList');
          }}
        />
      )}

      {screen === 'health'  && <HealthPage />}
      {screen === 'mypage'  && <MyPage />}

      {showNav && (
        <BottomNav active={tab} onChange={handleTabChange} badges={{ bookings: true }} />
      )}
    </>
  );
}
