import api from './api';

export const notificationService = {
  // Get all notifications for a user
  getUserNotifications: async (userId) => {
    const response = await api.get(`/api/notifications/user/${userId}`);
    return response.data;
  },

  // Get unread notifications
  getUnreadNotifications: async (userId) => {
    const response = await api.get(`/api/notifications/user/${userId}/unread`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (userId) => {
    const response = await api.get(`/api/notifications/user/${userId}/unread/count`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async (userId) => {
    const response = await api.put(`/api/notifications/user/${userId}/read-all`);
    return response.data;
  },
};
