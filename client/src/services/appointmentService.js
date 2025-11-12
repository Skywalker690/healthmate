import api from './api';

export const appointmentService = {
  getAllAppointments: async (page = 0, size = 10, status = '', startDate = '', endDate = '') => {
    const params = { page, size };
    if (status) params.status = status;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/api/appointments', { params });
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/api/appointments/${id}`);
    return response.data;
  },

  getAppointmentByCode: async (code) => {
    const response = await api.get(`/api/appointments/code/${code}`);
    return response.data;
  },

  getAppointmentsByDoctor: async (doctorId) => {
    const response = await api.get(`/api/appointments/doctor/${doctorId}`);
    return response.data;
  },

  getAppointmentsByPatient: async (patientId) => {
    const response = await api.get(`/api/appointments/patient/${patientId}`);
    return response.data;
  },

  createAppointment: async (patientId, doctorId, appointmentData) => {
    const response = await api.post(`/api/appointments/${patientId}/${doctorId}`, appointmentData);
    return response.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await api.put(`/api/appointments/${id}/status`, { status });
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/api/appointments/${id}`);
    return response.data;
  },
};
