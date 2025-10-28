"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Input } from "antd";
import ListUser from "@/features/admin/managerUser/components/ListUser";
import { User } from "@/shared/types/user";
import ModalQLNguoiDung from "@/features/admin/managerUser/components/ModalQLNguoiDung";
import ModalEditQLNguoiDung from "@/features/admin/managerUser/components/ModalEditQLNguoiDung";

export default function ManagerUserPage() {
  const [valueInput, setValueInput] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // debounce search
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>): void => {
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

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="md:flex justify-between items-center py-5">
        <h1 className="text-2xl font-bold">Quản lý User</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="button-primary"
        >
          + Thêm người dùng mới
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-5">
        <Input
          className="p-2.5 my-3"
          placeholder="Tìm kiếm theo tên người dùng, email, số điện thoại"
          onChange={handleChangeSearch}
          value={valueInput}
        />
      </div>

      {/* User List */}
      <ListUser valueInput={valueInput} onEdit={handleOpenEdit} />

      {/* Modal Add */}
      <ModalQLNguoiDung
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setValueInput((v) => v);
        }}
      />

      {/* Modal Edit */}
      <ModalEditQLNguoiDung
        open={isEditOpen}
        user={selectedUser}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
