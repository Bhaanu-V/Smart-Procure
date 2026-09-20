import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ user, isMobileOpen, onCloseMobile }) {
  const role = user?.role || 'ROLE_EMPLOYEE';

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <span>⚡</span> SmartProcure
        </div>
        {isMobileOpen && (
          <button onClick={onCloseMobile} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        )}
      </div>

      {/* Navigation Group */}
      <div style={{ padding: '1rem 0', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '0 1.5rem 0.5rem', fontSize: '0.7rem', fontWeight: '800', uppercase: 'true', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          NAVIGATION
        </div>

        {/* Common Dashboard Link */}
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span>📊</span> Workspace Dashboard
        </NavLink>

        {/* Employee Only Links */}
        {(role === 'ROLE_EMPLOYEE' || role === 'EMPLOYEE') && (
          <>
            <NavLink to="/requests/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>➕</span> New Purchase Request
            </NavLink>
          </>
        )}

        {/* Manager Only Links */}
        {(role === 'ROLE_MANAGER' || role === 'MANAGER') && (
          <>
            <div style={{ padding: '1.25rem 1.5rem 0.5rem', fontSize: '0.7rem', fontWeight: '800', uppercase: 'true', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              APPROVAL MANAGEMENT
            </div>
            <NavLink to="/manager/pending" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>📥</span> Approval Queue
            </NavLink>
          </>
        )}

        {/* Admin Only Links */}
        {(role === 'ROLE_ADMIN' || role === 'ADMIN') && (
          <>
            <div style={{ padding: '1.25rem 1.5rem 0.5rem', fontSize: '0.7rem', fontWeight: '800', uppercase: 'true', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              SYSTEM GOVERNANCE
            </div>
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>🛡️</span> Admin Command Center
            </NavLink>
          </>
        )}
      </div>

      {/* Role Footer */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged in as</div>
        <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user?.fullName || 'User'}
        </div>
        <span className="badge badge-normal" style={{ marginTop: '0.35rem', fontSize: '0.65rem' }}>
          {role.replace('ROLE_', '')}
        </span>
      </div>
    </aside>
  );
}
