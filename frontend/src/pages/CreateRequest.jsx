import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPurchaseRequest, checkDuplicateRequest, getBudgetImpact } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BudgetImpactWidget from '../components/BudgetImpactWidget';
import {
  FilePlus,
  AlertTriangle,
  Calculator,
  Briefcase,
  ArrowLeft,
  Send
} from 'lucide-react';

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
            departmentId: user.departmentId,
          });
          if (res.data?.possibleDuplicateFound) {
            setDuplicateWarning(res.data.warningMessage);
          } else {
            setDuplicateWarning(null);
          }
        } catch (err) {
          console.error('Duplicate check error:', err);
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
        .then((res) => setBudgetImpact(res.data))
        .catch((err) => console.error('Budget impact error:', err));
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
        title: title.trim(),
        category,
        estimatedCost: estimatedTotal,
        description: fullDescription.trim(),
        urgency,
      });

      addToast('Purchase order request submitted successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Failed to create purchase request: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              marginBottom: '0.75rem',
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="page-title">Create Purchase Request</h1>
          <p className="page-subtitle">Submit a new capital or operational purchase order for manager authorization.</p>
        </div>
      </div>

      {/* Duplicate Alert Banner */}
      {duplicateWarning && (
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.85rem',
            alignItems: 'flex-start',
            color: '#fcd34d',
          }}
        >
          <AlertTriangle size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Duplicate Detection Alert (Non-blocking)</div>
            <div style={{ fontSize: '0.825rem', marginTop: '0.2rem', color: '#fef3c7' }}>{duplicateWarning}</div>
          </div>
        </div>
      )}

      {/* Live Budget Impact Preview Widget */}
      <BudgetImpactWidget impact={budgetImpact} />

      {/* Multi-Section Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Overview */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.65rem',
              color: 'var(--accent-blue)',
            }}
          >
            <FilePlus size={18} />
            <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>
              1. Request Information
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label">Item / Service Title *</label>
            <input
              type="text"
              className="form-input"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. High-performance Development Workstation - Apple M3 Max"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Procurement Category *</label>
              <select
                className="form-select"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="LOW">LOW — Routine Need (SLA 48 Hours)</option>
                <option value="MEDIUM">MEDIUM — Standard Need (SLA 48 Hours)</option>
                <option value="HIGH">HIGH — High Operational Priority (SLA 24 Hours)</option>
                <option value="CRITICAL">CRITICAL — Executive Blocker (SLA 12 Hours)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Itemization & Financial Calculation */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.65rem',
              color: 'var(--accent-indigo)',
            }}
          >
            <Calculator size={18} />
            <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>
              2. Financial Calculation & Itemization
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                min="1"
                className="form-input"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Unit Price ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div
              className="card"
              style={{
                padding: '0.85rem 1.15rem',
                background: 'rgba(56, 189, 248, 0.05)',
                borderColor: 'rgba(56, 189, 248, 0.25)',
                marginBottom: 0,
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Calculated Total
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-blue)', lineHeight: 1.2 }}>
                ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Justification */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.65rem',
              color: 'var(--accent-emerald)',
            }}
          >
            <Briefcase size={18} />
            <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>
              3. Business Justification
            </h3>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Business Purpose & Project Necessity *</label>
            <textarea
              rows="4"
              className="form-textarea"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State vendor quotation details, project requirements, or reason why this expenditure is required..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ gap: '0.45rem' }}
          >
            <Send size={15} />
            <span>{submitting ? 'Submitting Order...' : 'Submit Purchase Request'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
