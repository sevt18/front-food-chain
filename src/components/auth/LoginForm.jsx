import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { validateEmail } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import './AuthForms.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!formData.correo || !formData.password) {
      setError('Todos los campos son requeridos');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.correo)) {
      setError('El correo electrónico no es válido');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(formData);
      const { token, user } = response.data;
      
      await login(user, token);
      
      // Redirigir según el rol
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'distribuidor':
          navigate('/distributor');
          break;
        default:
          navigate('/visitor');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="tu@correo.com"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="small" text="" /> : 'Iniciar Sesión'}
        </button>
        
        <div className="auth-links">
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;