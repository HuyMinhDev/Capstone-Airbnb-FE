export interface BookingData {
  id: number;
  room_id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  guest_quantity: number;
  total_price: string;
  note: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  confirmed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  deleted_by: number;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  Users: {
    id: number;
    name: string;
    email: string;
  };
  Rooms: {
    id: number;
    room_name: string;
    price: number;
  };
}

export interface BookingResponse {
  status: string;
  statusCode: number;
  message: string;
  data: BookingData;
}

export interface CreateBookingPayload {
  room_id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  guest_quantity: number;
  total_price?: number;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED";
  note?: string | null;
  created_at?: string;
}

export interface BookingError {
  message: string;
  error: string;
  statusCode: number;
}

export interface RemoveBookingError {
  statusCode: number;
  message: string;
  error: string;
}
