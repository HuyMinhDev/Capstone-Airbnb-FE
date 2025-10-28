import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { API_CONFIG, ApiResponse, ApiError } from "./config";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Token storage utility
export const tokenStorage = {
  get: (): { accessToken: string | null; refreshToken: string | null } => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      return { accessToken, refreshToken };
    }
    return { accessToken: null, refreshToken: null };
  },
  set: (tokens: { accessToken: string; refreshToken: string }): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
    }
  },
  clear: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = tokenStorage.get(); // lấy accessToken trong localStorage
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`; // kẹp vào header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = tokenStorage.get();
        if (refreshToken) {
          const response = await axios.post<
            ApiResponse<{
              accessToken: string;
              refreshToken: string;
            }>
          >(`${API_CONFIG.BASE_URL}/auth/refresh`, { refreshToken });

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;
          tokenStorage.set({ accessToken, refreshToken: newRefreshToken });

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        tokenStorage.clear();
        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.get<T>(url, config),

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.post<T>(url, data, config),

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.put<T>(url, data, config),

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.patch<T>(url, data, config),

  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.delete<T>(url, config),
};

// Error handler utility
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return {
        message:
          (error.response.data as { message?: string })?.message ||
          "An error occurred",
        status: error.response.status,
        errors: (error.response.data as { errors?: Record<string, string[]> })
          ?.errors,
      };
    } else if (error.request) {
      return {
        message: "Network error - please check your connection",
        status: 0,
      };
    }
  }

  return {
    message:
      error instanceof Error ? error.message : "An unexpected error occurred",
    status: 0,
  };
};

export default apiClient;
