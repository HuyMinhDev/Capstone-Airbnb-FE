"use client";
import { useRef, useState, type ChangeEvent } from "react";
import { Input } from "antd";
import ListRoom from "@/features/admin/ManagerRoom/components/ListRoom";
import { Room } from "@/features/room/types/room";
// import ModalQLPhong from "@/features/admin/ManagerBooking/components/ModalQLPhong";
import ModalEditQLPhong from "@/features/admin/ManagerRoom/components/ModalEditQLPhong";
import ModalCreateQLPhong from "@/features/admin/ManagerRoom/components/ModalQLPhong";

export default function ManagerRoom() {
  const [valueInput, setValueInput] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // debounce search
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value
      .replace(/[^\p{L}\p{N}\s@._-]/gu, "")
      .replace(/\s+/g, " ")
      .trimStart();

    if (value === " ") value = "";

    setValueInput(value);
    if (searchRef.current) clearTimeout(searchRef.current);

    searchRef.current = setTimeout(() => {
      setValueInput(value);
    }, 1000);
  };

  const handleOpenEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsEditOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="md:flex justify-between items-center py-5">
        <h1 className="text-2xl font-bold">Quản lý phòng thuê</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="button-primary"
        >
          + Thêm phòng thuê mới
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-5">
        <Input
          className="p-2.5 my-3"
          placeholder="Tìm kiếm theo tên phòng, mô tả hoặc vị trí..."
          onChange={handleChangeSearch}
          value={valueInput}
        />
      </div>

      {/* Room List */}
      <ListRoom valueInput={valueInput} onEdit={handleOpenEdit} />

      {/* Modal Add */}
      {/* {isAddModalOpen && (
        
      )} */}
      <ModalCreateQLPhong
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        // onSuccess={() => {
        //   setValueInput((v) => v);
        // }}
      />

      {/* Modal Edit */}
      <ModalEditQLPhong
        open={isEditOpen}
        room={selectedRoom}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
