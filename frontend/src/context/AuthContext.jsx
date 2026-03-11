
import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);         // initial token check
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyStoredToken = async () => {
      const token = localStorage.getItem('fc_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/profile');
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } catch {
        // Token invalid — clear stale data
        localStorage.removeItem('fc_token');
        localStorage.removeItem('fc_user');
      } finally {
        setIsLoading(false);
      }
    };

    verifyStoredToken();
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('fc_token', data.token);
    localStorage.setItem('fc_user', JSON.stringify(data.user));
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('fc_token', data.token);
    localStorage.setItem('fc_user', JSON.stringify(data.user));
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('fc_token');
    localStorage.removeItem('fc_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const contextPayload = {
    currentUser,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextPayload}>
      {children}
    </AuthContext.Provider>
  );
}
