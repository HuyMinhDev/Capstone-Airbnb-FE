// Thông tin user
export interface User {
  user_id: number;
  full_name: string;
  email: string;
  avatar: string;
}

// Thông tin comment
export interface Comment {
  comment_id: number;
  user_id: number;
  image_id: number;
  comment_date: string; // ISO date string
  content: string;
  users: User;
}

// Thông tin từng ảnh
export interface ImageItem {
  image_id: number;
  image_name: string;
  path: string;
  description: string;
  user_id: number;
  deleted_by?: number;
  is_deleted?: boolean;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
  users: User;
  comments?: Comment[]; // ⬅ thêm mảng comments
}

// Kiểu cho response phân trang
export interface ImageResponse {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
  items: ImageItem[];
}
export interface ImageListQuery {
  page: number;
  pageSize: number;
  keyword?: {
    keyword?: string;
  };
}
