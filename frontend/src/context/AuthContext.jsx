// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import authApi from '../services/authApi';
import toast from 'react-hot-toast';
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial loading while checking token

  // Helper to store token
  const setToken = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  };

  // Helper to decode JWT payload (base64url safe)
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
        return {
          firstName: decoded.firstName || decoded.fName || decoded.first_name || '' ,
          lastName: decoded.lastName || decoded.lName || decoded.last_name || '' ,
          email: decoded.email || decoded.sub || decoded.email_address || ''
        };
    } catch (e) {
      console.error('Failed to decode token', e);
      return {};
    }
  };

  // Initialize loading flag on mount – load persisted token and user if present
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Decode token to get basic user info immediately
        const decoded = decodeToken(token);
        setUser(decoded);
        
        try {
          // Fetch full profile to get userId and role
          const { default: userApi } = await import('../services/userApi');
          const profile = await userApi.getProfile();
          setUser(prev => ({ ...prev, ...profile, userId: profile.id || profile.userId }));
        } catch (err) {
          console.error('Failed to fetch full profile on load', err);
        }
      }
      setLoading(false);
    };
    
    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      toast.error('Session expired. Please login again.');
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (payload) => {
    try {
      const { data } = await authApi.login(payload);
      setToken(data.token);
      const userInfo = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
      };
      setUser(userInfo);
      toast.success('Logged in successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  }, []);


  const register = useCallback(async (payload) => {
    try {
      const { data } = await authApi.register(payload);
      if (data && data.token) {
        setToken(data.token);
        const userInfo = {
          userId: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
        };
        setUser(userInfo);
      }
      toast.success('Account created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  }, []);


  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  // Update user fields (e.g., after profile edit)
  const updateUser = useCallback((updates) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
