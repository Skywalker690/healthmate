import api from './api';

export const userService = {
  getAllUsers: async () => {
    return await api.get('/api/users');
  },

  getUserById: async (id) => {
    return await api.get(`/api/users/${id}`);
  },

  getCurrentUser: async () => {
    return await api.get('/api/users/me');
  },

  updateUser: async (id, userData) => {
    return await api.put(`/api/users/${id}`, userData);
  },

  updateCurrentUser: async (userData) => {
    return await api.put('/api/users/me', userData);
  },

  deleteUser: async (id) => {
    return await api.delete(`/api/users/${id}`);
  },

  getUsersByRole: async (role) => {
    return await api.get(`/api/users/role/${role}`);
  },

  // Old password-based change (deprecated)
  changePassword: async (oldPassword, newPassword) => {
    return await api.put('/api/users/me/password', { oldPassword, newPassword });
  },

  // OTP-based password change (new flow)
  requestPasswordChangeOTP: async () => {
    return await api.post('/api/users/me/password/otp/request');
  },

  changePasswordWithOTP: async (otp, newPassword) => {
    return await api.put('/api/users/me/password/otp', { otp, newPassword });
  },

  // Forgot password flow
  requestPasswordResetOTP: async (email) => {
    return await api.post('/api/auth/forgot-password/request', { email });
  },

  verifyPasswordResetOTP: async (email, otp) => {
    return await api.post('/api/auth/forgot-password/verify', { email, otp });
  },

  resetPasswordWithOTP: async (email, otp, newPassword) => {
    return await api.post('/api/auth/forgot-password/reset', { email, otp, newPassword });
  },
};
