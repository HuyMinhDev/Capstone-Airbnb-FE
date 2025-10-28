import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { favoriteApi } from "../services/favoriteServices";

interface FavoriteResponse {
  data: {
    is_favorite: boolean;
    message: string;
  };
  message: string;
  status: string;
  statusCode: number;
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { user_id: number; room_id: number }) =>
      favoriteApi.toggleFavorite(payload),

    onSuccess: (data: FavoriteResponse) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });

      toast.success(
        data?.data.is_favorite
          ? "Đã thêm vào yêu thích ❤️"
          : "Đã bỏ yêu thích 💔"
      );
    },

    onError: () => {
      toast.error("Không thể cập nhật yêu thích. Vui lòng thử lại!");
    },
  });
}
export function useFavoriteStatus(user_id?: number, room_id?: number) {
  return useQuery({
    queryKey: ["favoriteStatus", user_id, room_id],
    queryFn: async () => {
      if (!user_id || !room_id) throw new Error("Missing IDs");
      return favoriteApi.getFavoriteStatus(user_id, room_id);
    },
    enabled: !!user_id && !!room_id,
  });
}
