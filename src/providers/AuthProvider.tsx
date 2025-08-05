// src/providers/AuthProvider.tsx

import { useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from '../context/AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);

  const value: AuthContextType = { isAdmin, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}