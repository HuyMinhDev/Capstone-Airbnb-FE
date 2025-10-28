export interface Location {
  id: number;
  location_name: string;
  province: string;
  country: string;
  image: string;
}

export interface Room {
  id: number;
  room_name: string;
  guest_count: number;
  bedroom_count: number;
  bed_count: number;
  bathroom_count: number;
  description: string;
  price: number;
  washing_machine: boolean;
  iron: boolean;
  tv: boolean;
  air_conditioner: boolean;
  wifi: boolean;
  kitchen: boolean;
  parking: boolean;
  pool: boolean;
  desk: boolean;
  image: string;
  location_id: number;
  location: Location;
  is_favorite?: boolean;
  Locations?: Location;
}

export interface RoomsResponse {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
  items: Room[];
}

export interface RoomDetailResponse {
  success: boolean;
  message: string;
  data: Room;
}

export interface RoomResponseError {
  message: string;
  error: string;
  statusCode: number;
}
