import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '../services/api';
import Navbar from '../components/Navbar';
import { Mail, ArrowRight, Key, CheckCircle, AlertCircle } from 'lucide-react';

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
      const res = await forgotPasswordApi(email);
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
    <div>
      <Navbar />
      <div style={{ maxWidth: '440px', margin: '3.5rem auto', padding: '2.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-medium)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)', marginBottom: '0.75rem' }}>
            <Key size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>Forgot Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Enter your registered email address to generate a password reset authorization token.
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1rem', backgroundColor: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        {successMessage && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-emerald)', color: '#34d399', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              <CheckCircle size={18} />
              Password Reset Link Sent!
            </div>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              We have dispatched a password reset link to <strong>{email}</strong>. Please check your inbox (and spam folder) to reset your password.
            </p>
            {resetToken && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '0.35rem' }}>
                  YOUR RESET AUTHORIZATION TOKEN:
                </div>
                <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#0f172a', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--accent-blue)', fontWeight: '700', fontSize: '0.85rem', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
                  {resetToken}
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
                >
                  Click Here to Auto-Fill Reset Form <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              <Mail size={16} style={{ color: 'var(--accent-blue)' }} /> Registered Work Email *
            </label>
            <input
              type="email"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. employee@smartprocure.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '0.25rem' }}
          >
            {loading ? 'Generating Reset Token...' : <>Send Reset Instructions <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Remembered your password? <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
