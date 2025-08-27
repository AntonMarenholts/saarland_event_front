import { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "../context/AuthContext";
import type { CurrentUser } from "../types";
import AuthService from "../services/auth.service";
import { fetchFavorites } from "../api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [favoriteEventIds, setFavoriteEventIds] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async (currentUser: CurrentUser) => {
    
    if (currentUser && currentUser.id) {
      try {
        const favoriteEvents = await fetchFavorites(currentUser.id);
        const ids = favoriteEvents.map((event) => event.id);
        setFavoriteEventIds(new Set(ids));
      } catch (error) {
        console.error("Failed to load favorites, logging out.", error);
        logout();
      }
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const currentUser = AuthService.getCurrentUser();
      if (currentUser && currentUser.id) {
        setUser(currentUser);
        await loadFavorites(currentUser);
      }
      setIsLoading(false);
    };
    initAuth();
  }, [loadFavorites]);

  const login = (userData: CurrentUser) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    loadFavorites(userData);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setFavoriteEventIds(new Set());
  };

  const addFavorite = (eventId: number) => {
    setFavoriteEventIds((prev) => new Set(prev).add(eventId));
  };

  const removeFavorite = (eventId: number) => {
    setFavoriteEventIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
  };

  const value: AuthContextType = {
    user,
    favoriteEventIds,
    login,
    logout,
    addFavorite,
    removeFavorite,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}