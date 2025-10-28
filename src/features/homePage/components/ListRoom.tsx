"use client";

import { motion } from "framer-motion";
import { RoomGrid } from "./RoomGrid";

export default function ListRoom() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Tiêu đề có hiệu ứng fade-in nhẹ */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-[#5C5C5C] font-[Poppins] text-[55px] leading-[1.2em] tracking-[1px]">
            Choose Your Perfect Room
          </h1>
          <p className="text-[#5C5C5C] font-poppins text-[12px] tracking-[4px] mt-2">
            Luxury accommodations with breathtaking ocean views
          </p>
        </motion.div>

        {/* Grid có hiệu ứng xuất hiện lần lượt từng phần tử */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15, // delay giữa các item
              },
            },
          }}
        >
          <RoomGrid />
        </motion.div>
      </div>
    </main>
  );
}
