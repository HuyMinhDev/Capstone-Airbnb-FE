export interface UserComment {
  user_id: number;
  full_name: string;
  avatar: string;
}

export interface Comment {
  comment_id: number;
  user_id: number;
  image_id: number;
  content: string;
  comment_date: string;
  users: UserComment;
}
export interface CommentResponse {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
  items: Comment[];
}
