import {
  Room,
  RoomDetailResponse,
  RoomsResponse,
} from "@/features/room/types/room";
import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";

export interface RoomFavoriteResponse {
  status: string;
  statusCode: number;
  message: string;
  data: {
    page: number;
    pageSize: number;
    totalItem: number;
    totalPage: number;
    items: RoomDetail[];
  };
}
export interface RoomDetail {
  id: number;
  user_id: number;
  room_id: number;
  Rooms: Room;
}

export interface RoomPayload {
  id?: number;
  room_name: string;
  guest_count: number;
  bedroom_count: number;
  bed_count: number;
  bathroom_count: number;
  description: string;
  price: number;
  washing_machine: boolean;
  iron: boolean;
  tv: boolean;
  air_conditioner: boolean;
  wifi: boolean;
  kitchen: boolean;
  parking: boolean;
  pool: boolean;
  desk: boolean;
  image: string;
  location_id: number;
  // location: Location;
  // is_favorite?: boolean;
  // Locations?: Location;
}

export type CreateRoomPayload = Omit<RoomPayload, "id">;

export const roomApi = {
  getRooms: async (params: {
    page?: number;
    pageSize?: number;
    locationId?: number | null;
    guestCount?: number;
  }): Promise<RoomsResponse> => {
    const { page = 1, pageSize = 12, locationId, guestCount } = params;

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (locationId) query.append("locationId", String(locationId));
    if (guestCount) query.append("guestCount", String(guestCount));

    const res = await api.get<RoomsResponse>(
      `${API_ENDPOINTS.ROOM.LIST}?${query.toString()}`
    );
    return res.data;
  },

  getAdminRooms: async (params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    locationId?: number | null;
  }): Promise<RoomsResponse> => {
    const { page = 1, pageSize = 10, keyword, locationId } = params;

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (keyword) query.append("keyword", keyword);
    if (locationId) query.append("locationId", String(locationId));

    const res = await api.get<RoomsResponse>(
      `${API_ENDPOINTS.ROOM.LIST}?${query.toString()}`
    );
    return res.data;
  },

  getRoomDetail: async (id: string | number): Promise<RoomDetailResponse> => {
    const res = await api.get<RoomDetailResponse>(
      API_ENDPOINTS.ROOM.GET_ROOM_DETAIL(id)
    );
    return res.data;
  },

  getRoomFavorites: async (params: {
    page?: number;
    pageSize?: number;
    id: string | number;
  }): Promise<RoomFavoriteResponse> => {
    const { page = 1, pageSize = 12, id } = params;

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    const res = await api.get<RoomFavoriteResponse>(
      `${API_ENDPOINTS.FAVORITE.GET_COMMENTS_FOR_FAVORITE(
        id
      )}?${query.toString()}`
    );
    return res.data;
  },

  updateRoom: async (
    id: string | number,
    data: Partial<RoomPayload>
  ): Promise<RoomFavoriteResponse> => {
    const res = await api.patch<RoomFavoriteResponse>(
      API_ENDPOINTS.ROOM.UPDATE(id),
      data
    );
    return res.data;
  },
  createRoom: async (
    data: CreateRoomPayload
  ): Promise<RoomFavoriteResponse> => {
    const res = await api.post<RoomFavoriteResponse>(
      API_ENDPOINTS.ROOM.CREATE,
      data
    );
    return res.data;
  },

  deleteRoom: async (id: string | number): Promise<RoomFavoriteResponse> => {
    const res = await api.delete<RoomFavoriteResponse>(
      API_ENDPOINTS.ROOM.DELETE(id)
    );
    return res.data;
  },
};
