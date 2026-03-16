import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardCheck, CalendarDays, BarChart3,
  Scale, Utensils, Dumbbell, FileCheck, Camera, Settings, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/StoreContext';

const navItems = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Daily Check-In', path: '/checkin', icon: ClipboardCheck },
  { label: '14-Day Tracker', path: '/tracker', icon: CalendarDays },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Body Metrics', path: '/body-metrics', icon: Scale },
  { label: 'Nutrition', path: '/nutrition', icon: Utensils },
  { label: 'Activity', path: '/activity', icon: Dumbbell },
  { label: 'Weekly Review', path: '/review', icon: FileCheck },
  { label: 'Photos', path: '/photos', icon: Camera },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { getCurrentCycleLogs } = useStore();
  const cycleLogs = getCurrentCycleLogs();
  const currentDay = cycleLogs.length;

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{ position: 'fixed', top: '14px', left: '16px', zIndex: 200 }}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">CT</div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">CutTracker</span>
            <span className="sidebar-brand-sub">Body Recomp OS</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Dashboard</span>
          {navItems.slice(0, 4).map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              end={item.path === '/'}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <span className="sidebar-section-label">Tracking</span>
          {navItems.slice(4, 8).map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <span className="sidebar-section-label">Other</span>
          {navItems.slice(8).map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">U</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">User</span>
              <span className="sidebar-user-phase">Day {currentDay} / 14</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
