import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { CheckCircle2, XCircle, Clock, DollarSign } from 'lucide-react';

export default function ManagerDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewAction, setReviewAction] = useState('APPROVE');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get('/approvals/pending');
      setPendingRequests(response.data);
    } catch (err) {
      setError('Failed to load pending department requests');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = (request) => {
    setSelectedRequest(request);
    setReviewAction('APPROVE');
    setComments('');
    setModalError('');
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setModalError('');
  };

  const handleSubmitDecision = async (e) => {
    e.preventDefault();
    setModalError('');

    if (reviewAction === 'REJECT' && (!comments || comments.trim() === '')) {
      setModalError('A detailed comment explaining the rejection reason is mandatory.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/approvals/${selectedRequest.id}/review`, {
        action: reviewAction,
        comments,
      });
      handleCloseModal();
      fetchPendingRequests();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit approval decision';
      setModalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const totalPendingValue = pendingRequests.reduce((sum, r) => sum + (r.estimatedCost || 0), 0);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem' }}>Manager Approval Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Review, approve, or reject purchase order requests for your department
          </p>
        </div>

        {/* Manager Summary Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Pending Action</span>
              <Clock size={20} style={{ color: 'var(--accent-warning)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-warning)' }}>{pendingRequests.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Requests awaiting your review</div>
          </div>

          <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Pending Exposure Value</span>
              <DollarSign size={20} style={{ color: 'var(--accent-blue)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-blue)' }}>
              ${totalPendingValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Combined pending purchase total</div>
          </div>
        </div>

        {/* Pending Requests Table */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: '700' }}>
            Pending Department Approvals
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading pending requests...</div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-red)' }}>{error}</div>
          ) : pendingRequests.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={36} style={{ color: 'var(--accent-green)', marginBottom: '0.75rem' }} />
              <div>All department requests reviewed! No pending approvals.</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Request #</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Requested By</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Title</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Est. Cost</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', fontWeight: '600', color: 'var(--accent-blue)' }}>
                      {req.requestNumber}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{req.employeeName}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{req.title}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{req.category}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '700' }}>
                      ${parseFloat(req.estimatedCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <button
                        onClick={() => handleOpenReviewModal(req)}
                        style={{ padding: '0.4rem 0.9rem', backgroundColor: 'var(--accent-indigo)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Review Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ maxWidth: '550px', width: '100%', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '2rem' }}>
            <h3 style={{ marginBottom: '0.25rem', color: 'var(--accent-blue)' }}>Review Purchase Request</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: '1.25rem' }}>
              {selectedRequest.requestNumber} • Submitted by {selectedRequest.employeeName}
            </div>

            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{selectedRequest.title}</div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span>Category: <strong>{selectedRequest.category}</strong></span>
                <span>Amount: <strong style={{ color: 'var(--accent-green)' }}>${parseFloat(selectedRequest.estimatedCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {selectedRequest.description || 'No additional description provided.'}
              </div>
            </div>

            {modalError && (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmitDecision} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Decision</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setReviewAction('APPROVE')}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--accent-green)', backgroundColor: reviewAction === 'APPROVE' ? 'rgba(52, 211, 153, 0.2)' : 'var(--bg-primary)', color: 'var(--accent-green)', fontWeight: '700', cursor: 'pointer' }}
                  >
                    <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '0.4rem' }} /> APPROVE
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction('REJECT')}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--accent-red)', backgroundColor: reviewAction === 'REJECT' ? 'rgba(248, 113, 113, 0.2)' : 'var(--bg-primary)', color: 'var(--accent-red)', fontWeight: '700', cursor: 'pointer' }}
                  >
                    <XCircle size={16} style={{ display: 'inline', marginRight: '0.4rem' }} /> REJECT
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                  Manager Justification / Comments {reviewAction === 'REJECT' && <span style={{ color: 'var(--accent-red)' }}>* Required for Rejection</span>}
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={reviewAction === 'REJECT' ? 'State exact reason for rejecting this request...' : 'Optional approval notes...'}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'white', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: reviewAction === 'APPROVE' ? 'var(--accent-green)' : 'var(--accent-red)', color: 'black', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {submitting ? 'Submitting...' : `Confirm ${reviewAction}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
