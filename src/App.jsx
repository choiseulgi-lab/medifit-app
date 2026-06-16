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
import './App.css';

const TABS_WITH_NAV = ['home', 'search', 'bookings', 'health', 'mypage'];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [tab, setTab]       = useState('home');

  const [member, setMember]     = useState(null);   // 예약자 (가족 구성원)
  const [symptoms, setSymptoms] = useState([]);
  const [dept, setDept]         = useState(null);
  const [hospital, setHospital] = useState(null);

  const go = (next) => setScreen(next);

  const handleTabChange = (key) => {
    setTab(key);
    if (key === 'home')     go('home');
    if (key === 'search')   go('search');
    if (key === 'bookings') go('bookings');
    if (key === 'health')   go('health');
    if (key === 'mypage')   go('mypage');
  };

  const showNav = TABS_WITH_NAV.includes(screen);

  return (
    <>
      {screen === 'home' && (
        <Home onBookingClick={() => go('memberSelect')} />
      )}

      {/* ① 예약자 선택 → 증상 선택으로 진입 */}
      {screen === 'memberSelect' && (
        <MemberSelect
          onBack={() => go('home')}
          onSelect={(m) => {
            setMember(m);
            go('symptom');
          }}
        />
      )}

      {screen === 'symptom' && (
        <SymptomPage
          member={member}
          onBack={() => go('memberSelect')}
          onNext={(data) => {
            setSymptoms(data.symptoms);
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
          onBack={() => go('recommend')}
          onSelect={(h) => {
            setHospital(h);
            go('hospitalDetail');
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
          onBack={() => go('hospitalDetail')}
          onDone={() => {
            setTab('bookings');
            go('bookings');
          }}
        />
      )}

      {screen === 'bookings' && (
        <BookingList
          onBack={() => { setTab('home'); go('home'); }}
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

      {screen === 'health' && <HealthPage />}
      {screen === 'mypage'  && <MyPage />}

      {showNav && (
        <BottomNav active={tab} onChange={handleTabChange} badges={{ bookings: true }} />
      )}
    </>
  );
}
