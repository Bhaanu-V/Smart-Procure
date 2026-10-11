# SmartProcure Production Deployment Guide

## 1. Cloud Deployment on Render

SmartProcure is configured for zero-configuration blueprint deployments using `render.yaml`.

### Services Configured
1. **Backend Web Service**: Docker / Maven Spring Boot application.
2. **Frontend Static Site**: Vite SPA build with rewrite rules pointing to `/index.html` and proxying `/api/*` to backend.

### Environment Variables
| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `postgres` or `tidb` |
| `DB_HOST` | Database Host | `localhost` or TiDB host |
| `DB_PORT` | Database Port | `5432` or `4000` |
| `DB_NAME` | Database Name | `smartprocure_db` |
| `DB_USERNAME` | Database User | `postgres` or cloud user |
| `DB_PASSWORD` | Database Password | Secured secret |
| `JWT_SECRET` | 256-bit Hex Key | 64+ char secret |

---

## 2. Local Development Setup

### Quick Start
```bash
# Launch backend and frontend simultaneously
start-dev.bat
```

### Manual Backend Launch
```bash
cd backend
mvn spring-boot:run
```

### Manual Frontend Launch
```bash
cd frontend
npm install
npm run dev
```
