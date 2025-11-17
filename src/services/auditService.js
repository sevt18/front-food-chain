import api from './api';

export const auditService = {
  getLogs: (params = {}) => api.get('/admin/audit-logs', { params }),
  getStats: () => api.get('/admin/audit-stats'),
};

