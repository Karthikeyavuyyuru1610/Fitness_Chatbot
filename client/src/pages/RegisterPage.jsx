import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoPerson, IoMail, IoLockClosed, IoAlertCircle, IoCheckmarkCircle } from 'react-icons/io5';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950 glow-bg">
      <div className="w-full max-w-md glass-card space-y-6 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500
                          mx-auto flex items-center justify-center text-3xl shadow-xl shadow-primary-500/20">
            🏋️
          </div>
          <h2 className="text-2xl font-bold gradient-text">Create Account</h2>
          <p className="text-xs text-gray-400">Join FitBot AI to unlock custom fitness coaching</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs animate-slide-up">
            <IoAlertCircle className="text-base shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-slide-up">
            <IoCheckmarkCircle className="text-base shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
            <div className="relative">
              <IoPerson className="absolute left-3.5 top-3.5 text-gray-500 text-base" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="input-field !pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
            <div className="relative">
              <IoMail className="absolute left-3.5 top-3.5 text-gray-500 text-base" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field !pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <IoLockClosed className="absolute left-3.5 top-3.5 text-gray-500 text-base" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                className="input-field !pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm Password</label>
            <div className="relative">
              <IoLockClosed className="absolute left-3.5 top-3.5 text-gray-500 text-base" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="input-field !pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-accent w-full mt-2"
          >
            {submitting ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-2 border-t border-dark-700/50">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
