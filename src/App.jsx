import { useState } from 'react';
import { BottomNav } from './components';
import Home        from './pages/Home/Home';
import SymptomPage from './pages/Symptom/SymptomPage';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [tab, setTab]       = useState('home');

  const handleTabChange = (key) => {
    setTab(key);
    setScreen('home');
  };

  return (
    <>
      {screen === 'home' && (
        <Home onBookingClick={() => setScreen('symptom')} />
      )}
      {screen === 'symptom' && (
        <SymptomPage
          onBack={() => setScreen('home')}
          onNext={() => setScreen('home')}
        />
      )}

      {screen === 'home' && (
        <BottomNav active={tab} onChange={handleTabChange} badges={{ bookings: true }} />
      )}
    </>
  );
}
