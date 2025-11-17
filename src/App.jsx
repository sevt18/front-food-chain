import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/auth/common/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/auth/admin/AdminDashboard';
import DistributorDashboard from './pages/auth/distributor/DistributorDashboard';
import VisitorDashboard from './pages/auth/visitor/VisitorDashboard';
import Products from './pages/auth/shared/Products';
import ProductDetail from './pages/auth/shared/ProductDetail';
import Inventory from './pages/auth/distributor/Inventory';
import Batches from './pages/auth/distributor/Batches';
import LoadingSpinner from './components/auth/common/LoadingSpinner';
import './styles/App.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Verificando autenticación..." />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const getRoleName = () => {
    if (!user || !user.role) return '';
    return typeof user.role === 'object' ? user.role.nombre : user.role;
  };

  if (requiredRole && getRoleName() !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Cargando..." />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppContent() {
  const { user } = useAuth();

  const getRoleName = () => {
    if (!user || !user.role) return '';
    // Si role es un objeto, extraer el nombre; si es string, usarlo directamente
    return typeof user.role === 'object' ? user.role.nombre : user.role;
  };

  const getDefaultRoute = () => {
    if (!user) return '/login';
    
    const role = getRoleName();
    switch (role) {
      case 'admin': return '/admin';
      case 'distribuidor': return '/distributor';
      default: return '/visitor';
    }
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <ProductDetail />
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