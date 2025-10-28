import { RoomCommentsResponse } from "@/features/roomDetail/types/comment";
import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";

export type CreateCommentPayload = {
  user_id: number;
  room_id: number;
  content: string;
  comment_date: string;
  rating: number;
};

export const commentApi = {
  getComment: async (id: string | number): Promise<RoomCommentsResponse> => {
    const res = await api.get<RoomCommentsResponse>(
      API_ENDPOINTS.COMMENT.GET_COMMENTS_FOR_ROOM(id)
    );
    return res.data;
  },
  createComment: async (payload: CreateCommentPayload) =>
    api.post(API_ENDPOINTS.COMMENT.CREATE_COMMENT, payload, {}),
};
