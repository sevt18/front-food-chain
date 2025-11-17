import api from './api';

export const tagService = {
  getAllTags: () => api.get('/tags'),
  createTag: (tagData) => api.post('/tags', tagData),
  getProductTags: (productId) => api.get(`/tags/products/${productId}`),
  addTagsToProduct: (productId, tagIds) => api.post(`/tags/products/${productId}`, { tagIds }),
  removeTagFromProduct: (productId, tagId) => api.delete(`/tags/products/${productId}/${tagId}`),
  deleteTag: (tagId) => api.delete(`/tags/${tagId}`)
};

