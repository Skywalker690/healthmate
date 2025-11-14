import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers(currentPage, pageSize, searchQuery);
      if (response.statusCode === 200) {
        setUsers(response.userList || []);
        
        // Extract pagination metadata
        if (response.data) {
          setTotalPages(response.data.totalPages || 0);
          setTotalElements(response.data.totalElements || 0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users');
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
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
    return sortableUsers;
  }, [users, sortConfig]);

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateUser(editingUser.id, editingUser);
      if (response.statusCode === 200) {
        setSuccess('User updated successfully');
        setIsEditModalOpen(false);
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Failed to update user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteUser = (id) => {
    setUserToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await userService.deleteUser(userToDelete);
      if (response.statusCode === 200) {
        setSuccess('User deleted successfully');
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUserToDelete(null);
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
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
              Users Management
            </h1>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1 sm:mt-2">
              Manage user accounts and permissions
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
                    onClick={() => handleSort('role')}
                  >
                    Role <SortIcon columnKey="role" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border dark:divide-border-dark">
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-background dark:hover:bg-background-dark">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-text-primary-dark">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary dark:text-text-primary-dark">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-dark">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`badge ${
                        user.role === 'ROLE_ADMIN' ? 'badge-error' :
                        user.role === 'ROLE_DOCTOR' ? 'badge-success' :
                        'badge-primary'
                      }`}>
                        {user.role?.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-dark">
                      {user.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary dark:text-text-secondary-dark max-w-xs truncate">
                      {user.address || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-primary dark:text-primary-dark hover:opacity-80 inline-flex items-center"
                        aria-label="Edit user"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-error dark:text-error-dark hover:opacity-80 inline-flex items-center"
                        aria-label="Delete user"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {sortedUsers.length === 0 && (
              <div className="text-center py-8 text-text-secondary dark:text-text-secondary-dark">
                No users found
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="bg-surface dark:bg-surface-dark px-6 py-4 border-t border-border dark:border-border-dark">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} users
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

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="input-label">Name</label>
            <input
              type="text"
              value={editingUser?.name || ''}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>
          
          <div>
            <label className="input-label">Email</label>
            <input
              type="email"
              value={editingUser?.email || ''}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="input-label">Phone Number</label>
            <input
              type="tel"
              value={editingUser?.phoneNumber || ''}
              onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="input-label">Address</label>
            <textarea
              value={editingUser?.address || ''}
              onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
              className="input-field w-full"
              rows="3"
            />
          </div>

          <div>
            <label className="input-label">Date of Birth</label>
            <input
              type="date"
              value={editingUser?.dateOfBirth || ''}
              onChange={(e) => setEditingUser({ ...editingUser, dateOfBirth: e.target.value })}
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
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone and will remove all associated data."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default UsersManagement;
