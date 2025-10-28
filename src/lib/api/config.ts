// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3069/api",
  TIMEOUT: 20000,
  HEADERS: {
    "Content-Type": "application/json",
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  USER: {
    LIST: "/users",
    GET_USER_DETAIL: (id: string | number) => `/users/${id}`,
    CREATE: "/users",
    DELETE: (id: string | number) => `/users/${id}`,
    UPDATE: (id: string | number) => `/users/${id}`,
  },

  ROOM: {
    LIST: "/rooms",
    UPDATE: (id: string | number) => `/rooms/${id}`,
    CREATE: "/rooms",
    GET_ROOM_DETAIL: (id: string | number) => `/rooms/${id}`,
    DELETE: (id: string | number) => `/rooms/${id}`,
  },

  BOOKING: {
    LIST: "/booking",
    API_BOOKING: "/booking",
    COMFIRM_BOOKING: "/confirm",
    DELETE_BOOKING: (id: string | number) => `/booking/${id}`,
  },

  FAVORITE: {
    TOGGLE_FAVORITE: "/favorite",
    GET_COMMENTS_FOR_FAVORITE: (id: string | number) => `/favorite/${id}`,
  },

  // Images endpoints
  IMAGES: {
    LIST: "/api/images",
    DETAIL: (id: string | number) => `/api/images/${id}`,
    CREATE: "/api/images",
    UPDATE: (id: string | number) => `/images/${id}`,
    DELETE: (id: string | number) => `/api/images/${id}`,
    COMMENTS: (id: string | number) => `/images/${id}/comments`,
    ADD_COMMENT: (id: string | number) => `/images/${id}/comments`,
    SAVE: (id: string | number) => `/api/images/save/${id}`,
    UNSAVE: (id: string | number) => `/images/${id}/unsave`,
  },

  COMMENT: {
    GET_COMMENTS_FOR_ROOM: (id: string | number) => `/comments/${id}`,
    CREATE_COMMENT: "/comments",
  },

  // Users endpoints
  USERS: {
    PROFILE: (id: string | number) => `/users/${id}`,
    SAVED_IMAGES: "/users/saved",
    CREATED_IMAGES: "/users/created",
    UPDATE_PROFILE: (id: number | string) => `/users/${id}`,
  },

  FILE: {
    UPLOAD: "/file/upload",
    DELETE: "/file/images",
  },

  LOCATIONS: {
    CREATE: "/locations",
    LIST: "/locations",
    DELETE: (id: string | number) => `/locations/${id}`,
    UPDATE: (id: string | number) => `/locations/${id}`,
    GET_COMMENTS_FOR_LOCATION: (id: string | number) => `/locations/${id}`,
  },
} as const;

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
