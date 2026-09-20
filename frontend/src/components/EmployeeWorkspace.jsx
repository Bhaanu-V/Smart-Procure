import React, { useState, useEffect } from 'react';
import { getMyRequests, createPurchaseRequest, checkDuplicateRequest, getBudgetImpact } from '../services/api';
import PriorityBadge from './PriorityBadge';
import SlaBadge from './SlaBadge';
import BudgetImpactWidget from './BudgetImpactWidget';
import VisualTimeline from './VisualTimeline';

export default function EmployeeWorkspace({ user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // New Request Form State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('MEDIUM');

  // Pre-submission simulation states
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [budgetImpact, setBudgetImpact] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await getMyRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Duplicate Check Trigger on Title change
  useEffect(() => {
    if (title.length > 4 && user?.departmentId) {
      const timer = setTimeout(async () => {
        try {
          const res = await checkDuplicateRequest({
            title,
            category,
            departmentId: user.departmentId
          });
          if (res.data?.possibleDuplicateFound) {
            setDuplicateWarning(res.data.warningMessage);
          } else {
            setDuplicateWarning(null);
          }
        } catch (err) {
          console.error(err);
        }
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setDuplicateWarning(null);
    }
  }, [title, category, user]);

  // Budget Impact Simulation Trigger on Cost change
  useEffect(() => {
    if (estimatedCost > 0 && user?.departmentId) {
      getBudgetImpact(user.departmentId, estimatedCost)
        .then(res => setBudgetImpact(res.data))
        .catch(err => console.error(err));
    } else {
      setBudgetImpact(null);
    }
  }, [estimatedCost, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPurchaseRequest({
        title,
        category,
        estimatedCost: parseFloat(estimatedCost),
        description,
        urgency
      });
      setShowModal(false);
      setTitle('');
      setCategory('');
      setEstimatedCost('');
      setDescription('');
      fetchRequests();
    } catch (err) {
      alert('Failed to submit request: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'PENDING') return r.status === 'SUBMITTED' || r.status === 'IN_REVIEW';
    if (activeTab === 'APPROVED') return r.status === 'APPROVED';
    if (activeTab === 'REJECTED') return r.status === 'REJECTED';
    return true;
  });

  return (
    <div className="main-container">
      <div className="workspace-header">
        <div>
          <h1 className="workspace-title">Employee Procurement Workspace</h1>
          <p className="workspace-subtitle">Track, Create, and Manage Purchase Requests</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Create Purchase Request
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === tab ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab ? '700' : '500',
              borderBottom: activeTab === tab ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              paddingBottom: '0.5rem',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Request Table */}
      <div className="glass-card">
        {loading ? (
          <p>Loading requests...</p>
        ) : filteredRequests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No requests found in this view.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem' }}>PR Number</th>
                <th style={{ padding: '0.75rem' }}>Title & Category</th>
                <th style={{ padding: '0.75rem' }}>Cost</th>
                <th style={{ padding: '0.75rem' }}>Priority</th>
                <th style={{ padding: '0.75rem' }}>SLA Status</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>{r.requestNumber}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ fontWeight: '600' }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.category}</div>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: '700' }}>${r.estimatedCost?.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <PriorityBadge level={r.priorityLevel} score={r.priorityScore} cost={r.estimatedCost} urgency={r.urgency} />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <SlaBadge status={r.slaStatus} expectedTime={r.expectedApprovalTime} />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ fontWeight: '700', color: r.status === 'APPROVED' ? '#34d399' : r.status === 'REJECTED' ? '#f87171' : '#fbbf24' }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button className="btn-secondary" onClick={() => setSelectedRequest(r)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                      Timeline Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: '800', marginBottom: '1rem' }}>Create Purchase Request</h3>

            {duplicateWarning && (
              <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--accent-amber)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', color: '#fcd34d' }}>
                ⚠️ {duplicateWarning}
              </div>
            )}

            <BudgetImpactWidget impact={budgetImpact} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Item / Service Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. MacBook Pro M3 Max 32GB"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: '#fff' }}
                  >
                    <option value="">Select Category</option>
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Software Licenses">Software Licenses</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Estimated Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={estimatedCost}
                    onChange={e => setEstimatedCost(e.target.value)}
                    placeholder="0.00"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Request Urgency</label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: '#fff' }}
                >
                  <option value="LOW">LOW - Routine (SLA 48h)</option>
                  <option value="MEDIUM">MEDIUM - Normal (SLA 48h)</option>
                  <option value="HIGH">HIGH - Urgent Business Need (SLA 24h)</option>
                  <option value="CRITICAL">CRITICAL - Executive Blocker (SLA 12h)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Description & Justification</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Business justification for this purchase..."
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timeline Audit Drawer */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: '800' }}>Timeline Audit History ({selectedRequest.requestNumber})</h3>
              <button onClick={() => setSelectedRequest(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✖</button>
            </div>
            <VisualTimeline requestId={selectedRequest.id} />
          </div>
        </div>
      )}
    </div>
  );
}
