import { useState } from 'react';
import { Info } from 'lucide-react';

export default function PriorityBadge({ level, score, cost, urgency }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getBadgeClass = () => {
    switch (level) {
      case 'URGENT': return 'priority-urgent';
      case 'HIGH': return 'priority-high';
      case 'NORMAL': return 'priority-normal';
      case 'LOW': return 'priority-low';
      default: return 'priority-normal';
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span
        className={`priority-badge ${getBadgeClass()}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ cursor: 'pointer', gap: '0.35rem' }}
      >
        <span>{level}</span>
        {score !== undefined && score !== null ? (
          <span style={{ opacity: 0.85, fontWeight: '600' }}>({score} pts)</span>
        ) : null}
        <Info size={12} style={{ opacity: 0.75 }} />
      </span>

      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '130%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            width: '240px',
            padding: '0.75rem',
            background: 'var(--bg-modal)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-overlay)',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: '700', marginBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem', color: 'var(--accent-blue)' }}>
            Priority Score Breakdown
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Amount Weight:</span>
            <span style={{ fontWeight: '700' }}>{cost ? `$${Number(cost).toLocaleString()}` : 'Calculated'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Urgency Multiplier:</span>
            <span style={{ fontWeight: '700' }}>{urgency || 'Standard'}</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: '1.4' }}>
            Rule-based explainable score calculated on order submission.
          </div>
        </div>
      )}
    </div>
  );
}
