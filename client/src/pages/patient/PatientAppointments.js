import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointmentsByPatient(user.id);
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
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
          My Appointments
        </h1>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4
                          dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Code', 'Doctor', 'Specialization', 'Date & Time', 'Status', 'Notes'].map((heading) => (
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      Dr. {appointment.doctor?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {appointment.doctor?.specialization || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDateTime(appointment.appointmentDateTime)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {appointment.notes || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {appointments.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No appointments found.{' '}
              <a href="/patient/book-appointment" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
                Book your first appointment
              </a>
            </div>
          )}
        </div>

        {/* Mobile Cards - Hidden on desktop */}
        <div className="md:hidden space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 text-center text-gray-500 dark:text-gray-400">
              No appointments found.{' '}
              <a href="/patient/book-appointment" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
                Book your first appointment
              </a>
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
                  <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Doctor</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Dr. {appointment.doctor?.name || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Specialization</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {appointment.doctor?.specialization || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Date & Time</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {formatDateTime(appointment.appointmentDateTime)}
                  </p>
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

export default PatientAppointments;
