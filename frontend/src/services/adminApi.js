// src/services/adminApi.js
import authApi from './authApi';

// Admin API wrapper – returns response.data.data for list endpoints and metrics
const adminApi = {
  // GET /api/admin/dashboard
  getDashboard: () =>
    authApi.get('/admin/dashboard').then((res) => res.data.data),

  // GET /api/admin/users
  getUsers: (params) =>
    authApi.get('/admin/users', { params }).then((res) => res.data.data),

  // GET /api/admin/products
  getProducts: (params) =>
    authApi.get('/admin/products', { params }).then((res) => res.data.data),

  // GET /api/admin/auctions
  getAuctions: (params) =>
    authApi.get('/admin/auctions', { params }).then((res) => res.data.data),

  // GET /api/admin/categories
  getCategories: (params) =>
    authApi.get('/admin/categories', { params }).then((res) => res.data.data),

  // GET /api/admin/reviews
  getReviews: (params) =>
    authApi.get('/admin/reviews', { params }).then((res) => res.data.data),

  // GET /api/admin/metrics/:type (e.g., users, products, auctions)
  getMetrics: (type, params = {}) =>
    authApi.get(`/admin/metrics/${type}`, { params }).then((res) => res.data.data),

  // PUT /api/admin/users/:id/disable
  disableUser: (id) =>
    authApi.put(`/admin/users/${id}/disable`).then((res) => res.data),

  // PUT /api/admin/users/:id/enable
  enableUser: (id) =>
    authApi.put(`/admin/users/${id}/enable`).then((res) => res.data),

  // DELETE /api/admin/users/:id
  deleteUser: (id) =>
    authApi.delete(`/admin/users/${id}`).then((res) => res.data),

  // DELETE /api/admin/products/:id
  deleteProduct: (id) =>
    authApi.delete(`/admin/products/${id}`).then((res) => res.data),

  // DELETE /api/admin/auctions/:id
  deleteAuction: (id) =>
    authApi.delete(`/admin/auctions/${id}`).then((res) => res.data),
};

export default adminApi;
