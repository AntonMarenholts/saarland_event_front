import { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "../context/AuthContext";
import type { CurrentUser } from "../types";
import AuthService from "../services/auth.service";
import { fetchFavorites, fetchUserProfile } from "../api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [favoriteEventIds, setFavoriteEventIds] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async (currentUserId: number) => {
    try {
      const favoriteEvents = await fetchFavorites(currentUserId);
      const ids = favoriteEvents.map((event) => event.id);
      setFavoriteEventIds(new Set(ids));
    } catch (error) {
      console.error("Failed to load favorites, logging out.", error);
      logout();
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    const token = AuthService.getCurrentUser()?.token;
    if (token && token.length > 0) {
      try {
        setIsLoading(true);
        const fullUserData = await fetchUserProfile();
        setUser(fullUserData);
        await loadFavorites(fullUserData.id);
      } catch (error) {
        console.error("Failed to refresh user data, logging out.", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    }
  }, [loadFavorites]);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const currentUser = AuthService.getCurrentUser();
      if (currentUser && currentUser.token) {
        await refreshUserData();
      }
      setIsLoading(false);
    };
    initAuth();
  }, [refreshUserData]);

  const login = (userData: CurrentUser) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.id) {
      loadFavorites(userData.id);
    }
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
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
