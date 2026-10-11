import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import { Bell, CheckCheck, X, ExternalLink, Inbox } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleRead = async (n) => {
    try {
      if (!n.isRead) {
        await markNotificationRead(n.id);
        fetchNotifications();
      }
      if (n.linkUrl) {
        navigate(n.linkUrl);
        onClose(false);
      }
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '68px',
        right: '1.75rem',
        zIndex: 400,
        width: 'min(380px, calc(100vw - 2rem))',
        maxHeight: '520px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-overlay)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'modalScale 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(12, 19, 34, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Bell size={16} style={{ color: 'var(--accent-blue)' }} />
          <h4 style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Notifications
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleReadAll}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-blue)',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
            title="Mark all notifications as read"
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </button>
          <button
            onClick={() => onClose(false)}
            aria-label="Close notifications"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '0.65rem' }}>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleRead(n)}
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '0.45rem',
                backgroundColor: n.isRead ? 'transparent' : 'rgba(56, 189, 248, 0.05)',
                border: '1px solid',
                borderColor: n.isRead ? 'transparent' : 'rgba(56, 189, 248, 0.2)',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = n.isRead ? 'transparent' : 'rgba(56, 189, 248, 0.05)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  {n.title}
                </span>
                {n.linkUrl && <ExternalLink size={12} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {n.message}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                {new Date(n.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Inbox size={28} style={{ margin: '0 auto 0.5rem', color: 'var(--text-muted)' }} />
            <p style={{ fontSize: '0.85rem' }}>No notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
