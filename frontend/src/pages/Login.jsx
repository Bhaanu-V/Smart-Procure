import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      if (result.data.role === 'MANAGER') {
        navigate('/manager/pending');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Sign in to your SmartProcure account
        </p>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Quick Demo Logins (Click to autofill)
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => { setEmail('admin@smartprocure.com'); setPassword('admin123'); }}
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-medium)', borderRadius: '4px', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: '700' }}
            >
              🔑 Admin
            </button>
            <button
              type="button"
              onClick={() => { setEmail('manager@smartprocure.com'); setPassword('manager123'); }}
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-medium)', borderRadius: '4px', color: 'var(--accent-indigo)', cursor: 'pointer', fontWeight: '700' }}
            >
              👔 Manager
            </button>
            <button
              type="button"
              onClick={() => { setEmail('employee@smartprocure.com'); setPassword('employee123'); }}
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-medium)', borderRadius: '4px', color: 'var(--accent-emerald)', cursor: 'pointer', fontWeight: '700' }}
            >
              👤 Employee
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Work Email</label>
            <input
              type="email"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@smartprocure.com"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.75rem', backgroundColor: 'var(--accent-indigo)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '1rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
