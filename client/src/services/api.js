import axios from 'axios';

/**
 * Axios instance pre-configured with the backend base URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
