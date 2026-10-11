import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingApprovals, submitApprovalDecision } from '../services/api';
import { useToast } from '../context/ToastContext';
import PriorityBadge from '../components/PriorityBadge';
import SlaBadge from '../components/SlaBadge';
import { SkeletonTable, SkeletonCard } from '../components/ui/Skeleton';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Search,
  X
} from 'lucide-react';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Decision Modal State
  const [decisionModal, setDecisionModal] = useState(null); // { req, action }
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);
  const [commentError, setCommentError] = useState('');

  const fetchPending = async () => {
    try {
      const res = await getPendingApprovals();
      setPendingRequests(res.data || []);
    } catch (err) {
      console.error('Failed to fetch pending approvals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const openDecisionModal = (req, action) => {
    setDecisionModal({ req, action });
    setComments('');
    setCommentError('');
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!decisionModal) return;

    if (decisionModal.action === 'REJECT' && !comments.trim()) {
      setCommentError('A detailed rejection reason comment is mandatory when rejecting a purchase request.');
      addToast('A detailed rejection reason is mandatory when rejecting.', 'warning');
      return;
    }

    setProcessing(true);
    setCommentError('');
    try {
      await submitApprovalDecision(decisionModal.req.id, {
        action: decisionModal.action,
        comments: comments.trim(),
      });

      const isApprove = decisionModal.action === 'APPROVE';
      addToast(
        `Order ${decisionModal.req.requestNumber} successfully ${isApprove ? 'Approved' : 'Rejected'}`,
        isApprove ? 'success' : 'error'
      );
      setDecisionModal(null);
      setComments('');
      fetchPending();
    } catch (err) {
      addToast('Error submitting decision: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setProcessing(false);
    }
  };

  const urgentCount = pendingRequests.filter(
    (r) => r.priorityLevel === 'URGENT' || r.urgency === 'CRITICAL'
  ).length;
  const overdueCount = pendingRequests.filter((r) => r.slaStatus === 'OVERDUE').length;

  const filteredRequests = pendingRequests.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.requestNumber?.toLowerCase().includes(term) ||
      r.title?.toLowerCase().includes(term) ||
      r.employeeName?.toLowerCase().includes(term) ||
      r.category?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Approval Command Center</h1>
          <p className="page-subtitle">Department Manager Authorization & Governance Queue</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="badge badge-high" style={{ padding: '0.4rem 0.85rem', gap: '0.4rem' }}>
            <ShieldCheck size={14} />
            <span>DEPARTMENT MANAGER</span>
          </span>
        </div>
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
              <span className="kpi-title">Pending Approvals</span>
              <Inbox size={18} style={{ color: 'var(--accent-amber)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-amber)' }}>
              {pendingRequests.length}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orders awaiting review</span>
          </div>

          <div className="card kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">Urgent Queue</span>
              <AlertTriangle size={18} style={{ color: 'var(--accent-rose)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-rose)' }}>
              {urgentCount}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Critical priority orders</span>
          </div>

          <div className="card kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">SLA Overdue</span>
              <Clock size={18} style={{ color: 'var(--accent-rose)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-rose)' }}>
              {overdueCount}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exceeded standard window</span>
          </div>

          <div className="card kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">Governance Status</span>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
            </div>
            <span className="kpi-value" style={{ color: 'var(--accent-emerald)' }}>
              Active
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget guardrails active</span>
          </div>
        </div>
      )}

      {/* Review Queue Table */}
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
              Priority-Sorted Review Queue
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Orders ordered dynamically by Smart Priority Engine score
            </p>
          </div>

          <div style={{ position: 'relative', width: '240px' }}>
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
              placeholder="Search queue..."
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
        </div>

        {loading ? (
          <SkeletonTable rows={4} />
        ) : filteredRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'var(--accent-emerald)',
              }}
            >
              <CheckCircle2 size={28} />
            </div>
            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              All caught up!
            </h3>
            <p style={{ fontSize: '0.875rem' }}>
              {searchTerm
                ? 'No pending requests match your search criteria.'
                : 'No purchase requests currently require your managerial review.'}
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>PR Number</th>
                  <th>Title & Category</th>
                  <th>Submitter</th>
                  <th>Estimated Cost</th>
                  <th>Priority Score</th>
                  <th>SLA Status</th>
                  <th style={{ textAlign: 'right' }}>Authorization Action</th>
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
                    <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                      {r.employeeName}
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
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.45rem', alignItems: 'center' }}>
                        <button
                          className="btn btn-success"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => openDecisionModal(r, 'APPROVE')}
                          title="Authorize purchase order"
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => openDecisionModal(r, 'REJECT')}
                          title="Reject purchase order"
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', gap: '0.25rem' }}
                          onClick={() => navigate(`/requests/${r.id}`)}
                          title="Inspect details and audit trail"
                        >
                          <span>Details</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Decision Authorization Modal */}
      {decisionModal && (
        <div
          className="modal-overlay"
          onClick={() => setDecisionModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {decisionModal.action === 'APPROVE' ? (
                  <CheckCircle2 size={22} style={{ color: 'var(--accent-emerald)' }} />
                ) : (
                  <XCircle size={22} style={{ color: 'var(--accent-rose)' }} />
                )}
                <h3 style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  Confirm {decisionModal.action === 'APPROVE' ? 'Approval' : 'Rejection'}
                </h3>
              </div>
              <button
                onClick={() => setDecisionModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Request Summary Capsule */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '700', color: 'var(--accent-blue)', fontSize: '0.875rem' }}>
                  {decisionModal.req.requestNumber}
                </span>
                <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>
                  ${decisionModal.req.estimatedCost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {decisionModal.req.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Submitted by: {decisionModal.req.employeeName}
              </div>
            </div>

            <form onSubmit={handleDecisionSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Manager Review Comments{' '}
                  {decisionModal.action === 'REJECT' ? (
                    <span style={{ color: 'var(--accent-rose)', fontWeight: '700' }}>
                      * (Mandatory Rejection Rationale)
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(Optional notes)</span>
                  )}
                </label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  required={decisionModal.action === 'REJECT'}
                  value={comments}
                  onChange={(e) => {
                    setComments(e.target.value);
                    if (e.target.value.trim()) setCommentError('');
                  }}
                  placeholder={
                    decisionModal.action === 'REJECT'
                      ? 'Specify why this order is rejected (e.g., budget exceeded, duplicate service, missing specs)...'
                      : 'Add authorization notes, vendor confirmation codes, or remarks...'
                  }
                  style={{
                    borderColor: commentError ? 'var(--accent-rose)' : undefined,
                  }}
                />
                {commentError && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '0.25rem' }}>
                    {commentError}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDecisionModal(null)}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${decisionModal.action === 'APPROVE' ? 'btn-success' : 'btn-danger'}`}
                  disabled={processing}
                >
                  {processing
                    ? 'Processing...'
                    : `Confirm ${decisionModal.action === 'APPROVE' ? 'Approval' : 'Rejection'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
