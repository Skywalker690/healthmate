import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointmentsByDoctor(user.id);
      if (response.statusCode === 200) {
        setAppointments(response.appointmentList || []);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await appointmentService.updateAppointmentStatus(id, newStatus);
      console.log('Update status response:', response);
      if (response.statusCode === 200) {
        setSuccess('Appointment status updated successfully');
        fetchAppointments();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to update appointment status');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update appointment status';
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">My Appointments</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4
                          dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4
                          dark:bg-green-900 dark:border-green-700 dark:text-green-200">
            {success}
          </div>
        )}

        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Code', 'Patient', 'Date & Time', 'Status', 'Update Status', 'Notes'].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                                 dark:text-gray-300"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {appointment.appointmentCode}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {appointment.patient?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(appointment.appointmentDateTime)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleUpdateStatus(appointment.id, e.target.value)}
                        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 
                          ${
                            appointment.status === 'SCHEDULED'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : appointment.status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : appointment.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                      >
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELED">CANCELED</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {appointment.notes || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {appointments.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No appointments scheduled yet.
            </div>
          )}
        </div>

        {/* Mobile Cards - Hidden on desktop */}
        <div className="md:hidden space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 text-center text-gray-500 dark:text-gray-400">
              No appointments scheduled yet.
            </div>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Code</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {appointment.appointmentCode}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}
                  >
                    {appointment.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Patient</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {appointment.patient?.name || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Date & Time</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {formatDateTime(appointment.appointmentDateTime)}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-2">Update Status</p>
                  <select
                    value={appointment.status}
                    onChange={(e) => handleUpdateStatus(appointment.id, e.target.value)}
                    className={`w-full px-3 py-2 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${
                        appointment.status === 'SCHEDULED'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : appointment.status === 'CONFIRMED'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : appointment.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                  >
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELED">CANCELED</option>
                  </select>
                </div>
                
                {appointment.notes && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Notes</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointments;
