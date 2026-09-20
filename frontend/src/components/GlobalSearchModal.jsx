import React, { useState, useEffect } from 'react';
import { globalSearch } from '../services/api';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose(prev => !prev);
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
        const res = await globalSearch(query);
        setResults(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Omnibox Global Search</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ESC to close</span>
        </div>
        <input
          type="text"
          placeholder="Search by PR#, title, category, or employee..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-dark)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none',
            marginBottom: '1rem'
          }}
        />

        {loading && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Searching...</p>}

        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {results.length > 0 ? (
            results.map(req => (
              <div
                key={req.id}
                style={{
                  padding: '0.75rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{req.requestNumber} - {req.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Category: {req.category} | Employee: {req.employeeName} | Dept: {req.departmentName}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700' }}>${req.estimatedCost?.toLocaleString()}</div>
                  <span className={`priority-badge priority-${req.priorityLevel?.toLowerCase()}`}>{req.priorityLevel}</span>
                </div>
              </div>
            ))
          ) : (
            query.trim() && !loading && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No matching requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
