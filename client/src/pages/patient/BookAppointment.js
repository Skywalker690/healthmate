import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { scheduleService } from '../../services/scheduleService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

const BookAppointment = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingMethod, setBookingMethod] = useState('slots'); // 'slots' or 'manual'
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDateTime: '',
    selectedSlot: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // Fetch all doctors without pagination for booking (or use a large page size)
      const response = await doctorService.getAllDoctors(0, 100);
      if (response.statusCode === 200) {
        setDoctors(response.doctorList || []);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // When doctor changes, reset slots and selected date
    if (name === 'doctorId') {
      setAvailableSlots([]);
      setSelectedDate('');
      setFormData(prev => ({ ...prev, selectedSlot: '', appointmentDateTime: '' }));
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setFormData({ ...formData, selectedSlot: '' });

    if (formData.doctorId && date) {
      await fetchAvailableSlots(formData.doctorId, date);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    setLoadingSlots(true);
    setError('');
    try {
      const response = await scheduleService.getAvailableSlots(doctorId, date);
      if (response.statusCode === 200) {
        setAvailableSlots(response.timeSlotList || []);
        if (response.timeSlotList?.length === 0) {
          setError('No available slots for this date. Try another date or use manual booking.');
        }
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      // Don't show error, just fall back to manual booking
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSlotSelect = (slot) => {
    setFormData({
      ...formData,
      selectedSlot: slot.id,
      appointmentDateTime: `${slot.slotDate}T${slot.startTime}`
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.doctorId || !formData.appointmentDateTime) {
      setError('Please fill in all required fields');
      return;
    }

    setBooking(true);

    try {
      const appointmentData = {
        appointmentDateTime: formData.appointmentDateTime,
        status: 'SCHEDULED',
        notes: formData.notes,
      };

      const response = await appointmentService.createAppointment(
        user.id,
        formData.doctorId,
        appointmentData
      );

      if (response.statusCode === 200) {
        setSuccess('Appointment booked successfully!');
        setFormData({
          doctorId: '',
          appointmentDateTime: '',
          notes: '',
        });
      } else {
        setError(response.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Failed to book appointment:', error);
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Book New Appointment
        </h1>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4
                          dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4
                          dark:bg-green-900 dark:border-green-700 dark:text-green-200">
            {success}
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Selection */}
            <div>
              <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Doctor *
              </label>
              <select
                name="doctorId"
                id="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 
                           rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                           dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Choose a doctor...</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialization || 'General'}
                  </option>
                ))}
              </select>
            </div>

            {/* Booking Method Tabs */}
            {formData.doctorId && (
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8" aria-label="Tabs">
                  <button
                    type="button"
                    onClick={() => setBookingMethod('slots')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      bookingMethod === 'slots'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <ClockIcon className="inline h-5 w-5 mr-1" />
                    Available Slots
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingMethod('manual')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      bookingMethod === 'manual'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <CalendarIcon className="inline h-5 w-5 mr-1" />
                    Manual Selection
                  </button>
                </nav>
              </div>
            )}

            {/* Slot-based Booking */}
            {formData.doctorId && bookingMethod === 'slots' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700
                               rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                               dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                {loadingSlots && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading available slots...</p>
                  </div>
                )}

                {!loadingSlots && selectedDate && availableSlots.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Available Time Slots *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                            formData.selectedSlot === slot.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                          }`}
                        >
                          <ClockIcon className="h-4 w-4 mx-auto mb-1" />
                          {slot.startTime}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!loadingSlots && selectedDate && availableSlots.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No slots available for this date
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Try another date or use manual booking
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Manual Booking */}
            {formData.doctorId && bookingMethod === 'manual' && (
              <div>
                <label htmlFor="appointmentDateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Appointment Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="appointmentDateTime"
                  id="appointmentDateTime"
                  value={formData.appointmentDateTime}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700
                             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                             dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            )}

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                id="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700
                           rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                           dark:bg-gray-800 dark:text-gray-100"
                placeholder="Any specific concerns or requirements..."
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={booking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
