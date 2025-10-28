"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";
import { Info, X } from "lucide-react";
import room01 from "@/shared/assets/image/room01.jpg";
import {
  useBookingsUser,
  useCancelBooking,
  useRemoveBooking,
} from "@/shared/hooks/useBooking";
import { BookingItem } from "@/shared/types/bookingForUser";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";

import { GenericPagination } from "@/shared/component/GenericPagination";
import { toast } from "sonner";
import { RemoveBookingError } from "@/shared/types/booking";
import { AxiosError } from "axios";
import { ConfirmDialog } from "@/shared/component/ConfirmDialog";
import { CancelBookingDialog } from "./CancelBookingDialog";
import { Alert } from "antd";
import { Popover } from "antd";

export default function BookingCartItem() {
  const { userId } = useAuthStore();
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const {
    data,
    isLoading: isLoadingBookings,
    isError,
    refetch,
  } = useBookingsUser(page, pageSize, Number(userId));

  const bookingUser = data?.data.items || [];
  const removeBookingMutation = useRemoveBooking();
  const cancelBookingMutation = useCancelBooking();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (isLoadingBookings) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;
  if (!bookingUser?.length) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Alert
          message="Không có phòng phù hợp"
          description="Hiện chưa có phòng nào ở địa điểm này."
          type="info"
          showIcon
        />
      </div>
    );
  }

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

  return (
    <div className="w-full">
      <div className="border-b-2 border-gray-100">
        {/* Header Row */}
        <div className="grid grid-cols-[1fr_120px_120px_120px] gap-4 px-6 py-4 text-sm">
          <div className="font-serif text-[#1a1a1a] text-center">Product</div>
          <div className="font-serif text-[#1a1a1a] text-center">Price</div>
          <div className="font-serif text-[#1a1a1a] text-center underline decoration-1 underline-offset-4">
            Cleaning fee
          </div>
          <div className="font-serif text-[#1a1a1a] text-center underline decoration-1 underline-offset-4">
            Subtotal
          </div>
        </div>

        {bookingUser.map((item: BookingItem) => {
          const days = dayjs(item.check_out).diff(dayjs(item.check_in), "day");
          return (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_120px_120px_120px] gap-4 px-6 py-6 items-start border-t-2 border-gray-200"
            >
              {/* Product Column */}
              <div className="flex gap-4">
                <div className="flex flex-row justify-center items-center gap-4">
                  <ConfirmDialog
                    onConfirm={() => handleDelete(Number(item.id))}
                    trigger={
                      <button
                        className="flex-shrink-0 w-6 h-full flex items-center justify-center hover:bg-[#FE6B6E] text-gray-600 hover:text-white bg-gray-100 rounded transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-10 h-10 font-normal" />
                      </button>
                    }
                    title="Xác nhận xóa đặt phòng"
                    description="Bạn có chắc chắn muốn xóa đặt phòng này? Hành động này không thể hoàn tác."
                  />

                  <div className="flex-shrink-0 w-[250px] h-[180px] relative overflow-hidden">
                    <Image
                      src={item.Rooms.image || room01}
                      alt={item.Rooms.room_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <h3 className="font-serif text-xl text-[#1a1a1a]">
                    {item.Rooms.room_name}
                  </h3>
                  <p className="text-sm text-[#1a1a1a]">
                    <span className="font-medium">Reservation:</span>{" "}
                    {dayjs(item.check_in).format("DD/MM/YYYY")} -{" "}
                    {dayjs(item.check_out).format("DD/MM/YYYY")} ({days} nights)
                  </p>
                  <p className="text-sm text-[#1a1a1a]">
                    <span className="font-medium">Guests:</span>{" "}
                    {item.guest_quantity}
                  </p>

                  <p className="text-sm text-[#1a1a1a]">
                    <span className="font-medium">Extra Services:</span> Clean
                    the room
                  </p>
                  {item.status === "CONFIRMED" && (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium">Status:</p>
                      {renderStatus(item.status)}
                    </div>
                  )}

                  {item.status === "CANCELLED" && (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium">Status:</p>
                      <div className="flex items-center justify-center gap-1">
                        {renderStatus(item.status)}
                        <Popover
                          content={
                            <div className="max-w-64 text-sm text-gray-700">
                              <p className="font-medium text-red-500 mb-1">
                                Đơn đã bị hủy
                              </p>
                              <p className="mb-1">
                                <span className="font-medium">
                                  Thời gian hủy:
                                </span>{" "}
                                {dayjs(item?.cancelled_at).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </p>
                              <p className="mb-1">
                                <span className="font-medium">Người hủy:</span>{" "}
                                {item?.cancelled_by === "user"
                                  ? "Khách hàng"
                                  : "Quản lý phòng"}
                              </p>
                              <p>
                                <span className="font-medium">Lý do:</span>{" "}
                                {item?.cancel_reason || "Không có lý do cụ thể"}
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
                            className="text-red-600 cursor-pointer hover:text-red-600 ml-2"
                          />
                        </Popover>
                      </div>
                    </div>
                  )}

                  <div>
                    {item.status === "PENDING" && (
                      <CancelBookingDialog
                        onConfirm={(reason) =>
                          handleCancel(Number(item.id), reason)
                        }
                        trigger={
                          <Button className="bg-rose-600 text-white px-2 py-2 text-sm font-semibold rounded-lg hover:bg-rose-700">
                            Hủy phòng
                          </Button>
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-center text-[#1a1a1a] pt-2">
                {new Intl.NumberFormat("vi-VN").format(
                  Number(item.Rooms.price)
                )}
                ₫
              </div>

              {/* Cleaning fee */}
              <div className="text-center text-[#1a1a1a] pt-2">100,000₫</div>

              {/* Subtotal */}
              <div className="text-center text-[#1a1a1a] pt-2">
                {new Intl.NumberFormat("vi-VN").format(
                  Number(item.total_price)
                )}
                ₫
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        {bookingUser.length > 0 && (
          <GenericPagination
            currentPage={page}
            pageSize={pageSize}
            onPageChange={setPage}
            totalItems={data?.data.totalItem || 0}
            totalPages={Math.max(1, data?.data.totalPage || 0)}
            showFirstLast={false}
            showTotal={false}
            showPageInfo={false}
            className="justify-center"
          />
        )}
      </div>
    </div>
  );
}
