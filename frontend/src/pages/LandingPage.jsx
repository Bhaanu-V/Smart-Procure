import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header style={{ padding: '1.25rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(9, 13, 22, 0.85)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <span>⚡</span> SmartProcure
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '6rem 2rem 4rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: 'var(--accent-blue)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '2rem' }}>
          <span>✨</span> ENTERPRISE PROCUREMENT GOVERNANCE PLATFORM
        </div>
        <h1 style={{ fontSize: '3.75rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.03em', marginBottom: '1.5rem', background: 'linear-gradient(180deg, #f8fafc 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Procurement decisions, approvals and visibility — in one place.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
          Eliminate purchasing bottlenecks, enforce real-time department budgets, and rank requests with an explainable rule-based priority engine.
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2.25rem', fontSize: '1rem' }}>
            Launch Enterprise Workspace →
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 2.25rem', fontSize: '1rem' }}>
            Sign In to Demo Account
          </Link>
        </div>
      </section>

      {/* Workflow Visualization Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
            Seamless Workflow Architecture
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            How purchase requests travel securely from submission to manager authorization.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', position: 'relative' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>1️⃣</div>
            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Submit Request</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Employees input item quantities and prices with live total calculation and pre-submission duplicate detection.
            </p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>2️⃣</div>
            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Smart Priority Scoring</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              The transparent priority engine evaluates amount, urgency, and age to classify orders into URGENT, HIGH, or NORMAL.
            </p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>3️⃣</div>
            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Budget & SLA Guard</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Department budgets are reserved pending approval while SLA countdown timers monitor manager response deadlines.
            </p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>4️⃣</div>
            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Audit Log Approval</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Department managers authorize orders with comments, committing funds and appending to the visual audit history.
            </p>
          </div>
        </div>
      </section>

      {/* Key Capabilities Grid */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-sidebar)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
              Enterprise Governance Capabilities
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Built specifically for compliance, transparency, and operational velocity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <div style={{ fontSize: '1.5rem', color: 'var(--accent-blue)', marginBottom: '0.75rem' }}>📊 Command Center Metrics</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Single-pane dashboard detailing total spend value, overdue SLA bottlenecks, and department utilization bars.
              </p>
            </div>
            <div className="card">
              <div style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)', marginBottom: '0.75rem' }}>🛡️ Department Budget Controls</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Calculates real-time allocated, used, and pending request budgets to block or flag unbudgeted capital expenditures.
              </p>
            </div>
            <div className="card">
              <div style={{ fontSize: '1.5rem', color: 'var(--accent-indigo)', marginBottom: '0.75rem' }}>⏱️ Real-time SLA Countdown</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Hourly background tasks track expected completion times, flagging requests as On Track, Due Soon, or Overdue.
              </p>
            </div>
            <div className="card">
              <div style={{ fontSize: '1.5rem', color: 'var(--accent-amber)', marginBottom: '0.75rem' }}>🔍 Omnibox Global Search (Ctrl+K)</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Instant full-text lookup across PR numbers, titles, employee names, categories, and department codes.
              </p>
            </div>
            <div className="card">
              <div style={{ fontSize: '1.5rem', color: 'var(--accent-rose)', marginBottom: '0.75rem' }}>📜 Step-by-Step Audit Lifecycle</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Replaces raw database tables with an intuitive visual event timeline for complete corporate auditability.
              </p>
            </div>
            <div className="card">
              <div style={{ fontSize: '1.5rem', color: 'var(--accent-violet)', marginBottom: '0.75rem' }}>🔒 Role-Based Access (RBAC)</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Strict Spring Security guards enforcing data isolation for Employees, Department Managers, and Finance Directors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer style={{ marginTop: 'auto', padding: '3rem 2.5rem', backgroundColor: 'var(--bg-app)', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            ⚡ SmartProcure Enterprise
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © 2026 SmartProcure Inc. All rights reserved. Enterprise Purchase Order Governance.
          </div>
        </div>
      </footer>
    </div>
  );
}
