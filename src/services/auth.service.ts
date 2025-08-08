import axios from "axios";
import { jwtDecode } from "jwt-decode"; // <-- 1. ИМПОРТИРУЕМ ДЕКОДЕР
import type { LoginData, RegisterData, CurrentUser } from "../types";

const API_URL = "http://localhost:8080/api/auth/";

const register = (data: RegisterData) => {
  return axios.post(API_URL + "signup", data);
};

const login = (data: LoginData) => {
  return axios
    .post(API_URL + "signin", data)
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

// ▼▼▼ 2. НОВЫЙ МЕТОД ДЛЯ ВХОДА С ТОКЕНОМ ▼▼▼
const loginWithToken = (token: string) => {
  // Декодируем токен, чтобы получить информацию о пользователе
  const decoded: { sub: string; iat: number; exp: number } = jwtDecode(token);
  
  // Создаем объект пользователя, который будем хранить.
  // ВАЖНО: Мы не знаем email и ID из простого токена, но для работы интерфейса
  // нам достаточно имени пользователя и ролей.
  const user: CurrentUser = {
    token: token,
    username: decoded.sub,
    roles: ['ROLE_USER'], // По умолчанию все, кто вошел через Google - USER
    id: 0, // Мы не знаем ID, ставим заглушку
    email: '', // Мы не знаем email, ставим заглушку
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
  loginWithToken, // <-- 3. ЭКСПОРТИРУЕМ НОВЫЙ МЕТОД
};

export default AuthService;