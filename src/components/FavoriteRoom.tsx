"use client";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { Alert } from "antd";
import { useRoomFavorites } from "@/features/room/hooks/useRooms";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { GenericPagination } from "@/shared/component/GenericPagination";

export default function FavoriteRoom() {
  const router = useRouter();

  const { userId } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const booking = useSelector((state: RootState) => state.bookingSlice);

  useEffect(() => {
    setMounted(true); // chỉ render sau khi client mount
  }, []);

  const { data, isLoading, isError } = useRoomFavorites({
    id: userId as number,
    page: Number(page),
    pageSize: pageSize,
  });
  const roomsFavorites = data?.data.items;
  console.log("Check roomsFavorites", roomsFavorites);

  if (!mounted) return null;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;

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
    const filteredRooms = roomsFavorites?.filter(
      (room) => room.Rooms.guest_count >= booking.guest_quantity
    );

    console.log("Check data filteredRooms: ", filteredRooms);

    // Nếu không có phòng phù hợp
    if (filteredRooms?.length === 0) {
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
    return filteredRooms?.map((room) => (
      <div
        data-aos="zoom-in"
        key={room.id}
        onClick={() => handleRoomClick(room.room_id)}
        className="md:flex grid grid-cols-1 mt-5 border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white duration-300 cursor-pointer hover:shadow-lg card-boder"
      >
        <Image
          src={room.Rooms.image}
          alt={room.Rooms.room_name}
          className="md:w-48 w-full h-48 object-cover"
          height={192}
          width={192}
        />

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black">
              {room.Rooms.room_name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {room.Rooms.guest_count} khách • {room.Rooms.bedroom_count} phòng
              ngủ • {room.Rooms.bed_count} giường • {room.Rooms.bathroom_count}{" "}
              phòng tắm
            </p>

            <p className="text-gray-700 mt-2 text-sm line-clamp-2">
              {room.Rooms.description}
            </p>
          </div>

          <div className="flex flex-col items-start justify-between mt-2">
            <p className="text-lg font-bold text-[#E53935]">
              {room.Rooms.price.toLocaleString("vi-VN")} ₫ / đêm
            </p>

            <p className="text-xs font-medium text-gray-500 text-right">
              {[
                room.Rooms.wifi && "Wi-Fi",
                room.Rooms.washing_machine && "Máy giặt",
                room.Rooms.pool && "Hồ bơi",
                room.Rooms.iron && "Bàn ủi",
                room.Rooms.air_conditioner && "Điều hòa",
                room.Rooms.kitchen && "Nhà bếp",
                room.Rooms.tv && "TV",
                room.Rooms.parking && "Chỗ đỗ xe",
                room.Rooms.desk && "Bàn làm việc",
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
    <div className="w-full">
      {/* {savedImages?.length ?? 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
          {savedImages?.map((item) => (
            <div
              key={item.image_id}
              className="break-inside-avoid mb-4 group cursor-pointer"
            >
              <Link href={`/images/${item.image_id}`} prefetch={false}>
                <div className="relative rounded-2xl overflow-hidden bg-muted hover:shadow-lg transition-shadow duration-200">
                  <Image
                    src={`${NEXT_PUBLIC_API_IMAGE_URL}/${item.path}`}
                    alt={item.image_name}
                    width={500}
                    height={500}
                    className="object-cover w-full h-auto group-hover:brightness-75 transition-all duration-200"
                  />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                    <div className="text-white">
                      {item.image_name && (
                        <p className="text-xs opacity-90 truncate max-w-[120px]">
                          {item.image_name}
                        </p>
                      )}

                      {item.users && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="w-8 h-8 border-4 border-white shadow-none">
                            <AvatarImage
                              src={
                                item.users.avatar
                                  ? `${NEXT_PUBLIC_API_IMAGE_URL}/${item.users.avatar}`
                                  : undefined
                              }
                              alt="User avatar"
                            />
                            <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                              {item.users.full_name
                                ?.trim()
                                ?.charAt(0)
                                .toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs truncate max-w-[100px]">
                            {item.users.full_name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          Bạn chưa lưu hình nào
        </div>
      )} */}
      {renderList()}
      <div className="mt-8">
        {(data?.data.totalItem ?? 0) > 0 && (
          <GenericPagination
            currentPage={page}
            pageSize={pageSize}
            onPageChange={setPage}
            totalItems={data?.data.totalItem ?? 0}
            totalPages={Math.max(1, data?.data.totalPage ?? 0)}
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
