import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.25rem' }}>
        <div
          className="card"
          style={{
            maxWidth: '480px',
            width: '100%',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            boxShadow: 'var(--shadow-overlay)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              color: 'var(--accent-rose)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <ShieldAlert size={34} />
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            403 — Access Denied
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
            You do not possess the required role permissions to access this workspace module. Access is restricted by enterprise role governance.
          </p>

          <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', gap: '0.45rem' }}>
            <ArrowLeft size={16} />
            <span>Return to Workspace Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
