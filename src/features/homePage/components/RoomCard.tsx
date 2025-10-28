"use client";

import Image, { StaticImageData } from "next/image";
import { useState } from "react";

interface RoomCardProps {
  name: string;
  price: number;
  image: string | StaticImageData;
}

export function RoomCard({ name, price, image }: RoomCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Price badge */}
        <div className="absolute right-4 top-4 rounded bg-[#FE6B6E] opacity-80 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-sm font-semibold text-white">{price} $</span>
        </div>

        {/* Room name */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-balance text-center text-2xl font-semibold text-white font-[Poppins]">
            {name}
          </h3>
        </div>
      </div>
    </div>
  );
}
