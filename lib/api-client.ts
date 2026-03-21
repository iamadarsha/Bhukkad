import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., toast notifications)
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
