import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMail, IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950 glow-bg">
      <div className="w-full max-w-md glass-card space-y-6 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500
                          mx-auto flex items-center justify-center text-3xl shadow-xl shadow-primary-500/20">
            🔐
          </div>
          <h2 className="text-2xl font-bold gradient-text">Reset Password</h2>
          <p className="text-xs text-gray-400">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 animate-slide-up text-center">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
              <IoCheckmarkCircle className="text-3xl" />
              <p className="font-semibold">Reset Link Sent!</p>
              <p className="text-xs text-gray-300">
                If an account exists for <span className="text-white font-medium">{email}</span>, password recovery instructions have been sent.
              </p>
            </div>
            <Link to="/login" className="btn-secondary w-full flex items-center justify-center gap-2 text-xs">
              <IoArrowBack /> Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button type="submit" className="btn-primary w-full mt-2">
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-gray-400 hover:text-gray-200 inline-flex items-center gap-1">
                <IoArrowBack /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
