import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { userService } from '../../services/userService';
import { EnvelopeIcon, KeyIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ForgotPassword = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Smooth fade-in animation when step changes
  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [step]);

  // Clear error when user types
  const handleInputChange = (field, value) => {
    setError('');
    setSuccess('');
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (step === 1) {
      // Request OTP - validate email first
      setLoading(true);
      try {
        const response = await userService.requestPasswordResetOTP(formData.email);
        if (response.statusCode === 200) {
          setSuccess('OTP sent successfully! Check your email.');
          setTimeout(() => {
            setSuccess('');
            setStep(2);
          }, 1500);
        }
      } catch (error) {
        console.error('Failed to send OTP:', error);
        const errorMsg = error.response?.data?.message || 'Failed to send OTP. Please try again.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      // Verify OTP
      if (!formData.otp || formData.otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }

      setLoading(true);
      try {
        const response = await userService.verifyPasswordResetOTP(formData.email, formData.otp);
        if (response.statusCode === 200) {
          setSuccess('OTP verified successfully!');
          setTimeout(() => {
            setSuccess('');
            setStep(3);
          }, 1000);
        }
      } catch (error) {
        console.error('Failed to verify OTP:', error);
        setError(error.response?.data?.message || 'Invalid or expired OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      // Reset Password
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      setLoading(true);
      try {
        const response = await userService.resetPasswordWithOTP(
          formData.email,
          formData.otp,
          formData.newPassword
        );
        if (response.statusCode === 200) {
          setSuccess('Password reset successfully!');
          setTimeout(() => {
            // Reset form
            setFormData({
              email: '',
              otp: '',
              newPassword: '',
              confirmPassword: '',
            });
            setStep(1);
            onSuccess && onSuccess('Password reset successfully! You can now login with your new password.');
            onClose();
          }, 1500);
        }
      } catch (error) {
        console.error('Failed to reset password:', error);
        setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setStep(1);
    onClose();
  };

  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1:
        return 'Forgot Password';
      case 2:
        return 'Enter OTP';
      case 3:
        return 'Reset Password';
      default:
        return 'Forgot Password';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getTitle()}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
            step >= 1 ? 'bg-primary dark:bg-primary-dark text-white' : 'bg-border dark:bg-border-dark text-text-secondary dark:text-text-secondary-dark'
          }`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <div className={`w-12 h-1 transition-all duration-300 ${
            step >= 2 ? 'bg-primary dark:bg-primary-dark' : 'bg-border dark:bg-border-dark'
          }`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
            step >= 2 ? 'bg-primary dark:bg-primary-dark text-white' : 'bg-border dark:bg-border-dark text-text-secondary dark:text-text-secondary-dark'
          }`}>
            {step > 2 ? '✓' : '2'}
          </div>
          <div className={`w-12 h-1 transition-all duration-300 ${
            step >= 3 ? 'bg-primary dark:bg-primary-dark' : 'bg-border dark:bg-border-dark'
          }`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
            step >= 3 ? 'bg-primary dark:bg-primary-dark text-white' : 'bg-border dark:bg-border-dark text-text-secondary dark:text-text-secondary-dark'
          }`}>
            3
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-success/10 dark:bg-success-dark/10 border border-success dark:border-success-dark text-success dark:text-success-dark px-4 py-3 rounded-lg text-sm flex items-center animate-fade-in">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-error/10 dark:bg-error-dark/10 border border-error dark:border-error-dark text-error dark:text-error-dark px-4 py-3 rounded-lg text-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Step content with smooth transitions */}
        <div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          {step === 1 && (
            <>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-4">
                Enter your registered email address. We'll verify it and send you an OTP to reset your password.
              </p>
              <div>
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-text-secondary dark:text-text-secondary-dark" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field w-full pl-10"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-primary/10 dark:bg-primary-dark/10 border border-primary dark:border-primary-dark rounded-lg px-4 py-3 mb-4">
                <p className="text-sm text-text-primary dark:text-text-primary-dark">
                  OTP sent to <strong>{formData.email}</strong>
                </p>
              </div>
              <div>
                <label className="input-label">Enter OTP Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-text-secondary dark:text-text-secondary-dark" />
                  </div>
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, ''))}
                    className="input-field w-full pl-10 text-center text-lg tracking-widest"
                    placeholder="000000"
                    required
                    maxLength="6"
                    pattern="\d{6}"
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
                  Enter the 6-digit code sent to your email
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="bg-success/10 dark:bg-success-dark/10 border border-success dark:border-success-dark rounded-lg px-4 py-3 mb-4">
                <p className="text-sm text-success dark:text-success-dark flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  OTP verified! Now set your new password
                </p>
              </div>
              <div>
                <label className="input-label">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-text-secondary dark:text-text-secondary-dark" />
                  </div>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="input-field w-full pl-10"
                    placeholder="Enter new password"
                    required
                    minLength="6"
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
                  Must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="input-label">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-text-secondary dark:text-text-secondary-dark" />
                  </div>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="input-field w-full pl-10"
                    placeholder="Confirm new password"
                    required
                    minLength="6"
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="btn-outline"
              disabled={loading}
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : step === 1
              ? 'Send OTP'
              : step === 2
              ? 'Verify OTP'
              : 'Reset Password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ForgotPassword;
