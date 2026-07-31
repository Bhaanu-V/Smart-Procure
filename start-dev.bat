@echo off
echo Starting SmartProcure Backend and Frontend...

start "SmartProcure Backend (Spring Boot)" cmd /k "cd backend && mvn spring-boot:run"
start "SmartProcure Frontend (React + Vite)" cmd /k "cd frontend && npm run dev"

echo Both services launched in separate windows!
echo - Backend:  http://localhost:8080
echo - Frontend: http://localhost:5173
