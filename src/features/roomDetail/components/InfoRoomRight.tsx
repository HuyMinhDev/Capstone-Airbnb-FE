"use client";

import { StarFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import {
  setIsModalCalendarOpen,
  setIsModalPaymentOpen,
  setGuest_quantity,
  setTienTruocThue,
} from "@/store/slices/bookingSlice";

import ModalPayment from "./ModalPayment";
import ModalReBooking from "./ModalReBooking";
import { Room } from "@/features/room/types/room";
import type { RootState } from "@/store/store";
import { useAuthStore } from "@/store/auth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";
import { useComments } from "../hooks/useComments";
import { useEffect } from "react";
import { useCreateBooking } from "@/shared/hooks/useBooking";
import { CreateBookingPayload } from "@/shared/types/booking";

interface InfoRoomLeftProps {
  infoRoom: Room | undefined;
  idRoom: number;
}

export default function InfoRoomRight({
  infoRoom: roomInfo,
  idRoom,
}: InfoRoomLeftProps) {
  const router = useRouter();
  const { userId } = useAuthStore();
  const { data: dataUser } = useUserProfile(userId ?? undefined);
  const user = dataUser?.data;
  const { data: dataComment } = useComments(idRoom);
  const listComment = dataComment?.data;
  const { mutate: createBooking } = useCreateBooking();
  const { guest_quantity, totalDay, check_in, check_out } = useSelector(
    (state: RootState) => state.bookingSlice
  );

  const dispatch = useDispatch();
  const booking = useSelector((state: RootState) => state.bookingSlice);

  const isLogin = () => {
    if (!user) {
      return toast.warning("Vui lòng đăng nhập để đặt phòng.");
    }

    dispatch(setIsModalPaymentOpen(true));
  };

  const bookingAction = () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để đặt phòng.");
      return;
    }
    if (!roomInfo?.id) {
      toast.error("Không tìm thấy thông tin phòng.");
      return;
    }

    const body = {
      user_id: Number(user.id),
      room_id: roomInfo.id,
      check_in: dayjs(check_in).add(1, "day").format("YYYY-MM-DD"),
      check_out: dayjs(check_out).add(1, "day").format("YYYY-MM-DD"),
      guest_quantity,
      total_price: booking?.tienTruocThue,
      status: "PENDING",
    } as CreateBookingPayload;

    createBooking(body, {
      onSuccess: (res) => {
        toast.success(res.message);
        dispatch(setIsModalPaymentOpen(false));
      },
      onError: (err) => {
        // lấy message từ backend
        const msg = err.response?.data?.message || "Đặt phòng thất bại!";
        toast.error(msg);
      },
    });
  };

  const calculateRating = (): number => {
    if (!listComment || listComment.length === 0) return 0;
    const total = listComment.reduce((sum, c) => sum + (c.rating || 0), 0);
    return parseFloat((total / listComment.length).toFixed(2));
  };

  const handleSoKhachChange = (delta: number) => {
    if (!roomInfo) return;
    let totalKhach = guest_quantity + delta;
    if (totalKhach < 1) {
      totalKhach = 1;
      toast.warning("Số lượng khách tối thiểu là 1.");
    }
    if (totalKhach > roomInfo.guest_count) {
      totalKhach = roomInfo.guest_count;
      toast.warning("Số lượng khách vượt quá giới hạn cho phép.");
    }
    dispatch(setGuest_quantity(totalKhach));
  };

  const tienNgay = roomInfo ? roomInfo.price * totalDay : 0;
  const tienTruocThue = tienNgay + 100000;
  useEffect(() => {
    dispatch(setTienTruocThue(tienTruocThue));
  }, [tienTruocThue, dispatch]);

  if (!roomInfo) return null;

  return (
    <div className="basis w-full lg:h-80">
      <div className="p-5 space-y-5 divide-y-2 border border-gray-300 rounded-lg shadow-lg bg-white">
        {/* Giá & đánh giá */}
        <div className="space-y-3">
          <div className="flex justify-between text-dark">
            <div>
              <span className="font-bold">
                {new Intl.NumberFormat("vi-VN").format(roomInfo.price)}₫
              </span>{" "}
              / đêm
            </div>
            <div className="flex gap-2">
              <p className="space-x-2">
                <StarFilled className="text-primary" />
                <span className="font-bold">{calculateRating()}</span>
              </p>
              <a className="underline text-comment" href="#">
                {listComment?.length} đánh giá
              </a>
            </div>
          </div>

          {/* Lịch */}
          <div className="border-2 border-gray-300 rounded-lg">
            <div className="flex items-center justify-between border border-gray-300">
              <div
                className="p-3 cursor-pointer grow border-r-2 border-gray-300 text-dark"
                onClick={() => dispatch(setIsModalCalendarOpen(true))}
              >
                <h1 className="font-bold">Ngày nhận phòng</h1>
                <p>{dayjs(check_in).format("DD/MM/YYYY")}</p>
              </div>
              <div
                className="p-3 cursor-pointer grow text-dark"
                onClick={() => dispatch(setIsModalCalendarOpen(true))}
              >
                <h1 className="font-bold">Ngày trả phòng</h1>
                <p>{dayjs(check_out).format("DD/MM/YYYY")}</p>
              </div>
            </div>

            {/* Khách */}
            <div className="p-3 border-t-2 border-gray-300">
              <h1 className="font-bold text-center text-dark">
                Số lượng khách
              </h1>
              <div className="flex justify-evenly items-center">
                <button
                  className="w-9 h-9 font-bold hover:opacity-80 duration-300 text-white rounded-full bg-primary flex items-center justify-center"
                  onClick={() => handleSoKhachChange(-1)}
                >
                  –
                </button>
                <p className="text-dark">{guest_quantity}</p>
                <button
                  className="w-9 h-9 font-bold hover:opacity-80 duration-300 text-white rounded-full bg-primary flex items-center justify-center"
                  onClick={() => handleSoKhachChange(1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Giá chi tiết */}
          <div className="flex justify-between text-dark">
            <p className="font-bold">
              {new Intl.NumberFormat("vi-VN").format(roomInfo.price)} ×{" "}
              {totalDay} đêm
            </p>
            <p className="font-bold">
              {new Intl.NumberFormat("vi-VN").format(tienNgay)}₫
            </p>
          </div>
          <div className="flex justify-between text-dark border-dark">
            <p className="font-bold">Phí dọn phòng</p>
            <p className="font-bold">100,000₫</p>
          </div>
        </div>

        {/* Tổng & nút đặt */}
        <div className="space-y-5 py-3">
          <div className="flex justify-between text-dark">
            <p className="font-bold">Tổng cộng</p>
            <p className="font-bold">
              {new Intl.NumberFormat("vi-VN").format(tienTruocThue)}₫
            </p>
          </div>
          <div>
            <button
              className="button-primary w-full font-bold"
              style={{ padding: "12px 0px" }}
              onClick={isLogin}
            >
              Đặt phòng ngay
            </button>
          </div>
          <div>
            <p
              className="text-primary underline hover:cursor-pointer"
              onClick={() => router.push("/dashboard/edit")}
            >
              Xem hồ sơ cá nhân
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalPayment bookingAction={bookingAction} />
      <ModalReBooking />
    </div>
  );
}
