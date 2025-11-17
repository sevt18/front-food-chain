import api from './api';

export const recommendationService = {
  getRecommendations: () => api.get('/recommendations'),
  getRelatedProducts: (productId) => api.get(`/products/${productId}/related`)
};

