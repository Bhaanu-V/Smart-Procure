import { useState } from 'react';
import GlobalSearchModal from '../GlobalSearchModal';
import NotificationDrawer from '../NotificationDrawer';
import { Menu, Search, Bell, LogOut } from 'lucide-react';

export default function TopHeader({ user, onLogout, onToggleMobileSidebar }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      <header className="top-header">
        {/* Left Side: Mobile Menu Toggle & Omnibox Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
            className="mobile-menu-btn"
          >
            <Menu size={20} />
          </button>

          {/* Omnibox Global Search Button */}
          <button
            className="search-trigger"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open global search (Ctrl+K)"
          >
            <Search size={15} style={{ color: 'var(--accent-blue)' }} />
            <span style={{ display: 'inline-block', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Search requests, items, dept...
            </span>
            <kbd className="keyboard-kbd">Ctrl K</kbd>
          </button>
        </div>

        {/* Right Side: Notification Trigger & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Notifications Button */}
          <button
            className="notif-bell"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            aria-label="Toggle notifications"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="notif-badge" />
          </button>

          {/* User Profile Summary */}
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                paddingLeft: '0.75rem',
                borderLeft: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: '#fff',
                  fontSize: '0.85rem',
                  boxShadow: '0 0 10px rgba(56, 189, 248, 0.25)',
                }}
              >
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }} className="user-text-pill">
                <span
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    lineHeight: 1.2,
                  }}
                >
                  {user.fullName}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {user.departmentName || user.email}
                </span>
              </div>

              <button
                className="btn btn-secondary"
                onClick={onLogout}
                style={{
                  padding: '0.4rem 0.65rem',
                  fontSize: '0.75rem',
                  marginLeft: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
                title="Log out of SmartProcure"
              >
                <LogOut size={13} />
                <span>Logout</span>
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
