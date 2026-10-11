import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyRequests } from '../services/api';
import PriorityBadge from '../components/PriorityBadge';
import SlaBadge from '../components/SlaBadge';
import { SkeletonTable, SkeletonCard } from '../components/ui/Skeleton';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  ArrowUpRight,
  Inbox
} from 'lucide-react';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getMyRequests()
      .then((res) => setRequests(res.data || []))
      .catch((err) => console.error('Failed to fetch requests', err))
      .finally(() => setLoading(false));
  }, []);

  const totalRequests = requests.length;
  const pendingCount = requests.filter(
    (r) => r.status === 'SUBMITTED' || r.status === 'IN_REVIEW' || r.status === 'UNDER_REVIEW'
  ).length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  const filteredRequests = requests.filter((r) => {
    const matchesTab =
      activeTab === 'ALL'
        ? true
        : activeTab === 'PENDING'
        ? r.status === 'SUBMITTED' || r.status === 'IN_REVIEW' || r.status === 'UNDER_REVIEW'
        : r.status === activeTab;

    const matchesSearch =
      searchTerm.trim() === '' ||
      r.requestNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Procurement Workspace</h1>
          <p className="page-subtitle">Track, manage, and submit department purchase requests in real time.</p>
        </div>
        <Link to="/requests/new" className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <Plus size={16} />
          <span>New Purchase Request</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">Total Submissions</span>
              <FileText size={18} style={{ color: 'var(--accent-blue)' }} />
            </div>
            <span className="kpi-value">{totalRequests}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All recorded orders</span>
          </div>

          <div className="card kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">Pending Review</span>
              <Clock size={18} style={{ color: 'var(--accent-amber)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-amber)' }}>
              {pendingCount}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting manager action</span>
          </div>

          <div className="card kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">Approved Orders</span>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-emerald)' }}>
              {approvedCount}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Successfully authorized</span>
          </div>

          <div className="card kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">Rejected Orders</span>
              <XCircle size={18} style={{ color: 'var(--accent-rose)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-rose)' }}>
              {rejectedCount}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Declined with feedback</span>
          </div>
        </div>
      )}

      {/* Content Section: Table & Status Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(260px, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main Table Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                My Purchase Requests
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Showing {filteredRequests.length} of {totalRequests} total requests
              </p>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '200px' }}>
                <Search
                  size={14}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Filter requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{
                    padding: '0.4rem 0.75rem 0.4rem 2.1rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(255,255,255,0.03)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.725rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <SkeletonTable rows={4} />
          ) : filteredRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: 'var(--accent-blue)',
                }}
              >
                <Inbox size={24} />
              </div>
              <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                No purchase requests found
              </p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {searchTerm
                  ? 'No results match your search criteria. Try a different keyword.'
                  : 'You have not submitted any purchase requests matching this view.'}
              </p>
              <Link to="/requests/new" className="btn btn-secondary" style={{ fontSize: '0.825rem' }}>
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
                    <th>Estimated Cost</th>
                    <th>Priority</th>
                    <th>SLA Turnaround</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>
                        {r.requestNumber}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{r.title}</div>
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
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => navigate(`/requests/${r.id}`)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.75rem',
                            gap: '0.3rem',
                          }}
                        >
                          <span>Details</span>
                          <ArrowUpRight size={13} />
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3
              style={{
                fontWeight: '700',
                fontSize: '0.95rem',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.5rem',
                color: 'var(--text-primary)',
              }}
            >
              Order Status Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Approved</span>
                  <span style={{ fontWeight: '800', color: 'var(--accent-emerald)' }}>
                    {approvedCount} ({totalRequests > 0 ? Math.round((approvedCount / totalRequests) * 100) : 0}%)
                  </span>
                </div>
                <div className="budget-bar-container" style={{ height: '6px' }}>
                  <div
                    className="budget-bar-fill budget-green"
                    style={{ width: `${totalRequests > 0 ? (approvedCount / totalRequests) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Pending Review</span>
                  <span style={{ fontWeight: '800', color: 'var(--accent-amber)' }}>
                    {pendingCount} ({totalRequests > 0 ? Math.round((pendingCount / totalRequests) * 100) : 0}%)
                  </span>
                </div>
                <div className="budget-bar-container" style={{ height: '6px' }}>
                  <div
                    className="budget-bar-fill budget-amber"
                    style={{ width: `${totalRequests > 0 ? (pendingCount / totalRequests) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Rejected</span>
                  <span style={{ fontWeight: '800', color: 'var(--accent-rose)' }}>
                    {rejectedCount} ({totalRequests > 0 ? Math.round((rejectedCount / totalRequests) * 100) : 0}%)
                  </span>
                </div>
                <div className="budget-bar-container" style={{ height: '6px' }}>
                  <div
                    className="budget-bar-fill budget-red"
                    style={{ width: `${totalRequests > 0 ? (rejectedCount / totalRequests) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="glass-card" style={{ background: 'rgba(56, 189, 248, 0.03)', borderColor: 'rgba(56, 189, 248, 0.15)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '0.4rem' }}>
              Procurement SLA Guidance
            </h4>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Standard orders are reviewed within 48 hours. Urgent or critical items are prioritized with 12–24h turnaround times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
