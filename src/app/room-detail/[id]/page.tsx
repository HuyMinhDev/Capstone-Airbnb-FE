"use client";
import React, { useEffect, useState, type JSX } from "react";
import {
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useParams } from "next/navigation"; // ✅ Next.js hook

import Comment from "@/features/roomDetail/components/Comment";
import ModalCalendar from "@/features/roomDetail/components/ModalCalendar";
import { useRoomDetail } from "@/features/room/hooks/useRooms";
import {
  WifiOutlined,
  CarOutlined,
  DesktopOutlined,
  FireOutlined,
  CloudOutlined,
  AppstoreOutlined,
  HomeOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Room } from "@/features/room/types/room";
import InfoRoomLeft from "@/features/roomDetail/components/InfoRoomLeft";
import InfoRoomRight from "@/features/roomDetail/components/InfoRoomRight";
import plane from "@/shared/assets/image/plane.png";
import racing from "@/shared/assets/image/racing.png";
import {
  useFavoriteStatus,
  useToggleFavorite,
} from "@/shared/hooks/useFavorite";
import { useAuthStore } from "@/store/auth";

export default function RoomDetailPage() {
  const { userId } = useAuthStore();
  const params = useParams();
  const idRoom = params?.id as string;
  const {
    data: infoRoomDetail,
    isLoading: loadingInfoRoom,
    refetch: refetchRoom,
  } = useRoomDetail(idRoom);
  const infoRoom = infoRoomDetail?.data;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleFavoriteMutation = useToggleFavorite();
  const {
    data: favorite,
    refetch,
    isLoading,
  } = useFavoriteStatus(Number(userId), Number(idRoom));

  useEffect(() => {
    refetchRoom();
  }, [refetchRoom]);

  useEffect(() => {
    if (favorite?.data) {
      setIsFavorite(favorite.data.is_favorite);
    }
    setLoading(isLoading);
  }, [favorite, isLoading]);

  if (loadingInfoRoom) {
    return (
      <div className="flex justify-center items-center w-full mt-10">
        <div className="w-12 h-12 border-2 border-[#FE6B6E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderTienIch = () => {
    if (!infoRoom) return null;

    const tienIchContent: React.ReactNode[] = [];

    const tienIchMapping: Partial<
      Record<keyof Room, { label: string; icon: JSX.Element }>
    > = {
      washing_machine: { label: "Máy giặt", icon: <ToolOutlined /> },
      iron: { label: "Bàn là", icon: <FireOutlined /> },
      tv: { label: "Tivi", icon: <DesktopOutlined /> },
      air_conditioner: { label: "Điều hoà", icon: <CloudOutlined /> },
      wifi: { label: "Wi-Fi", icon: <WifiOutlined /> },
      kitchen: { label: "Bếp", icon: <HomeOutlined /> },
      parking: { label: "Đỗ xe", icon: <CarOutlined /> },
      pool: { label: "Hồ bơi", icon: <AppstoreOutlined /> },
      desk: { label: "Bàn làm việc", icon: <DesktopOutlined /> },
    };

    (Object.keys(tienIchMapping) as Array<keyof typeof tienIchMapping>).forEach(
      (key) => {
        if (infoRoom?.[key]) {
          const tienIch = tienIchMapping[key];
          if (tienIch) {
            const { label, icon } = tienIch;
            tienIchContent.push(
              <div key={key} className="flex items-center gap-2 text-gray-700">
                {icon} <span>{label}</span>
              </div>
            );
          }
        }
      }
    );

    if (tienIchContent.length === 0) {
      return <p className="text-gray-500 italic">Không có tiện ích</p>;
    }
    return tienIchContent;
  };

  const handleToggle = async () => {
    toggleFavoriteMutation.mutate(
      { user_id: Number(userId), room_id: Number(idRoom) },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <div className="pt-28 space-y-5 container mx-auto">
      <h1 className="text-2xl font-bold">{infoRoom?.room_name}</h1>
      <div className="flex items-center gap-2">
        <EnvironmentOutlined className="text-gray-500" />
        <span className="text-gray-700 text-sm">
          {infoRoom?.Locations?.country}
        </span>

        {/* Nút yêu thích */}
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`ml-2 p-1.5 rounded-full transition-all duration-300 
          ${
            isFavorite
              ? "bg-red-100 text-red-500"
              : "bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50"
          }
        `}
          aria-label="Toggle favorite"
        >
          {isFavorite ? (
            <div className="flex items-center gap-2 px-1 font-semibold">
              <HeartFilled className="text-lg text-red-500" />
              <span>Đã yêu thích</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-1 font-semibold">
              <HeartOutlined className="text-lg" />
              <span>Yêu thích</span>
            </div>
          )}
        </button>
      </div>

      {/* Ảnh phòng */}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
          <Image
            src={infoRoom?.image || ""}
            alt={infoRoom?.room_name || ""}
            fill
            className="object-cover rounded-lg transition-transform duration-500 ease-in-out hover:scale-105"
          />
        </div>
        <InfoRoomRight infoRoom={infoRoom} idRoom={Number(idRoom)} />
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 lg:flex gap-5">
          <InfoRoomLeft infoRoom={infoRoom} idRoom={Number(idRoom)} />
          <div className="basis-1/3 relative inline-block">
            {/* plane làm nền */}
            <Image src={plane} alt="plane" fill className="block" />

            {/* racing nằm ở góc phải dưới */}
            <Image
              src={racing}
              alt="racing"
              width={150}
              height={100}
              className="absolute bottom-[25px] right-[8px]"
            />
          </div>
        </div>

        <div className="border-b-2 border-gray-300 pb-5">
          <h1 className="text-xl font-bold">Tiện ích</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderTienIch()}
          </div>
        </div>

        <Comment idRoom={Number(idRoom)} />
      </div>

      <ModalCalendar />
    </div>
  );
}
