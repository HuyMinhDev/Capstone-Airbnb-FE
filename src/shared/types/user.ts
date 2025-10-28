export interface UserProfile {
  user_id: number;
  email: string;
  full_name: string;
  age: number | null;
  avatar?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  gender: "male" | "female" | "other" | string;
  birth_day: string;
  avatar: string;
  created_at: string;
  phone?: string;
}

export interface UsersResponse {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
  items: User[];
}
