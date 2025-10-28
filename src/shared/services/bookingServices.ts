import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { BookingResponse, CreateBookingPayload } from "../types/booking";
import { BookingsResponse } from "../types/bookingForUser";

export const bookingApi = {
  createBooking: async (
    payload: CreateBookingPayload
  ): Promise<BookingResponse> => {
    const response = await api.post<BookingResponse>(
      API_ENDPOINTS.BOOKING.API_BOOKING,
      payload
    );
    return response.data;
  },

  getUserBookings: async ({
    page,
    pageSize,
    user_id,
  }: {
    page: number;
    pageSize: number;
    user_id: number;
  }) => {
    const response = await api.get<BookingsResponse>(
      `${API_ENDPOINTS.BOOKING.API_BOOKING}?page=${page}&pageSize=${pageSize}&user_id=${user_id}`
    );
    return response.data;
  },

  removeBooking: async (bookingId: number) => {
    const response = await api.delete<BookingResponse>(
      API_ENDPOINTS.BOOKING.DELETE_BOOKING(bookingId)
    );
    return response.data;
  },
  cancelBooking: async (bookingId: number, reason: string) => {
    const response = await api.patch<BookingResponse>(
      `${API_ENDPOINTS.BOOKING.API_BOOKING}/cancel/${bookingId}`,
      { reason }
    );
    return response.data;
  },

  confirmBooking: async (bookingId: number) => {
    const response = await api.patch<BookingResponse>(
      `${API_ENDPOINTS.BOOKING.API_BOOKING}/confirm/${bookingId}`
    );
    return response.data;
  },

  // getBookings: async (params: {
  //   page?: number;
  //   pageSize?: number;
  //   keyword?: string;
  // }): Promise<BookingsResponse> => {
  //   const { page = 1, pageSize = 10, keyword } = params;

  //   const query = new URLSearchParams({
  //     page: String(page),
  //     pageSize: String(pageSize),
  //   });

  //   if (keyword) query.append("keyword", keyword);

  //   const res = await api.get<BookingsResponse>(
  //     `${API_ENDPOINTS.LOCATIONS.LIST}?${query.toString()}`
  //   );
  //   return res.data;
  // },
  getBookings: async (params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    status?: "PENDING" | "CONFIRMED" | "CANCELLED" | null;
  }): Promise<BookingsResponse> => {
    const { page = 1, pageSize = 10, keyword, status } = params;

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (keyword) query.append("keyword", keyword);
    if (status) query.append("status", String(status));

    const res = await api.get<BookingsResponse>(
      `${API_ENDPOINTS.BOOKING.LIST}?${query.toString()}`
    );
    return res.data;
  },
};
