import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('fitbot_token'));
  const [loading, setLoading] = useState(true);

  /** Check existing token on app initialization */
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('fitbot_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.getProfile();
      if (data.success) {
        setUser(data.data.user);
        setToken(savedToken);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to load authenticated user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /** Register user */
  const register = async (name, email, password) => {
    const { data } = await api.registerUser({ name, email, password });
    if (data.success) {
      const { user: newUser, token: newToken } = data.data;
      localStorage.setItem('fitbot_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return data;
    }
  };

  /** Login user */
  const login = async (email, password) => {
    const { data } = await api.loginUser({ email, password });
    if (data.success) {
      const { user: loggedInUser, token: newToken } = data.data;
      localStorage.setItem('fitbot_token', newToken);
      setToken(newToken);
      setUser(loggedInUser);
      return data;
    }
  };

  /** Logout user */
  const logout = () => {
    localStorage.removeItem('fitbot_token');
    setToken(null);
    setUser(null);
  };

  /** Update user profile */
  const updateUserProfile = async (profileData) => {
    const { data } = await api.updateProfile(profileData);
    if (data.success) {
      setUser(data.data.user);
      return data;
    }
  };

  /** Change user password */
  const updateUserPassword = async (passwordData) => {
    const { data } = await api.changePassword(passwordData);
    return data;
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    register,
    login,
    logout,
    updateUserProfile,
    updateUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
