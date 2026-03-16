import { useStore } from '../store/StoreContext';
import { avgField, getWeightTrend } from '../utils/analytics';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingDown, TrendingUp, Minus, Scale } from 'lucide-react';

export default function BodyMetrics() {
  const { getCurrentCycleLogs, baseline } = useStore();
  const logs = getCurrentCycleLogs();
  const weights = logs.map(l => l.weight).filter(v => v != null);
  const waists = logs.filter(l => l.waist != null);

  const startWeight = weights[0] || baseline.currentWeight;
  const currentWeight = weights[weights.length - 1] || baseline.currentWeight;
  const bestWeight = weights.length > 0 ? Math.min(...weights) : null;
  const avgWeight = avgField(logs, 'weight');
  const trend = getWeightTrend(logs);

  const startWaist = waists.length > 0 ? waists[0].waist : null;
  const currentWaist = waists.length > 0 ? waists[waists.length - 1].waist : null;
  const waistChange = startWaist && currentWaist ? +(currentWaist - startWaist).toFixed(1) : null;

  const weightData = logs.map(l => ({
    day: `Day ${l.dayNumberInCycle}`,
    weight: l.weight,
  }));

  const judgeList = [
    { rank: 1, label: 'Weekly average weight', desc: 'Most reliable metric for fat loss rate' },
    { rank: 2, label: 'Waist trend', desc: 'Body composition changes beyond scale' },
    { rank: 3, label: 'Progress photos', desc: 'Visual changes week-over-week' },
    { rank: 4, label: 'Gym performance', desc: 'Strength maintenance during deficit' },
    { rank: 5, label: 'Daily scale', desc: 'Noise — not truth. Use only for averages.' },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Body Metrics</h1>
        <p>Track your body composition changes through this phase</p>
      </div>

      {/* Stats Grid */}
      <div className="kpi-grid section-gap">
        <div className="kpi-card accent-red">
          <div className="kpi-card-header">
            <span className="kpi-card-label"><Scale size={14} /> Current Weight</span>
          </div>
          <div className="kpi-card-value">{currentWeight} kg</div>
          <div className="kpi-card-sub">
            {trend.direction === 'down' && <span style={{ color: 'var(--success)' }}>↓ Trending down</span>}
            {trend.direction === 'up' && <span style={{ color: 'var(--danger)' }}>↑ Trending up</span>}
            {trend.direction === 'stable' && <span style={{ color: 'var(--warning)' }}>→ Stable</span>}
            {trend.direction === 'insufficient' && <span>Need more data</span>}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Start Weight</span>
          </div>
          <div className="kpi-card-value">{startWeight} kg</div>
          <div className="kpi-card-sub">Change: {(currentWeight - startWeight) > 0 ? '+' : ''}{(currentWeight - startWeight).toFixed(1)} kg</div>
        </div>
        <div className="kpi-card accent-green">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Best Weight</span>
          </div>
          <div className="kpi-card-value">{bestWeight != null ? bestWeight : '—'} kg</div>
          <div className="kpi-card-sub">Lowest in this phase</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Average Weight</span>
          </div>
          <div className="kpi-card-value">{avgWeight || '—'} kg</div>
          <div className="kpi-card-sub">Across all logged days</div>
        </div>
      </div>

      <div className="grid-2 section-gap">
        {/* Weight Trend Chart */}
        <div className="chart-container">
          <div className="card-header">
            <div className="card-title">Weight Over Time</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {trend.direction === 'down' && <TrendingDown size={18} style={{ color: 'var(--success)' }} />}
              {trend.direction === 'up' && <TrendingUp size={18} style={{ color: 'var(--danger)' }} />}
              {trend.direction === 'stable' && <Minus size={18} style={{ color: 'var(--warning)' }} />}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222228" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#C4343A" strokeWidth={2} dot={{ r: 3, fill: '#C4343A' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Waist & Notes */}
        <div>
          {/* Waist Panel */}
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Waist Measurements</div>
            {waists.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Start</div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{startWaist} cm</div>
                </div>
                <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Current</div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{currentWaist} cm</div>
                </div>
                {waistChange != null && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: 'var(--text-sm)', color: waistChange < 0 ? 'var(--success)' : 'var(--text-secondary)' }}>
                    Change: {waistChange > 0 ? '+' : ''}{waistChange} cm
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>No waist measurements logged yet.</p>
            )}
          </div>

          {/* Judge Progress By */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Judge Progress By</div>
            <div className="judge-progress-list">
              {judgeList.map(item => (
                <div key={item.rank} className="judge-progress-item">
                  <div className="judge-progress-rank">{item.rank}</div>
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{item.label}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
