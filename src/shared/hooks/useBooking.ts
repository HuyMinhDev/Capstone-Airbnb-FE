import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  BookingResponse,
  CreateBookingPayload,
  RemoveBookingError,
} from "../types/booking";
import { bookingApi } from "../services/bookingServices";

export function useCreateBooking() {
  return useMutation<
    BookingResponse,
    AxiosError<{ message: string }>,
    CreateBookingPayload
  >({
    mutationFn: (payload) => bookingApi.createBooking(payload),
  });
}

export function useBookingsUser(
  page: number,
  pageSize: number,
  userId: number
) {
  return useQuery({
    queryKey: ["bookings", page, userId],
    queryFn: () =>
      bookingApi.getUserBookings({
        page,
        pageSize,
        user_id: userId,
      }),
    placeholderData: (previousData) => previousData,
    enabled: !!userId,
  });
}

export function useRemoveBooking() {
  return useMutation<BookingResponse, AxiosError<RemoveBookingError>, number>({
    mutationFn: (bookingId) => bookingApi.removeBooking(bookingId),
  });
}
export function useCancelBooking() {
  return useMutation<
    BookingResponse,
    AxiosError<RemoveBookingError>,
    { bookingId: number; reason: string }
  >({
    mutationFn: ({ bookingId, reason }) =>
      bookingApi.cancelBooking(bookingId, reason),
  });
}

export function useConfirmBooking() {
  return useMutation<
    BookingResponse,
    AxiosError<RemoveBookingError>,
    { bookingId: number; reason: string }
  >({
    mutationFn: ({ bookingId }) => bookingApi.confirmBooking(bookingId),
  });
}

export const useAdminBookings = (params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | null;
}) => {
  const { page = 1, pageSize = 10, keyword = "", status = null } = params;

  return useQuery({
    queryKey: ["bookings", page, pageSize, keyword, status],
    queryFn: () =>
      bookingApi.getBookings({
        page,
        pageSize,
        keyword,
        status,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
};
