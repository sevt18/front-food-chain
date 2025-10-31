import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/auth/LoginForm';
import './AuthPages.css';

const Login = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-hero">
          <h1>Bienvenido al Sistema de Trazabilidad</h1>
          <p>Gestiona y rastrea tus productos de manera eficiente y transparente</p>
          <div className="features">
            <div className="feature">
              <span>🔍</span>
              <span>Seguimiento en tiempo real</span>
            </div>
            <div className="feature">
              <span>📊</span>
              <span>Reportes detallados</span>
            </div>
            <div className="feature">
              <span>🛡️</span>
              <span>Seguridad garantizada</span>
            </div>
          </div>
        </div>
        <div className="auth-form-section">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;