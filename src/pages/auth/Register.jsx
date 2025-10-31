import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegisterForm from '../../components/auth/RegisterForm';
import './AuthPages.css';

const Register = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-hero">
          <h1>Únete a Nuestra Plataforma</h1>
          <p>Crea tu cuenta y comienza a gestionar la trazabilidad de tus productos</p>
          <div className="features">
            <div className="feature">
              <span>👥</span>
              <span>Diferentes tipos de usuario</span>
            </div>
            <div className="feature">
              <span>📈</span>
              <span>Gestión optimizada</span>
            </div>
            <div className="feature">
              <span>🔒</span>
              <span>Datos protegidos</span>
            </div>
          </div>
        </div>
        <div className="auth-form-section">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;