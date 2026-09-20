import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '65px',
        right: '2rem',
        zIndex: 400,
        width: '380px',
        maxHeight: '500px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h4 style={{ fontWeight: '700' }}>Notifications</h4>
        <button
          onClick={handleReadAll}
          style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          Mark all as read
        </button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem' }}>
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleRead(n.id)}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                background: n.isRead ? 'transparent' : 'rgba(56, 189, 248, 0.05)',
                borderLeft: n.isRead ? '3px solid transparent' : '3px solid var(--accent-cyan)',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{n.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{n.message}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        ) : (
          <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No notifications at this time.
          </p>
        )}
      </div>
    </div>
  );
}
