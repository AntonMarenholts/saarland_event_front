import { createContext } from "react";
import type { CurrentUser } from "../types";

export interface AuthContextType {
  user: CurrentUser | null;
  favoriteEventIds: Set<number>;
  login: (userData: CurrentUser) => void;
  logout: () => void;
  addFavorite: (eventId: number) => void;
  removeFavorite: (eventId: number) => void;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
