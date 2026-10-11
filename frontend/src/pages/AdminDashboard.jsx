import { useState, useEffect } from 'react';
import { getCommandCenterMetrics } from '../services/api';
import { SkeletonCard } from '../components/ui/Skeleton';
import {
  ShieldAlert,
  DollarSign,
  Inbox,
  Clock,
  CheckCircle2,
  Building,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommandCenterMetrics()
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error('Failed to load command center metrics', err))
      .finally(() => setLoading(false));
  }, []);

  const totalValue = metrics?.totalProcurementValue || 0;
  const pendingCount = metrics?.pendingApprovals || 0;
  const overdueCount = metrics?.overdueApprovals || 0;
  const approvedCount = metrics?.totalApprovedCount || 0;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Command Center</h1>
          <p className="page-subtitle">Enterprise Purchasing Metrics, Budget Utilization & Governance Overview</p>
        </div>
        <span className="badge badge-urgent" style={{ padding: '0.4rem 0.85rem', gap: '0.4rem' }}>
          <ShieldAlert size={14} />
          <span>ADMIN SYSTEM ACCESS</span>
        </span>
      </div>

      {/* KPI Cards */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">Total Procurement Value</span>
              <DollarSign size={18} style={{ color: 'var(--accent-blue)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-blue)' }}>
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cumulative approved expenditure</span>
          </div>

          <div className="card kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">Pending Approvals</span>
              <Inbox size={18} style={{ color: 'var(--accent-amber)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-amber)' }}>
              {pendingCount}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across all departments</span>
          </div>

          <div className="card kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">Overdue Approvals</span>
              <Clock size={18} style={{ color: 'var(--accent-rose)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-rose)' }}>
              {overdueCount}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exceeded SLA turnaround</span>
          </div>

          <div className="card kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">Approved Orders</span>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-emerald)' }}>
              {approvedCount}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Authorized purchase orders</span>
          </div>
        </div>
      )}

      {/* 2-Column Analytics Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* SLA Performance Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            <Activity size={18} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              SLA Turnaround Performance
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', fontSize: '0.875rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>SLA On Track</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-emerald)' }}>
                  {metrics?.slaOnTrackCount || 0} Requests
                </span>
              </div>
              <div className="budget-bar-container" style={{ height: '6px' }}>
                <div
                  className="budget-bar-fill budget-green"
                  style={{ width: `${Math.min(100, ((metrics?.slaOnTrackCount || 0) / Math.max(1, pendingCount)) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>SLA Due Soon (&lt; 12 Hours)</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-amber)' }}>
                  {metrics?.slaDueSoonCount || 0} Requests
                </span>
              </div>
              <div className="budget-bar-container" style={{ height: '6px' }}>
                <div
                  className="budget-bar-fill budget-amber"
                  style={{ width: `${Math.min(100, ((metrics?.slaDueSoonCount || 0) / Math.max(1, pendingCount)) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>SLA Overdue Flagged</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-rose)' }}>
                  {overdueCount} Requests
                </span>
              </div>
              <div className="budget-bar-container" style={{ height: '6px' }}>
                <div
                  className="budget-bar-fill budget-red"
                  style={{ width: `${Math.min(100, (overdueCount / Math.max(1, pendingCount)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Department Spending Allocation */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            <Building size={18} style={{ color: 'var(--accent-indigo)' }} />
            <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Department Spend Allocation
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            {metrics?.departmentSpending && Object.entries(metrics.departmentSpending).length > 0 ? (
              Object.entries(metrics.departmentSpending).map(([dept, spend]) => (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{dept}</span>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                      ${spend?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="budget-bar-container" style={{ height: '5px' }}>
                    <div
                      className="budget-bar-fill budget-green"
                      style={{ width: `${Math.min(100, totalValue > 0 ? ((spend || 0) / totalValue) * 100 : 20)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No department expenditure records logged yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
