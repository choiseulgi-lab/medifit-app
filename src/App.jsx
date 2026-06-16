import { useState } from 'react';
import { BottomNav } from './components';
import Home           from './pages/Home/Home';
import SymptomPage    from './pages/Symptom/SymptomPage';
import RecommendPage  from './pages/Recommend/RecommendPage';
import HospitalList   from './pages/HospitalList/HospitalList';
import HospitalDetail from './pages/HospitalDetail/HospitalDetail';
import BookingPage    from './pages/Booking/BookingPage';
import BookingList    from './pages/BookingList/BookingList';
import './App.css';

const TABS_WITH_NAV = ['home', 'search', 'bookings', 'health', 'mypage'];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [tab, setTab]       = useState('home');

  // 화면 간 전달 데이터
  const [symptoms, setSymptoms]   = useState([]);
  const [dept, setDept]           = useState(null);
  const [hospital, setHospital]   = useState(null);

  const go = (next) => setScreen(next);

  const handleTabChange = (key) => {
    setTab(key);
    if (key === 'home')     go('home');
    if (key === 'bookings') go('bookings');
    // 미구현 탭은 홈으로 유지
  };

  const showNav = TABS_WITH_NAV.includes(screen);

  return (
    <>
      {screen === 'home' && (
        <Home onBookingClick={() => go('symptom')} />
      )}

      {screen === 'symptom' && (
        <SymptomPage
          onBack={() => go('home')}
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

      {showNav && (
        <BottomNav active={tab} onChange={handleTabChange} badges={{ bookings: true }} />
      )}
    </>
  );
}
