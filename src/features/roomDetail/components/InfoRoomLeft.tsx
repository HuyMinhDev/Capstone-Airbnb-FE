"use client"; // Nếu dùng App Router và component cần state/hook

import { useState, useMemo } from "react";
import Image from "next/image";
import winner from "@/shared/assets/image/winner.png";
import profile from "@/shared/assets/image/Minh_Huy.jpg";
import { useComments } from "../hooks/useComments";
import { Room } from "@/features/room/types/room";
import { Bath, BedDouble, HomeIcon, Users } from "lucide-react";

interface InfoRoomLeftProps {
  infoRoom: Room | undefined;
  idRoom: number;
}

export default function InfoRoomLeft({
  infoRoom: roomInfo,
  idRoom,
}: InfoRoomLeftProps) {
  const features = [
    {
      icon: "fa-wifi",
      title: "Wi-Fi miễn phí",
      desc: "Kết nối internet tốc độ cao",
    },
    { icon: "fa-car", title: "Bãi đỗ xe", desc: "Đỗ xe miễn phí cho khách" },
    {
      icon: "fa-snowflake",
      title: "Điều hoà",
      desc: "Phòng được trang bị máy lạnh hiện đại",
    },
  ];

  const { data: dataComment } = useComments(idRoom);
  const listComment = dataComment?.data;

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);

  // Trung bình đánh giá
  const averageRating = useMemo(() => {
    if (!listComment || listComment.length === 0) return 0;
    const total = listComment.reduce((sum, c) => sum + (c.rating || 0), 0);
    return parseFloat((total / listComment.length).toFixed(2));
  }, [listComment]);

  const renderRatingAward = () => {
    if (averageRating >= 4)
      return <Award type="Huy chương Bạch Kim" color="text-cyan-400" />;
    if (averageRating >= 3)
      return <Award type="Huy chương Vàng" color="text-yellow-300" />;
    if (averageRating > 0)
      return <Award type="Huy chương Bạc" color="text-gray-400" />;
    return null;
  };

  const renderFavorite = () => {
    if (averageRating >= 4) {
      return (
        <div className="container border-2 border-gray-300 py-5 px-7 rounded-lg">
          <div className="flex items-center justify-center">
            <Image src={winner} alt="Winner" width={80} height={80} />
          </div>
          <div className="text-center">
            <p>Phòng được yêu thích bởi khách hàng!</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const descriptionToShow = useMemo(() => {
    if (!roomInfo?.description) return "";
    const full = roomInfo.description;
    if (full.length <= 100) return full;
    return isExpanded ? full : full.slice(0, 100) + "...";
  }, [roomInfo?.description, isExpanded]);

  if (!roomInfo) return null;

  return (
    <div className="basis-2/3 divide-y-2 space-y-5">
      {/* Thông tin chung */}
      <div className="space-y-5 py-5 border-b-2 border-gray-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              Thông tin chi tiết{" "}
              <span className="underline uppercase">MINHHUY</span>
            </h1>
            <div className="text-gray-500 text-sm mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {roomInfo.guest_count} khách
              </span>
              <span className="flex items-center gap-1">
                <HomeIcon className="w-4 h-4" />
                {roomInfo.bedroom_count} phòng ngủ
              </span>
              <span className="flex items-center gap-1">
                <BedDouble className="w-4 h-4" />
                {roomInfo.bed_count} giường
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {roomInfo.bathroom_count} phòng tắm
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Image
              src={profile}
              alt="avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
            {renderRatingAward()}
          </div>
        </div>
        {renderFavorite()}
      </div>

      {/* Tiện ích */}
      {Array.isArray(features) && features.length > 0 && (
        <div className="py-5 space-y-3 border-b-2 border-gray-300">
          {features.map((item, idx) => (
            <div className="flex gap-2 text-[#FE6B6E]" key={idx}>
              <div>
                <i className={`fa ${item.icon}`}></i>
              </div>
              <div>
                <h1 className="font-bold">{item.title}</h1>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mô tả */}
      {roomInfo?.description && (
        <div className="py-5 border-b-2 border-gray-300">
          <p>{descriptionToShow}</p>
          {roomInfo.description.length > 100 && (
            <button onClick={toggleReadMore} className="font-bold">
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Component hiển thị huy chương
const Award = ({ type, color }: { type: string; color: string }) => (
  <div className={color}>
    <span>{type} </span>
    <i className="fa fa-award"></i>
  </div>
);
