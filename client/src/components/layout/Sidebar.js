import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  ChartBarIcon,
  UsersIcon,
  UserGroupIcon,
  HeartIcon,
  CalendarIcon,
  UserCircleIcon,
  PlusCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/admin/users', label: 'Users', icon: UsersIcon },
    { path: '/admin/doctors', label: 'Doctors', icon: UserGroupIcon },
    { path: '/admin/patients', label: 'Patients', icon: HeartIcon },
    { path: '/admin/appointments', label: 'Appointments', icon: CalendarIcon },
  ];

  const doctorLinks = [
    { path: '/doctor', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/doctor/appointments', label: 'My Appointments', icon: CalendarIcon },
    { path: '/doctor/profile', label: 'My Profile', icon: UserCircleIcon },
  ];

  const patientLinks = [
    { path: '/patient', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/patient/appointments', label: 'My Appointments', icon: CalendarIcon },
    { path: '/patient/book-appointment', label: 'Book Appointment', icon: PlusCircleIcon },
    { path: '/patient/profile', label: 'My Profile', icon: UserCircleIcon },
  ];

  let links = [];
  if (role === 'ROLE_ADMIN') links = adminLinks;
  else if (role === 'ROLE_DOCTOR') links = doctorLinks;
  else if (role === 'ROLE_PATIENT') links = patientLinks;

  return (
    <>
      {/* Mobile Overlay (below sidebar, above content) */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Sidebar - z-40 so it appears above overlay and below modal */}
      <aside
        className={`
          fixed left-0 z-40
          w-64
          transform transition-transform duration-300 ease-in-out
          bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:top-[64px] lg:h-[calc(100vh-64px)]
          top-0 h-screen lg:h-[calc(100vh-64px)]
        `}
      >
        <div className="p-4 flex flex-col h-full">
          
          <div className="flex justify-end lg:hidden mb-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-background dark:hover:bg-background-dark"
            >
              <XMarkIcon className="h-6 w-6 text-text-primary dark:text-text-primary-dark" />
            </button>
          </div>

          <nav className="space-y-2 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-surface/20 dark:scrollbar-thumb-primary-dark/50 dark:scrollbar-track-surface-dark/20">
            {links.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={handleLinkClick}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-primary dark:bg-primary-dark text-white'
                    : 'text-text-secondary dark:text-text-secondary-dark hover:bg-primary/5 dark:hover:bg-primary-dark/10 hover:text-text-primary dark:hover:text-text-primary-dark'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium text-sm">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Reserved space so content shifts on desktop */}
      <div className="lg:ml-64 mt-[64px]" />
    </>
  );
};

export default Sidebar;
