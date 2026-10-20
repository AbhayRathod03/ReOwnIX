// src/services/userApi.js
import authApi from './authApi';

// All functions return response.data (the nested data field if present)
const userApi = {
  // Update profile information (e.g., name, email)
  updateProfile: (payload) =>
    authApi.put('/users/profile', payload).then((res) => res.data?.data || res.data),

  // Get profile information
  getProfile: () =>
    authApi.get('/users/profile').then((res) => res.data?.data || res.data),

  // Change password; expects { oldPassword, newPassword }
  changePassword: (payload) =>
    authApi.put('/users/change-password', payload).then((res) => res.data),
};

export default userApi;
