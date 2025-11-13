import api from './api';

export const scheduleService = {
  // Get doctor's schedule
  getDoctorSchedule: async (doctorId) => {
    const response = await api.get(`/api/doctors/${doctorId}/schedule`);
    return response.data;
  },

  // Set/Update doctor's schedule
  setDoctorSchedule: async (doctorId, schedules) => {
    const response = await api.post(`/api/doctors/${doctorId}/schedule`, schedules);
    return response.data;
  },

  // Generate time slots
  generateTimeSlots: async (doctorId, slotData) => {
    const response = await api.post(`/api/doctors/${doctorId}/slots/generate`, slotData);
    return response.data;
  },

  // Get available slots for a date
  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get(`/api/doctors/${doctorId}/slots`, {
      params: { date }
    });
    return response.data;
  },
};
