import { useStore } from '../store/StoreContext';
import { avgField } from '../utils/analytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Footprints, Dumbbell, AlertTriangle, Clock } from 'lucide-react';

export default function Activity() {
  const { getCurrentCycleLogs, baseline } = useStore();
  const logs = getCurrentCycleLogs();

  const avgSteps = avgField(logs, 'steps');
  const workoutDays = logs.filter(l => l.workoutDone).length;
  const totalDays = logs.length;
  const workoutPct = totalDays > 0 ? Math.round((workoutDays / totalDays) * 100) : 0;
  const avgDuration = avgField(logs.filter(l => l.workoutDone && l.workoutDuration > 0), 'workoutDuration');

  // Workout type breakdown
  const typeMap = {};
  logs.filter(l => l.workoutDone && l.workoutType).forEach(l => {
    typeMap[l.workoutType] = (typeMap[l.workoutType] || 0) + 1;
  });

  const chartData = logs.map(l => ({
    day: `Day ${l.dayNumberInCycle}`,
    steps: l.steps,
    duration: l.workoutDone ? l.workoutDuration : 0,
  }));

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Activity & Training</h1>
        <p>Steps, workout tracking, and movement consistency</p>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid section-gap">
        <div className="kpi-card accent-steel">
          <div className="kpi-card-header">
            <span className="kpi-card-label"><Footprints size={14} /> Avg Steps</span>
          </div>
          <div className="kpi-card-value">{avgSteps ? Math.round(avgSteps).toLocaleString() : '—'}</div>
          <div className="kpi-card-sub">Target: {baseline.stepTarget.toLocaleString()}</div>
          {avgSteps && (
            <div className="kpi-card-progress">
              <div className={`kpi-card-progress-fill ${avgSteps >= baseline.stepTarget ? 'success' : 'warning'}`}
                style={{ width: `${Math.min(100, (avgSteps / baseline.stepTarget) * 100)}%` }} />
            </div>
          )}
        </div>
        <div className="kpi-card accent-red">
          <div className="kpi-card-header">
            <span className="kpi-card-label"><Dumbbell size={14} /> Workouts</span>
          </div>
          <div className="kpi-card-value">{workoutDays}/{totalDays}</div>
          <div className="kpi-card-sub">Completion: {workoutPct}%</div>
          <div className="kpi-card-progress">
            <div className={`kpi-card-progress-fill ${workoutPct >= 80 ? 'success' : 'warning'}`}
              style={{ width: `${workoutPct}%` }} />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label"><Clock size={14} /> Avg Duration</span>
          </div>
          <div className="kpi-card-value">{avgDuration ? `${Math.round(avgDuration)} min` : '—'}</div>
          <div className="kpi-card-sub">Per workout session</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Weekly Rate</span>
          </div>
          <div className="kpi-card-value">{totalDays >= 7 ? Math.round((workoutDays / totalDays) * 7) : workoutDays}/{baseline.gymFrequency}</div>
          <div className="kpi-card-sub">Target: {baseline.gymFrequency} days/week</div>
        </div>
      </div>

      {/* Important Warning */}
      <div className="warning-banner section-gap" style={{
        background: 'var(--danger-muted)',
        borderColor: 'rgba(196, 58, 58, 0.2)',
        color: 'var(--danger)',
        padding: 'var(--space-4) var(--space-5)',
      }}>
        <AlertTriangle size={18} />
        <div>
          <strong style={{ display: 'block', marginBottom: 2 }}>Do not casually eat back exercise calories.</strong>
          <span style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>
            Exercise helps the deficit but does not automatically justify extra intake.
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2 section-gap">
        <div className="chart-container">
          <div className="card-header">
            <div className="card-title">Daily Steps</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222228" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={50} />
              <Tooltip />
              <Bar dataKey="steps" name="Steps" radius={[4, 4, 0, 0]} fill="#5A7A9A" fillOpacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="card-header">
            <div className="card-title">Workout Duration</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222228" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip />
              <Bar dataKey="duration" name="Duration (min)" radius={[4, 4, 0, 0]} fill="#C4343A" fillOpacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workout Type Breakdown */}
      {Object.keys(typeMap).length > 0 && (
        <div className="card section-gap">
          <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Workout Type Breakdown</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {Object.entries(typeMap).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <div key={type} style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{type}</span>
                <span className="badge badge-neutral">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
