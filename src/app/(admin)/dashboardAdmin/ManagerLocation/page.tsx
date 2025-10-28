"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Input } from "antd";
import ListLocation from "@/features/admin/managerLocation/components/ListLocation";
import { Location } from "@/shared/services/locationServices";
import ModalEditQLViTri from "@/features/admin/managerLocation/components/ModalEditQLViTri";
import ModalQLViTri from "@/features/admin/managerLocation/components/ModalQLViTri";

export default function ManagerLocation() {
  const [valueInput, setValueInput] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

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

  const handleOpenEdit = (location: Location) => {
    setSelectedLocation(location);
    setIsEditOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="md:flex justify-between items-center py-5">
        <h1 className="text-2xl font-bold">Quản lý Location</h1>
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
          placeholder="Tìm kiếm theo tên name, province, or country"
          onChange={handleChangeSearch}
          value={valueInput}
        />
      </div>

      {/* Location List */}
      <ListLocation valueInput={valueInput} onEdit={handleOpenEdit} />

      {/* Modal Add */}
      <ModalQLViTri
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setValueInput((v) => v);
        }}
      />

      {/* Modal Edit */}
      <ModalEditQLViTri
        open={isEditOpen}
        location={selectedLocation}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
