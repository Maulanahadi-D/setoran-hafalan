import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, clearAuth } from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const userData = getUser();
    
    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, setUser, isAuthenticated, setIsAuthenticated, logout, loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};