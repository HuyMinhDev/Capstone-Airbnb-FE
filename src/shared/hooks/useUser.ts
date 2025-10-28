"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUserPayload, userApi } from "../services/userServices";
import { toast } from "sonner";
import { User } from "../types/user";

export const useUsers = (params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}) => {
  const { page = 1, pageSize = 10, keyword = "" } = params;

  return useQuery({
    queryKey: ["users", page, pageSize, keyword],
    queryFn: () =>
      userApi.getUsers({
        page,
        pageSize,
        keyword,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
};
export const useUser = () => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserPayload) => userApi.createUser(data),
    onSuccess: (res) => {
      toast.success(res.message || "Tạo người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Tạo người dùng thất bại!");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string | number) => userApi.deleteUser(id),
    onSuccess: (res) => {
      toast.success(res.message || "Xóa người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Xóa người dùng thất bại");
    },
  });

  return {
    createUser: createUserMutation.mutate,
    createUserAsync: createUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutate,
    createUserLoading: createUserMutation.isPending,
    deleteUserLoading: deleteUserMutation.isPending,
  };
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: User }) =>
      userApi.updateUser(id, data),
    onSuccess: () => {
      toast.success("Cập nhật người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Cập nhật người dùng thất bại!");
    },
  });
};
