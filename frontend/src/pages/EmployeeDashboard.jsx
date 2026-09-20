import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyRequests } from '../services/api';
import PriorityBadge from '../components/PriorityBadge';
import SlaBadge from '../components/SlaBadge';
import { SkeletonTable, SkeletonCard } from '../components/ui/Skeleton';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    getMyRequests()
      .then(res => setRequests(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalRequests = requests.length;
  const pendingCount = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'IN_REVIEW').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'PENDING') return r.status === 'SUBMITTED' || r.status === 'IN_REVIEW';
    if (activeTab === 'APPROVED') return r.status === 'APPROVED';
    if (activeTab === 'REJECTED') return r.status === 'REJECTED';
    return true;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Procurement Workspace</h1>
          <p className="page-subtitle">Manage, track, and submit department purchase requests.</p>
        </div>
        <Link to="/requests/new" className="btn btn-primary">
          <span>➕</span> New Purchase Request
        </Link>
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
            <span className="kpi-title">Total Submissions</span>
            <span className="kpi-value">{totalRequests}</span>
          </div>
          <div className="card kpi-card">
            <span className="kpi-title">Pending Review</span>
            <span className="kpi-value" style={{ color: 'var(--accent-amber)' }}>{pendingCount}</span>
          </div>
          <div className="card kpi-card">
            <span className="kpi-title">Approved Orders</span>
            <span className="kpi-value" style={{ color: 'var(--accent-emerald)' }}>{approvedCount}</span>
          </div>
          <div className="card kpi-card">
            <span className="kpi-title">Rejected Orders</span>
            <span className="kpi-value" style={{ color: 'var(--accent-rose)' }}>{rejectedCount}</span>
          </div>
        </div>
      )}

      {/* Content Section: Table & Status Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem' }}>
        {/* Main Table Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: '800', fontSize: '1.1rem' }}>My Purchase Requests</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <SkeletonTable rows={4} />
          ) : filteredRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📑</div>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>No purchase requests found in this view.</p>
              <Link to="/requests/new" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                Create First Request
              </Link>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PR Number</th>
                    <th>Title & Category</th>
                    <th>Cost</th>
                    <th>Priority</th>
                    <th>SLA Status</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>{r.requestNumber}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{r.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.category}</div>
                      </td>
                      <td style={{ fontWeight: '700' }}>
                        ${r.estimatedCost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td>
                        <PriorityBadge level={r.priorityLevel} score={r.priorityScore} cost={r.estimatedCost} urgency={r.urgency} />
                      </td>
                      <td>
                        <SlaBadge status={r.slaStatus} expectedTime={r.expectedApprovalTime} />
                      </td>
                      <td>
                        <span className={`badge badge-${r.status?.toLowerCase()}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => navigate(`/requests/${r.id}`)}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar Widget: Status Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Status Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Approved</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-emerald)' }}>{approvedCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Pending Review</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-amber)' }}>{pendingCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Rejected</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-rose)' }}>{rejectedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
