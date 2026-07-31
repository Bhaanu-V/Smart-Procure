-- =========================================================
-- SmartProcure Database DDL Script
-- MySQL 8.0 Compatible Schema definition
-- =========================================================

CREATE DATABASE IF NOT EXISTS smartprocure_db;
USE smartprocure_db;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    budget_allocated DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    department_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Purchase Requests Table
CREATE TABLE IF NOT EXISTS purchase_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    estimated_cost DECIMAL(15,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    employee_id BIGINT NOT NULL,
    department_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pr_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pr_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Approvals Workflow Table
CREATE TABLE IF NOT EXISTS approvals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_request_id BIGINT NOT NULL,
    manager_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL,
    comments TEXT,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_pr FOREIGN KEY (purchase_request_id) REFERENCES purchase_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes for Query Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pr_employee ON purchase_requests(employee_id);
CREATE INDEX idx_pr_department_status ON purchase_requests(department_id, status);
CREATE INDEX idx_approvals_pr ON approvals(purchase_request_id);

-- Initial Seed Data: Default Departments
INSERT INTO departments (name, code, budget_allocated)
VALUES 
    ('Engineering', 'ENG', 500000.00),
    ('Finance & Accounting', 'FIN', 250000.00),
    ('Operations & Logistics', 'OPS', 300000.00),
    ('Human Resources', 'HR', 150000.00),
    ('Sales & Marketing', 'MKT', 200000.00)
ON DUPLICATE KEY UPDATE name=VALUES(name);
