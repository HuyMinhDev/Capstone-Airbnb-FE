"use client";

import Carousel from "@/components/layouts/Carousel";
import SelectForm from "@/features/homePage/components/SelectForm";
import HotelFacilitiesPage from "@/features/homePage/components/HotelFacilitiesPage";
import ListRoom from "@/features/homePage/components/ListRoom";
import { HeroSection } from "@/features/homePage/components/HeroSection";
import "@/shared/utils/suppressAntdFormWarning";

export default function PinterestClone() {
  return (
    <div className="min-h-screen bg-background">
      <Carousel />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <SelectForm isRoompage={false} handleSelectRoomByLocation={() => {}} />
        <ListRoom />
      </main>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <HotelFacilitiesPage />
      </div>
    </div>
  );
}
