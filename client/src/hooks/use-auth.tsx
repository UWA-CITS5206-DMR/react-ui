import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../lib/axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const autologin = useCallback(async () => {
    if (user) return;
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setLoading(true);
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    autologin();
  }, [autologin]);

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};