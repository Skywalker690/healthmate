import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { scheduleService } from '../../services/scheduleService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const DoctorSchedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [slotGeneration, setSlotGeneration] = useState({
    startDate: '',
    endDate: '',
    slotDurationMinutes: 30
  });

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  useEffect(() => {
    if (user?.id) {
      fetchSchedule();
    }
  }, [user]);

  const fetchSchedule = async () => {
    try {
      const response = await scheduleService.getDoctorSchedule(user.id);
      if (response.statusCode === 200 && response.scheduleList) {
        setSchedules(response.scheduleList);
        
        // Initialize empty schedules for days that don't have one
        const existingDays = response.scheduleList.map(s => s.dayOfWeek);
        const missingDays = daysOfWeek.filter(day => !existingDays.includes(day));
        
        if (missingDays.length > 0) {
          const emptySchedules = missingDays.map(day => ({
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '17:00',
            isActive: false
          }));
          setSchedules([...response.scheduleList, ...emptySchedules]);
        }
      } else {
        // Initialize with default schedule
        const defaultSchedules = daysOfWeek.map(day => ({
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          isActive: ['SATURDAY', 'SUNDAY'].includes(day) ? false : true
        }));
        setSchedules(defaultSchedules);
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      // Initialize with default on error
      const defaultSchedules = daysOfWeek.map(day => ({
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        isActive: ['SATURDAY', 'SUNDAY'].includes(day) ? false : true
      }));
      setSchedules(defaultSchedules);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.dayOfWeek === day 
        ? { ...schedule, [field]: value }
        : schedule
    ));
  };

  const handleSaveSchedule = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const activeSchedules = schedules.filter(s => s.isActive);
      const response = await scheduleService.setDoctorSchedule(user.id, activeSchedules);
      
      if (response.statusCode === 200) {
        setSuccess('Schedule saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Failed to save schedule:', error);
      setError('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSlots = async () => {
    setError('');
    setSuccess('');

    if (!slotGeneration.startDate || !slotGeneration.endDate) {
      setError('Please select start and end dates');
      return;
    }

    setGenerating(true);

    try {
      const response = await scheduleService.generateTimeSlots(user.id, slotGeneration);
      
      if (response.statusCode === 200) {
        setSuccess(`Generated ${response.timeSlotList?.length || 0} time slots successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to generate slots');
      }
    } catch (error) {
      console.error('Failed to generate slots:', error);
      setError(error.response?.data?.message || 'Failed to generate slots');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Manage Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set your weekly availability and generate appointment slots
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Weekly Schedule */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Weekly Availability
            </h2>
            <button
              onClick={handleSaveSchedule}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>

          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.dayOfWeek}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                {/* Day and Active Toggle */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <input
                    type="checkbox"
                    checked={schedule.isActive}
                    onChange={(e) => handleScheduleChange(schedule.dayOfWeek, 'isActive', e.target.checked)}
                    className="h-5 w-5 text-primary focus:ring-primary rounded"
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {schedule.dayOfWeek.charAt(0) + schedule.dayOfWeek.slice(1).toLowerCase()}
                  </span>
                </div>

                {/* Time inputs */}
                {schedule.isActive && (
                  <>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">From:</label>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleScheduleChange(schedule.dayOfWeek, 'startTime', e.target.value)}
                        className="input-field w-32"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">To:</label>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleScheduleChange(schedule.dayOfWeek, 'endTime', e.target.value)}
                        className="input-field w-32"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Slot Generation */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Generate Time Slots
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={slotGeneration.startDate}
                onChange={(e) => setSlotGeneration({...slotGeneration, startDate: e.target.value})}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={slotGeneration.endDate}
                onChange={(e) => setSlotGeneration({...slotGeneration, endDate: e.target.value})}
                className="input-field"
                min={slotGeneration.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slot Duration (minutes)
              </label>
              <select
                value={slotGeneration.slotDurationMinutes}
                onChange={(e) => setSlotGeneration({...slotGeneration, slotDurationMinutes: parseInt(e.target.value)})}
                className="input-field"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateSlots}
                disabled={generating}
                className="btn-primary w-full"
              >
                {generating ? 'Generating...' : 'Generate Slots'}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            <ClockIcon className="inline h-4 w-4 mr-1" />
            Slots will be generated based on your weekly schedule for the selected date range
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorSchedule;
