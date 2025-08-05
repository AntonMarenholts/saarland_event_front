import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Создаем кастомный хук для удобного доступа к контексту
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}