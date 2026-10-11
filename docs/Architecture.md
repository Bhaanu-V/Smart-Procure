# SmartProcure System Architecture & Technical Design

## 1. System Overview
SmartProcure is an enterprise Purchase Order & Requisition Management System built using a modular micro-tier architecture. It automates approval chains, enforces dynamic departmental budget governance, tracks SLAs in real-time, and guarantees audit accountability.

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Tier                           │
│        React 18 + Vite SPA (Vanilla CSS, Glassmorphic UI)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST / JSON (JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Reverse Proxy              │
│       Vite Proxy (Dev) / Render Cloud Ingress (Prod)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Tier                       │
│                   Spring Boot 3.2.3 (Java 17/21/25)         │
│  - Security & JWT Auth Filter                               │
│  - SLA & Escalation Scheduler Engine                        │
│  - Budget Governance & Threshold Verification               │
│  - Priority Scoring Algorithm Engine                        │
│  - Real-time In-App Notification System                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ JPA / Hibernate ORM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Tier                            │
│           PostgreSQL / TiDB Cloud / In-Memory H2            │
└─────────────────────────────────────────────────────────────┘
```

## 2. Core Architectural Pillars

### 2.1 Multi-Layered Security & Authentication
- **Stateless JWT Tokens**: Signed using HMAC-SHA256 with 256-bit entropy keys.
- **Role-Based Access Control (RBAC)**: Fine-grained access control across 5 distinct roles: `EMPLOYEE`, `MANAGER`, `PROCUREMENT_OFFICER`, `FINANCE_OFFICER`, and `ADMIN`.
- **BCrypt Password Hashing**: Adaptive hashing with salt to protect user credentials.

### 2.2 Dynamic SLA Engine
- Automatically assigns SLA targets upon order submission:
  - Critical / Urgent: 12 Hours
  - High Priority: 24 Hours
  - Standard / Normal: 48 Hours
- Background scheduler polls every 10 minutes to compute breach status (`ON_TRACK`, `DUE_SOON`, `OVERDUE`, `COMPLETED`).

### 2.3 Departmental Budget Governance
- Real-time tracking of:
  - `budget_allocated`: Total funding allocated to the department.
  - `budget_used`: Realized expenditures from approved purchase orders.
  - `budget_pending`: Reserved funds for orders currently in review.
- Automatic threshold warnings when projected expenditure exceeds 80% or 100% of allocated budget.
