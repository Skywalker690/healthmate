import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { appointmentService } from '../../services/appointmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  
  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, pageSize, statusFilter, startDate, endDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAllAppointments(
        currentPage,
        pageSize,
        statusFilter,
        startDate,
        endDate
      );
      if (response.statusCode === 200) {
        setAppointments(response.appointmentList || []);
        
        // Extract pagination metadata
        if (response.data) {
          setTotalPages(response.data.totalPages || 0);
          setTotalElements(response.data.totalElements || 0);
        }
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
      if (response.statusCode === 200) {
        setSuccess('Appointment status updated successfully');
        fetchAppointments();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('Failed to update appointment status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteAppointment = (id) => {
    setAppointmentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      const response = await appointmentService.deleteAppointment(appointmentToDelete);
      if (response.statusCode === 200) {
        setSuccess('Appointment deleted successfully');
        fetchAppointments();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      setError('Failed to delete appointment');
      setTimeout(() => setError(''), 3000);
    } finally {
      setAppointmentToDelete(null);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(0); // Reset to first page on filter change
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset to first page on page size change
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setCurrentPage(0);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setCurrentPage(0);
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Appointments Management
          </h1>
        </div>

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

        {/* Filter Controls */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Size
              </label>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Code', 'Patient', 'Doctor', 'Date & Time', 'Status', 'Actions'].map((heading) => (
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
                      {appointment.patient?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {appointment.doctor?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDateTime(appointment.appointmentDateTime)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleUpdateStatus(appointment.id, e.target.value)}
                        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full focus:outline-none 
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {appointments.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No appointments found
            </div>
          )}
        </div>

        {/* Mobile Cards - Hidden on desktop */}
        <div className="md:hidden space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 text-center text-gray-500 dark:text-gray-400">
              No appointments found
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
                  <select
                    value={appointment.status}
                    onChange={(e) => handleUpdateStatus(appointment.id, e.target.value)}
                    className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full focus:outline-none 
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
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Patient</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {appointment.patient?.name || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Doctor</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {appointment.doctor?.name || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Date & Time</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {formatDateTime(appointment.appointmentDateTime)}
                  </p>
                </div>
                
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    className="w-full text-center text-sm font-medium text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete Appointment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 py-4 rounded-lg shadow-md mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} appointments
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage(0)}
                  disabled={currentPage === 0}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded 
                           bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 0}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded 
                           bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Prev
                </button>
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 px-2 sm:px-3">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded 
                           bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages - 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded 
                           bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setAppointmentToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default AppointmentsManagement;
