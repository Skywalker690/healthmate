import api from './api';

export const userService = {

  // ===================== USER DATA =====================
  getAllUsers: async (page = 0, size = 10, search = '') => {
    const params = { page, size };
    if (search) params.search = search;
    const response = await api.get('/api/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  updateCurrentUser: async (userData) => {
    const response = await api.put('/api/users/me', userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  getUsersByRole: async (role) => {
    const response = await api.get(`/api/users/role/${role}`);
    return response.data;
  },

  // ===================== PASSWORD CHANGE (AUTHENTICATED) =====================
  requestPasswordChangeOTP: async () => {
    const response = await api.post('/api/auth/password/otp/request');
    return response.data;
  },

  changePasswordWithOTP: async (otp, newPassword) => {
    const response = await api.put('/api/auth/password/otp', { otp, newPassword });
    return response.data;
  },

  // ===================== FORGOT PASSWORD (UNAUTHENTICATED) =====================
  requestPasswordResetOTP: async (email) => {
    const response = await api.post('/api/auth/forgot-password/request', { email });
    return response.data;
  },

  verifyPasswordResetOTP: async (email, otp) => {
    const response = await api.post('/api/auth/forgot-password/verify', { email, otp });
    return response.data;
  },

  resetPasswordWithOTP: async (email, otp, newPassword) => {
    const response = await api.post('/api/auth/forgot-password/reset', { email, otp, newPassword });
    return response.data;
  },

};
