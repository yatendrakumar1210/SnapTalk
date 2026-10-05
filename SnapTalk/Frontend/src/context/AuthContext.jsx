import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getStoredToken, getStoredUser, saveStoredUserSession, clearStoredUserSession } from '../utils/storage';
import { initSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          const res = await api.get('/auth/profile');
          if (res.success && res.user) {
            setUser(res.user);
            saveStoredUserSession(storedToken, res.user);
            initSocket(storedToken);
          }
        } catch (err) {
          console.error("Auth verification failed:", err);
          clearStoredUserSession();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      saveStoredUserSession(res.token, res.user);
      initSocket(res.token);
    }
    return res;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      saveStoredUserSession(res.token, res.user);
      initSocket(res.token);
    }
    return res;
  };

  const verifyOTP = async (phone, otpCode) => {
    const res = await api.post('/auth/verify-otp', { phone, otpCode });
    if (res.success && res.user) {
      setUser(res.user);
      if (token) saveStoredUserSession(token, res.user);
    }
    return res;
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    saveStoredUserSession(token, newUser);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore logout errors
    }
    disconnectSocket();
    clearStoredUserSession();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      verifyOTP,
      updateUser,
      logout,
      isAuthenticated: Boolean(user && token)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
