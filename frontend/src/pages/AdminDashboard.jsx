import React, { useState, useEffect } from 'react';
import { getCommandCenterMetrics } from '../services/api';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommandCenterMetrics()
      .then(res => setMetrics(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Command Center</h1>
          <p className="page-subtitle">Enterprise Purchasing Metrics, Budget Utilization & Governance Overview</p>
        </div>
        <span className="badge badge-urgent" style={{ padding: '0.4rem 0.85rem' }}>ADMIN SYSTEM ACCESS</span>
      </div>

      {loading ? (
        <div className="kpi-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="kpi-grid">
          <div className="card kpi-card">
            <span className="kpi-title">Total Procurement Value</span>
            <span className="kpi-value" style={{ color: 'var(--accent-blue)' }}>
              ${metrics?.totalProcurementValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </span>
          </div>
          <div className="card kpi-card">
            <span className="kpi-title">Pending Approvals</span>
            <span className="kpi-value" style={{ color: 'var(--accent-amber)' }}>
              {metrics?.pendingApprovals || 0}
            </span>
          </div>
          <div className="card kpi-card">
            <span className="kpi-title">Overdue Approvals</span>
            <span className="kpi-value" style={{ color: 'var(--accent-rose)' }}>
              {metrics?.overdueApprovals || 0}
            </span>
          </div>
          <div className="card kpi-card">
            <span className="kpi-title">Approved Orders</span>
            <span className="kpi-value" style={{ color: 'var(--accent-emerald)' }}>
              {metrics?.totalApprovedCount || 0}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* SLA Distribution */}
        <div className="card">
          <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            SLA Performance Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🟢 SLA On Track</span>
              <span style={{ fontWeight: '800', color: 'var(--accent-emerald)' }}>{metrics?.slaOnTrackCount || 0} Requests</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>⚡ SLA Due Soon (&lt; 12h)</span>
              <span style={{ fontWeight: '800', color: 'var(--accent-amber)' }}>{metrics?.slaDueSoonCount || 0} Requests</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🚨 SLA Overdue</span>
              <span style={{ fontWeight: '800', color: 'var(--accent-rose)' }}>{metrics?.overdueApprovals || 0} Requests</span>
            </div>
          </div>
        </div>

        {/* Department Spending Summary */}
        <div className="card">
          <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Department Spend Allocation
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
            {metrics?.departmentSpending && Object.entries(metrics.departmentSpending).map(([dept, spend]) => (
              <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{dept}</span>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                  ${spend?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
