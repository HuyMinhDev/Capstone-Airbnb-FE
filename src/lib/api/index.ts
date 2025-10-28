// Export all API services and utilities
export { authApi } from "./services/auth";
export { imagesApi } from "./services/images";
export { usersApi } from "./services/users";

// Export API client and utilities
export { api, tokenStorage, handleApiError } from "./client";

// Export configuration
export { API_CONFIG, API_ENDPOINTS } from "./config";
export type { ApiResponse, ApiError } from "./config";

// Export types
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "./services/auth";
export type {
  Image,
  Comment,
  ImageListQuery,
  CreateImageRequest,
  UpdateImageRequest,
  AddCommentRequest,
} from "./services/images";
export type {
  UserProfile,
  UpdateProfileRequest,
  UserStats,
} from "./services/users";

// Import for default export
import { authApi } from "./services/auth";
import { imagesApi } from "./services/images";
import { usersApi } from "./services/users";
import { api, tokenStorage, handleApiError } from "./client";
import { API_CONFIG, API_ENDPOINTS } from "./config";

// Default export for easy importing
const apiServices = {
  auth: authApi,
  images: imagesApi,
  users: usersApi,
  client: api,
  tokenStorage,
  handleApiError,
  config: API_CONFIG,
  endpoints: API_ENDPOINTS,
};

export default apiServices;
