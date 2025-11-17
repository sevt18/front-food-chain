import api from './api';

export const qrService = {
  getProductQR: (productId) => api.get(`/qr/products/${productId}`),
  getQRByCode: (codigo) => api.get(`/qr/code/${codigo}`)
};

