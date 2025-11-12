import api from './api';

export const patientService = {
  getAllPatients: async (page = 0, size = 10, search = '') => {
    const params = { page, size };
    if (search) params.search = search;
    const response = await api.get('/api/patients', { params });
    return response.data;
  },

  getPatientById: async (id) => {
    const response = await api.get(`/api/patients/${id}`);
    return response.data;
  },

  updatePatient: async (id, patientData) => {
    const response = await api.put(`/api/patients/${id}`, patientData);
    return response.data;
  },

  deletePatient: async (id) => {
    const response = await api.delete(`/api/patients/${id}`);
    return response.data;
  },
};
