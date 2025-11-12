import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HomeIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_PATIENT',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStepOne = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || !formData.dateOfBirth) {
      setError('Fill all fields to continue');
      return false;
    }
    if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/[\s\-()]/g, ''))) {
      setError('Enter valid phone number (10-15 digits)');
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } else setError(result.message);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
      
      {/* HOME BUTTON */}
      <Link to="/" className="fixed top-4 left-4 px-4 py-2 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark flex items-center gap-2 hover:bg-primary/10">
        <HomeIcon className="h-5 w-5" />
        Home
      </Link>

      <div className="max-w-md w-full space-y-8 card p-6">
        
        <h2 className="text-center text-3xl font-semibold">Create your account</h2>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>

              <input className="input-field w-full" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} />
              <input className="input-field w-full" placeholder="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
              <input className="input-field w-full" placeholder="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              <input className="input-field w-full" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

              <button
                type="button"
                onClick={() => {
                  setError('');
                  if (validateStepOne()) setStep(2);
                }}
                className="btn-primary w-full mt-4"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address & Security</h3>

              <textarea className="input-field w-full" rows="2" placeholder="Address" name="address" value={formData.address} onChange={handleChange} />

              <input className="input-field w-full" type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
              <input className="input-field w-full" type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Registering...' : 'Register'}
              </button>

              <button type="button" className="text-sm text-primary underline w-full text-center" onClick={() => setStep(1)}>
                Back
              </button>
            </div>
          )}

        </form>

        <p className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
