import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * Axios instance pre-configured with the centralized API base URL.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

/**
 * Request Interceptor: Automatically attach JWT token from localStorage
 * if present.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitbot_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Format error messages and handle network connectivity issues gracefully.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error, server offline, or CORS failure
      error.customMessage = 'Unable to connect to the backend server. Please verify your internet connection or check backend availability.';
    } else if (error.response.status === 401) {
      error.customMessage = 'Authentication expired. Please log in again.';
    } else if (error.response.status >= 500) {
      error.customMessage = 'Server encountered an issue. Please try again later.';
    } else {
      error.customMessage = error.response.data?.error?.message || error.response.data?.message || 'An unexpected error occurred.';
    }
    return Promise.reject(error);
  }
);

// ── Auth API ────────────────────────────────────────────────────────
export const registerUser = (userData) => api.post('/auth/register', userData);

export const loginUser = (credentials) => api.post('/auth/login', credentials);

export const getProfile = () => api.get('/auth/profile');

export const updateProfile = (data) => api.put('/auth/profile', data);

export const changePassword = (data) => api.put('/auth/change-password', data);

// ── Chat API ────────────────────────────────────────────────────────
export const sendMessage = (conversationId, message) =>
  api.post('/chat/message', { conversationId, message });

export const getConversations = () => api.get('/chat/conversations');

export const getConversation = (id) => api.get(`/chat/conversations/${id}`);

export const deleteConversation = (id) => api.delete(`/chat/conversations/${id}`);

// ── Workout API ─────────────────────────────────────────────────────
export const generateWorkout = (params) => api.post('/workout/generate', params);

// ── Diet API ────────────────────────────────────────────────────────
export const generateDiet = (params) => api.post('/diet/generate', params);

// ── BMI API ─────────────────────────────────────────────────────────
export const calculateBMI = (params) => api.post('/bmi/calculate', params);

// ── Health Check ────────────────────────────────────────────────────
export const healthCheck = () => api.get('/health');

export default api;
