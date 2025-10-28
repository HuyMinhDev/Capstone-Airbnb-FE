import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";

export interface Location {
  id: number;
  location_name: string;
  province: string;
  country: string;
  image: string;
}

export interface LocationResponse {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
  items: Location[];
}

export interface LocationDetail {
  status: string;
  statusCode: number;
  message: string;
  data: Location;
}

export interface CreateLocationPayload {
  location_name: string;
  province: string;
  country: string;
  image: string;
}

export interface CreateLocationResponse {
  status: string;
  statusCode: number;
  message: string;
  data: boolean;
}

export const locationApi = {
  getAll: async (page = 1, pageSize = 10): Promise<LocationResponse> => {
    const res = await api.get<LocationResponse>(API_ENDPOINTS.LOCATIONS.LIST, {
      params: { page, pageSize },
    });
    return res.data;
  },
  getLocations: async (params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
  }): Promise<LocationResponse> => {
    const { page = 1, pageSize = 10, keyword } = params;

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (keyword) query.append("keyword", keyword);

    const res = await api.get<LocationResponse>(
      `${API_ENDPOINTS.LOCATIONS.LIST}?${query.toString()}`
    );
    return res.data;
  },
  getDetail: async (id: number): Promise<LocationDetail> => {
    const res = await api.get<LocationDetail>(
      API_ENDPOINTS.LOCATIONS.GET_COMMENTS_FOR_LOCATION(id)
    );
    return res.data;
  },

  createLocation: async (
    data: CreateLocationPayload
  ): Promise<CreateLocationResponse> => {
    const res = await api.post<CreateLocationResponse>(
      API_ENDPOINTS.LOCATIONS.CREATE,
      data
    );
    return res.data;
  },

  updateLocation: async (
    id: string | number,
    data: Partial<CreateLocationPayload>
  ): Promise<CreateLocationResponse> => {
    const res = await api.patch<CreateLocationResponse>(
      API_ENDPOINTS.LOCATIONS.UPDATE(id),
      data
    );
    return res.data;
  },

  deleteLocation: async (
    id: string | number
  ): Promise<CreateLocationResponse> => {
    const res = await api.delete<CreateLocationResponse>(
      API_ENDPOINTS.LOCATIONS.DELETE(id)
    );
    return res.data;
  },
};
