import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CreateRequest from './pages/CreateRequest';
import ManagerDashboard from './pages/ManagerDashboard';
import Navbar from './components/Navbar';

function Home() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent-blue)' }}>
          SmartProcure Workflow System
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Digitize purchase requests, automate multi-level manager approval workflows, enforce department budget limits, and track enterprise purchasing audit trails.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login" style={{ padding: '0.85rem 2rem', background: 'var(--accent-indigo)', color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '1.1rem' }}>
            Get Started (Sign In)
          </Link>
          <Link to="/register" style={{ padding: '0.85rem 2rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '1.1rem' }}>
            Register New Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<EmployeeDashboard />} />
          <Route path="/requests/new" element={<CreateRequest />} />
          <Route path="/manager/pending" element={<ManagerDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
