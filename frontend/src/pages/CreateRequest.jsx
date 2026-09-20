import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPurchaseRequest, checkDuplicateRequest, getBudgetImpact } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BudgetImpactWidget from '../components/BudgetImpactWidget';

export default function CreateRequest() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Calculated Total
  const estimatedTotal = (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0);

  // Pre-submission simulation states
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [budgetImpact, setBudgetImpact] = useState(null);

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

  // Budget Impact Simulation Trigger on Calculated Total change
  useEffect(() => {
    if (estimatedTotal > 0 && user?.departmentId) {
      getBudgetImpact(user.departmentId, estimatedTotal)
        .then(res => setBudgetImpact(res.data))
        .catch(err => console.error(err));
    } else {
      setBudgetImpact(null);
    }
  }, [estimatedTotal, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (estimatedTotal <= 0) {
      addToast('Calculated estimated total must be greater than zero.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const fullDescription = `[Qty: ${quantity} x $${unitPrice}] ${description}`;
      await createPurchaseRequest({
        title,
        category,
        estimatedCost: estimatedTotal,
        description: fullDescription,
        urgency
      });

      addToast('Purchase request created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Failed to create purchase request: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Purchase Request</h1>
          <p className="page-subtitle">Submit a new capital or operational purchase order for manager authorization.</p>
        </div>
      </div>

      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Duplicate Warning Banner */}
        {duplicateWarning && (
          <div style={{ padding: '1rem 1.25rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--accent-amber)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#fcd34d' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Duplicate Request Alert (Non-blocking)</div>
              <div style={{ fontSize: '0.85rem' }}>{duplicateWarning}</div>
            </div>
          </div>
        )}

        {/* Live Department Budget Impact Widget */}
        <BudgetImpactWidget impact={budgetImpact} />

        {/* Multi-Section Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: Request Overview */}
          <div className="card">
            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', color: 'var(--accent-blue)' }}>
              1. Request Information
            </h3>

            <div className="form-group">
              <label className="form-label">Item / Service Title *</label>
              <input
                type="text"
                className="form-input"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Developer Laptop Upgrade - MacBook Pro M3 Max"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  required
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Select Procurement Category</option>
                  <option value="IT Hardware">IT Hardware</option>
                  <option value="Software Licenses">Software Licenses</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Consulting Services">Consulting Services</option>
                  <option value="Logistics & Shipping">Logistics & Shipping</option>
                  <option value="Marketing Assets">Marketing Assets</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Request Urgency Level *</label>
                <select
                  className="form-select"
                  value={urgency}
                  onChange={e => setUrgency(e.target.value)}
                >
                  <option value="LOW">LOW — Routine (SLA 48 Hours)</option>
                  <option value="MEDIUM">MEDIUM — Standard Need (SLA 48 Hours)</option>
                  <option value="HIGH">HIGH — High Operational Priority (SLA 24 Hours)</option>
                  <option value="CRITICAL">CRITICAL — Executive Blocker (SLA 12 Hours)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Itemization & Calculated Financials */}
          <div className="card">
            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', color: 'var(--accent-indigo)' }}>
              2. Itemization & Financial Calculation
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  required
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Unit Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  required
                  value={unitPrice}
                  onChange={e => setUnitPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="card" style={{ padding: '0.75rem 1rem', background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)', marginBottom: 0 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Calculated Total</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-blue)' }}>
                  ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Justification */}
          <div className="card">
            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', color: 'var(--accent-emerald)' }}>
              3. Business Justification
            </h3>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Detailed Rationale & Business Purpose *</label>
              <textarea
                rows="4"
                className="form-textarea"
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Provide details on project requirements, vendor quotes, or operational necessity..."
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting Order...' : 'Submit Purchase Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
