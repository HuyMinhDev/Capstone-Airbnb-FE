"use client";

import { useState } from "react";
import { Table, Popconfirm, Popover, Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { useLocations } from "@/shared/hooks/useLocations";
import { useAdminRooms, useDeleteRoom } from "@/shared/hooks/useRoom";
import { Room } from "@/features/room/types/room";
import Image from "next/image";
import {
  Wifi,
  Tv,
  Wind,
  Utensils,
  MonitorCheck,
  Shirt,
  SquareParking,
  Waves,
  Laptop,
} from "lucide-react";

interface ListLocationProps {
  valueInput: string;
  onEdit: (location: Room) => void;
}

export default function ListRoom({ valueInput, onEdit }: ListLocationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { deleteRoom } = useDeleteRoom();
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const { data, isLoading, refetch } = useAdminRooms({
    page: currentPage,
    pageSize,
    keyword: valueInput,
    locationId: selectedLocation ?? null,
  });

  const dataRoom = data?.items;

  const { data: dataLocation, isLoading: isLoadingLocation } = useLocations();
  const locationList = dataLocation?.items ?? [];
  console.log("locationMapping", locationList);

  const handleDeleteUser = async (id: number): Promise<void> => {
    try {
      deleteRoom(id);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Select
          style={{ width: 250 }}
          placeholder="Chọn địa điểm"
          loading={isLoadingLocation}
          value={selectedLocation ?? "all"}
          onChange={(value) => {
            setSelectedLocation(value === "all" ? null : (value as number));
            setCurrentPage(1);
          }}
          options={[
            { label: "Tất cả", value: "all" },
            ...locationList?.map((loc) => ({
              label: loc.location_name,
              value: loc.id,
            })),
          ]}
        />
      </div>
      <Table<Room>
        style={{ tableLayout: "fixed" }}
        loading={isLoading}
        dataSource={dataRoom?.map((u) => ({ ...u, key: u.id })) ?? []}
        scroll={{ x: "max-content" }}
        pagination={{
          total: data?.totalItem ?? 0,
          current: currentPage,
          pageSize,
          showSizeChanger: true,
          onChange: (page, newPageSize) => {
            setCurrentPage(page);
            if (newPageSize) setPageSize(newPageSize);
          },
        }}
        columns={[
          {
            title: "STT",
            key: "index",
            render: (_, __, index) => (
              <span>{(currentPage - 1) * pageSize + index + 1}</span>
            ),
            width: 80,
          },
          {
            title: "Tên",
            dataIndex: "room_name",
            key: "room_name",
            render: (_, record) => (
              <div className="flex items-center gap-2">
                <Avatar className="w-30 h-18 rounded-sm">
                  <AvatarImage
                    src={record?.image ? `${record?.image}` : undefined}
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                    {record?.room_name?.trim()?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{record.room_name}</span>
              </div>
            ),
          },
          {
            title: "Vị trí",
            key: "location_name",
            render: (_, record) => (
              <p className="truncate">
                {record?.Locations?.location_name ?? "—"}
              </p>
            ),
          },
          {
            title: "Tỉnh/Thành phố",
            key: "country",
            render: (_, record) => (
              <p className="truncate">{record?.Locations?.province ?? "—"}</p>
            ),
          },
          {
            title: "Thông tin",
            key: "room_info",
            render: (_, record) => {
              const amenities = [
                {
                  key: "wifi",
                  label: "Wi-Fi",
                  icon: Wifi,
                  active: record?.wifi,
                },
                { key: "tv", label: "TV", icon: Tv, active: record?.tv },
                {
                  key: "air_conditioner",
                  label: "Điều hòa",
                  icon: Wind,
                  active: record?.air_conditioner,
                },
                {
                  key: "kitchen",
                  label: "Bếp",
                  icon: Utensils,
                  active: record?.kitchen,
                },
                {
                  key: "parking",
                  label: "Bãi đỗ xe",
                  icon: SquareParking,
                  active: record?.parking,
                },
                {
                  key: "pool",
                  label: "Hồ bơi",
                  icon: Waves,
                  active: record?.pool,
                },
                {
                  key: "washing_machine",
                  label: "Máy giặt",
                  icon: MonitorCheck,
                  active: record?.washing_machine,
                },
                {
                  key: "iron",
                  label: "Bàn ủi",
                  icon: Shirt,
                  active: record?.iron,
                },
                {
                  key: "desk",
                  label: "Bàn làm việc",
                  icon: Laptop,
                  active: record?.desk,
                },
              ];

              const content = (
                <div className="max-w-96">
                  {/* Hình ảnh phòng */}
                  <div className="relative w-full h-40">
                    <Image
                      src={record?.image}
                      alt={record?.room_name}
                      fill
                      className="object-cover rounded-md mb-2"
                    />
                  </div>

                  {/* Tên và mô tả */}
                  <p className="font-semibold text-base mb-1">
                    {record?.room_name}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Vị trí:</span>{" "}
                    {record?.Locations?.location_name},{" "}
                    {record?.Locations?.province}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Giá:</span>{" "}
                    {record?.price?.toLocaleString("vi-VN")} ₫ / đêm
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Số khách:</span>{" "}
                    {record?.guest_count}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Phòng ngủ:</span>{" "}
                    {record?.bedroom_count} |{" "}
                    <span className="font-medium">Giường:</span>{" "}
                    {record?.bed_count} |{" "}
                    <span className="font-medium">Phòng tắm:</span>{" "}
                    {record?.bathroom_count}
                  </p>

                  {/* Mô tả */}
                  <p className="text-gray-600 text-sm mt-2 truncate">
                    {record?.description}
                  </p>

                  {/* Tiện nghi */}
                  <div className="mt-3">
                    <p className="font-medium text-gray-800 mb-1">Tiện nghi:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {amenities.map(
                        (item) =>
                          item.active && (
                            <div
                              key={item.key}
                              className="flex items-center gap-2 text-gray-700 text-sm"
                            >
                              <item.icon size={16} className="text-[#FE6B6E]" />
                              <span>{item.label}</span>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <Popover
                  content={content}
                  title={<span className="font-semibold">Chi tiết phòng</span>}
                  trigger="hover"
                >
                  <p className="cursor-pointer underline text-[#FE6B6E] hover:text-[#f85e61]">
                    Xem chi tiết
                  </p>
                </Popover>
              );
            },
          },

          {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
              <div>
                <EditOutlined
                  onClick={() => onEdit(record)}
                  className="text-2xl cursor-pointer mr-2"
                />
                <Popconfirm
                  title="Xoá người dùng"
                  description="Bạn có chắc muốn xoá người dùng này?"
                  onConfirm={() => handleDeleteUser(record.id)}
                  okText="Có"
                  cancelText="Không"
                  okButtonProps={{ danger: true }}
                >
                  <DeleteOutlined className="text-2xl cursor-pointer" />
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
