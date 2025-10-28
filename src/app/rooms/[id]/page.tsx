"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Alert } from "antd";
import Image from "next/image";

import { useRooms } from "@/features/room/hooks/useRooms";
import { useLocationDetail } from "@/shared/hooks/useLocations";
import SelectForm from "@/features/homePage/components/SelectForm";
import { Room } from "@/features/room/types/room";
import { RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ shadcn Skeleton
import { GenericPagination } from "@/shared/component/GenericPagination";

const PAGE_SIZE = 2;

export default function RoomsVitri() {
  const params = useParams();
  const idLocation = params?.id as string;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const booking = useSelector((state: RootState) => state.bookingSlice);

  const { data, isLoading, isError } = useRooms({
    page: currentPage,
    pageSize: PAGE_SIZE,
    locationId: idLocation ? Number(idLocation) : null,
    guestCount: booking.guest_quantity,
  });

  const {
    data: dataLocation,
    isLoading: isLoadingLocation,
    isError: isErrorLocation,
  } = useLocationDetail(idLocation ? Number(idLocation) : null);

  const locationMapping = dataLocation?.data.province;
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    // Khi đổi địa điểm mới, reset về trang đầu
    setCurrentPage(1);
  }, [idLocation]);

  useEffect(() => {
    // Cập nhật danh sách phòng mỗi khi data thay đổi
    if (data?.items) {
      setRooms(data.items);
    }
  }, [data]);

  const handleRoomClick = (id: number) => {
    router.push(`/room-detail/${id}`);
  };

  const renderSkeletonList = () => {
    return Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="md:flex grid grid-cols-1 border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white"
      >
        <Skeleton className="md:w-48 w-full h-48" />
        <div className="flex-1 p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-6 w-1/3 mt-3" />
        </div>
      </div>
    ));
  };

  const renderList = () => {
    // Hiển thị Skeleton khi đang tải
    if (isLoading) {
      return (
        <div className="flex flex-col gap-4 min-h-[300px]">
          {renderSkeletonList()}
        </div>
      );
    }

    // Báo lỗi khi xảy ra lỗi API
    if (isError) {
      return (
        <div className="flex justify-center items-center min-h-[300px]">
          <Alert
            message="Lỗi tải dữ liệu phòng"
            description="Không thể tải danh sách phòng. Vui lòng thử lại sau."
            type="error"
            showIcon
          />
        </div>
      );
    }

    // Lọc phòng theo số lượng khách
    const filteredRooms = rooms.filter(
      (room) => room.guest_count >= booking.guest_quantity
    );

    // Nếu không có phòng phù hợp
    if (filteredRooms.length === 0) {
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

    // Render danh sách phòng
    return filteredRooms.map((room) => (
      <div
        data-aos="zoom-in"
        key={room.id}
        onClick={() => handleRoomClick(room.id)}
        className="md:flex grid grid-cols-1 border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white duration-300 cursor-pointer hover:shadow-lg card-boder"
      >
        <Image
          src={room.image}
          alt={room.room_name}
          className="md:w-48 w-full h-48 object-cover"
          height={192}
          width={192}
        />

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black">
              {room.room_name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {room.guest_count} khách • {room.bedroom_count} phòng ngủ •{" "}
              {room.bed_count} giường • {room.bathroom_count} phòng tắm
            </p>

            <p className="text-gray-700 mt-2 text-sm line-clamp-2">
              {room.description}
            </p>
          </div>

          <div className="flex flex-col items-start justify-between mt-2">
            <p className="text-lg font-bold text-[#E53935]">
              {room.price.toLocaleString("vi-VN")} ₫ / đêm
            </p>

            <p className="text-xs font-medium text-gray-500 text-right">
              {[
                room.wifi && "Wi-Fi",
                room.washing_machine && "Máy giặt",
                room.pool && "Hồ bơi",
                room.iron && "Bàn ủi",
                room.air_conditioner && "Điều hòa",
                room.kitchen && "Nhà bếp",
                room.tv && "TV",
                room.parking && "Chỗ đỗ xe",
                room.desk && "Bàn làm việc",
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      {/* Banner địa điểm */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=1950&q=80)",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "50vh",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full opacity-80"
          style={{
            backgroundImage: "linear-gradient(195deg,#4c4c4c,#191919)",
          }}
        ></div>

        <h1 className="absolute text-white text-3xl font-bold z-10">
          {isLoadingLocation
            ? "Đang tải địa điểm..."
            : isErrorLocation
            ? "Không thể tải địa điểm"
            : locationMapping || "Địa điểm không xác định"}
        </h1>
      </div>

      {/* Bộ lọc tìm kiếm */}
      <SelectForm isRoompage={false} handleSelectRoomByLocation={() => {}} />

      {/* Danh sách phòng + Bản đồ */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div className="space-y-4">
          {renderList()}
          <div className="mt-8">
            {(data?.totalItem ?? 0) > 0 && (
              <GenericPagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
                totalItems={data?.totalItem ?? 0}
                totalPages={Math.max(1, data?.totalPage ?? 0)}
                showFirstLast={false}
                showTotal={false}
                showPageInfo={false}
                className="justify-center"
              />
            )}
          </div>
        </div>

        <div className="min-h-lvh">
          <iframe
            data-aos="zoom-in"
            title="Google Maps"
            className="w-full h-full rounded-lg shadow-lg"
            src={`https://www.google.com/maps?q=${
              idLocation ? locationMapping : "Vietnam"
            }&output=embed`}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
