import api from './api';

export const inventoryService = {
  getInventory: () => api.get('/distributor/inventory'),
  manageInventory: (data) => api.post('/distributor/manage-inventory', data),
  getLowStock: (threshold) => api.get('/distributor/low-stock', { params: { threshold } }),
  getStockHistory: (startDate, endDate) => 
    api.get('/distributor/stock-history', { params: { startDate, endDate } }),
};