import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { doctorService } from '../../services/doctorService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, pageSize, searchQuery]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAllDoctors(currentPage, pageSize, searchQuery);
      if (response.statusCode === 200) {
        setDoctors(response.doctorList || []);
        // Extract pagination metadata
        if (response.data) {
          setTotalPages(response.data.totalPages || 0);
          setTotalElements(response.data.totalElements || 0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      setError('Failed to load doctors');
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
    setCurrentPage(0); // Reset to first page when searching
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(0); // Reset to first page
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedDoctors = React.useMemo(() => {
    let sortableDoctors = [...doctors];
    if (sortConfig.key) {
      sortableDoctors.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDoctors;
  }, [doctors, sortConfig]);

  const handleEditDoctor = (doctor) => {
    setEditingDoctor({
      ...doctor,
      specialization: doctor.specialization || '',
      experience: doctor.experience || '',
      availableHours: doctor.availableHours || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await doctorService.updateDoctor(editingDoctor.id, editingDoctor);
      if (response.statusCode === 200) {
        setSuccess('Doctor updated successfully');
        setIsEditModalOpen(false);
        fetchDoctors();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update doctor:', error);
      setError('Failed to update doctor');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleViewProfile = async (id) => {
    try {
      setLoading(true);
      const response = await doctorService.getDoctorById(id);
      if (response.statusCode === 200) {
        setViewingDoctor(response.doctor);
        setIsProfileModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch doctor profile:', error);
      setError('Failed to load doctor profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = (id) => {
    setDoctorToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!doctorToDelete) return;

    try {
      const response = await doctorService.deleteDoctor(doctorToDelete);
      if (response.statusCode === 200) {
        setSuccess('Doctor deleted successfully');
        fetchDoctors();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      setError('Failed to delete doctor');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDoctorToDelete(null);
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="opacity-30">⇅</span>;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUpIcon className="h-4 w-4 inline" /> : 
      <ArrowDownIcon className="h-4 w-4 inline" />;
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
              Doctors Management
            </h1>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-2">
              Manage doctor profiles and specializations
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-error/10 dark:bg-error-dark/10 border border-error dark:border-error-dark text-error dark:text-error-dark px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-success/10 dark:bg-success-dark/10 border border-success dark:border-success-dark text-success dark:text-success-dark px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Search and Filters */}
        <div className="card">
          <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="input-label">Search Doctors</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder="Search by name or specialization..."
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
              </div>
            </div>
            <div>
              <label className="input-label">Page Size</label>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="input-field"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </form>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-border-dark">
              <thead className="bg-background dark:bg-background-dark">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider cursor-pointer hover:bg-primary/5 dark:hover:bg-primary-dark/5"
                    onClick={() => handleSort('id')}
                  >
                    ID <SortIcon columnKey="id" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider cursor-pointer hover:bg-primary/5 dark:hover:bg-primary-dark/5"
                    onClick={() => handleSort('name')}
                  >
                    Name <SortIcon columnKey="name" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider cursor-pointer hover:bg-primary/5 dark:hover:bg-primary-dark/5"
                    onClick={() => handleSort('email')}
                  >
                    Email <SortIcon columnKey="email" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider cursor-pointer hover:bg-primary/5 dark:hover:bg-primary-dark/5"
                    onClick={() => handleSort('specialization')}
                  >
                    Specialization <SortIcon columnKey="specialization" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider cursor-pointer hover:bg-primary/5 dark:hover:bg-primary-dark/5"
                    onClick={() => handleSort('experience')}
                  >
                    Experience <SortIcon columnKey="experience" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                    Available Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border dark:divide-border-dark">
                {sortedDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-background dark:hover:bg-background-dark">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-text-primary-dark">
                      {doctor.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary dark:text-text-primary-dark">
                      {doctor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-dark">
                      {doctor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-dark">
                      {doctor.specialization || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-dark">
                      {doctor.experience ? `${doctor.experience} years` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-dark">
                      {doctor.availableHours || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewProfile(doctor.id)}
                        className="text-blue-600 dark:text-blue-400 hover:opacity-80 inline-flex items-center"
                        aria-label="View doctor profile"
                        title="View Profile"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditDoctor(doctor)}
                        className="text-primary dark:text-primary-dark hover:opacity-80 inline-flex items-center"
                        aria-label="Edit doctor"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="text-error dark:text-error-dark hover:opacity-80 inline-flex items-center"
                        aria-label="Delete doctor"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {sortedDoctors.length === 0 && (
              <div className="text-center py-8 text-text-secondary dark:text-text-secondary-dark">
                No doctors found
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="px-6 py-4 bg-background dark:bg-background-dark border-t border-border dark:border-border-dark flex items-center justify-between">
              <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} doctors
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded border border-border dark:border-border-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 dark:hover:bg-primary-dark/10"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded border border-border dark:border-border-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 dark:hover:bg-primary-dark/10"
                >
                  Previous
                </button>
                <span className="px-4 py-1 text-sm text-text-primary dark:text-text-primary-dark">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-1 rounded border border-border dark:border-border-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 dark:hover:bg-primary-dark/10"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-1 rounded border border-border dark:border-border-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 dark:hover:bg-primary-dark/10"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Doctor Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Doctor Profile"
      >
        {viewingDoctor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">ID</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingDoctor.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Name</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingDoctor.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Email</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingDoctor.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Phone Number</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingDoctor.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Specialization</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingDoctor.specialization || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Experience</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingDoctor.experience ? `${viewingDoctor.experience} years` : 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Available Hours</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingDoctor.availableHours || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Address</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingDoctor.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Date of Birth</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingDoctor.dateOfBirth || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Gender</p>
                <p className="text-base text-text-primary dark:text-text-primary-dark">{viewingDoctor.gender || 'N/A'}</p>
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

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Doctor"
      >
        <form onSubmit={handleUpdateDoctor} className="space-y-4">
          <div>
            <label className="input-label">Name</label>
            <input
              type="text"
              value={editingDoctor?.name || ''}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>
          
          <div>
            <label className="input-label">Email</label>
            <input
              type="email"
              value={editingDoctor?.email || ''}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, email: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="input-label">Specialization</label>
            <input
              type="text"
              value={editingDoctor?.specialization || ''}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
              className="input-field w-full"
              placeholder="e.g., Cardiology, Neurology"
            />
          </div>

          <div>
            <label className="input-label">Experience (years)</label>
            <input
              type="number"
              value={editingDoctor?.experience || ''}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, experience: e.target.value })}
              className="input-field w-full"
              min="0"
              placeholder="e.g., 5"
            />
          </div>

          <div>
            <label className="input-label">Available Hours</label>
            <input
              type="text"
              value={editingDoctor?.availableHours || ''}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, availableHours: e.target.value })}
              className="input-field w-full"
              placeholder="e.g., Mon-Fri 9AM-5PM"
            />
          </div>

          <div>
            <label className="input-label">Phone Number</label>
            <input
              type="tel"
              value={editingDoctor?.phoneNumber || ''}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, phoneNumber: e.target.value })}
              className="input-field w-full"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDoctorToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Doctor"
        message="Are you sure you want to delete this doctor? This action cannot be undone and will remove the doctor profile and all associated appointments."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default DoctorsManagement;
