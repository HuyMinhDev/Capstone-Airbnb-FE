"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/store/auth";
import { Share2, Edit3 } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BookingCartItem from "@/components/BookingUser";
import FavoriteRoom from "@/components/FavoriteRoom";

export default function ProfilePage() {
  const { userId } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"saved" | "created">("saved");
  const router = useRouter();

  const tabs = [
    {
      key: "saved",
      label: "Phòng Yêu Thích",
    },
    {
      key: "created",
      label: "Phòng đã đặt",
    },
  ];
  const { data } = useUserProfile(userId ?? undefined);
  const userProfile = data?.data;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage
              src={userProfile?.avatar ? `${userProfile?.avatar}` : undefined}
              alt="User avatar"
            />
            <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
              {userProfile?.name?.trim()?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-2xl font-semibold mb-1">{userProfile?.name}</h1>
          <p className="text-muted-foreground mb-2">{userProfile?.email}</p>
          <p className="text-sm text-muted-foreground mb-6">
            0 người đang theo dõi
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
            <Button
              onClick={() => router.push(`/profile/${userId}`)}
              variant="secondary"
              size="sm"
              className="rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="border-b border-gray-200 mb-6 relative">
          <div className="flex justify-center space-x-8 relative">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "saved" | "created")}
                  className={`relative py-3 px-[14px] font-medium text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "text-black"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FavoriteRoom />
            </motion.div>
          )}

          {activeTab === "created" && (
            <motion.div
              key="created"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BookingCartItem />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
