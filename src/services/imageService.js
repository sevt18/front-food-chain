import api from './api';

export const imageService = {
  getProductImages: (productId) => api.get(`/images/products/${productId}/images`),
  uploadImage: (productId, imageData) => api.post(`/images/products/${productId}/images`, imageData),
  deleteImage: (imageId) => api.delete(`/images/images/${imageId}`),
};

