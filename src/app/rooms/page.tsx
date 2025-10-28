"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { RootState } from "@/store/store";
import { Room } from "@/features/room/types/room";
import { useRooms } from "@/features/room/hooks/useRooms";
import SelectForm from "@/features/homePage/components/SelectForm";
import Image from "next/image";
import bannerRoom from "@/shared/assets/image/bannerRoom.jpg";
import { Users, BedDouble, Bath, HomeIcon, Tag } from "lucide-react";
import { GenericPagination } from "@/shared/component/GenericPagination";
const PAGE_SIZE = 12;

export default function RoomsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const booking = useSelector((state: RootState) => state.bookingSlice);

  const { data, isLoading, isError, refetch } = useRooms({
    page: currentPage,
    pageSize: PAGE_SIZE,
    locationId: booking.location_id,
    guestCount: booking.guest_quantity,
  });

  const rooms: Room[] = data?.items ?? [];

  const handleSelectRoomByLocation = () => {
    setCurrentPage(1);
    refetch();
  };

  const handleRoomClick = (id: number) => {
    router.push(`/room-detail/${id}`);
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const renderList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="w-12 h-12 border-2 border-[#FE6B6E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center text-red-500">
          Lỗi khi tải danh sách phòng. Vui lòng thử lại.
        </div>
      );
    }

    if (!rooms.length) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[300px] w-full text-center">
          <p className="text-gray-600 text-lg">Không có phòng nào phù hợp</p>
        </div>
      );
    }

    return (
      <motion.div
        key={rooms.map((r) => r.id).join("-")}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            variants={itemVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onClick={() => handleRoomClick(room.id)}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col duration-300 cursor-pointer hover:shadow-2xl"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={room.image || "/placeholder.svg"}
                alt={room.room_name ?? "imageRoom"}
                fill
                className="object-cover"
              />
              <span className="absolute top-2 left-2 bg-white text-gray-800 text-xs px-2 py-1 rounded-lg shadow-md">
                Yêu thích
              </span>
            </div>
            <div className="py-4 px-2 flex flex-col justify-between flex-grow">
              <h3 className="font-semibold text-lg truncate text-black flex items-center gap-2">
                {room.room_name}
              </h3>

              <p className="text-black text-base font-semibold mt-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {room.price.toLocaleString()} ₫ / đêm
              </p>

              {/* Thông tin chi tiết */}
              <div className="text-gray-500 text-sm mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {room.guest_count} khách
                </span>
                <span className="flex items-center gap-1">
                  <HomeIcon className="w-4 h-4" />
                  {room.bedroom_count} phòng ngủ
                </span>
                <span className="flex items-center gap-1">
                  <BedDouble className="w-4 h-4" />
                  {room.bed_count} giường
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  {room.bathroom_count} phòng tắm
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      {/* Banner */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          backgroundImage: `url(${bannerRoom.src})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "60vh",
        }}
      >
        <div className="flex justify-center z-10">
          <h1 className="text-white text-3xl font-semibold">Danh sách phòng</h1>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-80 bg-gradient-to-b from-black/70 to-gray-800"></div>
      </div>

      {/* Danh sách phòng */}
      <div className="max-w-7xl mx-auto">
        <SelectForm
          isRoompage
          handleSelectRoomByLocation={handleSelectRoomByLocation}
        />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Danh sách phòng</h1>
          {renderList()}

          <div className="mt-8">
            {(data?.totalItem ?? 0) > 0 && (
              <GenericPagination
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
                totalItems={data?.totalItem || 0}
                totalPages={Math.max(1, data?.totalPage || 0)}
                showFirstLast={false}
                showTotal={false}
                showPageInfo={false}
                className="justify-center"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
