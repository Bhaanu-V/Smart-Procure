import React, { useState } from 'react';

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
        style={{ cursor: 'pointer' }}
      >
        {level} {score ? `(${score} pts)` : ''} ℹ️
      </span>

      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            width: '260px',
            padding: '0.75rem',
            background: '#1e293b',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.75rem',
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ fontWeight: '700', marginBottom: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
            Priority Score Breakdown
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span>Amount ({cost ? `$${cost}` : 'Cost'}):</span>
            <span style={{ fontWeight: '700' }}>Weighted</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span>Urgency ({urgency || 'MEDIUM'}):</span>
            <span style={{ fontWeight: '700' }}>Rule Match</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Calculated transparently by Smart Priority Engine.
          </div>
        </div>
      )}
    </div>
  );
}
