# SmartProcure — Purchase Order Approval Workflow System

[![Backend CI](https://github.com/Bhaanu-V/Smart-Procure/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Bhaanu-V/Smart-Procure/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/Bhaanu-V/Smart-Procure/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Bhaanu-V/Smart-Procure/actions/workflows/frontend-ci.yml)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

SmartProcure is an enterprise-grade Purchase Order Approval Workflow and Requisition Management System built with **Spring Boot 3**, **React 18 + Vite**, and flexible database tier support (**PostgreSQL**, **TiDB Cloud**, **MySQL**, and **H2**).

---

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**: Fine-grained workflows for `EMPLOYEE`, `MANAGER`, `PROCUREMENT_OFFICER`, `FINANCE_OFFICER`, and `ADMIN`.
- **Dynamic SLA Tracker**: Automatic calculation of resolution deadlines (12h/24h/48h) with scheduled breach detection.
- **Priority Scoring Engine**: Multi-factor scoring algorithm weighting cost, urgency, and waiting time.
- **Departmental Budget Governance**: Real-time budget reservation, consumption tracking, and threshold enforcement.
- **Audit Immutability**: Full event timeline tracking actions, actors, and state transitions.
- **Glassmorphic UI**: Ultra-responsive web interface with Command+K global search, live toast notifications, and dark canvas aesthetics.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 React 18 + Vite Frontend                    │
│   (Port 5173 / Render Static Site - AppShell & Dashboards)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON (JWT Bearer)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Spring Boot 3.2.3 Backend                   │
│   (Port 8080 / Render Web Service - REST Controllers)       │
│     ├── Security & JWT Authentication Filter                │
│     ├── Purchase Request & Approval Service Engine          │
│     ├── Dynamic SLA & Escalation Scheduler                  │
│     └── Budget Governance & Validation Engine               │
└──────────────────────────────┬──────────────────────────────┘
                               │ Spring Data JPA / Hibernate
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Storage                          │
│   PostgreSQL (Local/Render) | TiDB Cloud | MySQL | H2 Test  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
smartprocure/
├── .github/
│   ├── workflows/        # CI/CD automation pipelines for backend and frontend
│   └── ISSUE_TEMPLATE/   # Issue and pull request contribution templates
├── backend/              # Spring Boot 3.2 Java application
│   ├── src/main/java/    # Controllers, services, models, repositories, DTOs
│   └── src/main/resources/ # Profiles (postgres, tidb, mysql, dev)
├── frontend/             # React + Vite UI application
│   └── src/              # Pages, components, hooks, context, design system
├── database/             # Relational DDL schemas (PostgreSQL & MySQL)
├── docs/                 # Architecture, API specifications, SLA matrix, guides
├── render.yaml           # Infrastructure-as-code blueprint for Render
├── start-dev.bat         # One-click Windows development launcher
└── README.md
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Java JDK 17+** (JDK 17, 21, or 25 supported)
- **Node.js 18+** and **npm**
- **PostgreSQL 14+** or **MySQL 8.0+** (or use in-memory `dev` profile)

### 2. Launching Services

#### Quick Launch (Windows)
Run the automated dev launcher:
```bat
start-dev.bat
```

#### Manual Launch
**Backend**:
```bash
cd backend
mvn clean spring-boot:run
```
- API Base URL: `http://localhost:8080`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## ☁️ Cloud Deployment (Render)

SmartProcure supports zero-config deployment via `render.yaml`. When deploying on Render:

1. **Database Selection**:
   - **Render PostgreSQL**: Provision a free Render PostgreSQL database and supply its internal database connection URL / credentials via environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`).
   - **TiDB Cloud**: Set `SPRING_PROFILES_ACTIVE=tidb` and provide valid TiDB cluster credentials.
2. Ensure `JWT_SECRET` is set to a secure 256-bit secret.

---

## 📄 Documentation Links
- [System Architecture](docs/Architecture.md)
- [Database Schema & Data Dictionary](docs/DATABASE_SCHEMA.md)
- [REST API Specification](docs/API_REFERENCE.md)
- [SLA Matrix & Priority Scoring](docs/SLA_MATRIX.md)
- [Security & RBAC](docs/SECURITY_RBAC.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

---

## 🤝 Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on code standards and submitting pull requests.
