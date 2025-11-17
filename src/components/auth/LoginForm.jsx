import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { validateEmail } from '../../utils/helpers';
import LoadingSpinner from './common/LoadingSpinner';
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
      // Si role es un objeto, extraer el nombre; si es string, usarlo directamente
      const roleName = typeof user.role === 'object' ? user.role.nombre : user.role;
      switch (roleName) {
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
      console.error('Error al iniciar sesión:', error);
      
      // Mensajes de error más específicos
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 3306.');
      } else if (error.response) {
        // El servidor respondió con un código de error
        const message = error.response.data?.message || error.response.data?.error || 'Error al iniciar sesión';
        setError(message);
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        setError('El servidor no respondió. Verifica que el backend esté corriendo.');
      } else {
        setError(error.message || 'Error al iniciar sesión');
      }
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