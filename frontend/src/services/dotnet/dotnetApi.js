import axios from 'axios';

const dotnetApi = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

dotnetApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

dotnetApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('ASP.NET API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default dotnetApi;
