import React from 'react';

export default function BudgetImpactWidget({ impact }) {
  if (!impact) return null;

  const {
    departmentName,
    allocatedBudget,
    usedBudget,
    pendingBudget,
    remainingBudget,
    requestCost,
    projectedRemainingBudget,
    isExceeded,
    usagePercentage
  } = impact;

  const getBarColorClass = () => {
    if (usagePercentage > 90) return 'budget-red';
    if (usagePercentage > 75) return 'budget-amber';
    return 'budget-green';
  };

  return (
    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Department Budget Impact ({departmentName})</h4>
        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: isExceeded ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
          {usagePercentage?.toFixed(1)}% Allocated
        </span>
      </div>

      <div className="budget-bar-container">
        <div className={`budget-bar-fill ${getBarColorClass()}`} style={{ width: `${Math.min(usagePercentage || 0, 100)}%` }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1rem', fontSize: '0.8rem' }}>
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Allocated</div>
          <div style={{ fontWeight: '700' }}>${allocatedBudget?.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Used</div>
          <div style={{ fontWeight: '700' }}>${usedBudget?.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Pending</div>
          <div style={{ fontWeight: '700' }}>${pendingBudget?.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Projected Rem.</div>
          <div style={{ fontWeight: '800', color: isExceeded ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
            ${projectedRemainingBudget?.toLocaleString()}
          </div>
        </div>
      </div>

      {isExceeded && (
        <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', borderRadius: '6px', fontSize: '0.8rem', color: '#fda4af' }}>
          ⚠️ Warning: This purchase request exceeds the projected remaining department budget!
        </div>
      )}
    </div>
  );
}
