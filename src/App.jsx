import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import DistributorDashboard from './pages/distributor/DistributorDashboard';
import VisitorDashboard from './pages/visitor/VisitorDashboard';
import Products from './pages/shared/Products';
import Inventory from './pages/distributor/Inventory';
import Batches from './pages/distributor/Batches';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner text="Verificando autenticación..." />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner text="Cargando..." />;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppContent() {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin': return '/admin';
      case 'distribuidor': return '/distributor';
      default: return '/visitor';
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        {/* Protected Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to={getDefaultRoute()} replace />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Distributor Routes */}
          <Route path="/distributor" element={
            <ProtectedRoute requiredRole="distribuidor">
              <DistributorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/distributor/inventory" element={
            <ProtectedRoute requiredRole="distribuidor">
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/distributor/batches" element={
            <ProtectedRoute requiredRole="distribuidor">
              <Batches />
            </ProtectedRoute>
          } />
          
          {/* Visitor Routes */}
          <Route path="/visitor" element={
            <ProtectedRoute>
              <VisitorDashboard />
            </ProtectedRoute>
          } />
          
          {/* Shared Routes */}
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;