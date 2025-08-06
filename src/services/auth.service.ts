import axios from "axios";
import type { LoginData, RegisterData } from "../types"; // <-- Импортируем типы

const API_URL = "http://localhost:8080/api/auth/";

// Указываем типы для параметров
const register = (data: RegisterData) => {
  return axios.post(API_URL + "signup", data);
};

// Указываем типы для параметров
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

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
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
};

export default AuthService;