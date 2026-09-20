import React, { useState, useEffect } from 'react';
import { getPendingApprovals, submitApprovalDecision } from '../services/api';
import PriorityBadge from './PriorityBadge';
import SlaBadge from './SlaBadge';
import VisualTimeline from './VisualTimeline';

export default function ManagerWorkspace() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [decisionModal, setDecisionModal] = useState(null); // { req, action }
  const [comments, setComments] = useState('');

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

  const handleDecision = async (e) => {
    e.preventDefault();
    if (!decisionModal) return;

    try {
      await submitApprovalDecision(decisionModal.req.id, {
        action: decisionModal.action,
        comments
      });
      setDecisionModal(null);
      setComments('');
      fetchPending();
    } catch (err) {
      alert('Error submitting decision: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="main-container">
      <div className="workspace-header">
        <div>
          <h1 className="workspace-title">Manager Approval Queue</h1>
          <p className="workspace-subtitle">Smart Priority Sorted Review Center</p>
        </div>
        <span className="priority-badge priority-high">DEPARTMENT MANAGER</span>
      </div>

      <div className="glass-card">
        {loading ? (
          <p>Loading pending queue...</p>
        ) : pendingRequests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>🎉 No pending approvals requiring action!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem' }}>PR Number</th>
                <th style={{ padding: '0.75rem' }}>Title & Category</th>
                <th style={{ padding: '0.75rem' }}>Employee</th>
                <th style={{ padding: '0.75rem' }}>Estimated Cost</th>
                <th style={{ padding: '0.75rem' }}>Priority Score</th>
                <th style={{ padding: '0.75rem' }}>SLA Status</th>
                <th style={{ padding: '0.75rem' }}>Decision Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>{r.requestNumber}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ fontWeight: '600' }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.category}</div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{r.employeeName}</td>
                  <td style={{ padding: '0.75rem', fontWeight: '700' }}>${r.estimatedCost?.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <PriorityBadge level={r.priorityLevel} score={r.priorityScore} cost={r.estimatedCost} urgency={r.urgency} />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <SlaBadge status={r.slaStatus} expectedTime={r.expectedApprovalTime} />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: 'var(--accent-emerald)' }}
                        onClick={() => setDecisionModal({ req: r, action: 'APPROVE' })}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: 'var(--accent-rose)' }}
                        onClick={() => setDecisionModal({ req: r, action: 'REJECT' })}
                      >
                        Reject
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => setSelectedReq(r)}
                      >
                        Audit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Decision Modal */}
      {decisionModal && (
        <div className="modal-overlay" onClick={() => setDecisionModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>
              Confirm Decision: <span style={{ color: decisionModal.action === 'APPROVE' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{decisionModal.action}</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Request: {decisionModal.req.requestNumber} - {decisionModal.req.title} (${decisionModal.req.estimatedCost?.toLocaleString()})
            </p>

            <form onSubmit={handleDecision}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Manager Comments & Review Reason {decisionModal.action === 'REJECT' && <span style={{ color: 'var(--accent-rose)' }}>* (Mandatory for rejection)</span>}
                </label>
                <textarea
                  rows="3"
                  required={decisionModal.action === 'REJECT'}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Enter approval authorization notes or rejection rationale..."
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: '#fff', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setDecisionModal(null)}>Cancel</button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ background: decisionModal.action === 'APPROVE' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}
                >
                  Submit {decisionModal.action}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {selectedReq && (
        <div className="modal-overlay" onClick={() => setSelectedReq(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: '800' }}>Timeline Audit ({selectedReq.requestNumber})</h3>
              <button onClick={() => setSelectedReq(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✖</button>
            </div>
            <VisualTimeline requestId={selectedReq.id} />
          </div>
        </div>
      )}
    </div>
  );
}
