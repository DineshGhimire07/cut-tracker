import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider, useStore } from './store/StoreContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import DailyCheckIn from './pages/DailyCheckIn';
import Tracker from './pages/Tracker';
import Analytics from './pages/Analytics';
import BodyMetrics from './pages/BodyMetrics';
import Nutrition from './pages/Nutrition';
import Activity from './pages/Activity';
import WeeklyReview from './pages/WeeklyReview';
import Photos from './pages/Photos';
import SettingsPage from './pages/Settings';

function AppLayout() {
  const { isLoading } = useStore();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-md)' }}>Loading data from cloud...</div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/checkin" element={<DailyCheckIn />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/body-metrics" element={<BodyMetrics />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/review" element={<WeeklyReview />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <AppLayout />
      </Router>
    </StoreProvider>
  );
}
