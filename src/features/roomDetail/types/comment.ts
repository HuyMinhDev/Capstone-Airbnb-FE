export interface RoomCommentsResponse {
  status: "success" | "error" | string;
  statusCode: number;
  message: string;
  data: RoomComment[];
}

export interface RoomComment {
  id: number;
  comment_date: string;
  content: string;
  rating: number;
  user_comment: string;
  avatar: string;
}
