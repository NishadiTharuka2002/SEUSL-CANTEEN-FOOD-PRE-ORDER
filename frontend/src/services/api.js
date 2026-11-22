import axios from 'axios';
import { io } from 'socket.io-client';

/**
 * Intelligent Backend Host URL Resolver:
 * - If VITE_API_URL is configured in environment, use it.
 * - If running in browser and NOT on localhost / 127.0.0.1 (e.g. deployed on Vercel),
 *   automatically route to the live Vercel backend.
 * - Otherwise (local development), default to http://localhost:5000.
 */
const getBackendUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://seusl-canteen-backend.vercel.app';
  }

  return 'http://localhost:5000';
};

const BACKEND_URL = getBackendUrl();
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/api`;
const SOCKET_URL = BACKEND_URL.replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('canteen_user');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for graceful error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Authentication token invalid or user removed from DB.');
    }
    return Promise.reject(error);
  }
);

// Socket.io singleton connection
export const socket = io(SOCKET_URL, {
  autoConnect: true
});

export default api;
