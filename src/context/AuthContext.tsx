import { createContext } from "react";

export interface AuthContextType {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
