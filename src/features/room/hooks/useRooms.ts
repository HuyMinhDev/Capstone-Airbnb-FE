"use client";

import { useQuery } from "@tanstack/react-query";
import { roomApi, RoomFavoriteResponse } from "@/shared/services/roomServices";
import { RoomDetailResponse } from "../types/room";

interface UseRoomsParams {
  page: number;
  pageSize?: number;
  locationId?: number | null;
  guestCount?: number;
}

interface UseRoomFavoritesParams {
  id: string | number;
  page?: number;
  pageSize?: number;
}

export function useRooms({
  page,
  pageSize = 12,
  locationId,
  guestCount,
}: UseRoomsParams) {
  const query = useQuery({
    queryKey: ["rooms", page, locationId, guestCount],
    queryFn: () =>
      roomApi.getRooms({
        page,
        pageSize,
        locationId: locationId ?? null,
        guestCount,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });

  return query;
}

export const useRoomDetail = (id?: string | number) =>
  useQuery<RoomDetailResponse>({
    queryKey: ["room", id],
    queryFn: () => roomApi.getRoomDetail(id as string | number),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export function useRoomFavorites({
  id,
  page = 1,
  pageSize = 12,
}: UseRoomFavoritesParams) {
  return useQuery<RoomFavoriteResponse>({
    queryKey: ["favorites", id, page],
    queryFn: () =>
      roomApi.getRoomFavorites({
        id,
        page,
        pageSize,
      }),
    enabled: !!id,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}
