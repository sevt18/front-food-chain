import api from './api';

export const reviewService = {
  getReviews: (productId) => api.get(`/reviews/products/${productId}/reviews`),
  createReview: (productId, reviewData) => 
    api.post(`/reviews/products/${productId}/reviews`, reviewData),
  updateReview: (reviewId, reviewData) => 
    api.put(`/reviews/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/reviews/${reviewId}`),
};