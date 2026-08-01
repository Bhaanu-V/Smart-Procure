import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft, Send } from 'lucide-react';

export default function CreateRequest() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/purchase-requests', {
        title,
        category,
        estimatedCost: parseFloat(estimatedCost),
        description,
      });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit purchase request.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: '600' }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <h2 style={{ marginBottom: '0.5rem' }}>Create Purchase Request</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Submit a new request for manager approval.
        </p>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Item / Service Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dell UltraSharp 27-inch Monitor"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'white' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'white' }}
              >
                <option value="Hardware">Hardware</option>
                <option value="Software License">Software License</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Consulting">Consulting & Services</option>
                <option value="Facilities">Facilities & Equipment</option>
                <option value="Training">Training & Education</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Estimated Cost ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="450.00"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'white' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Business Justification / Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide reason for purchase and intended business impact..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'white', fontFamily: 'inherit' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', backgroundColor: 'var(--accent-indigo)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            <Send size={18} /> {loading ? 'Submitting...' : 'Submit Purchase Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
