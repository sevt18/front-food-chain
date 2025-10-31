import api from './api';

export const batchService = {
  getBatches: () => api.get('/distributor/batches'),
  manageBatches: (data) => api.post('/distributor/manage-batches', data),
  getMovementHistory: (startDate, endDate) => 
    api.get('/distributor/movement-history', { params: { startDate, endDate } }),
};