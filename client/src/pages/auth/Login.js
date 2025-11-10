import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon, EyeIcon, EyeSlashIcon, HomeIcon } from '@heroicons/react/24/outline';
import ForgotPassword from '../../components/common/ForgotPassword';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear error only when submitting
    setError('');
    setLoading(true);
    setShake(false);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
      setShake(true);
      setLoading(false);
      setTimeout(() => setShake(false), 650);
    } else {
      setLoading(false);
    }
  };

    const handleEmailChange = (e) => {
    if (error) {
      setError('');
    }
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    if (error) {
      setError('');
    }
    setPassword(e.target.value);
  };

  const handleForgotPasswordSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="fixed top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 hover:border-primary dark:hover:border-primary-dark transition-all shadow-lg group"
        aria-label="Go to Home"
      >
        <HomeIcon className="h-5 w-5 text-text-primary dark:text-text-primary-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors" />
        <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
          Home
        </span>
      </Link>
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 flex items-center justify-center w-12 h-12 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:bg-border/20 dark:hover:bg-border-dark/20 transition-colors shadow-lg"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6 text-text-primary dark:text-text-primary-dark" />
        ) : (
          <SunIcon className="h-6 w-6 text-text-primary dark:text-text-primary-dark" />
        )}
      </button>
      <div className={`max-w-md w-full space-y-8 card ${shake ? 'animate-shake' : ''}`}>
        <div>
          <h2 className="text-center text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
            Healthcare Management System
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary dark:text-text-secondary-dark">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="bg-success/10 dark:bg-success-dark/10 border border-success dark:border-success-dark text-success dark:text-success-dark px-4 py-3 rounded-lg animate-fade-in" role="alert">
              <span className="block sm:inline text-sm font-medium">{successMessage}</span>
            </div>
          )}
          {error && (
            <div className="bg-error/10 dark:bg-error-dark/10 border border-error dark:border-error-dark text-error dark:text-error-dark px-4 py-3 rounded-lg animate-fade-in" role="alert">
              <span className="block sm:inline text-sm font-medium">{error}</span>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="input-label">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field w-full"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="input-field w-full pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(true)}
              className="text-sm font-medium text-primary dark:text-primary-dark hover:opacity-80"
            >
              Forgot Password?
            </button>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary dark:text-primary-dark hover:opacity-80">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>

      <ForgotPassword
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onSuccess={handleForgotPasswordSuccess}
      />
    </div>
  );
};

export default Login;
