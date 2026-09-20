import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '2.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--accent-rose)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '16px', backgroundColor: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', marginBottom: '1.25rem' }}>
          <ShieldAlert size={48} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          403 Access Denied
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          You do not have the required role permissions to access this workspace module. Access is restricted by enterprise role governance.
        </p>
        <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
          <ArrowLeft size={18} /> Return to Your Workspace Dashboard
        </Link>
      </div>
    </div>
  );
}
