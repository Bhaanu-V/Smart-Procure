# SmartProcure — Purchase Order Approval Workflow System

SmartProcure is an enterprise-grade Purchase Order Approval Workflow System built with **Spring Boot 3**, **React**, and **MySQL**.

---

## 🏗 System Architecture

```
React (Frontend Port 5173)
  ↓ REST API (JSON / JWT Auth)
Spring Boot 3 (Backend Port 8080)
  ↓ Spring Data JPA / Hibernate
MySQL Database (Port 3306 - smartprocure_db)
```

---

## 📁 Repository Structure

```
smartprocure/
├── backend/          # Spring Boot 3.2 Java 17 application
├── frontend/         # React + Vite UI application
├── database/         # MySQL DDL scripts
├── docs/             # Technical architecture & API documentation
├── .env.example      # Environment variables template
└── README.md
```

---

## 🛠 Prerequisites

1. **Java JDK 17+**
2. **Node.js 18+** and **npm**
3. **MySQL Server 8.0+**
4. **Maven 3.8+** (or embedded `mvnw`)

---

## 🚀 Local Development Setup

### 1. Database Setup
Create the MySQL database using the provided script or MySQL CLI:
```sql
CREATE DATABASE smartprocure_db;
```

### 2. Environment Variables
Copy `.env.example` to `.env` or set environment variables:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smartprocure_db
DB_USERNAME=root
DB_PASSWORD=YOUR_PASSWORD
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

### 3. Start Backend (Spring Boot)
```bash
cd backend
mvn clean spring-boot:run
```
Backend will start on `http://localhost:8080`.
Swagger UI API Docs available at `http://localhost:8080/swagger-ui.html`.

### 4. Start Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## 🧪 Verification
- Backend Health Endpoint: `GET http://localhost:8080/api/health`
- Response: `{"status": "UP", "service": "SmartProcure Backend API"}`
