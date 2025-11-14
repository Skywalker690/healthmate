import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { notificationService } from '../../services/notificationService';
import websocketService from '../../services/websocketService';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('right');
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount();
      connectWebSocket();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [user]);

  const connectWebSocket = () => {
    if (user?.email) {
      websocketService.connect(user.email, handleNewNotification);
    }
  };

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification('HealthMate', {
        body: notification.message,
        icon: '/logo192.png'
      });
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getUnreadNotifications(user.id);
      setNotifications(response);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDropdownPosition = useCallback(() => {
    if (!bellRef.current) return;

    const bellRect = bellRef.current.getBoundingClientRect();
    const dropdownWidth = 320; // Default width for medium screens
    const viewportWidth = window.innerWidth;
    const padding = 16; // Padding from viewport edge

    // Check if there's enough space on the right
    const spaceOnRight = viewportWidth - bellRect.right;

    // On mobile (< 640px), center the dropdown or use full width
    if (viewportWidth < 640) {
      setDropdownPosition('mobile');
    } else if (spaceOnRight < dropdownWidth + padding) {
      // Not enough space on right, align to the right edge
      setDropdownPosition('right');
    } else {
      // Enough space, align to the right
      setDropdownPosition('right');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleResize = () => {
      if (showDropdown) {
        calculateDropdownPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [showDropdown, calculateDropdownPosition]);

  const handleBellClick = () => {
    if (!showDropdown) {
      fetchNotifications();
      calculateDropdownPosition();
    }
    setShowDropdown(!showDropdown);
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        ref={bellRef}
        onClick={handleBellClick}
        className="relative p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        title="Notifications"
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        ) : (
          <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        )}

        {/* Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
  fixed sm:absolute top-[60px] sm:top-auto mt-0
  bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
  z-50
  overflow-y-auto
  max-h-[70vh]
  transition-all duration-200

  ${dropdownPosition === 'mobile'
                ? 'left-0 right-0 mx-auto w-[92vw]'
                : 'right-0 w-72 sm:w-80 md:w-96'}
`}

            style={dropdownPosition === 'mobile' ? { maxWidth: 'calc(100vw - 2rem)' } : {}}
          >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs sm:text-sm text-primary hover:text-primary-dark whitespace-nowrap"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 sm:max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-6 sm:p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                  <BellIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm sm:text-base">No new notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 flex-1">
                        {notification.message}
                      </p>
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-primary hover:text-primary-dark whitespace-nowrap flex-shrink-0"
                      >
                        Mark read
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;