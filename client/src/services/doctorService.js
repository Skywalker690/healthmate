import api from './api';

export const doctorService = {
  getAllDoctors: async (page = 0, size = 10, search = '', specialty = '') => {
    const params = { page, size };
    if (search) {
      params.search = search;
    }
    if (specialty) {
      params.specialty = specialty;
    }
    const response = await api.get('/api/doctors', { params });
    // Return the response data directly as it contains the Response object from backend
    return response.data;
  },

  getAllSpecializations: async () => {
    const response = await api.get('/api/doctors/specializations');
    return response.data;
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/api/doctors/${id}`);
    return response.data;
  },

  getDoctorsBySpecialization: async (specialization) => {
    const response = await api.get(`/api/doctors/specialization/${specialization}`);
    return response.data;
  },

  updateDoctor: async (id, doctorData) => {
    const response = await api.put(`/api/doctors/${id}`, doctorData);
    return response.data;
  },

  deleteDoctor: async (id) => {
    const response = await api.delete(`/api/doctors/${id}`);
    return response.data;
  },
};
