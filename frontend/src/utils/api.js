import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to create FormData for requests with files
const createFormData = (data) => {
  const hasFile = Object.values(data).some(value => value instanceof File);
  
  if (!hasFile) return data;
  
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  return formData;
};

// Override post method to handle files
const originalPost = api.post;
api.post = function (url, data, config = {}) {
  const formData = createFormData(data);
  
  if (formData instanceof FormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };
  }
  
  return originalPost.call(this, url, formData, config);
};

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    console.error('API Error:', error);
    
    // Handle authentication errors
    if (response && response.status === 401) {
      console.warn('Authentication error detected, clearing auth data');
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('accountType');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        console.log('Redirecting to login page due to authentication error');
        window.location.href = '/login';
      }
    }
    
    // Format error for easier handling in components
    if (response && response.data) {
      // Extract the error message for easier access
      error.message = response.data.message || response.data.error || 'Request failed';
    }
    
    return Promise.reject(error);
  }
);

export default api; 