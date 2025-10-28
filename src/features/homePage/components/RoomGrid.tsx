"use client";

import { motion, Variants } from "framer-motion";
import { RoomCard } from "./RoomCard";
import room01 from "@/shared/assets/image/room01.jpg";
import room02 from "@/shared/assets/image/room02.jpg";
import room03 from "@/shared/assets/image/room03.jpg";
import room04 from "@/shared/assets/image/room04.jpg";
import room05 from "@/shared/assets/image/room05.jpg";
import room06 from "@/shared/assets/image/room06.jpg";

const rooms = [
  { id: 1, name: "Small Room", price: 56, image: room01 },
  { id: 2, name: "Room with View", price: 76, image: room02 },
  { id: 3, name: "Apartment", price: 54, image: room03 },
  { id: 4, name: "Luxury Room", price: 67, image: room04 },
  { id: 5, name: "Family Room", price: 30, image: room05 },
  { id: 6, name: "Double Room", price: 25, image: room06 },
];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function RoomGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <motion.div
          key={room.id}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // 👈 chỉ animate khi scroll tới 20% vùng hiển thị
        >
          <RoomCard {...room} />
        </motion.div>
      ))}
    </div>
  );
}
