export interface LocationItem {
  id: number;
  hinhAnh: string;
  tinhThanh: string;
}

export interface SelectFormProps {
  isRoompage: boolean;
  handleSelectRoomByLocation: (id: number | null) => void;
}
