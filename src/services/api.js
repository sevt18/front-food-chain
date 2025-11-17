import axios from 'axios';

// En desarrollo, usa el proxy de Vite. En producción, usa la URL completa del backend
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Proxy de Vite redirige a http://localhost:3000/api
  : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación y tokens expirados
    if (error.response?.status === 401 || 
        (error.response?.status === 403 && 
         (error.response?.data?.message === 'Token expirado' || 
          error.response?.data?.message === 'Token inválido'))) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Solo redirigir si no estamos ya en la página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Suprimir logs de errores esperados (404, 429, ERR_INSUFFICIENT_RESOURCES)
    // Solo loguear si no es un error esperado
    if (error.response?.status !== 404 && 
        error.response?.status !== 429 && 
        !error.message?.includes('ERR_INSUFFICIENT_RESOURCES')) {
      console.error('API Error:', error.response?.status, error.response?.data || error.message);
    }
    
    // Para errores 429, mostrar un mensaje más amigable
    if (error.response?.status === 429) {
      const retryAfter = error.response?.data?.retryAfter || 0;
      const minutes = Math.ceil(retryAfter / 60);
      console.warn(`⏱️ Límite de solicitudes alcanzado. Espera ${minutes} minuto(s) o reinicia el servidor backend.`);
    }
    
    return Promise.reject(error);
  }
);

export default api;