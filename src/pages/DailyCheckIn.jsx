import { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { WORKOUT_TYPES, DIGESTION_OPTIONS } from '../data/constants';
import { Save, Check } from 'lucide-react';

export default function DailyCheckIn() {
  const { baseline, addLog, getLogByDate } = useStore();
  const today = new Date().toISOString().split('T')[0];
  const existingLog = getLogByDate(today);

  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    date: today,
    weight: existingLog?.weight || '',
    calories: existingLog?.calories || '',
    protein: existingLog?.protein || '',
    carbs: existingLog?.carbs || '',
    fats: existingLog?.fats || '',
    steps: existingLog?.steps || '',
    workoutDone: existingLog?.workoutDone || false,
    workoutType: existingLog?.workoutType || '',
    workoutDuration: existingLog?.workoutDuration || '',
    waterIntake: existingLog?.waterIntake || '',
    sleepHours: existingLog?.sleepHours || '',
    waist: existingLog?.waist || '',
    hungerLevel: existingLog?.hungerLevel || 5,
    energyLevel: existingLog?.energyLevel || 5,
    cravingsLevel: existingLog?.cravingsLevel || 5,
    digestionStatus: existingLog?.digestionStatus || 'Good',
    sorenessLevel: existingLog?.sorenessLevel || 3,
    photoTaken: existingLog?.photoTaken || false,
    bingeOrUntrackedFood: existingLog?.bingeOrUntrackedFood || false,
    notes: existingLog?.notes || '',
    fullyTracked: existingLog?.fullyTracked || false,
    foodWeighed: existingLog?.foodWeighed || false,
    hiddenCaloriesCounted: existingLog?.hiddenCaloriesCounted || false,
    sameWeighInConditions: existingLog?.sameWeighInConditions || false,
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateNum = (field, value) => update(field, value === '' ? '' : Number(value));

  const handleSubmit = (e) => {
    e.preventDefault();
    const cycleStart = new Date(baseline.cycleStartDate);
    const logDate = new Date(form.date);
    const dayNum = Math.ceil((logDate - cycleStart) / (1000 * 60 * 60 * 24)) + 1;

    addLog({
      ...form,
      dayNumberInCycle: dayNum,
      weight: Number(form.weight) || null,
      calories: Number(form.calories) || null,
      protein: Number(form.protein) || null,
      carbs: Number(form.carbs) || null,
      fats: Number(form.fats) || null,
      steps: Number(form.steps) || null,
      workoutDuration: Number(form.workoutDuration) || 0,
      waterIntake: Number(form.waterIntake) || null,
      sleepHours: Number(form.sleepHours) || null,
      waist: form.waist ? Number(form.waist) : null,
      photoReferences: [],
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Daily Check-In</h1>
        <p>Log your metrics for {new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Date & Weight */}
        <div className="form-section">
          <div className="form-section-title">Core Measurements</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={form.date}
                onChange={e => update('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Morning Body Weight (kg)</label>
              <input type="number" step="0.1" className="form-input" placeholder="74.5"
                value={form.weight} onChange={e => updateNum('weight', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Waist Measurement (cm)</label>
              <input type="number" step="0.1" className="form-input" placeholder="Optional"
                value={form.waist} onChange={e => updateNum('waist', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Nutrition */}
        <div className="form-section">
          <div className="form-section-title">Nutrition</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Calories (kcal)</label>
              <input type="number" className="form-input" placeholder="1950"
                value={form.calories} onChange={e => updateNum('calories', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input type="number" className="form-input" placeholder="130"
                value={form.protein} onChange={e => updateNum('protein', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Carbs (g)</label>
              <input type="number" className="form-input" placeholder="180"
                value={form.carbs} onChange={e => updateNum('carbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Fats (g)</label>
              <input type="number" className="form-input" placeholder="60"
                value={form.fats} onChange={e => updateNum('fats', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Water Intake (L)</label>
              <input type="number" step="0.1" className="form-input" placeholder="3.0"
                value={form.waterIntake} onChange={e => updateNum('waterIntake', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="form-section">
          <div className="form-section-title">Activity & Training</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Steps</label>
              <input type="number" className="form-input" placeholder="8000"
                value={form.steps} onChange={e => updateNum('steps', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Workout Done</label>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                <button type="button" className={`btn ${form.workoutDone ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => update('workoutDone', true)}>Yes</button>
                <button type="button" className={`btn ${!form.workoutDone ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => update('workoutDone', false)}>No</button>
              </div>
            </div>
            {form.workoutDone && (
              <>
                <div className="form-group">
                  <label className="form-label">Workout Type</label>
                  <select className="form-select" value={form.workoutType}
                    onChange={e => update('workoutType', e.target.value)}>
                    <option value="">Select</option>
                    {WORKOUT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (min)</label>
                  <input type="number" className="form-input" placeholder="60"
                    value={form.workoutDuration} onChange={e => updateNum('workoutDuration', e.target.value)} />
                </div>
              </>
            )}
            <div className="form-group">
              <label className="form-label">Sleep (hours)</label>
              <input type="number" step="0.5" className="form-input" placeholder="7"
                value={form.sleepHours} onChange={e => updateNum('sleepHours', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Subjective */}
        <div className="form-section">
          <div className="form-section-title">How You Feel</div>
          <div className="form-grid">
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Hunger Level</span>
                <span className="slider-value">{form.hungerLevel}/10</span>
              </div>
              <input type="range" min="1" max="10" className="form-slider"
                value={form.hungerLevel} onChange={e => updateNum('hungerLevel', e.target.value)} />
            </div>
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Energy Level</span>
                <span className="slider-value">{form.energyLevel}/10</span>
              </div>
              <input type="range" min="1" max="10" className="form-slider"
                value={form.energyLevel} onChange={e => updateNum('energyLevel', e.target.value)} />
            </div>
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Cravings Level</span>
                <span className="slider-value">{form.cravingsLevel}/10</span>
              </div>
              <input type="range" min="1" max="10" className="form-slider"
                value={form.cravingsLevel} onChange={e => updateNum('cravingsLevel', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Digestion</label>
              <select className="form-select" value={form.digestionStatus}
                onChange={e => update('digestionStatus', e.target.value)}>
                {DIGESTION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Soreness Level</span>
                <span className="slider-value">{form.sorenessLevel}/10</span>
              </div>
              <input type="range" min="1" max="10" className="form-slider"
                value={form.sorenessLevel} onChange={e => updateNum('sorenessLevel', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Flags */}
        <div className="form-section">
          <div className="form-section-title">Tracking Flags</div>
          <div className="form-grid-2">
            <label className="checkbox">
              <input type="checkbox" checked={form.photoTaken}
                onChange={e => update('photoTaken', e.target.checked)} />
              Photo taken today
            </label>
            <label className="checkbox">
              <input type="checkbox" checked={form.bingeOrUntrackedFood}
                onChange={e => update('bingeOrUntrackedFood', e.target.checked)} />
              Binge / untracked food
            </label>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" placeholder="How was the day? Anything notable?"
                value={form.notes} onChange={e => update('notes', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Data Quality Checkboxes */}
        <div className="form-section" style={{ borderLeft: '3px solid var(--accent-red)' }}>
          <div className="form-section-title">Data Quality Verification</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
            These checkboxes directly affect your Data Quality Score. Be honest.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <label className="checkbox">
              <input type="checkbox" checked={form.fullyTracked}
                onChange={e => update('fullyTracked', e.target.checked)} />
              Fully tracked day — all food logged accurately
            </label>
            <label className="checkbox">
              <input type="checkbox" checked={form.foodWeighed}
                onChange={e => update('foodWeighed', e.target.checked)} />
              Food weighed properly — used scale, not eyeballed
            </label>
            <label className="checkbox">
              <input type="checkbox" checked={form.hiddenCaloriesCounted}
                onChange={e => update('hiddenCaloriesCounted', e.target.checked)} />
              Hidden calories counted — oils, sauces, bites, drinks included
            </label>
            <label className="checkbox">
              <input type="checkbox" checked={form.sameWeighInConditions}
                onChange={e => update('sameWeighInConditions', e.target.checked)} />
              Same weigh-in conditions followed — morning, fasted, after bathroom
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          {saved && (
            <span className="badge badge-success" style={{ alignSelf: 'center' }}>
              <Check size={14} /> Saved successfully
            </span>
          )}
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} />
            Save Check-In
          </button>
        </div>
      </form>
    </div>
  );
}
