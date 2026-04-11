import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './pages/LoginScreen';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardScreen } from './pages/DashboardScreen';
import { PatientDirectoryScreen } from './pages/PatientDirectoryScreen';
import { AppointmentsScreen } from './pages/AppointmentsScreen';
import { AddAppointmentScreen } from './pages/AddAppointmentScreen';
import { RecordsScreen } from './pages/RecordsScreen';
import { FinancialsScreen } from './pages/FinancialsScreen';
import { DepartmentsScreen } from './pages/DepartmentsScreen';
import { SettingsScreen } from './pages/SettingsScreen';

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

// --- App Router ---
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
          <Route path="/dashboard/patients" element={<ProtectedRoute><PatientDirectoryScreen /></ProtectedRoute>} />
          <Route path="/dashboard/appointments" element={<ProtectedRoute><AppointmentsScreen /></ProtectedRoute>} />
          <Route path="/dashboard/appointments/new" element={<ProtectedRoute><AddAppointmentScreen /></ProtectedRoute>} />
          <Route path="/dashboard/records" element={<ProtectedRoute><RecordsScreen /></ProtectedRoute>} />
          <Route path="/dashboard/financials" element={<ProtectedRoute><FinancialsScreen /></ProtectedRoute>} />
          <Route path="/dashboard/departments" element={<ProtectedRoute><DepartmentsScreen /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
