import api from './api';

export const distributorService = {
  getStats: () => api.get('/distributor/stats'),
  getMovementHistory: (filters) => 
    api.get('/distributor/movement-history', { params: filters }),
};