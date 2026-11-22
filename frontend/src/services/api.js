import axios from 'axios';
import { io } from 'socket.io-client';

/**
 * Intelligent Backend Host URL Resolver:
 * - If running in browser and NOT on localhost / 127.0.0.1 (e.g. deployed on Vercel),
 *   ALWAYS route directly to the active live production Vercel backend.
 * - If VITE_API_URL is configured, sanitize it (ensure https:// protocol and valid target).
 * - Otherwise (local development), default to http://localhost:5000.
 */
const getBackendUrl = () => {
  // 1. In browser production deployments (e.g. *.vercel.app)
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://seusl-canteen-backend.vercel.app';
  }

  // 2. Check environment variable
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string') {
    envUrl = envUrl.trim();
    if (envUrl.includes('seusl-canteen-food-pre-order')) {
      return 'https://seusl-canteen-backend.vercel.app';
    }
    if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
      envUrl = `https://${envUrl}`;
    }
    return envUrl;
  }

  // 3. Local fallback
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
  (response) => {
    // Guard against SPA fallback returning HTML instead of JSON
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE html>') || response.data.includes('<html'))
    ) {
      console.warn('API returned HTML page instead of JSON API response. Rejecting to activate fallbacks.');
      return Promise.reject(new Error('Invalid HTML response from API'));
    }
    return response;
  },
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
