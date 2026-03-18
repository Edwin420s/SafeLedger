// API service for SafeLedger backend integration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('safeledger_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const login = async (phone, password) => {
  const response = await apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });
  
  // Store token for future requests
  if (response.token) {
    localStorage.setItem('safeledger_token', response.token);
  }
  
  return response.user;
};

export const register = async (userData) => {
  const response = await apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  // Store token for future requests
  if (response.token) {
    localStorage.setItem('safeledger_token', response.token);
  }
  
  return response.user;
};

export const updateProfile = async (profileData) => {
  const response = await apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  return response;
};

export const createAgreement = async (agreementData) => {
  const response = await apiRequest('/agreements', {
    method: 'POST',
    body: JSON.stringify(agreementData),
  });
  return response;
};

export const getUserAgreements = async () => {
  const response = await apiRequest('/agreements');
  return response;
};

export const getAgreementById = async (id) => {
  const response = await apiRequest(`/agreements/${id}`);
  return response;
};

export const verifyAgreement = async (id) => {
  const response = await apiRequest(`/hedera/verify/${id}`, {
    method: 'POST',
  });
  return response;
};