import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { UsersResponse } from "../types/user";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  birth_day: string;
  gender: string;
  role?: string;
  avatar?: string;
}

export interface UserResponse {
  status: string;
  statusCode: number;
  message: string;
  //   data: any;
}

export const userApi = {
  getUsers: async (params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
  }): Promise<UsersResponse> => {
    const { page = 1, pageSize = 10, keyword } = params;

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (keyword) query.append("keyword", keyword);

    const res = await api.get<UsersResponse>(
      `${API_ENDPOINTS.USER.LIST}?${query.toString()}`
    );
    return res.data;
  },

  createUser: async (data: CreateUserPayload): Promise<UserResponse> => {
    const res = await api.post<UserResponse>(API_ENDPOINTS.USER.CREATE, data);
    return res.data;
  },

  deleteUser: async (id: string | number): Promise<UserResponse> => {
    const res = await api.delete<UserResponse>(API_ENDPOINTS.USER.DELETE(id));
    return res.data;
  },
  updateUser: async (
    id: string | number,
    data: Partial<CreateUserPayload>
  ): Promise<UserResponse> => {
    const res = await api.patch<UserResponse>(
      API_ENDPOINTS.USER.UPDATE(id),
      data
    );
    return res.data;
  },
};
