import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('safeledger_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      localStorage.setItem('safeledger_token', response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('safeledger_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = async (userData) => {
  try {
    // Clean and validate the phone number before sending
    const cleanedUserData = {
      phone: userData.phone ? userData.phone.replace(/\s/g, '').replace(/"/g, '') : '',
      password: userData.password,
      name: userData.name
    };
    
    console.log('Sending register request:', cleanedUserData);
    const response = await api.post('/users/register', cleanedUserData);
    return response.data;
  } catch (error) {
    console.error('Register API error:', error.response?.data || error.message);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    console.log('Raw credentials received:', credentials);
    console.log('credentials.phone:', credentials.phone);
    console.log('credentials.password:', credentials.password);
    
    // Clean and validate the phone number before sending
    const cleanedCredentials = {
      phone: credentials.phone ? credentials.phone.replace(/\s/g, '').replace(/"/g, '') : '',
      password: credentials.password
    };
    
    console.log('Sending login request:', cleanedCredentials);
    const response = await api.post('/users/login', cleanedCredentials);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error.response?.data || error.message);
    throw error;
  }
};

export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const getAgreements = async () => {
  const response = await api.get('/agreements');
  return response.data;
};

export const getAgreement = async (id) => {
  const response = await api.get(`/agreements/${id}`);
  return response.data;
};

export const createAgreement = async (agreementData) => {
  try {
    console.log('Creating agreement with data:', agreementData);
    const response = await api.post('/agreements', agreementData);
    console.log('Agreement created response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create agreement API error:', error.response?.data || error.message);
    throw error;
  }
};

export const acceptAgreement = async (id) => {
  const response = await api.patch(`/agreements/${id}/accept`);
  return response.data;
};

export const rejectAgreement = async (id) => {
  const response = await api.patch(`/agreements/${id}/reject`);
  return response.data;
};

export const getPayments = async (agreementId) => {
  const response = await api.get(`/payments/agreement/${agreementId}`);
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

export const verifyAgreement = async (id) => {
  const response = await api.post(`/hedera/verify/${id}`);
  return response.data;
};

export const getHederaStatus = async () => {
  const response = await api.get('/hedera/status');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('safeledger_token');
  window.location.href = '/login';
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('safeledger_token');
  if (!token) return null;

  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getUserAgreements = getAgreements;
export const getAgreementById = getAgreement;

export default api;