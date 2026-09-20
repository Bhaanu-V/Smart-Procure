import React, { useState, useEffect } from 'react';
import { getCommandCenterMetrics } from '../services/api';

export default function CommandCenterDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommandCenterMetrics()
      .then(res => setMetrics(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="main-container"><p>Loading Command Center Metrics...</p></div>;

  return (
    <div className="main-container">
      <div className="workspace-header">
        <div>
          <h1 className="workspace-title">Procurement Command Center</h1>
          <p className="workspace-subtitle">Executive Governance & Spending Oversight</p>
        </div>
        <span className="priority-badge priority-urgent">ADMIN ACCESS</span>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <span className="metric-label">Total Procurement Value</span>
          <span className="metric-value" style={{ color: 'var(--accent-cyan)' }}>
            ${metrics?.totalProcurementValue?.toLocaleString() || '0'}
          </span>
        </div>
        <div className="glass-card metric-card">
          <span className="metric-label">Pending Approvals</span>
          <span className="metric-value" style={{ color: 'var(--accent-amber)' }}>
            {metrics?.pendingApprovals || 0}
          </span>
        </div>
        <div className="glass-card metric-card">
          <span className="metric-label">Overdue Approvals</span>
          <span className="metric-value" style={{ color: 'var(--accent-rose)' }}>
            {metrics?.overdueApprovals || 0}
          </span>
        </div>
        <div className="glass-card metric-card">
          <span className="metric-label">Approved Orders</span>
          <span className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
            {metrics?.totalApprovedCount || 0}
          </span>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>SLA Performance Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🟢 On Track:</span>
              <span style={{ fontWeight: '700' }}>{metrics?.slaOnTrackCount || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>⚡ Due Soon:</span>
              <span style={{ fontWeight: '700' }}>{metrics?.slaDueSoonCount || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🚨 Overdue:</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-rose)' }}>{metrics?.overdueApprovals || 0}</span>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>Department Spend Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {metrics?.departmentSpending && Object.entries(metrics.departmentSpending).map(([dept, spend]) => (
              <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>{dept}</span>
                <span style={{ fontWeight: '700' }}>${spend?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
