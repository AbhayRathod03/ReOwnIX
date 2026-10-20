// src/services/categoryService.js
import authApi from './authApi';

// All functions return the nested data field: response.data.data
const categoryService = {
  // GET /api/categories
  getCategories: (params) =>
    authApi.get('/categories', { params }).then((res) => res.data.data),

  // GET /api/categories/{id}
  getCategory: (id) =>
    authApi.get(`/categories/${id}`).then((res) => res.data.data),

  // POST /api/categories
  createCategory: (payload) =>
    authApi.post('/categories', payload).then((res) => res.data.data),

  // PUT /api/categories/{id}
  updateCategory: (id, payload) =>
    authApi.put(`/categories/${id}`, payload).then((res) => res.data.data),

  // DELETE /api/categories/{id}
  deleteCategory: (id) =>
    authApi.delete(`/categories/${id}`).then((res) => res.data.data),
};

export default categoryService;
