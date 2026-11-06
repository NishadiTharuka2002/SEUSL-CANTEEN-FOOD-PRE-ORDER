import axios from 'axios';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
