import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestById, submitApprovalDecision } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PriorityBadge from '../components/PriorityBadge';
import SlaBadge from '../components/SlaBadge';
import VisualTimeline from '../components/VisualTimeline';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchRequest = async () => {
    try {
      const res = await getRequestById(id);
      setRequest(res.data);
    } catch (err) {
      addToast('Failed to load purchase request details: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const handleDecision = async (action) => {
    if (action === 'REJECT' && !comments.trim()) {
      addToast('A detailed rejection reason comment is mandatory when rejecting a purchase request.', 'warning');
      return;
    }

    setProcessing(true);
    try {
      await submitApprovalDecision(id, { action, comments });
      addToast(`Purchase request ${action === 'APPROVE' ? 'Approved 🎉' : 'Rejected ⚠️'}`, action === 'APPROVE' ? 'success' : 'error');
      setComments('');
      fetchRequest();
    } catch (err) {
      addToast('Error processing decision: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <SkeletonCard />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Request Not Found</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isManager = user?.role === 'ROLE_MANAGER' || user?.role === 'ROLE_ADMIN';
  const isPending = request.status === 'SUBMITTED' || request.status === 'IN_REVIEW';

  return (
    <div className="page-container">
      {/* Header Bar */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            ← Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="page-title">{request.requestNumber}</h1>
            <span className={`badge badge-${request.status?.toLowerCase()}`}>
              {request.status}
            </span>
          </div>
          <p className="page-subtitle">{request.title}</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', uppercase: 'true', fontWeight: '700' }}>Estimated Total</div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--accent-blue)' }}>
            ${request.estimatedCost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Metadata Card */}
          <div className="card">
            <h3 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Request Metadata
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.9rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', uppercase: 'true', fontWeight: '700' }}>Category</div>
                <div style={{ fontWeight: '600', marginTop: '0.2rem' }}>{request.category}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', uppercase: 'true', fontWeight: '700' }}>Submitted By</div>
                <div style={{ fontWeight: '600', marginTop: '0.2rem' }}>{request.employeeName}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', uppercase: 'true', fontWeight: '700' }}>Department</div>
                <div style={{ fontWeight: '600', marginTop: '0.2rem' }}>{request.departmentName}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', uppercase: 'true', fontWeight: '700' }}>Submission Date</div>
                <div style={{ fontWeight: '600', marginTop: '0.2rem' }}>{new Date(request.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Description & Justification */}
          <div className="card">
            <h3 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Business Justification & Description
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {request.description || 'No additional description provided.'}
            </p>
          </div>

          {/* Manager Decision Panel */}
          {isManager && isPending && (
            <div className="card" style={{ borderColor: 'var(--accent-indigo)' }}>
              <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-indigo)' }}>
                Manager Authorization Decision
              </h3>

              <div className="form-group">
                <label className="form-label">
                  Reviewer Rationale / Comments (Mandatory for rejection)
                </label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Enter approval notes or rejection rationale..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={processing}
                  onClick={() => handleDecision('REJECT')}
                >
                  Reject Request
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={processing}
                  onClick={() => handleDecision('APPROVE')}
                >
                  Approve Purchase Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Priority & SLA Card */}
          <div className="card">
            <h3 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Smart Governance Indicators
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '700' }}>PRIORITY LEVEL</div>
                <PriorityBadge level={request.priorityLevel} score={request.priorityScore} cost={request.estimatedCost} urgency={request.urgency} />
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '700' }}>SLA TURNAROUND</div>
                <SlaBadge status={request.slaStatus} expectedTime={request.expectedApprovalTime} />
              </div>
            </div>
          </div>

          {/* Step-by-step Audit Timeline */}
          <div className="card">
            <h3 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Audit Event Timeline
            </h3>
            <VisualTimeline requestId={request.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
