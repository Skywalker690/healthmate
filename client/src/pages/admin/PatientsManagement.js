import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { patientService } from '../../services/patientService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { EyeIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const PatientsManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [currentPage, pageSize, searchQuery]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientService.getAllPatients(currentPage, pageSize, searchQuery);
      if (response.statusCode === 200) {
        setPatients(response.patientList || []);
        
        // Extract pagination metadata
        if (response.data) {
          setTotalPages(response.data.totalPages || 0);
          setTotalElements(response.data.totalElements || 0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(0); // Reset to first page on search
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset to first page on page size change
  };

  const handleViewProfile = async (id) => {
    try {
      setLoading(true);
      const response = await patientService.getPatientById(id);
      if (response.statusCode === 200) {
        setViewingPatient(response.patient);
        setIsProfileModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch patient profile:', error);
      setError('Failed to load patient profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = (id) => {
    setPatientToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      const response = await patientService.deletePatient(patientToDelete);
      if (response.statusCode === 200) {
        setSuccess('Patient deleted successfully');
        fetchPatients();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to delete patient:', error);
      setError('Failed to delete patient');
      setTimeout(() => setError(''), 3000);
    } finally {
      setPatientToDelete(null);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start sm:items-center">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
              Patients Management
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary-dark mt-1 sm:mt-2">
              Manage patient records and information
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-error/10 dark:bg-error-dark/10 border border-error dark:border-error-dark text-error dark:text-error-dark px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-success/10 dark:bg-success-dark/10 border border-success dark:border-success-dark text-success dark:text-success-dark px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full sm:w-auto flex gap-2">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="input-field flex-1"
              />
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 px-4"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                Search
              </button>
            </form>
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-secondary dark:text-text-secondary-dark">
                Show:
              </label>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="input-field"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
                per page
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border dark:divide-border-dark">
            <thead className="bg-background dark:bg-background-dark">
              <tr>
                {['ID', 'Name', 'Email', 'Phone', 'Gender', 'Address', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border dark:divide-border-dark">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-background dark:hover:bg-background-dark">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-text-primary-dark">
                    {patient.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-dark">
                    {patient.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-dark">
                    {patient.phoneNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-dark">
                    {patient.gender || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary dark:text-text-secondary-dark max-w-xs truncate">
                    {patient.address || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewProfile(patient.id)}
                      className="text-blue-600 dark:text-blue-400 hover:opacity-80 inline-flex items-center"
                      aria-label="View patient profile"
                      title="View Profile"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="text-error dark:text-error-dark hover:opacity-80 inline-flex items-center"
                      aria-label="Delete patient"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {patients.length === 0 && (
            <div className="text-center py-8 text-text-secondary dark:text-text-secondary-dark">
              No patients found
            </div>
          )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="bg-surface dark:bg-surface-dark px-6 py-4 border-t border-border dark:border-border-dark">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} patients
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(0)}
                    disabled={currentPage === 0}
                    className="btn-outline px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 0}
                    className="btn-outline px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-text-secondary dark:text-text-secondary-dark px-3">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="btn-outline px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="btn-outline px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Patient Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Patient Profile"
      >
        {viewingPatient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">ID</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingPatient.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Name</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingPatient.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Email</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingPatient.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Phone Number</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingPatient.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Gender</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingPatient.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Date of Birth</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingPatient.dateOfBirth || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Address</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingPatient.address || 'N/A'}</p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setPatientToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Patient"
        message="Are you sure you want to delete this patient? This action cannot be undone and will remove all patient records and history."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default PatientsManagement;