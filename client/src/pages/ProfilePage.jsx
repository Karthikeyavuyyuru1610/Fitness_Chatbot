import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IoPerson, IoMail, IoLockClosed, IoCheckmarkCircle, IoAlertCircle, IoLogOut } from 'react-icons/io5';

export default function ProfilePage() {
  const { user, updateUserProfile, updateUserPassword, logout } = useAuth();

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    if (!name.trim() || !email.trim()) {
      setProfileMsg({ type: 'error', text: 'Name and email are required' });
      return;
    }

    setProfileLoading(true);
    try {
      await updateUserProfile({ name, email });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to update profile.',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setPasswordLoading(true);
    try {
      await updateUserPassword({ currentPassword, newPassword });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to change password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 overflow-y-auto h-full space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">👤 User Profile</h1>
            <p className="text-xs md:text-sm text-gray-400">Manage account information, security credentials, and active session</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-semibold"
          >
            <IoLogOut className="text-base" /> Sign Out
          </button>
        </div>

        {/* User Card */}
        <div className="glass-card flex items-center gap-4 animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-100 truncate">{user?.name}</h2>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent-500/15 border border-accent-500/30 text-accent-300">
              Active Member
            </span>
          </div>
        </div>

        {/* Profile Info Form */}
        <div className="glass-card space-y-4 animate-slide-up">
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Account Details</h3>

          {profileMsg.text && (
            <div
              className={`flex items-center gap-2 p-3 rounded-xl text-xs border ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {profileMsg.type === 'success' ? <IoCheckmarkCircle /> : <IoAlertCircle />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
              <div className="relative">
                <IoPerson className="absolute left-3.5 top-3.5 text-gray-500 text-base" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  required
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={profileLoading} className="btn-primary">
              {profileLoading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-card space-y-4 animate-slide-up">
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Security & Password</h3>

          {passwordMsg.text && (
            <div
              className={`flex items-center gap-2 p-3 rounded-xl text-xs border ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {passwordMsg.type === 'success' ? <IoCheckmarkCircle /> : <IoAlertCircle />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Current Password</label>
              <div className="relative">
                <IoLockClosed className="absolute left-3.5 top-3.5 text-gray-500 text-base" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">New Password</label>
                <div className="relative">
                  <IoLockClosed className="absolute left-3.5 top-3.5 text-gray-500 text-base" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="input-field !pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm New Password</label>
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
            </div>

            <button type="submit" disabled={passwordLoading} className="btn-accent">
              {passwordLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
