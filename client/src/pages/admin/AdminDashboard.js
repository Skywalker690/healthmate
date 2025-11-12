import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userService } from '../../services/userService';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  UsersIcon, 
  UserGroupIcon, 
  HeartIcon, 
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    canceledAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Use new dashboard analytics endpoint
      const response = await import('../../services/dashboardService').then(m => m.dashboardService.getAdminDashboard());
      
      if (response.statusCode === 200 && response.dashboardStats) {
        const data = response.dashboardStats;
        setStats({
          users: data.totalUsers || 0,
          doctors: data.totalDoctors || 0,
          patients: data.totalPatients || 0,
          appointments: data.totalAppointments || 0,
          todayAppointments: data.todayAppointments || 0,
          weeklyAppointments: data.weeklyAppointments || 0,
          monthlyAppointments: data.monthlyAppointments || 0,
          confirmedAppointments: data.confirmedAppointments || 0,
          pendingAppointments: data.pendingAppointments || 0,
          canceledAppointments: data.cancelledAppointments || 0,
          topDoctors: data.topConsultedDoctors || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Fallback to paginated endpoints with large page size to get totals
      try {
        const [usersRes, doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
          userService.getAllUsers(0, 1000, ''),
          doctorService.getAllDoctors(0, 1000, ''),
          patientService.getAllPatients(),
          appointmentService.getAllAppointments(0, 1000, '', '', ''),
        ]);

        // Extract totals from pagination metadata
        const userTotal = usersRes.data?.totalElements || usersRes.userList?.length || 0;
        const doctorTotal = doctorsRes.data?.totalElements || doctorsRes.doctorList?.length || 0;
        const patientTotal = patientsRes.patientList?.length || 0;
        const appointmentTotal = appointmentsRes.data?.totalElements || appointmentsRes.appointmentList?.length || 0;

        setStats({
          users: userTotal,
          doctors: doctorTotal,
          patients: patientTotal,
          appointments: appointmentTotal,
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  const mainStatCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: UsersIcon,
      color: 'primary',
      link: '/admin/users',
      bgGradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Doctors',
      value: stats.doctors,
      icon: UserGroupIcon,
      color: 'secondary',
      link: '/admin/doctors',
      bgGradient: 'from-teal-500 to-teal-600',
    },
    {
      title: 'Total Patients',
      value: stats.patients,
      icon: HeartIcon,
      color: 'success',
      link: '/admin/patients',
      bgGradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Appointments',
      value: stats.appointments,
      icon: CalendarIcon,
      color: 'warning',
      link: '/admin/appointments',
      bgGradient: 'from-yellow-500 to-yellow-600',
    },
  ];

  const appointmentStatCards = [
    {
      title: 'Confirmed',
      value: stats.confirmedAppointments,
      icon: CheckCircleIcon,
      color: 'success',
      bgColor: 'bg-green-50 dark:bg-green-900/10',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Pending',
      value: stats.pendingAppointments,
      icon: ClockIcon,
      color: 'warning',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'Canceled',
      value: stats.canceledAppointments,
      icon: XCircleIcon,
      color: 'error',
      bgColor: 'bg-red-50 dark:bg-red-900/10',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
            Admin Dashboard
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-2">
            Overview of your healthcare management system
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mainStatCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                to={stat.link}
                className="card hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary-dark">
                      {stat.value}
                    </p>
                    <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-2">
                      View Details →
                    </p>
                  </div>
                  <div
                    className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-lg`}
                  >
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Appointment Status Cards */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary-dark/10">
              <ChartBarIcon className="h-6 w-6 text-primary dark:text-primary-dark" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary-dark">
              Appointment Statistics
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {appointmentStatCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className={`${stat.bgColor} rounded-xl p-4 sm:p-6 border border-border dark:border-border-dark`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2">
                        {stat.title}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary-dark">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${stat.iconColor}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link 
              to="/admin/users" 
              className="btn-primary text-center py-3 sm:py-4 hover:scale-105 transition-transform"
            >
              <UsersIcon className="h-5 w-5 inline mr-2" />
              Manage Users
            </Link>
            <Link 
              to="/admin/doctors" 
              className="btn-secondary text-center py-3 sm:py-4 hover:scale-105 transition-transform"
            >
              <UserGroupIcon className="h-5 w-5 inline mr-2" />
              Manage Doctors
            </Link>
            <Link 
              to="/admin/appointments" 
              className="btn-outline text-center py-3 sm:py-4 hover:scale-105 transition-transform"
            >
              <CalendarIcon className="h-5 w-5 inline mr-2" />
              Manage Appointments
            </Link>
          </div>
        </div>

        {/* System Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5">
            <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary dark:text-text-secondary-dark">Active Users</span>
                <span className="text-sm font-medium text-success dark:text-success-dark">{stats.users} Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary dark:text-text-secondary-dark">Available Doctors</span>
                <span className="text-sm font-medium text-success dark:text-success-dark">{stats.doctors} Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary dark:text-text-secondary-dark">System Status</span>
                <span className="text-sm font-medium text-success dark:text-success-dark">● Operational</span>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-success/5 to-warning/5 dark:from-success-dark/5 dark:to-warning-dark/5">
            <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-success dark:bg-success-dark"></div>
                <div className="flex-1">
                  <p className="text-sm text-text-primary dark:text-text-primary-dark">New appointments scheduled</p>
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    {stats.pendingAppointments} pending appointments
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary dark:bg-primary-dark"></div>
                <div className="flex-1">
                  <p className="text-sm text-text-primary dark:text-text-primary-dark">Doctors available</p>
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    {stats.doctors} doctors ready for appointments
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-warning dark:bg-warning-dark"></div>
                <div className="flex-1">
                  <p className="text-sm text-text-primary dark:text-text-primary-dark">Patients registered</p>
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    {stats.patients} patients in the system
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
