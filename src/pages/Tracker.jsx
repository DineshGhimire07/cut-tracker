import { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { getAdherenceBadge, getQualityBadge } from '../utils/scoring';
import {
  ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle,
  Dumbbell, Footprints, Droplets, Moon
} from 'lucide-react';

export default function Tracker() {
  const { getCurrentCycleLogs } = useStore();
  const cycleLogs = getCurrentCycleLogs();
  const [expandedDay, setExpandedDay] = useState(null);
  const totalDays = 14;
  const completedDays = cycleLogs.length;
  const pct = Math.round((completedDays / totalDays) * 100);

  const toggleDay = (date) => {
    setExpandedDay(prev => prev === date ? null : date);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>14-Day Tracker</h1>
        <p>Phase timeline — click any day for full details</p>
      </div>

      {/* Progress bar */}
      <div className="card section-gap">
        <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
          <div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
              Phase Progress
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginLeft: 'var(--space-3)' }}>
              {completedDays} of {totalDays} days logged
            </span>
          </div>
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-red)' }}>
            {pct}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: '8px' }}>
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Day 1</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Day 14</span>
        </div>
      </div>

      {/* Day cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNum = i + 1;
          const log = cycleLogs.find(l => l.dayNumberInCycle === dayNum);
          const isExpanded = expandedDay === log?.date;
          const isFutureDay = !log;

          if (isFutureDay) {
            return (
              <div key={dayNum} className="day-card" style={{ opacity: 0.4, cursor: 'default' }}>
                <div className="day-card-number">Day {dayNum}</div>
                <div className="day-card-date" style={{ color: 'var(--text-tertiary)' }}>Not logged yet</div>
              </div>
            );
          }

          const adherenceBadge = getAdherenceBadge(log.adherenceScore);
          const qualityBadge = getQualityBadge(log.dataQualityScore);

          return (
            <div
              key={dayNum}
              className={`day-card ${log.fullyTracked ? 'complete' : 'incomplete'} ${isExpanded ? 'active' : ''}`}
              onClick={() => toggleDay(log.date)}
            >
              <div className="flex-between">
                <div>
                  <div className="day-card-number">Day {log.dayNumberInCycle}</div>
                  <div className="day-card-date">
                    {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span className={`badge badge-${adherenceBadge.type}`}>{log.adherenceScore}%</span>
                  {log.fullyTracked ? (
                    <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                  ) : (
                    <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
                  )}
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Summary metrics */}
              <div className="day-card-metrics" style={{ marginTop: 'var(--space-3)' }}>
                <div className="day-card-metric">
                  <span className="day-card-metric-label">Weight</span>
                  <span className="day-card-metric-value">{log.weight ? `${log.weight} kg` : '—'}</span>
                </div>
                <div className="day-card-metric">
                  <span className="day-card-metric-label">Calories</span>
                  <span className="day-card-metric-value">{log.calories || '—'}</span>
                </div>
                <div className="day-card-metric">
                  <span className="day-card-metric-label">Protein</span>
                  <span className="day-card-metric-value">{log.protein ? `${log.protein}g` : '—'}</span>
                </div>
                <div className="day-card-metric">
                  <span className="day-card-metric-label">Steps</span>
                  <span className="day-card-metric-value">{log.steps?.toLocaleString() || '—'}</span>
                </div>
              </div>

              {/* Warning flags */}
              <div className="day-card-flags">
                {!log.fullyTracked && <span className="badge badge-warning">Not fully tracked</span>}
                {log.bingeOrUntrackedFood && <span className="badge badge-danger">Untracked food</span>}
                {log.protein != null && log.protein < 130 && <span className="badge badge-warning">Low protein</span>}
                {log.steps != null && log.steps < 8000 && <span className="badge badge-neutral">Low steps</span>}
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="day-card-expanded">
                  <div className="day-card-metric">
                    <span className="day-card-metric-label"><Dumbbell size={12} style={{ marginRight: 4 }} />Workout</span>
                    <span className="day-card-metric-value">{log.workoutDone ? `${log.workoutType} (${log.workoutDuration}min)` : 'Rest'}</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label"><Moon size={12} style={{ marginRight: 4 }} />Sleep</span>
                    <span className="day-card-metric-value">{log.sleepHours}h</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label"><Droplets size={12} style={{ marginRight: 4 }} />Water</span>
                    <span className="day-card-metric-value">{log.waterIntake}L</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label"><Footprints size={12} style={{ marginRight: 4 }} />Steps</span>
                    <span className="day-card-metric-value">{log.steps?.toLocaleString()}</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label">Carbs</span>
                    <span className="day-card-metric-value">{log.carbs}g</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label">Fats</span>
                    <span className="day-card-metric-value">{log.fats}g</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label">Hunger</span>
                    <span className="day-card-metric-value">{log.hungerLevel}/10</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label">Energy</span>
                    <span className="day-card-metric-value">{log.energyLevel}/10</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label">Cravings</span>
                    <span className="day-card-metric-value">{log.cravingsLevel}/10</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label">Digestion</span>
                    <span className="day-card-metric-value">{log.digestionStatus}</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label">Soreness</span>
                    <span className="day-card-metric-value">{log.sorenessLevel}/10</span>
                  </div>
                  <div className="day-card-metric">
                    <span className="day-card-metric-label">Data Quality</span>
                    <span className="day-card-metric-value">
                      <span className={`badge badge-${qualityBadge.type}`}>{log.dataQualityScore}%</span>
                    </span>
                  </div>
                  {log.waist && (
                    <div className="day-card-metric">
                      <span className="day-card-metric-label">Waist</span>
                      <span className="day-card-metric-value">{log.waist} cm</span>
                    </div>
                  )}
                  {log.notes && (
                    <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-2)' }}>
                      <span className="day-card-metric-label">Notes</span>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>{log.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
