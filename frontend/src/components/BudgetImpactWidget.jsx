import { ShieldAlert, TrendingUp } from 'lucide-react';

export default function BudgetImpactWidget({ impact }) {
  if (!impact) return null;

  const {
    departmentName,
    allocatedBudget,
    usedBudget,
    pendingBudget,
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
    <div className="card" style={{ marginBottom: '1.5rem', borderColor: isExceeded ? 'var(--accent-rose)' : 'var(--border-subtle)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <TrendingUp size={16} style={{ color: 'var(--accent-blue)' }} />
          <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Department Budget Impact ({departmentName})
          </h4>
        </div>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: '800',
            color: isExceeded ? 'var(--accent-rose)' : 'var(--accent-emerald)',
          }}
        >
          {usagePercentage?.toFixed(1)}% Allocated
        </span>
      </div>

      <div className="budget-bar-container">
        <div
          className={`budget-bar-fill ${getBarColorClass()}`}
          style={{ width: `${Math.min(usagePercentage || 0, 100)}%` }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.85rem',
          marginTop: '1.15rem',
          fontSize: '0.825rem',
        }}
      >
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.725rem', textTransform: 'uppercase', fontWeight: '700' }}>
            Allocated Budget
          </div>
          <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
            ${allocatedBudget?.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.725rem', textTransform: 'uppercase', fontWeight: '700' }}>
            Used Budget
          </div>
          <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
            ${usedBudget?.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.725rem', textTransform: 'uppercase', fontWeight: '700' }}>
            Pending Hold
          </div>
          <div style={{ fontWeight: '700', color: 'var(--accent-amber)', marginTop: '0.15rem' }}>
            ${pendingBudget?.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.725rem', textTransform: 'uppercase', fontWeight: '700' }}>
            Projected Rem.
          </div>
          <div
            style={{
              fontWeight: '800',
              color: isExceeded ? 'var(--accent-rose)' : 'var(--accent-blue)',
              marginTop: '0.15rem',
            }}
          >
            ${projectedRemainingBudget?.toLocaleString()}
          </div>
        </div>
      </div>

      {isExceeded && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.65rem 0.85rem',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: '#fda4af',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ShieldAlert size={16} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />
          <span>Notice: This purchase request exceeds the projected remaining department budget.</span>
        </div>
      )}
    </div>
  );
}
