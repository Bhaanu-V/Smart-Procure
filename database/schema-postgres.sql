-- =========================================================
-- SmartProcure Enterprise Schema DDL (PostgreSQL 14+ Compatible)
-- =========================================================

-- 1. Departments Table (Enhanced with Budget tracking)
CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    budget_allocated NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    budget_used NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    budget_pending NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table (Enhanced with Email Verification)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL, -- ROLE_EMPLOYEE, ROLE_MANAGER, ROLE_ADMIN
    department_id BIGINT,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 3. Purchase Requests Table
CREATE TABLE IF NOT EXISTS purchase_requests (
    id BIGSERIAL PRIMARY KEY,
    request_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    estimated_cost NUMERIC(15,2) NOT NULL CHECK (estimated_cost > 0),
    urgency VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    priority_level VARCHAR(20) NOT NULL DEFAULT 'NORMAL', -- LOW, NORMAL, HIGH, URGENT
    priority_score INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED', -- DRAFT, SUBMITTED, IN_REVIEW, APPROVED, REJECTED, CANCELLED
    employee_id BIGINT NOT NULL,
    department_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pr_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pr_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 4. SLA Tracking Table
CREATE TABLE IF NOT EXISTS sla_records (
    id BIGSERIAL PRIMARY KEY,
    purchase_request_id BIGINT NOT NULL UNIQUE,
    submission_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expected_approval_time TIMESTAMPTZ NOT NULL,
    actual_approval_time TIMESTAMPTZ,
    sla_status VARCHAR(20) NOT NULL DEFAULT 'ON_TRACK', -- ON_TRACK, DUE_SOON, OVERDUE, COMPLETED
    hours_overdue INT DEFAULT 0,
    CONSTRAINT fk_sla_pr FOREIGN KEY (purchase_request_id) REFERENCES purchase_requests(id) ON DELETE CASCADE
);

-- 5. Approvals Table
CREATE TABLE IF NOT EXISTS approvals (
    id BIGSERIAL PRIMARY KEY,
    purchase_request_id BIGINT NOT NULL,
    manager_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL, -- APPROVED, REJECTED
    comments TEXT,
    action_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_pr FOREIGN KEY (purchase_request_id) REFERENCES purchase_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Timeline Audit Events Table
CREATE TABLE IF NOT EXISTS audit_events (
    id BIGSERIAL PRIMARY KEY,
    purchase_request_id BIGINT NOT NULL,
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    previous_status VARCHAR(30),
    new_status VARCHAR(30),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_pr FOREIGN KEY (purchase_request_id) REFERENCES purchase_requests(id) ON DELETE CASCADE
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(30) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PostgreSQL Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_pr_employee ON purchase_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_pr_department_status ON purchase_requests(department_id, status);
CREATE INDEX IF NOT EXISTS idx_pr_priority ON purchase_requests(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_sla_status ON sla_records(sla_status);
CREATE INDEX IF NOT EXISTS idx_audit_pr ON audit_events(purchase_request_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notif_user_read ON notifications(user_id, is_read);

-- Initial Seed Data: Default Departments with budget allocations
INSERT INTO departments (name, code, budget_allocated, budget_used, budget_pending)
VALUES 
    ('Engineering', 'ENG', 500000.00, 120000.00, 35000.00),
    ('Finance & Accounting', 'FIN', 250000.00, 45000.00, 15000.00),
    ('Operations & Logistics', 'OPS', 300000.00, 80000.00, 20000.00),
    ('Human Resources', 'HR', 150000.00, 30000.00, 5000.00),
    ('Sales & Marketing', 'MKT', 200000.00, 60000.00, 10000.00)
ON CONFLICT (name) DO NOTHING;
