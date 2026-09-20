import React, { useState, useEffect } from 'react';
import { getRequestTimeline } from '../services/api';

export default function VisualTimeline({ requestId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requestId) return;
    getRequestTimeline(requestId)
      .then(res => setEvents(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [requestId]);

  if (loading) return <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading timeline...</p>;
  if (!events.length) return <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No audit events recorded.</p>;

  return (
    <div className="timeline">
      {events.map((e, idx) => (
        <div key={e.id || idx} className="timeline-item">
          <div className="timeline-dot"></div>
          <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
            {e.action} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>by {e.actorName} ({e.actorRole})</span>
          </div>
          {e.comment && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.6rem', borderRadius: '4px', margin: '0.2rem 0' }}>"{e.comment}"</div>}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {new Date(e.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
