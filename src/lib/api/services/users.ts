import { api } from "../client";
import { API_ENDPOINTS } from "../config";
import { Image } from "./images";

// User types
export interface UserDetailResponse {
  data: UserProfile;
  message: string;
  status: string;
  statusCode: number;
}
export interface UserProfile {
  id?: number | string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  birth_day: string;
  gender: "male" | "female" | "other";
}
export const getUserProfile = async (id: number | string) => {
  const res = await api.get<UserDetailResponse>(
    API_ENDPOINTS.USERS.PROFILE(id)
  );
  return res.data;
};
export interface UpdateProfileRequest {
  full_name?: string;
  avatar?: string;
  age?: number;
}

export interface UserStats {
  totalImages: number;
  totalSaved: number;
  totalComments: number;
}

// Users API service
export const usersApi = {
  // Get user profile
  // profile: async () => {
  //   return api.get<UserProfile>(API_ENDPOINTS.USERS.PROFILE);
  // },

  // Update user profile
  updateProfile: async (id: number | string, data: UpdateProfileRequest) => {
    return api.patch<UserProfile>(API_ENDPOINTS.USERS.UPDATE_PROFILE(id), data);
  },

  // Get user's saved images
  savedImages: async () => {
    return api.get<Image[]>(API_ENDPOINTS.USERS.SAVED_IMAGES);
  },

  // Get user's created images
  createdImages: async () => {
    return api.get<Image[]>(API_ENDPOINTS.USERS.CREATED_IMAGES);
  },

  // Get user statistics
  stats: async () => {
    return api.get<UserStats>("/users/stats");
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return api.post<{ avatarUrl: string }>("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export interface UserImage {
  user_id: number;
  full_name: string;
  email: string;
  avatar: string;
}
