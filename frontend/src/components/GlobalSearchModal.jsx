import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { globalSearch } from '../services/api';
import PriorityBadge from './PriorityBadge';
import { Search, X, ArrowUpRight, Inbox } from 'lucide-react';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await globalSearch(query.trim());
        setResults(res.data || []);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectResult = (requestId) => {
    navigate(`/requests/${requestId}`);
    onClose(false);
    setQuery('');
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '1.5rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Search size={18} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Omnibox Global Search
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <kbd className="keyboard-kbd">ESC</kbd>
            <button
              onClick={() => onClose(false)}
              aria-label="Close search modal"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.9rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search by PR#, title, category, department, or employee..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="form-input"
            style={{
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              fontSize: '0.95rem',
              borderRadius: 'var(--radius-md)',
            }}
          />
        </div>

        {loading && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
            Searching database records...
          </p>
        )}

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {results.length > 0 ? (
            results.map((req) => (
              <div
                key={req.id}
                onClick={() => handleSelectResult(req.id)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast), border-color var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '700', color: 'var(--accent-blue)', fontSize: '0.875rem' }}>
                      {req.requestNumber}
                    </span>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {req.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {req.category} • {req.employeeName} • {req.departmentName}
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      ${req.estimatedCost?.toLocaleString()}
                    </div>
                    <PriorityBadge level={req.priorityLevel} score={req.priorityScore} />
                  </div>
                  <ArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            ))
          ) : (
            query.trim() &&
            !loading && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <Inbox size={28} style={{ margin: '0 auto 0.5rem', color: 'var(--text-muted)' }} />
                <p style={{ fontSize: '0.875rem' }}>No matching purchase requests found.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
