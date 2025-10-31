import api from './api';

export const adminService = {
  getAllUsers: () => api.get('/admin/users'),
  assignRole: (data) => api.post('/admin/assign-role', data),
  manageProducts: (data) => api.post('/admin/manage-products', data),
  getStats: () => api.get('/admin/stats'),
};