/**
 * Central API Configuration
 * Single source of truth for the backend API base URL across development and production.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://fitness-bot-backend.onrender.com/api'
    : '/api');

export const APP_ENV = import.meta.env.MODE || 'development';
