import { useLocation } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { avgField } from '../../utils/analytics';

const pageTitles = {
  '/': 'Overview',
  '/checkin': 'Daily Check-In',
  '/tracker': '14-Day Tracker',
  '/analytics': 'Progress Analytics',
  '/body-metrics': 'Body Metrics',
  '/nutrition': 'Nutrition',
  '/activity': 'Activity & Training',
  '/review': 'Weekly Review',
  '/photos': 'Progress Photos',
  '/settings': 'Settings',
};

export default function TopBar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'CutTracker';
  const { getCurrentCycleLogs, baseline } = useStore();
  const logs = getCurrentCycleLogs();
  const avgWeight = avgField(logs.slice(-7), 'weight');

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-stat">
          <span>7d Avg</span>
          <strong>{avgWeight ? `${avgWeight} kg` : '—'}</strong>
        </div>
        <div className="topbar-stat">
          <span>Target</span>
          <strong>{baseline.targetCalories} kcal</strong>
        </div>
      </div>
    </header>
  );
}
