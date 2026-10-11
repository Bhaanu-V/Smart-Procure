import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav
      style={{
        height: '64px',
        backgroundColor: 'var(--bg-header)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 80,
      }}
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          textDecoration: 'none',
        }}
      >
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
          <span
            style={{
              fontWeight: '800',
              fontSize: '1.2rem',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            SmartProcure
          </span>
          <span
            style={{
              marginLeft: '0.5rem',
              fontSize: '0.7rem',
              color: 'var(--accent-blue)',
              fontWeight: '700',
              letterSpacing: '0.04em',
            }}
          >
            ENTERPRISE
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link to="/login" className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
          Sign In
        </Link>
        <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
          Get Started
        </Link>
      </div>
    </nav>
  );
}
