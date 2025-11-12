// SimpleNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SimpleNavbar = () => {
  return (
    <nav className="bg-surface dark:bg-surface-dark py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-40">
      {/* Name only */}
      <span className="font-bold text-lg text-gray-900 dark:text-white">
        HealthCare
      </span>

      {/* Right side: Links */}
      <div className="flex items-center gap-4">
        <Link
          to="/register"
          className="px-4 py-2 rounded-md text-gray-900 dark:text-white hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition-colors text-sm sm:text-base"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 rounded-md text-gray-900 dark:text-white hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition-colors text-sm sm:text-base"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default SimpleNavbar;
