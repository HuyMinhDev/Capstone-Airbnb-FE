// Root API response
export interface BookingsResponse {
  status: string;
  statusCode: number;
  message: string;
  data: BookingData;
}

export interface BookingData {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
  items: BookingItem[];
}

export interface BookingItem {
  id: number;
  room_id: number;
  cancelled_by?: string;
  user_id: number;
  check_in: string;
  check_out: string;
  guest_quantity: number;
  total_price: string;
  note: string | null;
  status: BookingStatus;
  confirmed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  Users: User;
  Rooms: Room;
  created_at: string;
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | string;

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface Room {
  id: number;
  room_name: string;
  price: number;
  image?: string | null;
  Locations?: Location | null;
}

export interface Location {
  id: number;
  location_name: string;
  province?: string | null;
  country?: string | null;
}
