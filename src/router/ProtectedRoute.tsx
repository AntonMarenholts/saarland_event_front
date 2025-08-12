import AuthService from "../services/auth.service";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = AuthService.getCurrentUser();

  const isAdmin = user && user.roles.includes("ROLE_ADMIN");

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
