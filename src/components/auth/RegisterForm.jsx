import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { validateEmail, validatePassword } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import './AuthForms.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
    userType: 'visitante'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');

    // Validar contraseña en tiempo real
    if (name === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!formData.nombre || !formData.correo || !formData.password) {
      setError('Todos los campos son requeridos');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.correo)) {
      setError('El correo electrónico no es válido');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (passwordErrors.length > 0) {
      setError('La contraseña no cumple con los requisitos');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        nombre: formData.nombre,
        correo: formData.correo,
        password: formData.password
      };

      let response;
      if (formData.userType === 'distribuidor') {
        response = await authService.registerDistributor(userData);
      } else {
        response = await authService.registerUser(userData);
      }

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
      setError(error.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            required
            disabled={loading}
          />
        </div>
        
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
          <label htmlFor="userType">Tipo de Usuario:</label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="visitante">Visitante</option>
            <option value="distribuidor">Distribuidor</option>
          </select>
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
          {passwordErrors.length > 0 && (
            <div className="password-errors">
              {passwordErrors.map((error, index) => (
                <div key={index} className="password-error">• {error}</div>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-full"
          disabled={loading || passwordErrors.length > 0}
        >
          {loading ? <LoadingSpinner size="small" text="" /> : 'Registrarse'}
        </button>
        
        <div className="auth-links">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;