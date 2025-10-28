import { CommentResponse } from "@/shared/types/commen";
import { api } from "../client";
import { API_ENDPOINTS } from "../config";

export const commentApi = {
  // Get paginated comments for image
  getComments: async (
    imageId: number | string,
    page: number,
    pageSize: number
  ) => {
    const res = await api.get<CommentResponse>(
      `${API_ENDPOINTS.COMMENT.GET_COMMENTS_FOR_ROOM(imageId)}`,
      { params: { page, pageSize } }
    );
    return res.data;
  },

  createComment: async (payload: {
    user_id: number | string;
    image_id: number;
    content: string;
  }): Promise<{ message: string; stusCode: number }> => {
    const res = await api.post<{ message: string; stusCode: number }>(
      `${API_ENDPOINTS.COMMENT.CREATE_COMMENT}`,
      payload
    );
    return res.data;
  },
};
