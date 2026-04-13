import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = async (credentials) => {
    const data = await api.auth.login(credentials);
    setUser(data.user);
  };
  const logout = () => setUser(null);
  const updateUser = (updates) => {
    setUser(prevUser => (prevUser ? { ...prevUser, ...updates } : prevUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
