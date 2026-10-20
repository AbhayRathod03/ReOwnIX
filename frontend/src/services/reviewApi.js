// src/services/reviewApi.js
import authApi from './authApi';

// All functions return the nested data field: response.data.data
const reviewApi = {
  // GET /api/reviews/seller/{sellerId} – list reviews for a seller
  getBySeller: (sellerId) =>
    authApi.get(`/reviews/seller/${sellerId}`).then((res) => res.data.data),

  // GET /api/reviews/seller/{sellerId}/rating – get dynamic overall rating
  getSellerRating: (sellerId) =>
    authApi.get(`/reviews/seller/${sellerId}/rating`).then((res) => res.data.data),

  // POST /api/reviews – create a new review
  // payload: { sellerId, productId, rating, comment }
  create: (payload) =>
    authApi.post(`/reviews`, payload).then((res) => res.data.data),

  // DELETE /api/reviews/{reviewId} – delete a review
  remove: (reviewId) =>
    authApi.delete(`/reviews/${reviewId}`).then((res) => res.data.data),
};

export default reviewApi;
