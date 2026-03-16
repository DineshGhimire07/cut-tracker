import { Camera, Upload, Image } from 'lucide-react';

export default function Photos() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Progress Photos</h1>
        <p>Track visual changes with organized photo comparisons</p>
      </div>

      {/* Upload Area */}
      <div className="card section-gap" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        border: '2px dashed var(--border-primary)',
        background: 'var(--bg-elevated)',
        cursor: 'pointer',
        transition: 'all var(--duration-normal)',
      }}>
        <Upload size={32} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }} />
        <p style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
          Upload Progress Photos
        </p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
          Front · Side · Back · Flexed
        </p>
      </div>

      {/* Photo Categories */}
      <div className="grid-4 section-gap">
        {['Front', 'Side', 'Back', 'Flexed'].map(type => (
          <div key={type} className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <Camera size={24} style={{ color: 'var(--text-tertiary)', margin: '0 auto var(--space-3)' }} />
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{type}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>No photos yet</div>
          </div>
        ))}
      </div>

      {/* Comparison placeholder */}
      <div className="card section-gap">
        <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Photo Comparison</div>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <div style={{
            flex: 1,
            aspectRatio: '3/4',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}>
            <Image size={24} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Day 1</span>
          </div>
          <div style={{
            flex: 1,
            aspectRatio: '3/4',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}>
            <Image size={24} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Day 14</span>
          </div>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 'var(--space-3)' }}>
          Upload photos to enable side-by-side comparison
        </p>
      </div>
    </div>
  );
}
