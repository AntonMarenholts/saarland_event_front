import type { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import type { LoginData, RegisterData, CurrentUser } from "../types";
import { apiClient } from "../api";

const register = (data: RegisterData) => {
  return apiClient.post("/auth/signup", data);
};

const login = (data: LoginData): Promise<CurrentUser> => {
  return apiClient
    .post("/auth/signin", data)
    .then((response: AxiosResponse<CurrentUser>) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const loginWithToken = (token: string): CurrentUser => {
  const decoded: { sub: string; iat: number; exp: number } = jwtDecode(token);
  
  const partialUser: CurrentUser = {
    token: token,
    username: decoded.sub,
    roles: [], 
    id: 0, 
    email: "", 
  };
  localStorage.setItem("user", JSON.stringify(partialUser));
  return partialUser;
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