import { useStore } from '../store/StoreContext';
import { avgField, getWeightTrend, calcConsistencyScore, generateCutAnalysis } from '../utils/analytics';
import { CheckCircle, AlertTriangle, Info, TrendingDown, TrendingUp, Minus } from 'lucide-react';

function ReviewCard({ title, weekLogs, baseline, weekNum }) {
  if (!weekLogs || weekLogs.length === 0) return null;

  const avg = (field) => avgField(weekLogs, field);
  const trend = getWeightTrend(weekLogs);
  const workoutDays = weekLogs.filter(l => l.workoutDone).length;
  const fullyTracked = weekLogs.filter(l => l.fullyTracked).length;
  const consistency = calcConsistencyScore(weekLogs, baseline);
  const avgQuality = avg('dataQualityScore') || 0;
  const avgAdherence = avg('adherenceScore') || 0;

  const waists = weekLogs.filter(l => l.waist != null);
  const waistChange = waists.length >= 2
    ? +(waists[waists.length - 1].waist - waists[0].waist).toFixed(1)
    : null;

  // Generate smart messages
  const messages = [];
  if (avgAdherence >= 70 && avgQuality >= 70 && trend.direction === 'down') {
    messages.push({ text: 'Good compliance. Continue current plan.', type: 'success' });
  }
  if (avgQuality < 50) {
    messages.push({ text: 'Weight trend unclear because tracking consistency is weak.', type: 'warning' });
  }
  if (weekLogs.some(l => !l.hiddenCaloriesCounted)) {
    messages.push({ text: 'Calories may be undercounted.', type: 'warning' });
  }
  const lowProtDays = weekLogs.filter(l => l.protein != null && l.protein < (baseline.proteinTarget || 130)).length;
  if (lowProtDays >= 3) {
    messages.push({ text: 'Protein target frequently missed.', type: 'warning' });
  }
  const avgSteps = avg('steps') || 0;
  if (avgSteps < (baseline.stepTarget || 8000) * 0.75) {
    messages.push({ text: 'Step output too low for aggressive fat loss.', type: 'warning' });
  }
  if (weekLogs.length < 7) {
    messages.push({ text: 'Do not change calories yet. Collect more clean data.', type: 'info' });
  }
  if (messages.length === 0) {
    messages.push({ text: 'Judgment should come from weekly average, not one weigh-in.', type: 'info' });
  }

  return (
    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
      <div className="card-header">
        <div className="card-title">{title}</div>
        <span className="badge badge-neutral">{weekLogs.length} days</span>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Avg Weight</div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {avg('weight') || '—'} kg
          </div>
        </div>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Avg Calories</div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {avg('calories') ? Math.round(avg('calories')) : '—'}
          </div>
        </div>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Avg Protein</div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: avg('protein') >= (baseline.proteinTarget || 130) ? 'var(--success)' : 'var(--warning)' }}>
            {avg('protein') ? Math.round(avg('protein')) : '—'}g
          </div>
        </div>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Avg Steps</div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {avg('steps') ? Math.round(avg('steps')).toLocaleString() : '—'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Workouts</div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {workoutDays}/{weekLogs.length}
          </div>
        </div>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Avg Sleep</div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {avg('sleepHours') || '—'}h
          </div>
        </div>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Fully Tracked</div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: fullyTracked === weekLogs.length ? 'var(--success)' : 'var(--warning)' }}>
            {fullyTracked}/{weekLogs.length}
          </div>
        </div>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Consistency</div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: consistency >= 70 ? 'var(--success)' : consistency >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
            {consistency}%
          </div>
        </div>
      </div>

      {/* Weight Trend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
        {trend.direction === 'down' && <TrendingDown size={18} style={{ color: 'var(--success)' }} />}
        {trend.direction === 'up' && <TrendingUp size={18} style={{ color: 'var(--danger)' }} />}
        {trend.direction === 'stable' && <Minus size={18} style={{ color: 'var(--warning)' }} />}
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Weight trend: {trend.direction} ({trend.change > 0 ? '+' : ''}{trend.change} kg){waistChange != null ? ` · Waist: ${waistChange > 0 ? '+' : ''}${waistChange} cm` : ''}
        </span>
      </div>

      {/* Smart Messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`insight-card insight-${msg.type}`}>
            {msg.type === 'success' && <CheckCircle size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />}
            {msg.type === 'warning' && <AlertTriangle size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />}
            {msg.type === 'info' && <Info size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />}
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WeeklyReview() {
  const { getCurrentCycleLogs, baseline } = useStore();
  const logs = getCurrentCycleLogs();

  const week1 = logs.filter(l => l.dayNumberInCycle >= 1 && l.dayNumberInCycle <= 7);
  const week2 = logs.filter(l => l.dayNumberInCycle >= 8 && l.dayNumberInCycle <= 14);

  // Full phase cut analysis
  const cutAnalysis = generateCutAnalysis(logs, baseline);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Weekly Review</h1>
        <p>Auto-generated review summaries for each week</p>
      </div>

      {/* Cut Analysis (14-day) */}
      {logs.length >= 7 && (
        <div className="card section-gap" style={{
          borderLeft: `3px solid ${cutAnalysis.status === 'on_track' ? 'var(--success)' : cutAnalysis.status === 'low_quality' || cutAnalysis.status === 'too_aggressive' ? 'var(--danger)' : 'var(--warning)'}`,
        }}>
          <div className="card-header">
            <div className="card-title">Phase Analysis</div>
            <span className={`badge ${cutAnalysis.status === 'on_track' ? 'badge-success' : cutAnalysis.status === 'low_quality' ? 'badge-danger' : 'badge-warning'}`}>
              {cutAnalysis.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 'var(--space-4)' }}>
            {cutAnalysis.message}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {cutAnalysis.recommendations.map((rec, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
              }}>
                <span style={{ color: 'var(--accent-red)' }}>→</span>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      <ReviewCard title="Week 1 Review" weekLogs={week1} baseline={baseline} weekNum={1} />
      {week2.length > 0 && (
        <ReviewCard title="Week 2 Review" weekLogs={week2} baseline={baseline} weekNum={2} />
      )}
    </div>
  );
}
