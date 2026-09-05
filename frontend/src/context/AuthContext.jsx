import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axiosClient.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('Error fetching user', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser({
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
    });
  };

  const signup = async (name, email, password) => {
    const res = await axiosClient.post('/auth/signup', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser({
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

