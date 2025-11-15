
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getMockUserById } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('lumyn_user_id');
    if (storedUserId) {
      getMockUserById(storedUserId).then(userData => {
        if (userData) {
          setUser(userData);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (userId: string) => {
    const userData = await getMockUserById(userId);
    if (userData) {
      setUser(userData);
      localStorage.setItem('lumyn_user_id', userId);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lumyn_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
