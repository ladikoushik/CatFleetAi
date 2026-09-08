import React, { createContext, useContext, useState } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cat_fleetbrain_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Real User Sign-In via REST API Gateway -> Auth Service
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setUser(data);
      localStorage.setItem('cat_fleetbrain_user', JSON.stringify(data));
      localStorage.setItem('cat_fleetbrain_token', data.token);
      setLoading(false);
      return { success: true, user: data };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Real User Sign-Up via REST API Gateway -> Auth Service
  const register = async (name, email, password, role, companyName, phone) => {
    setLoading(true);
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, companyName, phone }),
      });

      setUser(data);
      localStorage.setItem('cat_fleetbrain_user', JSON.stringify(data));
      localStorage.setItem('cat_fleetbrain_token', data.token);
      setLoading(false);
      return { success: true, user: data };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cat_fleetbrain_user');
    localStorage.removeItem('cat_fleetbrain_token');
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        hasRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
