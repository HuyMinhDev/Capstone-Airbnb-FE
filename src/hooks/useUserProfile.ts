import { useQuery } from "@tanstack/react-query";
import { getUserProfile, UserDetailResponse } from "@/lib/api/services/users";

export const useUserProfile = (id?: number | string) => {
  return useQuery<UserDetailResponse>({
    queryKey: ["userProfile", String(id)], // ép thành string cho chắc
    queryFn: () => getUserProfile(String(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
