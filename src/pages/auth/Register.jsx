import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegisterForm from '../../components/auth/RegisterForm';
import '../AuthPages.css';

const Register = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <section className="auth-hero">
          <header>
            <h1>Únete a Nuestra Plataforma</h1>
            <p>Crea tu cuenta y comienza a gestionar la trazabilidad de tus productos</p>
          </header>
          <ul className="features" role="list">
            <li className="feature">
              <span aria-hidden="true">👥</span>
              <span>Diferentes tipos de usuario</span>
            </li>
            <li className="feature">
              <span aria-hidden="true">📈</span>
              <span>Gestión optimizada</span>
            </li>
            <li className="feature">
              <span aria-hidden="true">🔒</span>
              <span>Datos protegidos</span>
            </li>
          </ul>
        </section>
        <section className="auth-form-section">
          <RegisterForm />
        </section>
      </div>
    </main>
  );
};

export default Register;