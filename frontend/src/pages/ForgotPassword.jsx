import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '../services/api';
import Navbar from '../components/Navbar';
import { Mail, ArrowRight, Key, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setResetToken('');
    setLoading(true);

    try {
      const res = await forgotPasswordApi(email.trim());
      setSuccessMessage('Password reset instructions generated successfully!');
      if (res.data && res.data.token) {
        setResetToken(res.data.token);
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.25rem' }}>
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
              <Key size={22} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Forgot Password
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Enter your registered work email to generate an authorization reset token.
            </p>
          </div>

          {/* Error Notice */}
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

          {/* Success Box */}
          {successMessage && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#34d399', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={18} />
                <span>Reset Token Generated</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: '1.5' }}>
                Instructions sent for <strong>{email}</strong>. Use the authorization token below to reset your password.
              </p>

              {resetToken && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-medium)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Reset Authorization Token:
                  </div>
                  <div
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--accent-blue)',
                      fontWeight: '700',
                      fontSize: '0.825rem',
                      wordBreak: 'break-all',
                      marginBottom: '0.65rem',
                    }}
                  >
                    {resetToken}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', gap: '0.35rem' }}
                  >
                    <span>Auto-Fill Reset Form</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} style={{ color: 'var(--accent-blue)' }} /> Registered Work Email *
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

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.85rem', fontSize: '0.95rem', gap: '0.45rem', marginTop: '0.35rem' }}
            >
              <span>{loading ? 'Generating Token...' : 'Send Reset Instructions'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Remembered your password?{' '}
            <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: '700', textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
