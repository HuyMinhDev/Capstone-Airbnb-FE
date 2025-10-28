import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";

export interface FavoriteResponse {
  data: {
    is_favorite: boolean;
    message: string;
  };
  message: string;
  status: string;
  statusCode: number;
}
export interface GetFavoriteResponse {
  status: string;
  statusCode: number;
  message: string;
  data: {
    user_id: number;
    room_id: number;
    is_favorite: boolean;
  };
}

export const favoriteApi = {
  toggleFavorite: async (payload: {
    user_id: number;
    room_id: number;
  }): Promise<FavoriteResponse> => {
    const res = await api.post(API_ENDPOINTS.FAVORITE.TOGGLE_FAVORITE, payload);
    return res.data as FavoriteResponse;
  },

  getFavoriteStatus: async (
    user_id: number,
    room_id: number
  ): Promise<GetFavoriteResponse> => {
    const res = await api.get(
      `${API_ENDPOINTS.FAVORITE.TOGGLE_FAVORITE}/${user_id}/${room_id}`
    );
    return res.data as GetFavoriteResponse;
  },
};
