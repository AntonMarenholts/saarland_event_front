// src/services/auth.service.ts

import type { AxiosResponse } from "axios"; // 1. ИМПОРТИРУЕМ ТИП
import { jwtDecode } from "jwt-decode";
import type { LoginData, RegisterData, CurrentUser } from "../types";
import { apiClient } from "../api"; // 2. ИСПРАВЛЯЕМ ИМПОРТ (с фигурными скобками)

const register = (data: RegisterData) => {
  return apiClient.post("/auth/signup", data);
};

const login = (data: LoginData) => {
  return (
    apiClient
      .post("/auth/signin", data)
      // 3. УКАЗЫВАЕМ ТИП ДЛЯ ПАРАМЕТРА response
      .then((response: AxiosResponse) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      })
  );
};

const loginWithToken = (token: string) => {
  const decoded: { sub: string; iat: number; exp: number } = jwtDecode(token);
  const user: CurrentUser = {
    token: token,
    username: decoded.sub,
    roles: ["ROLE_USER"],
    id: 0,
    email: "",
  };
  localStorage.setItem("user", JSON.stringify(user));
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = (): CurrentUser | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  loginWithToken,
};

export default AuthService;
