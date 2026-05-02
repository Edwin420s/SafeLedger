import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '../services/api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      try {
        // Check for stored token
        const token = localStorage.getItem('safeledger_token');
        console.log('Token found:', !!token);
        if (!token) {
          setLoading(false);
          return;
        }

        // Validate token with backend
        const currentUser = await getCurrentUser();
        console.log('Current user:', currentUser);
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('safeledger_token');
          localStorage.removeItem('safeledger_user');
        }
      } catch (error) {
        console.error('Auth validation failed:', error);
        // Clear storage on error
        localStorage.removeItem('safeledger_token');
        localStorage.removeItem('safeledger_user');
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('safeledger_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('safeledger_token');
    localStorage.removeItem('safeledger_user');
  };

  // Get token from localStorage
  const token = localStorage.getItem('safeledger_token');

  return (
    <UserContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};