import AuthService from "../services/auth.service";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = AuthService.getCurrentUser();

  // Проверяем, есть ли пользователь и является ли он админом
  const isAdmin = user && user.roles.includes("ROLE_ADMIN");

  // Если админ - показываем содержимое. Если нет - перенаправляем на главную.
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}