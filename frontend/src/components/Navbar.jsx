import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
        <ShoppingCart style={{ color: 'var(--accent-blue)' }} />
        <span>SmartProcure</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <UserIcon size={18} style={{ color: 'var(--accent-blue)' }} />
              <div>
                <strong>{user.fullName}</strong>
                <span style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: user.role === 'MANAGER' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                  color: user.role === 'MANAGER' ? 'var(--accent-indigo)' : 'var(--accent-blue)',
                  fontWeight: '600'
                }}>
                  {user.role} ({user.departmentName})
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid var(--accent-red)',
                color: 'var(--accent-red)',
                borderRadius: '6px',
                fontWeight: '600',
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Login</Link>
            <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
