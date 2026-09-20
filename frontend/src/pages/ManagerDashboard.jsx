import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingApprovals, submitApprovalDecision } from '../services/api';
import { useToast } from '../context/ToastContext';
import PriorityBadge from '../components/PriorityBadge';
import SlaBadge from '../components/SlaBadge';
import { SkeletonTable, SkeletonCard } from '../components/ui/Skeleton';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decision Modal State
  const [decisionModal, setDecisionModal] = useState(null); // { req, action }
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchPending = async () => {
    try {
      const res = await getPendingApprovals();
      setPendingRequests(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!decisionModal) return;

    if (decisionModal.action === 'REJECT' && !comments.trim()) {
      addToast('A detailed rejection reason comment is mandatory when rejecting a purchase request.', 'warning');
      return;
    }

    setProcessing(true);
    try {
      await submitApprovalDecision(decisionModal.req.id, {
        action: decisionModal.action,
        comments
      });

      addToast(`Order ${decisionModal.req.requestNumber} ${decisionModal.action === 'APPROVE' ? 'Approved 🎉' : 'Rejected ⚠️'}`, decisionModal.action === 'APPROVE' ? 'success' : 'error');
      setDecisionModal(null);
      setComments('');
      fetchPending();
    } catch (err) {
      addToast('Error submitting decision: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setProcessing(false);
    }
  };

  const urgentCount = pendingRequests.filter(r => r.priorityLevel === 'URGENT' || r.urgency === 'CRITICAL').length;
  const overdueCount = pendingRequests.filter(r => r.slaStatus === 'OVERDUE').length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Approval Command Center</h1>
          <p className="page-subtitle">Department Manager Authorization & Governance Queue</p>
        </div>
        <span className="badge badge-high" style={{ padding: '0.4rem 0.85rem' }}>DEPARTMENT MANAGER</span>
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
            <span className="kpi-title">Pending Approvals</span>
            <span className="kpi-value" style={{ color: 'var(--accent-amber)' }}>{pendingRequests.length}</span>
          </div>
          <div className="card kpi-card">
            <span className="kpi-title">Urgent Queue</span>
            <span className="kpi-value" style={{ color: 'var(--accent-rose)' }}>{urgentCount}</span>
          </div>
          <div className="card kpi-card">
            <span className="kpi-title">SLA Overdue</span>
            <span className="kpi-value" style={{ color: 'var(--accent-rose)' }}>{overdueCount}</span>
          </div>
          <div className="card kpi-card">
            <span className="kpi-title">Review Velocity</span>
            <span className="kpi-value" style={{ color: 'var(--accent-emerald)' }}>High</span>
          </div>
        </div>
      )}

      {/* Pending Queue Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontWeight: '800', fontSize: '1.1rem' }}>Priority-Sorted Review Queue</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sorted by Smart Priority Score</span>
        </div>

        {loading ? (
          <SkeletonTable rows={4} />
        ) : pendingRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
            <p style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              All caught up!
            </p>
            <p style={{ fontSize: '0.875rem' }}>No purchase requests currently require your review.</p>
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
                  <th>Authorization</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>{r.requestNumber}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{r.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.category}</div>
                    </td>
                    <td style={{ fontWeight: '600' }}>{r.employeeName}</td>
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
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-success"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => setDecisionModal({ req: r, action: 'APPROVE' })}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => setDecisionModal({ req: r, action: 'REJECT' })}
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => navigate(`/requests/${r.id}`)}
                        >
                          Details
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

      {/* Decision Confirmation Modal */}
      {decisionModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }} onClick={() => setDecisionModal(null)}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', backgroundColor: 'var(--bg-card)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: '800', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
              Confirm Authorization: <span style={{ color: decisionModal.action === 'APPROVE' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{decisionModal.action}</span>
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Request: <strong style={{ color: 'var(--text-primary)' }}>{decisionModal.req.requestNumber}</strong> ({decisionModal.req.title}) - <strong>${decisionModal.req.estimatedCost?.toLocaleString()}</strong>
            </p>

            <form onSubmit={handleDecisionSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Manager Review Notes {decisionModal.action === 'REJECT' && <span style={{ color: 'var(--accent-rose)' }}>* (Mandatory Rejection Rationale)</span>}
                </label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  required={decisionModal.action === 'REJECT'}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Enter approval authorization code, comments, or rejection reason..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setDecisionModal(null)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${decisionModal.action === 'APPROVE' ? 'btn-success' : 'btn-danger'}`}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Confirm ${decisionModal.action}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
