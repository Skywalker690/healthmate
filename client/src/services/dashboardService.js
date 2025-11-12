import api from './api';

export const dashboardService = {
  // Get admin dashboard stats
  getAdminDashboard: async () => {
    const response = await api.get('/api/dashboard/admin');
    return response.data;
  },

  // Get doctor dashboard stats
  getDoctorDashboard: async (doctorId) => {
    const response = await api.get(`/api/dashboard/doctor/${doctorId}`);
    return response.data;
  },
};
