import { useStore } from '../store/StoreContext';
import { avgField, rollingAverage, getWeightTrend, generateInsights, calcConsistencyScore } from '../utils/analytics';
import { getAdherenceBadge, getQualityBadge } from '../utils/scoring';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import {
  Flame, Beef, Footprints, Dumbbell, Droplets, Moon,
  TrendingDown, TrendingUp, Minus, AlertTriangle, CheckCircle, Info, Target
} from 'lucide-react';

function KPICard({ label, value, sub, icon: Icon, progress, progressColor, badge, accentClass }) {
  return (
    <div className={`kpi-card ${accentClass || ''}`}>
      <div className="kpi-card-header">
        <span className="kpi-card-label">
          {Icon && <Icon />}
          {label}
        </span>
        {badge && <span className={`kpi-card-badge ${badge.type}`}>{badge.label}</span>}
      </div>
      <div className="kpi-card-value">{value}</div>
      {sub && <div className="kpi-card-sub">{sub}</div>}
      {progress != null && (
        <div className="kpi-card-progress">
          <div
            className={`kpi-card-progress-fill ${progressColor || ''}`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

function WeightTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{payload[0]?.payload?.label}</div>
      {payload.map((p, i) => (
        <div key={i} className="value" style={{ color: p.color }}>
          {p.name}: {p.value} kg
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { getCurrentCycleLogs, baseline, logs } = useStore();
  const cycleLogs = getCurrentCycleLogs();
  const todayLog = cycleLogs[cycleLogs.length - 1];
  const currentDay = cycleLogs.length;

  // Weight data
  const weights = cycleLogs.map(l => l.weight).filter(v => v != null);
  const rolling7 = rollingAverage(weights, 7);
  const avg7Weight = weights.length >= 7
    ? +(weights.slice(-7).reduce((a, b) => a + b, 0) / 7).toFixed(1)
    : weights.length > 0
      ? +(weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1)
      : null;
  const weightTrend = getWeightTrend(cycleLogs);
  const startWeight = weights[0] || baseline.currentWeight;
  const currentWeight = weights[weights.length - 1] || baseline.currentWeight;
  const estChange = weights.length >= 2 ? +((avg7Weight || currentWeight) - startWeight).toFixed(1) : 0;

  // Averages
  const avgAdherence = avgField(cycleLogs, 'adherenceScore') || 0;
  const avgQuality = avgField(cycleLogs, 'dataQualityScore') || 0;
  const consistency = calcConsistencyScore(cycleLogs, baseline);

  // Insights
  const insights = generateInsights(cycleLogs, baseline);

  // Today's values
  const todayCal = todayLog?.calories || 0;
  const todayProtein = todayLog?.protein || 0;
  const todaySteps = todayLog?.steps || 0;
  const todayWater = todayLog?.waterIntake || 0;
  const todaySleep = todayLog?.sleepHours || 0;

  const calPct = Math.round((todayCal / baseline.targetCalories) * 100);
  const protPct = Math.round((todayProtein / baseline.proteinTarget) * 100);
  const stepPct = Math.round((todaySteps / baseline.stepTarget) * 100);
  const waterPct = Math.round((todayWater / baseline.waterTarget) * 100);

  // Chart data for mini weight trend
  const chartData = cycleLogs.map((l, i) => ({
    label: `Day ${l.dayNumberInCycle}`,
    day: l.dayNumberInCycle,
    weight: l.weight,
    avg: rolling7[i],
  }));

  // Warnings
  const warnings = [];
  if (todayLog && !todayLog.fullyTracked) warnings.push('Today not fully tracked');
  if (todayProtein > 0 && todayProtein < baseline.proteinTarget) warnings.push('Protein below target');
  if (todaySteps > 0 && todaySteps < baseline.stepTarget) warnings.push('Step target missed');
  if (weightTrend.direction === 'insufficient') warnings.push('Not enough data for weight trend');
  const untrackedDays = cycleLogs.filter(l => !l.fullyTracked).length;
  if (untrackedDays >= 3) warnings.push(`${untrackedDays} days with incomplete tracking`);

  // Summary status
  let summaryType = 'review';
  let summaryText = 'Review needed after Day 14';
  if (avgQuality >= 70 && avgAdherence >= 70 && weightTrend.direction === 'down') {
    summaryType = 'on-track'; summaryText = 'Cut is on track';
  } else if (avgQuality < 50) {
    summaryType = 'warning'; summaryText = 'Tracking quality too weak to judge';
  } else if (weightTrend.direction === 'stable') {
    summaryType = 'warning'; summaryText = 'Likely water fluctuation — monitor trend';
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Command Center</h1>
        <p>Day {currentDay} of 14 · Phase Progress</p>
      </div>

      {/* Phase Progress */}
      <div className="card section-gap" style={{ padding: 'var(--space-4) var(--space-6)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>
            14-Day Phase
          </span>
          <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>
            {currentDay} / 14
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${(currentDay / 14) * 100}%` }} />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid section-gap">
        <KPICard
          label="Calories" icon={Flame} accentClass="accent-red"
          value={todayCal > 0 ? `${todayCal}` : '—'}
          sub={`Target: ${baseline.targetCalories} kcal`}
          progress={calPct}
          progressColor={calPct > 110 ? 'danger' : calPct >= 90 ? 'success' : 'warning'}
          badge={calPct >= 90 && calPct <= 110 ? { label: 'On Target', type: 'success' } : calPct > 110 ? { label: 'Over', type: 'danger' } : null}
        />
        <KPICard
          label="Protein" icon={Beef} accentClass="accent-green"
          value={todayProtein > 0 ? `${todayProtein}g` : '—'}
          sub={`Target: ${baseline.proteinTarget}g`}
          progress={protPct}
          progressColor={protPct >= 100 ? 'success' : protPct >= 80 ? 'warning' : 'danger'}
        />
        <KPICard
          label="Steps" icon={Footprints} accentClass="accent-steel"
          value={todaySteps > 0 ? todaySteps.toLocaleString() : '—'}
          sub={`Target: ${baseline.stepTarget.toLocaleString()}`}
          progress={stepPct}
          progressColor={stepPct >= 100 ? 'success' : stepPct >= 75 ? 'warning' : 'danger'}
        />
        <KPICard
          label="Workout" icon={Dumbbell} accentClass="accent-amber"
          value={todayLog?.workoutDone ? 'Done' : 'Not yet'}
          sub={todayLog?.workoutType || '—'}
          badge={todayLog?.workoutDone ? { label: '✓', type: 'success' } : { label: 'Pending', type: 'warning' }}
        />
        <KPICard
          label="Water" icon={Droplets}
          value={todayWater > 0 ? `${todayWater}L` : '—'}
          sub={`Target: ${baseline.waterTarget}L`}
          progress={waterPct}
          progressColor={waterPct >= 100 ? 'success' : 'warning'}
        />
        <KPICard
          label="Sleep" icon={Moon}
          value={todaySleep > 0 ? `${todaySleep}h` : '—'}
          sub="Target: 7+ hours"
          badge={todaySleep >= 7 ? { label: 'Good', type: 'success' } : todaySleep >= 6 ? { label: 'Okay', type: 'warning' } : todaySleep > 0 ? { label: 'Low', type: 'danger' } : null}
        />
        <KPICard
          label="Adherence Score" icon={Target}
          value={todayLog ? `${todayLog.adherenceScore}%` : '—'}
          sub={`Phase avg: ${Math.round(avgAdherence)}%`}
          badge={todayLog ? getAdherenceBadge(todayLog.adherenceScore) : null}
        />
        <KPICard
          label="Data Quality" icon={CheckCircle}
          value={todayLog ? `${todayLog.dataQualityScore}%` : '—'}
          sub={`Phase avg: ${Math.round(avgQuality)}%`}
          badge={todayLog ? getQualityBadge(todayLog.dataQualityScore) : null}
        />
      </div>

      {/* Two-column: Weight Trend + Summary */}
      <div className="grid-2 section-gap">
        {/* Weight Trend Mini Chart */}
        <div className="chart-container">
          <div className="card-header">
            <div>
              <div className="card-title">Weight Trend</div>
              <div className="card-subtitle">
                7d avg: {avg7Weight ? `${avg7Weight} kg` : '—'} · Est. change: {estChange > 0 ? '+' : ''}{estChange} kg
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {weightTrend.direction === 'down' && <TrendingDown size={18} style={{ color: 'var(--success)' }} />}
              {weightTrend.direction === 'up' && <TrendingUp size={18} style={{ color: 'var(--danger)' }} />}
              {weightTrend.direction === 'stable' && <Minus size={18} style={{ color: 'var(--warning)' }} />}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C4343A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C4343A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<WeightTooltip />} />
              <Area type="monotone" dataKey="weight" stroke="#C4343A" strokeWidth={2} fill="url(#weightGrad)" dot={{ r: 3, fill: '#C4343A' }} name="Daily" />
              <Line type="monotone" dataKey="avg" stroke="#5A7A9A" strokeWidth={2} strokeDasharray="4 4" dot={false} name="7d Avg" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary & Scores */}
        <div className="summary-panel">
          <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Cut Status</div>

          <div className={`summary-status ${summaryType}`}>
            {summaryType === 'on-track' && <CheckCircle size={20} />}
            {summaryType === 'warning' && <AlertTriangle size={20} />}
            {summaryType === 'review' && <Info size={20} />}
            <span className="summary-status-text">{summaryText}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Consistency</div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: consistency >= 70 ? 'var(--success)' : consistency >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{consistency}%</div>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Phase Avg Weight</div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{avgField(cycleLogs, 'weight') || '—'} kg</div>
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {warnings.map((w, i) => (
                <div key={i} className="warning-banner">
                  <AlertTriangle />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="section-gap">
          <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Insights</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {insights.map((ins, i) => (
              <div key={i} className={`insight-card insight-${ins.type}`}>
                {ins.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
