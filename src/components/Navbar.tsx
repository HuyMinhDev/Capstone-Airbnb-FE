"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import airbnbLogo from "../shared/assets/image/airbnb-1.png";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // dùng để check trang hiện tại
  const { userId, setUserId, setRole } = useAuthStore();
  const { data } = useUserProfile(userId ?? undefined);
  const userProfile = data?.data;
  const { role } = useAuthStore();

  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, [userId]);

  // Danh sách menu
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
      <div className="flex items-center gap-4 max-w-7xl mx-auto justify-between">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer select-none text-2xl self-center px-8 font-bold"
        >
          <Image
            src={airbnbLogo}
            alt="Airbnb logo"
            className="object-contain mr-2"
            width={40}
            height={32}
          />
          <span className="text-3xl text-primary-nav">airbnb</span>
        </div>

        {/* Menu navigation */}
        <ul className="items-stretch hidden space-x-3 lg:flex">
          {menuItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={label} className="flex">
                <Link
                  href={href}
                  className={`flex items-center px-4 font-normal transition cursor-pointer ${
                    isActive
                      ? "font-bold text-primary-nav"
                      : "text-muted-foreground hover:text-[#FE6B6E]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Các nút bên phải */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              93
            </Badge>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <MessageCircle className="h-5 w-5" />
          </Button>

          {/* Avatar + Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-1 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      userProfile?.avatar ? `${userProfile?.avatar}` : undefined
                    }
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                    {userProfile?.name?.trim()?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {!hasToken ? (
                <>
                  <DropdownMenuItem onClick={() => router.push("/login")}>
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/register")}>
                    Register
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(`/profile/${userId}`)}
                    className="cursor-pointer"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/edit")}
                    className="cursor-pointer"
                  >
                    Manage
                  </DropdownMenuItem>
                  {role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboardAdmin")}
                      className="cursor-pointer"
                    >
                      To Page Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("refreshToken");
                      setUserId(null);
                      setRole(null);
                      setHasToken(false);
                      router.replace("/login");
                    }}
                    className="cursor-pointer"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
