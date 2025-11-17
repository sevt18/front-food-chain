import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerUser: (userData) => api.post('/auth/register', userData),
  registerDistributor: (distributorData) => api.post('/auth/register-distributor', distributorData),
  getProfile: () => api.get('/auth/profile'),
  getAvailableRoles: () => api.get('/auth/roles'),
};