import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Location,
  locationApi,
  LocationDetail,
} from "../services/locationServices";
import { toast } from "sonner";

export const useLocations = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["locations", page, pageSize],
    queryFn: () => locationApi.getAll(page, pageSize),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
};

export const useLocationDetail = (id: number | null) => {
  return useQuery<LocationDetail>({
    queryKey: ["locationDetail", id],
    queryFn: async () => {
      if (!id) throw new Error("Invalid location ID");
      return await locationApi.getDetail(id);
    },
    enabled: !!id,
    staleTime: 1000 * 30,
    retry: 1,
  });
};

export const useLocationsByKeyword = (params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}) => {
  const { page = 1, pageSize = 10, keyword = "" } = params;

  return useQuery({
    queryKey: ["locations", page, pageSize, keyword],
    queryFn: () =>
      locationApi.getLocations({
        page,
        pageSize,
        keyword,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Location, "id"> }) =>
      locationApi.updateLocation(id, data),
    onSuccess: () => {
      toast.success("Cập nhật vị trí thành công!");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: () => {
      toast.error("Cập nhật vị trí thất bại!");
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  const deleteLocationMutation = useMutation({
    mutationFn: (id: string | number) => locationApi.deleteLocation(id),
    onSuccess: (res) => {
      toast.success(res.message || "Xóa người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: () => {
      toast.error("Xóa người dùng thất bại");
    },
  });

  return {
    deleteLocation: deleteLocationMutation.mutate,
    deleteLocationLoading: deleteLocationMutation.isPending,
  };
};
