import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Mail, Lock, Eye, EyeOff, Zap, Shield, User, ArrowRight, AlertCircle } from 'lucide-react';

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
      const cleanRole = result.data.role?.replace('ROLE_', '');
      if (cleanRole === 'MANAGER') {
        navigate('/manager/pending');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
        <div
          className="card"
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '2.25rem',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-overlay)',
            border: '1px solid var(--border-medium)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '0.85rem',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)',
              }}
            >
              <Zap size={22} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Sign in to SmartProcure Enterprise Workspace
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          {/* Quick Demo Logins Pill Bar */}
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '0.85rem',
              backgroundColor: 'rgba(56, 189, 248, 0.05)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(56, 189, 248, 0.18)',
            }}
          >
            <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Demo Accounts (Click to Autofill)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => handleDemoFill('admin@smartprocure.com', 'admin123')}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.725rem', gap: '0.3rem' }}
                title="Login as System Admin"
              >
                <Shield size={12} style={{ color: 'var(--accent-rose)' }} />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('manager@smartprocure.com', 'manager123')}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.725rem', gap: '0.3rem' }}
                title="Login as Department Manager"
              >
                <Zap size={12} style={{ color: 'var(--accent-indigo)' }} />
                <span>Manager</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('employee@smartprocure.com', 'employee123')}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.725rem', gap: '0.3rem' }}
                title="Login as Staff Employee"
              >
                <User size={12} style={{ color: 'var(--accent-emerald)' }} />
                <span>Employee</span>
              </button>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} style={{ color: 'var(--accent-blue)' }} /> Work Email
              </label>
              <input
                type="email"
                className="form-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@smartprocure.com"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: 0 }}>
                  <Lock size={14} style={{ color: 'var(--accent-blue)' }} /> Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '0.775rem', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}
                >
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.8rem', fontSize: '0.95rem', gap: '0.45rem', marginTop: '0.35rem' }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Do not have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: '700', textDecoration: 'none' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
