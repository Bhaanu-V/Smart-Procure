import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { PlusCircle, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function EmployeeDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await api.get('/purchase-requests/my');
      setRequests(response.data);
    } catch (err) {
      setError('Failed to load purchase requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      SUBMITTED: { bg: 'rgba(251, 191, 36, 0.15)', color: 'var(--accent-warning)', label: 'SUBMITTED' },
      UNDER_REVIEW: { bg: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-blue)', label: 'UNDER REVIEW' },
      APPROVED: { bg: 'rgba(52, 211, 153, 0.15)', color: 'var(--accent-green)', label: 'APPROVED' },
      REJECTED: { bg: 'rgba(248, 113, 113, 0.15)', color: 'var(--accent-red)', label: 'REJECTED' },
    };
    const s = styles[status] || { bg: 'var(--bg-card)', color: 'var(--text-secondary)', label: status };
    return (
      <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', backgroundColor: s.bg, color: s.color, fontWeight: '700', fontSize: '0.75rem' }}>
        {s.label}
      </span>
    );
  };

  const pendingCount = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;
  const totalCost = requests.reduce((sum, r) => sum + (r.estimatedCost || 0), 0);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem' }}>Employee Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage and track your department purchase requests</p>
          </div>
          <Link
            to="/requests/new"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: 'var(--accent-indigo)', color: 'white', borderRadius: '8px', fontWeight: '600' }}
          >
            <PlusCircle size={18} /> New Request
          </Link>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Total Requests</span>
              <FileText size={20} style={{ color: 'var(--accent-blue)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{requests.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Valued at ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>

          <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Pending Review</span>
              <Clock size={20} style={{ color: 'var(--accent-warning)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-warning)' }}>{pendingCount}</div>
          </div>

          <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Approved</span>
              <CheckCircle size={20} style={{ color: 'var(--accent-green)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-green)' }}>{approvedCount}</div>
          </div>

          <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Rejected</span>
              <XCircle size={20} style={{ color: 'var(--accent-red)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-red)' }}>{rejectedCount}</div>
          </div>
        </div>

        {/* Requests Table */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: '700' }}>
            My Purchase Requests
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading purchase requests...</div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-red)' }}>{error}</div>
          ) : requests.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No purchase requests found. Click <strong>"New Request"</strong> to submit your first purchase order request.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Request Number</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Title</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Est. Cost</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Submitted Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', fontWeight: '600', color: 'var(--accent-blue)' }}>
                      {req.requestNumber}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{req.title}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{req.category}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '700' }}>
                      ${parseFloat(req.estimatedCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(req.status)}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
