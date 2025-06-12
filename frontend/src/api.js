import axios from 'axios';

// Determine the API base URL.
// 1. If VITE_API_URL is provided use that value.
// 2. When running locally fall back to the development server.
// 3. In production assume the frontend is served from the same domain
//    as the backend and use a relative path.
const defaultApiUrl =
  window.location.hostname === 'localhost'
    ? 'http://localhost:4000/api'
    : '/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor per aggiungere automaticamente il token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire errori di autenticazione
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token scaduto o non valido
      localStorage.removeItem('token');
      
      // Solo se non siamo già nella homepage
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;