import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { UserPlus, Building, Mail, Lock, UserCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

const DEFAULT_DEPARTMENTS = [
  { id: 1, name: 'Engineering', code: 'ENG' },
  { id: 2, name: 'Finance & Accounting', code: 'FIN' },
  { id: 3, name: 'Operations & Logistics', code: 'OPS' },
  { id: 4, name: 'Human Resources', code: 'HR' },
  { id: 5, name: 'Sales & Marketing', code: 'MKT' },
];

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('EMPLOYEE');
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);
  const [departmentId, setDepartmentId] = useState(1);
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await api.get('/departments');
        if (response.data && response.data.length > 0) {
          setDepartments(response.data);
          setDepartmentId(response.data[0].id);
        }
      } catch (err) {
        console.log('Using default client-side department list fallback.');
      }
    }
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const selectedDeptId = departmentId ? parseInt(departmentId, 10) : 1;

    const result = await register({
      fullName,
      email,
      password,
      role,
      departmentId: selectedDeptId,
    });

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
      <div style={{ maxWidth: '480px', margin: '3rem auto', padding: '2.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)', marginBottom: '0.75rem' }}>
            <UserPlus size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join SmartProcure Workflow Management System
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(248, 113, 113, 0.15)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              <UserCheck size={16} style={{ color: 'var(--accent-blue)' }} /> Full Name *
            </label>
            <input
              type="text"
              className="form-input"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alice Smith"
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              <Mail size={16} style={{ color: 'var(--accent-blue)' }} /> Work Email *
            </label>
            <input
              type="email"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@smartprocure.com"
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              <Lock size={16} style={{ color: 'var(--accent-blue)' }} /> Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                required
                minLength={6}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Role *</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              >
                <option value="EMPLOYEE" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>EMPLOYEE</option>
                <option value="MANAGER" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>MANAGER</option>
                <option value="ADMIN" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>ADMIN</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                <Building size={16} style={{ color: 'var(--accent-blue)' }} /> Department *
              </label>
              <select
                className="form-select"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id} style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem', backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', marginTop: '0.75rem', cursor: 'pointer' }}
          >
            {loading ? 'Creating Account...' : <>Register Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
