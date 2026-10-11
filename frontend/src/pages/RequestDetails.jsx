import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestById, submitApprovalDecision, getApprovalHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PriorityBadge from '../components/PriorityBadge';
import SlaBadge from '../components/SlaBadge';
import VisualTimeline from '../components/VisualTimeline';
import { SkeletonCard } from '../components/ui/Skeleton';
import {
  ArrowLeft,
  XCircle,
  Building,
  User,
  Calendar,
  Tag,
  ShieldAlert,
} from 'lucide-react';

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchRequest = useCallback(async () => {
    try {
      const res = await getRequestById(id);
      setRequest(res.data);

      // If request is rejected, attempt to fetch rejection history comment
      if (res.data?.status === 'REJECTED') {
        try {
          const histRes = await getApprovalHistory(id);
          const rejectAction = histRes.data?.find((a) => a.action === 'REJECT');
          if (rejectAction?.comments) {
            setRejectionReason(rejectAction.comments);
          }
        } catch {
          // Fallback handled gracefully in timeline
        }
      }
    } catch (err) {
      addToast('Failed to load purchase request details: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleDecision = async (action) => {
    if (action === 'REJECT' && !comments.trim()) {
      addToast('A detailed rejection reason comment is mandatory when rejecting a purchase request.', 'warning');
      return;
    }

    setProcessing(true);
    try {
      await submitApprovalDecision(id, { action, comments: comments.trim() });
      addToast(
        `Purchase request ${action === 'APPROVE' ? 'Approved successfully' : 'Rejected'}`,
        action === 'APPROVE' ? 'success' : 'error'
      );
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
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Purchase Request Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>The requested order ID does not exist or has been removed.</p>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{ marginTop: '1.25rem' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const cleanRole = user?.role?.replace('ROLE_', '');
  const isManagerOrAdmin = cleanRole === 'MANAGER' || cleanRole === 'ADMIN';
  const isPending =
    request.status === 'SUBMITTED' ||
    request.status === 'IN_REVIEW' ||
    request.status === 'UNDER_REVIEW';

  return (
    <div className="page-container">
      {/* Header Bar */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.35rem', marginBottom: '0.75rem' }}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className="page-title" style={{ color: 'var(--accent-blue)' }}>
              {request.requestNumber}
            </h1>
            <span className={`badge badge-${request.status?.toLowerCase()}`}>
              {request.status}
            </span>
          </div>
          <p className="page-subtitle">{request.title}</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
            Estimated Total
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            ${request.estimatedCost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Prominent Rejection Reason Banner for Employees & Managers */}
      {request.status === 'REJECTED' && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.75rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}
        >
          <XCircle size={24} style={{ color: 'var(--accent-rose)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: '800', fontSize: '1rem', color: '#fda4af' }}>
              Order Rejected by Department Reviewer
            </div>
            <div style={{ fontSize: '0.875rem', color: '#fecdd3', marginTop: '0.35rem', lineHeight: '1.5' }}>
              {rejectionReason ? (
                <>
                  <strong>Rejection Rationale:</strong> "{rejectionReason}"
                </>
              ) : (
                'This purchase order was declined. Check the audit timeline below for reviewer remarks.'
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Details & Manager Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Metadata Card */}
          <div className="card">
            <h3 style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Request Metadata
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', fontSize: '0.875rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                  <Tag size={13} style={{ color: 'var(--accent-blue)' }} /> Category
                </div>
                <div style={{ fontWeight: '600', marginTop: '0.25rem', color: 'var(--text-primary)' }}>{request.category}</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                  <User size={13} style={{ color: 'var(--accent-blue)' }} /> Submitted By
                </div>
                <div style={{ fontWeight: '600', marginTop: '0.25rem', color: 'var(--text-primary)' }}>{request.employeeName}</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                  <Building size={13} style={{ color: 'var(--accent-blue)' }} /> Department
                </div>
                <div style={{ fontWeight: '600', marginTop: '0.25rem', color: 'var(--text-primary)' }}>{request.departmentName}</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                  <Calendar size={13} style={{ color: 'var(--accent-blue)' }} /> Submission Date
                </div>
                <div style={{ fontWeight: '600', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                  {new Date(request.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Justification */}
          <div className="card">
            <h3 style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Business Justification & Specifications
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {request.description || 'No additional justification notes provided.'}
            </p>
          </div>

          {/* Manager Action Panel */}
          {isManagerOrAdmin && isPending && (
            <div
              className="card"
              style={{
                borderColor: 'var(--border-active)',
                background: 'linear-gradient(180deg, rgba(17, 27, 47, 0.9) 0%, rgba(14, 21, 37, 0.95) 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <ShieldAlert size={18} style={{ color: 'var(--accent-blue)' }} />
                <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Manager Authorization Decision
                </h3>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Reviewer Notes / Rejection Rationale <span style={{ color: 'var(--accent-rose)' }}>* (Mandatory if rejecting)</span>
                </label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter approval authorization notes or mandatory rejection reason..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={processing}
                  onClick={() => handleDecision('REJECT')}
                >
                  Reject Order
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={processing}
                  onClick={() => handleDecision('APPROVE')}
                >
                  Approve Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Governance Badges & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Smart Governance Indicators */}
          <div className="card">
            <h3 style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Governance Indicators
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '700' }}>
                  SMART PRIORITY ENGINE
                </div>
                <PriorityBadge level={request.priorityLevel} score={request.priorityScore} cost={request.estimatedCost} urgency={request.urgency} />
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '700' }}>
                  SLA TURNAROUND STATUS
                </div>
                <SlaBadge status={request.slaStatus} expectedTime={request.expectedApprovalTime} />
              </div>
            </div>
          </div>

          {/* Audit Event Timeline */}
          <div className="card">
            <h3 style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Audit Event Timeline
            </h3>
            <VisualTimeline requestId={request.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
