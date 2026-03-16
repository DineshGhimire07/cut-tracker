import { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Save, Check, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const { baseline, updateBaseline, resetToSeedData } = useStore();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...baseline });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateNum = (field, value) => update(field, value === '' ? '' : Number(value));

  const handleSave = () => {
    updateBaseline(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your profile baseline and tracking preferences</p>
      </div>

      {/* Profile Baseline */}
      <div className="settings-group">
        <div className="settings-group-title">Profile Baseline</div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Age</span><span>Years old</span>
          </div>
          <input type="number" className="form-input" value={form.age}
            onChange={e => updateNum('age', e.target.value)} />
        </div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Height</span><span>Centimeters</span>
          </div>
          <input type="number" className="form-input" value={form.height}
            onChange={e => updateNum('height', e.target.value)} />
        </div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Current Weight</span><span>Kilograms</span>
          </div>
          <input type="number" step="0.1" className="form-input" value={form.currentWeight}
            onChange={e => updateNum('currentWeight', e.target.value)} />
        </div>
      </div>

      {/* Targets */}
      <div className="settings-group">
        <div className="settings-group-title">Calorie & Macro Targets</div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Target Calories</span><span>Daily kcal target for this cut</span>
          </div>
          <input type="number" className="form-input" value={form.targetCalories}
            onChange={e => updateNum('targetCalories', e.target.value)} />
        </div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Maintenance Calories</span><span>Estimated TDEE</span>
          </div>
          <input type="number" className="form-input" value={form.maintenanceCalories}
            onChange={e => updateNum('maintenanceCalories', e.target.value)} />
        </div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Protein Target</span><span>Daily grams</span>
          </div>
          <input type="number" className="form-input" value={form.proteinTarget}
            onChange={e => updateNum('proteinTarget', e.target.value)} />
        </div>
      </div>

      {/* Activity Targets */}
      <div className="settings-group">
        <div className="settings-group-title">Activity Targets</div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Step Target</span><span>Daily steps goal</span>
          </div>
          <input type="number" className="form-input" value={form.stepTarget}
            onChange={e => updateNum('stepTarget', e.target.value)} />
        </div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Gym Frequency</span><span>Days per week</span>
          </div>
          <input type="number" className="form-input" value={form.gymFrequency}
            onChange={e => updateNum('gymFrequency', e.target.value)} />
        </div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Water Target</span><span>Liters per day</span>
          </div>
          <input type="number" step="0.1" className="form-input" value={form.waterTarget}
            onChange={e => updateNum('waterTarget', e.target.value)} />
        </div>
      </div>

      {/* Phase */}
      <div className="settings-group">
        <div className="settings-group-title">Phase Settings</div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>14-Day Cycle Start Date</span><span>Begin of current tracking cycle</span>
          </div>
          <input type="date" className="form-input" value={form.cycleStartDate}
            onChange={e => update('cycleStartDate', e.target.value)} />
        </div>
      </div>

      {/* Preferences */}
      <div className="settings-group">
        <div className="settings-group-title">Tracking Preferences</div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Show Adherence Score</span><span>Display daily adherence scoring</span>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={form.showAdherenceScore}
              onChange={e => update('showAdherenceScore', e.target.checked)} />
            <span className="toggle-track"></span>
            <span className="toggle-thumb"></span>
          </label>
        </div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Show Data Quality Score</span><span>Display daily data quality scoring</span>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={form.showDataQualityScore}
              onChange={e => update('showDataQualityScore', e.target.checked)} />
            <span className="toggle-track"></span>
            <span className="toggle-thumb"></span>
          </label>
        </div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Chart Smoothing</span><span>Smooth chart line rendering</span>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={form.chartSmoothing}
              onChange={e => update('chartSmoothing', e.target.checked)} />
            <span className="toggle-track"></span>
            <span className="toggle-thumb"></span>
          </label>
        </div>
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Reminder Banners</span><span>Show contextual reminder banners</span>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={form.reminderBanners}
              onChange={e => update('reminderBanners', e.target.checked)} />
            <span className="toggle-track"></span>
            <span className="toggle-thumb"></span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
        <button type="button" className="btn btn-secondary" onClick={resetToSeedData}>
          <RotateCcw size={16} />
          Reset to Demo Data
        </button>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {saved && (
            <span className="badge badge-success">
              <Check size={14} /> Settings saved
            </span>
          )}
          <button type="button" className="btn btn-primary btn-lg" onClick={handleSave}>
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
