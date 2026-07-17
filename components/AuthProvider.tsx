'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCurrentUser, signOut as authSignOut, type User } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setIsLoading(false);
  }, []);

  const logout = () => {
    authSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
