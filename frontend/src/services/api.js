import axios from 'axios';

const API = axios.create({
  baseURL: '/api/v1', // Proxied in vite.config.js
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
};

export const recordAPI = {
  getRecords: (params) => API.get('/records', { params }),
  createRecord: (data) => API.post('/records', data),
  deleteRecord: (id) => API.delete(`/records/${id}`),
};

export const dashboardAPI = {
  getStats: (params) => API.get('/dashboard', { params }),
};

export const userAPI = {
  getUsers: () => API.get('/users'),
  updateUser: (id, data) => API.patch(`/users/${id}`, data),
};

export default API;
