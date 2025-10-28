import { ImageItem, ImageResponse } from "@/shared/types/image";
import { api } from "../client";
import { API_ENDPOINTS } from "../config";
import { UserImage } from "./users";

// Image types
export interface Image {
  id: number;
  name: string;
  url: string;
  description?: string;
  creator: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  saved?: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface ImageDetail {
  image_id: number;
  image_name: string;
  description: string;
  path: string;
  user_id: number;
  users: UserImage;
}
export interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ImageListQuery {
  name?: string;
  page?: number;
  pageSize?: number;
  filters?: string;
  keyword?: string;
  limit?: number;
  sortBy?: "createdAt" | "name" | "popularity";
  sortOrder?: "asc" | "desc";
}

export interface CreateImageRequest {
  name: string;
  description?: string;
  file: File;
}

export interface UpdateImageRequest {
  name?: string;
  description?: string;
}

export interface AddCommentRequest {
  content: string;
}
export interface CreateImage {
  image_name: string;
  path: string;
  description: string;
  user_id: number | string | null;
}

// Images API service
export const imagesApi = {
  // Get images list
  list: async (query?: ImageListQuery) => {
    const url = `${API_ENDPOINTS.IMAGES.LIST}`;

    return api.get<ImageResponse>(url, { params: query });
  },

  // Get image detail
  detail: async (id: string | number) => {
    const res = await api.get<ImageDetail>(API_ENDPOINTS.IMAGES.DETAIL(id));
    return res.data;
  },

  // 🔹 Hard delete image (truyền thêm userId)
  deleteImage: async (id: string | number, userId: number | string | null) => {
    return api.delete(API_ENDPOINTS.IMAGES.DELETE(id), {
      params: { userId },
    });
  },

  // Create new image
  create: async (data: CreateImage) => {
    return api.post(API_ENDPOINTS.IMAGES.CREATE, data);
  },

  // Update image
  update: async (id: string | number, data: UpdateImageRequest) => {
    return api.put<Image>(API_ENDPOINTS.IMAGES.UPDATE(id), data);
  },

  // Delete image
  remove: async (id: string | number) => {
    return api.delete(API_ENDPOINTS.IMAGES.DELETE(id));
  },

  // Get image comments
  comments: async (id: string | number) => {
    return api.get<Comment[]>(API_ENDPOINTS.IMAGES.COMMENTS(id));
  },

  // Add comment to image
  addComment: async (id: string | number, data: AddCommentRequest) => {
    return api.post<Comment>(API_ENDPOINTS.IMAGES.ADD_COMMENT(id), data);
  },

  // Save image
  save: async (id: string | number) => {
    return api.post(API_ENDPOINTS.IMAGES.SAVE(id));
  },

  // Unsave image
  unsave: async (id: string | number) => {
    return api.delete(API_ENDPOINTS.IMAGES.UNSAVE(id));
  },

  // Check if image is saved

  toggleSave: async (
    imageId: number | string,
    userId: number | string | null
  ) => {
    return api
      .post<{ message: string }>(API_ENDPOINTS.IMAGES.SAVE(imageId), { userId })
      .then((res) => res.data);
  },

  // Check if saved
  saved: async (imageId: number | string, userId: number | string | null) => {
    return api
      .get<{ isSaved: boolean }>(
        `${API_ENDPOINTS.IMAGES.SAVE(imageId)}?userId=${userId}`
      )
      .then((res) => res.data);
  },

  // 🔹 Get list of saved images by userId
  listSaved: async (userId: number | string | null) => {
    return api.get<ImageItem[]>(`${API_ENDPOINTS.IMAGES.LIST}/saved`, {
      params: { userId },
    });
  },

  listCreated: async (userId: number | string | null) => {
    return api.get<ImageItem[]>(`${API_ENDPOINTS.IMAGES.LIST}/created`, {
      params: { userId },
    });
  },
};
