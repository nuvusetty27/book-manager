import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set standard API endpoint base
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const storedUser = localStorage.getItem('book_manager_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data) {
      localStorage.setItem('book_manager_user', JSON.stringify(response.data));
      setUser(response.data);
    }
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    if (response.data) {
      localStorage.setItem('book_manager_user', JSON.stringify(response.data));
      setUser(response.data);
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('book_manager_user');
    setUser(null);
  };

  // Axios helper for authenticated requests
  const authAxios = axios.create({
    baseURL: API_URL,
  });

  authAxios.interceptors.request.use(
    (config) => {
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, authAxios, API_URL }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
