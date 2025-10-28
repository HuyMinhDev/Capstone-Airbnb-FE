"use client";

import { useState } from "react";
import { Table, Popconfirm, Select, Popover } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import { useUser } from "@/shared/hooks/useUser";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Location } from "@/shared/services/locationServices";
import {
  useAdminBookings,
  useCancelBooking,
  useConfirmBooking,
  useRemoveBooking,
} from "@/shared/hooks/useBooking";
import Image from "next/image";
// import { BookingResponse } from "@/shared/types/booking";
import dayjs from "dayjs";
import { BookingItem } from "@/shared/types/bookingForUser";
import { toast } from "sonner";
import { CancelBookingDialog } from "@/components/CancelBookingDialog";
import { RemoveBookingError } from "@/shared/types/booking";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, Info } from "lucide-react";
// import { useQueryClient } from "@tanstack/react-query";

interface ListLocationProps {
  valueInput: string;
  onEdit: (location: Location) => void;
}

export default function ListBooking({ valueInput }: ListLocationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const removeBookingMutation = useRemoveBooking();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data, isLoading, refetch } = useAdminBookings({
    page: currentPage,
    pageSize,
    keyword: valueInput,
    status: selectedStatus as "PENDING" | "CONFIRMED" | "CANCELLED" | null,
  });
  const dataBooking = data?.data.items;
  console.log("Check dataBooking: ", dataBooking);
  const cancelBookingMutation = useCancelBooking();
  const comfirmBookingMutation = useConfirmBooking();

  const handleDelete = async (bookingId: number) => {
    try {
      await removeBookingMutation.mutateAsync(bookingId);
      toast.success("Xóa booking thành công!");
      refetch();
    } catch (error) {
      const err = error as AxiosError<RemoveBookingError>;
      const message =
        err.response?.data?.message ||
        "Không thể xóa booking, vui lòng thử lại!";
      toast.error(message);
    }
  };

  const renderStatus = (status: string) => {
    const baseClass = "px-3 py-1 rounded-full text-sm font-semibold";
    switch (status) {
      case "PENDING":
        return (
          <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>
            Waiting for confirmation
          </span>
        );
      case "CONFIRMED":
        return (
          <span className={`${baseClass} bg-green-100 text-green-700`}>
            Confirmed
          </span>
        );
      case "CANCELLED":
        return (
          <span className={`${baseClass} bg-red-100 text-red-700`}>
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const handleCancel = async (bookingId: number, reason: string) => {
    try {
      await cancelBookingMutation.mutateAsync({
        bookingId,
        reason,
      });
      toast.success("Hủy booking thành công!");
      refetch();
    } catch (error) {
      const err = error as AxiosError<RemoveBookingError>;
      const message =
        err.response?.data?.message ||
        "Không thể hủy booking, vui lòng thử lại!";
      toast.error(message);
    }
  };

  const handleConfirm = async (bookingId: number) => {
    try {
      await comfirmBookingMutation.mutateAsync({ bookingId, reason: "" });
      toast.success("Confirmed booking thành công!");
      refetch();
    } catch (error) {
      const err = error as AxiosError<RemoveBookingError>;
      const message =
        err.response?.data?.message ||
        "Không thể confirmed booking, vui lòng thử lại!";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Select
          style={{ width: 250 }}
          placeholder="Chọn trạng thái"
          value={selectedStatus ?? "ALL"}
          onChange={(value) => {
            setSelectedStatus(value === "ALL" ? null : value);
            setCurrentPage(1);
          }}
          options={[
            { label: "Tất cả", value: "ALL" },
            { label: "PENDING", value: "PENDING" },
            { label: "CONFIRMED", value: "CONFIRMED" },
            { label: "CANCELLED", value: "CANCELLED" },
          ]}
        />
      </div>
      <Table<BookingItem>
        style={{ tableLayout: "fixed" }}
        loading={isLoading}
        dataSource={dataBooking?.map((u) => ({ ...u, key: u.id })) ?? []}
        scroll={{ x: "max-content" }}
        pagination={{
          total: data?.data.totalItem ?? 0,
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
            title: "Tên Phòng",
            dataIndex: "room_name",
            key: "room_name",
            render: (_, record) => (
              <div className="flex items-center gap-2">
                <Avatar className="w-30 h-18 rounded-sm">
                  <AvatarImage
                    src={
                      record?.Rooms?.image
                        ? `${record?.Rooms?.image}`
                        : undefined
                    }
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                    {record?.Rooms?.room_name
                      ?.trim()
                      ?.charAt(0)
                      .toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{record.Rooms.room_name}</span>
              </div>
            ),
          },
          {
            title: "Tên Users",
            dataIndex: "name",
            key: "name",
            render: (_, record) => (
              <div className="flex items-center gap-2">
                <Avatar className="w-15 h-15">
                  <AvatarImage
                    src={
                      record?.Users?.avatar
                        ? `${record?.Users?.avatar}`
                        : undefined
                    }
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                    {record?.Users?.name?.trim()?.charAt(0).toUpperCase() ||
                      "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{record.Users.name}</span>
              </div>
            ),
          },
          {
            title: "Check In",
            key: "check_in",
            render: (_, record) => (
              <p className="truncate">
                {record?.check_in
                  ? dayjs(record.check_in).format("DD/MM/YYYY")
                  : "—"}
              </p>
            ),
          },
          {
            title: "Check Out",
            key: "check_out",
            render: (_, record) => (
              <p className="truncate">
                {record?.check_out
                  ? dayjs(record.check_out).format("DD/MM/YYYY")
                  : "—"}
              </p>
            ),
          },
          {
            title: "Tổng tiền",
            key: "total_price",
            render: (_, record) => (
              <p className="truncate font-medium text-[#16a34a]">
                {record?.total_price
                  ? Number(record.total_price).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                  : "—"}
              </p>
            ),
          },
          {
            title: "Trạng thái",
            key: "status",
            render: (_, record) => (
              <div className="flex items-center gap-3">
                {renderStatus(record.status)}

                {record.status === "PENDING" && (
                  <div className="flex items-center gap-3">
                    <CancelBookingDialog
                      onConfirm={(reason) =>
                        handleCancel(Number(record.id), reason)
                      }
                      trigger={
                        <Button className="bg-rose-600 text-white px-2 py-2 text-sm font-semibold rounded-lg hover:bg-rose-700">
                          Hủy phòng
                        </Button>
                      }
                    />
                    <Button
                      onClick={() => handleConfirm(Number(record.id))}
                      className="bg-green-600 text-white px-2 py-2 text-sm font-semibold rounded-lg hover:bg-green-700"
                    >
                      Xác nhận
                      <CheckCircleIcon className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                )}
              </div>
            ),
          },
          {
            title: "Thông tin",
            key: "room_info",
            render: (_, record) => {
              const roomContent = (
                <div className="max-w-96">
                  {/* Hình ảnh phòng */}
                  <div className="relative w-full h-40 mb-2">
                    <Image
                      src={record?.Rooms?.image ?? ""}
                      alt={record?.Rooms?.room_name ?? ""}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  {/* Tên và mô tả */}
                  <p className="font-semibold text-base mb-1">
                    {record?.Rooms?.room_name}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Vị trí:</span>{" "}
                    {record?.Rooms?.Locations?.location_name},{" "}
                    {record?.Rooms?.Locations?.province}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Giá:</span>{" "}
                    {record?.Rooms?.price?.toLocaleString("vi-VN")} ₫ / đêm
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Số khách:</span>{" "}
                    {record?.guest_quantity}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Thời gian:</span>{" "}
                    {dayjs(record?.check_in).format("DD/MM/YYYY")} -{" "}
                    {dayjs(record?.check_out).format("DD/MM/YYYY")}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Tổng tiền:</span>{" "}
                    {Number(record?.total_price)?.toLocaleString("vi-VN")} ₫
                  </p>

                  {/* Thông tin người đặt */}
                  <div className="flex items-center gap-3 mt-3">
                    <Image
                      src={record?.Users?.avatar ?? ""}
                      alt={record?.Users?.name ?? ""}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {record?.Users?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record?.Users?.email}
                      </p>
                    </div>
                  </div>
                </div>
              );

              // Nếu đơn bị hủy, hiển thị thêm Popover với lý do hủy
              const cancelInfo = record?.cancelled_at && (
                <Popover
                  content={
                    <div className="max-w-64 text-sm text-gray-700">
                      <p className="font-medium text-red-500 mb-1">
                        Đơn đã bị hủy
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Thời gian hủy:</span>{" "}
                        {dayjs(record?.cancelled_at).format("DD/MM/YYYY HH:mm")}
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Người hủy:</span>{" "}
                        {record?.cancelled_by === "user"
                          ? "Khách hàng"
                          : "Quản lý phòng"}
                      </p>
                      <p>
                        <span className="font-medium">Lý do:</span>{" "}
                        {record?.cancel_reason || "Không có lý do cụ thể"}
                      </p>
                    </div>
                  }
                  title={
                    <span className="font-semibold text-red-500">
                      Chi tiết hủy
                    </span>
                  }
                  trigger="hover"
                >
                  <Info
                    size={18}
                    className="text-red-500 cursor-pointer hover:text-red-600 ml-2"
                  />
                </Popover>
              );

              return (
                <div className="flex items-center gap-2">
                  <Popover
                    content={roomContent}
                    title={
                      <span className="font-semibold">Chi tiết phòng</span>
                    }
                    trigger="hover"
                  >
                    {/* <Info
                      size={18}
                      className="text-[#FE6B6E] cursor-pointer hover:text-[#f85e61]"
                    /> */}
                    <p className="cursor-pointer underline text-[#FE6B6E] hover:text-[#f85e61]">
                      Xem chi tiết
                    </p>
                  </Popover>

                  {/* Hiển thị icon thông tin hủy nếu có */}
                  {cancelInfo}
                </div>
              );
            },
          },

          {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
              <div className="flex items-center justify-start pl-5">
                {/* <EditOutlined
                  onClick={() => onEdit(record)}
                  className="text-2xl cursor-pointer mr-2"
                /> */}
                <Popconfirm
                  title="Xoá người dùng"
                  description="Bạn có chắc muốn xoá người dùng này?"
                  onConfirm={() => handleDelete(record.id)}
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
