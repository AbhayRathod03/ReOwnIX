// src/services/reviewService.js
import authApi from './authApi';

/**
 * reviewService provides abstraction over review related API calls.
 * All functions return the nested data field: response.data.data
 */
const reviewService = {
  // Create a new review for a product
  createReview: (sellerId, productId, data) =>
    authApi
      .post('/reviews', { sellerId, productId, ...data })
      .then((res) => res.data.data),

  // Update an existing review
  updateReview: (reviewId, data) =>
    authApi.put(`/reviews/${reviewId}`, data).then((res) => res.data.data),

  // Delete a review
  deleteReview: (reviewId) =>
    authApi.delete(`/reviews/${reviewId}`).then((res) => res.data.data),

  // Get all reviews for a specific seller
  getSellerReviews: (sellerId) =>
    authApi.get(`/reviews/seller/${sellerId}`).then((res) => res.data.data),

  // Get rating summary for a seller
  getSellerRating: (sellerId) =>
    authApi.get(`/reviews/seller/${sellerId}/rating`).then((res) => res.data.data),
};

export default reviewService;
