import React, { useState } from 'react';
import GlobalSearchModal from '../GlobalSearchModal';
import NotificationDrawer from '../NotificationDrawer';

export default function TopHeader({ user, onLogout, onToggleMobileSidebar }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      <header className="top-header">
        {/* Left Mobile Menu Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onToggleMobileSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.25rem',
              cursor: 'pointer',
              display: 'none'
            }}
            className="mobile-menu-btn"
          >
            ☰
          </button>

          {/* Omnibox Global Search Trigger */}
          <button className="search-trigger" onClick={() => setIsSearchOpen(true)}>
            🔍 <span>Search requests, items, departments...</span>
            <kbd className="keyboard-kbd">Ctrl K</kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Notifications Trigger */}
          <button className="notif-bell" onClick={() => setIsNotifOpen(prev => !prev)} title="Notifications">
            🔔
            <span className="notif-badge">!</span>
          </button>

          {/* User Profile Menu */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', paddingLeft: '0.75rem', borderLeft: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '0.9rem' }}>
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user.fullName}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.departmentName || user.email}</span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={onLogout}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', marginLeft: '0.5rem' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={setIsSearchOpen} />
      <NotificationDrawer isOpen={isNotifOpen} onClose={setIsNotifOpen} />
    </>
  );
}
