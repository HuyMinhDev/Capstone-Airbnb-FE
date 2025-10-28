import { api } from "../client";
import { API_ENDPOINTS } from "../config";

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  age?: number;
}

export interface AuthResponse {
  status: string;
  statusCode: number;
  message: string;
  data: Token;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterResponse {
  status: string;
  statusCode: number;
  message: string;
  data: boolean;
}

// Auth API service
export const authApi = {
  // Login user
  login: async (payload: LoginRequest) => {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload
    );
    return response.data;
  },

  // Register user
  register: async (data: RegisterRequest) => {
    return api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  // Refresh token
  refresh: async (refreshToken: string) => {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  // Logout user
  logout: async () => {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // Get current user info
  me: async () => {
    return api.get<User>(API_ENDPOINTS.AUTH.ME);
  },
};
