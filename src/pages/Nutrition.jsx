import { useStore } from '../store/StoreContext';
import { avgField } from '../utils/analytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertTriangle, Eye } from 'lucide-react';

const hiddenCalorieItems = [
  { label: 'Cooking oils & butter', icon: '🫒' },
  { label: 'Milk tea / chai', icon: '🍵' },
  { label: 'Biscuits & cookies', icon: '🍪' },
  { label: 'Peanut butter & nuts', icon: '🥜' },
  { label: 'Sauces & dressings', icon: '🫙' },
  { label: 'Random snacking', icon: '🍿' },
  { label: 'Bakery items (bread, roti)', icon: '🍞' },
  { label: 'Bites while cooking', icon: '🍳' },
  { label: 'Extra rice / roti', icon: '🍚' },
  { label: 'Untracked drinks', icon: '🧃' },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="value" style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

export default function Nutrition() {
  const { getCurrentCycleLogs, baseline } = useStore();
  const logs = getCurrentCycleLogs();

  const avgCal = avgField(logs, 'calories');
  const avgProt = avgField(logs, 'protein');
  const avgCarbs = avgField(logs, 'carbs');
  const avgFats = avgField(logs, 'fats');

  const overDays = logs.filter(l => l.calories > baseline.targetCalories + 100).length;
  const underDays = logs.filter(l => l.calories < baseline.targetCalories - 100).length;
  const onTargetDays = logs.length - overDays - underDays;
  const lowProtDays = logs.filter(l => l.protein != null && l.protein < baseline.proteinTarget).length;
  const notTrackedDays = logs.filter(l => !l.fullyTracked).length;
  const noHiddenCounted = logs.filter(l => !l.hiddenCaloriesCounted).length;

  const chartData = logs.map(l => ({
    day: `Day ${l.dayNumberInCycle}`,
    calories: l.calories,
    protein: l.protein,
    carbs: l.carbs,
    fats: l.fats,
  }));

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Nutrition Tracking</h1>
        <p>Macro breakdown, adherence patterns, and hidden calorie awareness</p>
      </div>

      {/* Macro Averages */}
      <div className="macro-bar section-gap">
        <div className="macro-item">
          <div className="macro-item-value">{avgCal || '—'}</div>
          <div className="macro-item-label">Avg Calories</div>
        </div>
        <div className="macro-item">
          <div className="macro-item-value" style={{ color: 'var(--success)' }}>{avgProt || '—'}g</div>
          <div className="macro-item-label">Avg Protein</div>
        </div>
        <div className="macro-item">
          <div className="macro-item-value">{avgCarbs || '—'}g</div>
          <div className="macro-item-label">Avg Carbs</div>
        </div>
        <div className="macro-item">
          <div className="macro-item-value">{avgFats || '—'}g</div>
          <div className="macro-item-label">Avg Fats</div>
        </div>
      </div>

      {/* Adherence Stats */}
      <div className="kpi-grid section-gap">
        <div className="kpi-card accent-green">
          <div className="kpi-card-label">On Target Days</div>
          <div className="kpi-card-value">{onTargetDays}</div>
          <div className="kpi-card-sub">Within ±100 kcal of target</div>
        </div>
        <div className="kpi-card accent-amber">
          <div className="kpi-card-label">Over Target Days</div>
          <div className="kpi-card-value">{overDays}</div>
          <div className="kpi-card-sub">&gt; {baseline.targetCalories + 100} kcal</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-label">Under Target Days</div>
          <div className="kpi-card-value">{underDays}</div>
          <div className="kpi-card-sub">&lt; {baseline.targetCalories - 100} kcal</div>
        </div>
        <div className="kpi-card accent-red">
          <div className="kpi-card-label">Low Protein Days</div>
          <div className="kpi-card-value">{lowProtDays}</div>
          <div className="kpi-card-sub">&lt; {baseline.proteinTarget}g protein</div>
        </div>
      </div>

      {/* Calorie + Protein Chart */}
      <div className="grid-2 section-gap">
        <div className="chart-container">
          <div className="card-header">
            <div className="card-title">Daily Calories</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222228" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="calories" name="Calories" radius={[4, 4, 0, 0]} fill="#C4343A" fillOpacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <div className="card-header">
            <div className="card-title">Macro Split</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222228" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="protein" name="Protein" stackId="a" fill="#3DA66B" />
              <Bar dataKey="carbs" name="Carbs" stackId="a" fill="#5A7A9A" />
              <Bar dataKey="fats" name="Fats" stackId="a" fill="#D4943A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hidden Calories Risk System */}
      <div className="card section-gap">
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Eye size={16} />
              Hidden Calories Risk
            </div>
            <div className="card-subtitle">Watch for these common untracked calorie sources</div>
          </div>
          {noHiddenCounted > 0 && (
            <span className="badge badge-warning">{noHiddenCounted} day(s) uncounted</span>
          )}
        </div>

        <div className="hidden-cal-list">
          {hiddenCalorieItems.map((item, i) => (
            <div key={i} className="hidden-cal-item">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {(notTrackedDays > 0 || noHiddenCounted > 0) && (
          <div className="warning-banner" style={{ marginTop: 'var(--space-4)' }}>
            <AlertTriangle />
            <span>
              {notTrackedDays > 0 && `${notTrackedDays} days not fully tracked. `}
              {noHiddenCounted > 0 && `${noHiddenCounted} days without hidden calories counted. `}
              Data quality reduced.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
