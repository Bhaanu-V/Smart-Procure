import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  Search,
  FileText,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section style={{ padding: '5.5rem 1.5rem 3.5rem', textAlign: 'center', maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: 'var(--accent-blue)',
            fontWeight: '700',
            fontSize: '0.8rem',
            marginBottom: '1.75rem',
            letterSpacing: '0.04em',
          }}
        >
          <Sparkles size={14} />
          <span>ENTERPRISE PURCHASE ORDER GOVERNANCE PLATFORM</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
          }}
        >
          Procurement decisions, approvals, and budget control — in one place.
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            lineHeight: '1.65',
            maxWidth: '760px',
            margin: '0 auto 2.5rem',
          }}
        >
          Eliminate purchasing bottlenecks, enforce real-time department budgets, and rank requests with an explainable rule-based priority engine.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2.25rem', fontSize: '1rem', gap: '0.5rem' }}>
            <span>Launch Enterprise Workspace</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 2.25rem', fontSize: '1rem' }}>
            Sign In to Demo Account
          </Link>
        </div>
      </section>

      {/* Workflow Visualization Section */}
      <section style={{ padding: '3.5rem 1.5rem', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.025em', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Seamless Governance Architecture
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            How purchase requests travel securely from submission to manager authorization.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.75rem', position: 'relative' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue)',
                marginBottom: '1rem',
              }}
            >
              <FileText size={20} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              STEP 1
            </div>
            <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Submit Request
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Employees itemize quantities and unit costs with live total calculations, pre-submission duplicate detection, and category tagging.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-indigo)',
                marginBottom: '1rem',
              }}
            >
              <TrendingUp size={20} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-indigo)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              STEP 2
            </div>
            <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Smart Priority Engine
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Transparent rule-based scoring combines cost thresholds, urgency factors, and request age into an explainable priority level.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)',
                marginBottom: '1rem',
              }}
            >
              <Clock size={20} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-amber)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              STEP 3
            </div>
            <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Budget & SLA Guard
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Pending funds are reserved in department budgets while background SLA countdown timers track turnaround deadlines.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)',
                marginBottom: '1rem',
              }}
            >
              <CheckCircle2 size={20} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-emerald)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              STEP 4
            </div>
            <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Audit Authorization
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Department managers authorize orders, commit allocated funds, or reject with mandatory rationale logged into the audit trail.
            </p>
          </div>
        </div>
      </section>

      {/* Key Capabilities Grid */}
      <section
        style={{
          padding: '4.5rem 1.5rem',
          backgroundColor: 'var(--bg-sidebar)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.025em', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Enterprise Governance Capabilities
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Built specifically for compliance, transparency, and operational velocity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-blue)' }}>
                <Layers size={20} />
                <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Command Center Metrics</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Single-pane dashboard detailing total spend value, overdue SLA bottlenecks, and department allocation tracking bars.
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-emerald)' }}>
                <ShieldCheck size={20} />
                <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Department Budget Guardrails</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Calculates real-time allocated, used, and pending request budgets to prevent and flag unbudgeted capital expenditures.
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-indigo)' }}>
                <Clock size={20} />
                <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Turnaround SLA Monitoring</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Background tracker continuously monitors expected completion times, classifying orders as On Track, Due Soon, or Overdue.
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-amber)' }}>
                <Search size={20} />
                <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Omnibox Global Search (Ctrl+K)</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Instant full-text lookup across PR numbers, titles, employee names, categories, and department codes.
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-rose)' }}>
                <FileText size={20} />
                <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Visual Audit Event Lifecycle</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Replaces raw database tables with an intuitive visual event timeline for complete corporate auditability.
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-violet)' }}>
                <Shield size={20} />
                <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Role-Based Access Control (RBAC)</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Strict Spring Security guards enforcing data isolation for Staff Employees, Department Managers, and Administrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer style={{ marginTop: 'auto', padding: '2.5rem 1.5rem', backgroundColor: 'var(--bg-app)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            <Zap size={18} style={{ color: 'var(--accent-blue)' }} />
            <span>SmartProcure Enterprise</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
            Purchase Order Approval Workflow System. Built with Spring Boot 3 & React.
          </div>
        </div>
      </footer>
    </div>
  );
}
