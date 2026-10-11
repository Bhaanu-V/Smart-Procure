# SmartProcure Database Schema & Data Dictionary

## 1. Schema Overview
The relational database design guarantees ACID transactions, referential integrity via cascade delete rules, and audit immutability for compliance.

Supported Database Engines:
- **PostgreSQL 14+** (Default Production Profile)
- **TiDB Cloud Serverless** (Zero-Env Cloud Deployment Profile)
- **H2 In-Memory** (Local Unit & Integration Test Profile)

---

## 2. Entity Relationship Overview

| Table Name | Primary Key | Description | Key Relationships |
|------------|-------------|-------------|-------------------|
| `departments` | `id` (BIGINT) | Department definitions and allocated budgets | Referenced by `users`, `purchase_requests` |
| `users` | `id` (BIGINT) | User credentials, roles, and verification flags | Belongs to `departments` |
| `purchase_requests` | `id` (BIGINT) | Procurement requisition orders | References `users` (employee), `departments` |
| `approvals` | `id` (BIGINT) | Decision logs (APPROVE / REJECT) | References `purchase_requests`, `users` (manager) |
| `sla_records` | `id` (BIGINT) | SLA target milestones and breach metrics | 1-to-1 with `purchase_requests` |
| `audit_events` | `id` (BIGINT) | Immutable timeline historical trail | References `purchase_requests` |
| `notifications` | `id` (BIGINT) | In-app user notifications and alerts | References `users` |

---

## 3. Data Dictionary

### 3.1 `departments`
- `id`: BIGSERIAL (Primary Key)
- `name`: VARCHAR(100) NOT NULL UNIQUE - Department title
- `code`: VARCHAR(20) NOT NULL UNIQUE - Standardized identifier (e.g., `ENG`, `OPS`)
- `budget_allocated`: NUMERIC(15,2) - Total allocated budget
- `budget_used`: NUMERIC(15,2) - Realized expenditures
- `budget_pending`: NUMERIC(15,2) - Reserved pending approvals
- `created_at` / `updated_at`: TIMESTAMPTZ - Lifecycle timestamps

### 3.2 `purchase_requests`
- `id`: BIGSERIAL (Primary Key)
- `request_number`: VARCHAR(50) NOT NULL UNIQUE - Formatted order code (e.g. `PR-202610-001`)
- `title`: VARCHAR(200) NOT NULL - Brief subject
- `description`: TEXT - Requisition justification
- `category`: VARCHAR(100) NOT NULL - IT, Facilities, Hardware, Software, Services
- `estimated_cost`: NUMERIC(15,2) NOT NULL - Monetary amount
- `urgency`: VARCHAR(20) NOT NULL - `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `priority_level`: VARCHAR(20) NOT NULL - `LOW`, `NORMAL`, `HIGH`, `URGENT`
- `priority_score`: INTEGER NOT NULL - Computed priority score (0 - 100)
- `status`: VARCHAR(30) NOT NULL - `DRAFT`, `SUBMITTED`, `IN_REVIEW`, `APPROVED`, `REJECTED`, `PO_CREATED`
- `employee_id`: BIGINT NOT NULL - FK to `users(id)`
- `department_id`: BIGINT NOT NULL - FK to `departments(id)`
