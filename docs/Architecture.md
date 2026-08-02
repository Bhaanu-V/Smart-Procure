# SmartProcure — System Architecture & Data Model

## 1. Architectural Layers
```
React Frontend (Vite, Axios, React Router - Port 5173)
       │
       ▼ REST API (JWT Bearer Auth)
Spring Boot 3 Backend (Security, JPA, Validation - Port 8080)
       │
       ▼ Hibernate ORM
MySQL Relational Database (smartprocure_db - Port 3306)
```

## 2. Entity Relationship Model (ERD)
- `departments` (1) ── (N) `users`
- `users` (1) ── (N) `purchase_requests` [Employee]
- `departments` (1) ── (N) `purchase_requests`
- `purchase_requests` (1) ── (N) `approvals`
- `users` (1) ── (N) `approvals` [Manager]
