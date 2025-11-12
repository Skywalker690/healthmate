import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  CalendarIcon, 
  UserIcon,  
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  BeakerIcon,
  HeartIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardService.getDoctorDashboard(user.id);
      if (response.statusCode === 200 && response.dashboardStats) {
        setStats(response.dashboardStats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  const recentAppointments = stats?.recentAppointments?.slice(0, 5) || [];

  const quickActions = [
    { icon: CalendarIcon, label: 'View Appointments', link: '/doctor/appointments', color: 'blue' },
    { icon: CalendarIcon, label: 'Manage Schedule', link: '/doctor/schedule', color: 'purple' },
    { icon: UserIcon, label: 'Update Profile', link: '/doctor/profile', color: 'green' }
  ];

  // Prepare chart data from appointmentsByMonth
  const chartData = stats?.appointmentsByMonth 
    ? Object.entries(stats.appointmentsByMonth).map(([month, count]) => ({
        month: month.split(' ')[0], // Get just the month abbreviation
        appointments: count
      }))
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-white/90">Here's your medical practice overview for today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transform hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Upcoming</p>
                <h3 className="text-3xl font-bold mt-2">{stats?.upcomingAppointments || 0}</h3>
              </div>
              <CalendarIcon className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transform hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <h3 className="text-3xl font-bold mt-2">{stats?.completedAppointments || 0}</h3>
              </div>
              <CheckCircleIcon className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-xl transform hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Cancelled</p>
                <h3 className="text-3xl font-bold mt-2">{stats?.cancelledAppointments || 0}</h3>
              </div>
              <XCircleIcon className="h-12 w-12 text-red-200" />
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transform hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total</p>
                <h3 className="text-3xl font-bold mt-2">
                  {(stats?.upcomingAppointments || 0) + (stats?.completedAppointments || 0)}
                </h3>
              </div>
              <ChartBarIcon className="h-12 w-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Appointment Trend Chart */}
        {chartData.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Appointment Trends (Last 6 Months)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
              <Link to="/doctor/appointments" className="text-primary hover:text-primary-hover text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentAppointments.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No recent appointments
                </p>
              ) : (
                recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                        {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {new Date(appointment.appointmentDateTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : appointment.status === 'SCHEDULED'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`flex items-center p-4 rounded-lg bg-gradient-to-r from-${action.color}-500/10 to-${action.color}-600/10 border border-${action.color}-200 dark:border-${action.color}-800 hover:shadow-md hover:scale-105 transform transition-all`}
                >
                  <action.icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400 mr-3`} />
                  <span className="font-medium text-gray-900 dark:text-white">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Specialization Card */}
          <div className="card p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center mb-4">
              <BeakerIcon className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Specialization</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Cardiology</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">15 years of experience</p>
          </div>

          {/* Patient Satisfaction */}
          <div className="card p-6 bg-gradient-to-br from-success/5 to-success/10">
            <div className="flex items-center mb-4">
              <HeartIcon className="h-8 w-8 text-success mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Patient Satisfaction</h3>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-success">98%</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">Positive feedback</span>
            </div>
          </div>

          {/* Availability Status */}
          <div className="card p-6 bg-gradient-to-br from-warning/5 to-warning/10">
            <div className="flex items-center mb-4">
              <ClockIcon className="h-8 w-8 text-warning mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Availability</h3>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-success rounded-full mr-2 animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400">Available</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Mon-Fri: 9AM - 5PM</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
