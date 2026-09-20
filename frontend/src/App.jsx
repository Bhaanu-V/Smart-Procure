import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Pages & Views
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateRequest from './pages/CreateRequest';
import RequestDetails from './pages/RequestDetails';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Layout Shell
import AppShell from './components/layout/AppShell';
import StarryBackground from './components/StarryBackground';

function ProtectedWorkspace({ children }) {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell user={user} onLogout={logout}>
      {children}
    </AppShell>
  );
}

function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role?.replace('ROLE_', '');
  const hasPermission = allowedRoles.some(role => role.replace('ROLE_', '') === userRole);

  if (!hasPermission) {
    return <UnauthorizedPage />;
  }

  return children;
}

function RoleBasedDashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN') {
    return <AdminDashboard />;
  }
  if (user.role === 'ROLE_MANAGER' || user.role === 'MANAGER') {
    return <ManagerDashboard />;
  }
  return <EmployeeDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <StarryBackground />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Authenticated Routes wrapped in AppShell & RoleGuard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedWorkspace>
                  <RoleBasedDashboard />
                </ProtectedWorkspace>
              }
            />
            <Route
              path="/manager/pending"
              element={
                <ProtectedWorkspace>
                  <RoleGuard allowedRoles={['MANAGER']}>
                    <ManagerDashboard />
                  </RoleGuard>
                </ProtectedWorkspace>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedWorkspace>
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </RoleGuard>
                </ProtectedWorkspace>
              }
            />
            <Route
              path="/requests/new"
              element={
                <ProtectedWorkspace>
                  <RoleGuard allowedRoles={['EMPLOYEE']}>
                    <CreateRequest />
                  </RoleGuard>
                </ProtectedWorkspace>
              }
            />
            <Route
              path="/requests/:id"
              element={
                <ProtectedWorkspace>
                  <RequestDetails />
                </ProtectedWorkspace>
              }
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
