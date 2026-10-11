import { NavLink } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  PlusCircle,
  CheckSquare,
  Shield,
  X,
} from 'lucide-react';

export default function Sidebar({ user, isMobileOpen, onCloseMobile }) {
  const role = user?.role || 'ROLE_EMPLOYEE';
  const cleanRole = role.replace('ROLE_', '');

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.35)',
            }}
          >
            <Zap size={18} />
          </div>
          <div>
            <div
              style={{
                fontWeight: '800',
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              SmartProcure
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', fontWeight: '700', letterSpacing: '0.04em' }}>
              ENTERPRISE SAAS
            </div>
          </div>
        </div>

        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div style={{ padding: '1rem 0', flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            padding: '0 1.5rem 0.5rem',
            fontSize: '0.68rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}
        >
          CORE WORKSPACE
        </div>

        {/* Universal Dashboard Link */}
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </NavLink>

        {/* Employee Only Actions */}
        {(cleanRole === 'EMPLOYEE' || cleanRole === 'ADMIN') && (
          <>
            <div
              style={{
                padding: '1.25rem 1.5rem 0.5rem',
                fontSize: '0.68rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
              }}
            >
              PROCUREMENT ACTIONS
            </div>
            <NavLink to="/requests/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <PlusCircle size={17} />
              <span>New Request</span>
            </NavLink>
          </>
        )}

        {/* Manager Only Actions */}
        {(cleanRole === 'MANAGER' || cleanRole === 'ADMIN') && (
          <>
            <div
              style={{
                padding: '1.25rem 1.5rem 0.5rem',
                fontSize: '0.68rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
              }}
            >
              APPROVAL MANAGEMENT
            </div>
            <NavLink to="/manager/pending" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <CheckSquare size={17} />
              <span>Approval Queue</span>
            </NavLink>
          </>
        )}

        {/* Admin Governance */}
        {cleanRole === 'ADMIN' && (
          <>
            <div
              style={{
                padding: '1.25rem 1.5rem 0.5rem',
                fontSize: '0.68rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
              }}
            >
              SYSTEM GOVERNANCE
            </div>
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Shield size={17} />
              <span>Command Center</span>
            </NavLink>
          </>
        )}
      </div>

      {/* Role Footer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              color: 'var(--accent-blue)',
              fontSize: '0.85rem',
            }}
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: '700',
                fontSize: '0.825rem',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.fullName || 'User'}
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.departmentName || user?.email || 'Corporate'}
            </div>
          </div>
          <span
            className="badge badge-normal"
            style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}
          >
            {cleanRole}
          </span>
        </div>
      </div>
    </aside>
  );
}
