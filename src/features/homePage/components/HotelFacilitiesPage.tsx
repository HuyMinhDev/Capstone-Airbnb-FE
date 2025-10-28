"use client";

import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import stones from "../../../shared/assets/image/stones.jpg";
import glasses from "../../../shared/assets/image/glasses.jpg";
import icn1 from "../../../shared/assets/icon/icn1.png";
import icn2 from "../../../shared/assets/icon/icn2.png";
import icn3 from "../../../shared/assets/icon/icn3.png";
import icn4 from "../../../shared/assets/icon/icn4.png";
import icn5 from "../../../shared/assets/icon/icon-5.png";
import icn6 from "../../../shared/assets/icon/icon-6.png";
import coffee from "../../../shared/assets/image/coffee.png";
import floor from "../../../shared/assets/image/floor.png";

export default function HotelFacilitiesPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <motion.div
        className="container mx-auto px-4 pb-16 md:pb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-16 md:mb-20">
          <p className="text-[#5C5C5C] font-poppins text-[12px] tracking-[4px] mb-5">
            Services & More
          </p>
          <h1 className="text-[#5C5C5C] font-[Poppins] text-[55px] leading-[1.2em] tracking-[1px]">
            Hotel Facilities
          </h1>
        </div>

        {/* Facilities Icons Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
          viewport={{ once: true }}
        >
          {[
            { src: icn1, label: "Smart Key" },
            { src: icn3, label: "Room Service" },
            { src: icn2, label: "Luggage Store" },
            { src: icn4, label: "Daily Sanitation" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <FacilityItem
                icon={
                  <Image
                    src={item.src}
                    alt={item.label}
                    className="w-12 h-12 md:w-16 md:h-16 object-contain"
                  />
                }
                label={item.label}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Info Cards */}
          <motion.div
            className="flex flex-col justify-between items-center gap-5 "
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <InfoCard
              background={coffee}
              title="HOTEL LOCATION"
              content={
                <>
                  <p className="mb-2">Bùi Hữu Nghĩa, TP HCM</p>
                  <p className="mb-2">VN. +84 344 375 201</p>
                  <p>huy@gmail.com</p>
                </>
              }
            />
            <InfoCard
              background={floor}
              title="RECEPTION"
              content={
                <>
                  <p className="mb-2">MON ...... 11:00 - 03:00 pm</p>
                  <p className="mb-2">FRY ...... 11:00 - 03:00 pm</p>
                  <p className="mb-2">SAT ...... 11:00 - 03:00 pm</p>
                  <p>SUN ...... 11:00 - 03:00 pm</p>
                </>
              }
            />
          </motion.div>

          {/* Middle Column - Lunch Card */}
          <motion.div
            className="relative h-[400px] lg:h-[600px] overflow-hidden group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Image
              src={glasses}
              alt="Lunch"
              className="w-full h-full object-cover"
              height={600}
              width={600}
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
              <div className="mb-5">
                <Image
                  src={icn5}
                  alt="icn5"
                  className="w-7 h-7 md:w-8 md:h-8 object-contain"
                />
              </div>
              <h2 className="text-white font-poppins text-[60px] font-normal leading-[1.5em] tracking-[2px] mb-5">
                Lunch
              </h2>
              <button className="cursor-pointer text-white border-2 border-white px-8 py-3 text-xs uppercase hover:bg-white hover:text-gray-900 transition-colors duration-300">
                More Info
              </button>
            </div>
          </motion.div>

          {/* Right Column - Spa Card */}
          <motion.div
            className="relative h-[400px] lg:h-[600px] overflow-hidden group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Image
              src={stones}
              alt="Spa"
              className="w-full h-full object-cover"
              height={600}
              width={600}
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
              <div className="mb-5">
                <Image
                  src={icn6}
                  alt="icn6"
                  className="w-7 h-7 md:w-8 md:h-8 object-contain"
                />
              </div>
              <h2 className="text-white font-poppins text-[60px] font-normal leading-[1.5em] tracking-[2px] mb-5">
                Spa
              </h2>
              <button className="cursor-pointer text-white border-2 border-white px-8 py-3 text-xs uppercase hover:bg-white hover:text-gray-900 transition-colors duration-300">
                Check Here
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function FacilityItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-gray-700 mb-4">{icon}</div>
      <p className="text-[#5C5C5C] font-[Poppins] text-[20px]">{label}</p>
    </div>
  );
}

function InfoCard({
  title,
  content,
  background,
}: {
  title: string;
  content: React.ReactNode;
  background: StaticImageData;
}) {
  return (
    <div
      className="relative text-white p-8 md:p-10 h-[280px] flex flex-col justify-center w-full text-center bg-cover bg-center bg-no-repeat  overflow-hidden"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="absolute inset-0 bg-[#FE6B6E]/80" />
      <div className="relative z-10">
        <h3 className="text-xs tracking-[0.3em] mb-6 uppercase font-light">
          {title}
        </h3>
        <div className="text-sm md:text-base font-light leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
