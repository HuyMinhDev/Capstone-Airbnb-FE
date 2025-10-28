import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roomApi, RoomPayload } from "../services/roomServices";
import { toast } from "sonner";

export const useAdminRooms = (params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  locationId?: number | null;
}) => {
  const { page = 1, pageSize = 10, keyword = "", locationId = null } = params;

  return useQuery({
    queryKey: ["rooms", page, pageSize, keyword, locationId],
    queryFn: () =>
      roomApi.getAdminRooms({
        page,
        pageSize,
        keyword,
        locationId,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RoomPayload> }) =>
      roomApi.updateRoom(id, data),
    onSuccess: () => {
      toast.success("Cập nhật phòng thành công!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () => {
      toast.error("Cập nhật phòng thất bại!");
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  const deleteRoomMutation = useMutation({
    mutationFn: (id: string | number) => roomApi.deleteRoom(id),
    onSuccess: (res) => {
      toast.success(res.message || "Xóa người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () => {
      toast.error("Xóa người dùng thất bại");
    },
  });

  return {
    deleteRoom: deleteRoomMutation.mutate,
    deleteRoomLoading: deleteRoomMutation.isPending,
  };
};
