import api from './api';

export const productService = {
  getProducts: () => api.get('/products/products'),
  getProduct: (id) => api.get(`/products/products/${id}`),
  createProduct: (productData) => api.post('/products/products', productData),
  updateProduct: (id, productData) => api.put(`/products/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/products/${id}`),
  searchProducts: (filters) => api.get('/products/search', { params: filters }),
};