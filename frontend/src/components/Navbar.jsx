import React, { useState } from 'react';
import GlobalSearchModal from './GlobalSearchModal';
import NotificationDrawer from './NotificationDrawer';

export default function Navbar({ user, onLogout }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="brand-logo">
          ⚡ SmartProcure Enterprise
        </div>

        <div className="nav-actions">
          <button className="search-trigger" onClick={() => setIsSearchOpen(true)}>
            🔍 Search PRs, Items, Depts... <kbd className="keyboard-kbd">Ctrl K</kbd>
          </button>

          <button className="notif-bell" onClick={() => setIsNotifOpen(prev => !prev)} title="Notifications">
            🔔
            <span className="notif-badge">!</span>
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{user.fullName}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</div>
              </div>
              <button className="btn-secondary" onClick={onLogout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={setIsSearchOpen} />
      <NotificationDrawer isOpen={isNotifOpen} onClose={setIsNotifOpen} />
    </>
  );
}
