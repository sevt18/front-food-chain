import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/auth/LoginForm';
import '../AuthPages.css';

const Login = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <section className="auth-hero">
          <header>
            <h1>Bienvenido a FOODCHAIN</h1>
            <p>Gestiona y rastrea tus productos de manera eficiente y transparente</p>
          </header>
          <ul className="features" role="list">
            <li className="feature">
              <span aria-hidden="true">🔍</span>
              <span>Seguimiento en tiempo real</span>
            </li>
            <li className="feature">
              <span aria-hidden="true">📊</span>
              <span>Reportes detallados</span>
            </li>
            <li className="feature">
              <span aria-hidden="true">🛡️</span>
              <span>Seguridad garantizada</span>
            </li>
          </ul>
        </section>
        <section className="auth-form-section">
          <LoginForm />
        </section>
      </div>
    </main>
  );
};

export default Login;