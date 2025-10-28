import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RoomCommentsResponse } from "@/features/roomDetail/types/comment";
import { commentApi } from "@/shared/services/commentServices";

export const useComments = (id: string | number) => {
  return useQuery<RoomCommentsResponse>({
    queryKey: ["comments", id],
    queryFn: () => commentApi.getComment(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentApi.createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.room_id],
      });
    },
  });
};
