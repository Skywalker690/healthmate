import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowRightOnRectangleIcon,
  KeyIcon,
  Bars3Icon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import ChangePassword from '../common/ChangePassword';
import NotificationBell from '../common/NotificationBell';
import { Link } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const { user, role, logout } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogout = () => logout();
  const handlePasswordChangeSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getRoleName = () => {
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_DOCTOR') return 'Doctor';
    if (role === 'ROLE_PATIENT') return 'Patient';
    return '';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark sticky top-0 z-30">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          {successMessage && (
            <div className="py-2">
              <div className="bg-success/10 dark:bg-success-dark/10 border border-success dark:border-success-dark text-success dark:text-success-dark px-4 py-2 rounded-lg text-sm text-center">
                {successMessage}
              </div>
            </div>
          )}
          <div className="flex justify-between items-center py-3">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-background dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <Bars3Icon className="h-6 w-6 text-text-primary dark:text-text-primary-dark" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-primary dark:text-primary-dark">
                Healthcare
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* User Info (hidden on small) */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary dark:text-primary-dark">
                    {getInitials(user?.name)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    {user?.name}
                  </p>
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    {getRoleName()}
                  </p>
                </div>
              </div>

              {/* Notifications */}
              <NotificationBell />

              {/* Home */}
              <Link
                to="/"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all text-xs sm:text-sm"
              >
                <HomeIcon className="h-5 w-5 text-text-primary dark:text-text-primary-dark" />
                <span className="hidden sm:inline">Home</span>
              </Link>

              {/* Change Password (hidden xs) */}
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="hidden sm:flex items-center space-x-1 sm:space-x-2 bg-secondary dark:bg-secondary-dark hover:opacity-90 text-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium"
              >
                <KeyIcon className="h-5 w-5" />
                <span className="hidden lg:inline">Change</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 bg-error dark:bg-error-dark hover:opacity-90 text-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <ChangePassword
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={handlePasswordChangeSuccess}
        userEmail={user?.email}
      />
    </>
  );
};

export default Header;
