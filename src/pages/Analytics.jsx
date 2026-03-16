import { useStore } from '../store/StoreContext';
import { rollingAverage } from '../utils/analytics';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="value" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="chart-container">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Analytics() {
  const { getCurrentCycleLogs, baseline } = useStore();
  const logs = getCurrentCycleLogs();

  const weights = logs.map(l => l.weight).filter(v => v != null);
  const rolling7 = rollingAverage(weights, 7);

  const chartData = logs.map((l, i) => ({
    day: `Day ${l.dayNumberInCycle}`,
    weight: l.weight,
    avg7: rolling7[i],
    calories: l.calories,
    protein: l.protein,
    steps: l.steps,
    sleep: l.sleepHours,
    water: l.waterIntake,
    adherence: l.adherenceScore,
    waist: l.waist,
  }));

  const gridStroke = '#222228';

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Progress Analytics</h1>
        <p>Interactive charts showing your cut phase trends</p>
      </div>

      {/* Weight Chart */}
      <div className="section-gap">
        <ChartCard title="Body Weight" subtitle="Daily weight vs 7-day rolling average">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C4343A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#C4343A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="weight" stroke="#C4343A" strokeWidth={2} fill="url(#weightGrad2)" dot={{ r: 3, fill: '#C4343A' }} name="Daily Weight" />
              <Line type="monotone" dataKey="avg7" stroke="#5A7A9A" strokeWidth={2} strokeDasharray="5 5" dot={false} name="7-Day Avg" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-2 section-gap">
        {/* Calories Chart */}
        <ChartCard title="Calorie Intake" subtitle={`Target: ${baseline.targetCalories} kcal`}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="calories" name="Calories" radius={[4, 4, 0, 0]}
                fill="#C4343A"
                fillOpacity={0.7}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Protein Chart */}
        <ChartCard title="Protein Intake" subtitle={`Target: ${baseline.proteinTarget}g`}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="protein" name="Protein (g)" radius={[4, 4, 0, 0]}
                fill="#3DA66B"
                fillOpacity={0.7}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-2 section-gap">
        {/* Steps Chart */}
        <ChartCard title="Daily Steps" subtitle={`Target: ${baseline.stepTarget.toLocaleString()}`}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="steps" name="Steps" radius={[4, 4, 0, 0]}
                fill="#5A7A9A"
                fillOpacity={0.7}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Sleep Chart */}
        <ChartCard title="Sleep Hours" subtitle="Target: 7+ hours">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis domain={[4, 9]} tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="sleep" stroke="#D4943A" strokeWidth={2} dot={{ r: 3, fill: '#D4943A' }} name="Sleep (hrs)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-2 section-gap">
        {/* Water Chart */}
        <ChartCard title="Water Intake" subtitle="Target: 3L">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="water" name="Water (L)" radius={[4, 4, 0, 0]}
                fill="#4A90D9"
                fillOpacity={0.7}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Adherence Score Chart */}
        <ChartCard title="Adherence Score" subtitle="Daily compliance percentage">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="adherence" stroke="#C4343A" strokeWidth={2} dot={{ r: 3, fill: '#C4343A' }} name="Adherence %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Waist Chart if data available */}
      {chartData.some(d => d.waist != null) && (
        <div className="section-gap">
          <ChartCard title="Waist Measurement" subtitle="Tracked measurement days">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData.filter(d => d.waist != null)}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fontSize: 11, fill: '#5A5A65' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="waist" stroke="#D4943A" strokeWidth={2} dot={{ r: 4, fill: '#D4943A' }} name="Waist (cm)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
