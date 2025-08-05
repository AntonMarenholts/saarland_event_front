import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isAdmin } = useAuth();

  // Если пользователь - админ, показываем содержимое (через Outlet)
  // Если нет - перенаправляем на страницу входа
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}