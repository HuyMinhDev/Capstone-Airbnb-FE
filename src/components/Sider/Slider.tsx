"use client";

import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import {
  AimOutlined,
  CalendarOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartArea } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useUserProfile } from "@/hooks/useUserProfile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import airbnbLogo from "@/shared/assets/image/airbnb-1.png";
import Image from "next/image";

const { Content, Sider } = Layout;

interface SliderProps {
  content: ReactNode;
}

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: ReactNode,
  key: string,
  icon?: ReactNode,
  children?: MenuItem[]
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

export default function Slider({ content }: SliderProps) {
  const { userId, setUserId } = useAuthStore();

  const { data } = useUserProfile(userId ?? undefined);
  const user = data?.data;

  const [collapsed, setCollapsed] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userIconRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  const items: MenuItem[] = [
    getItem(
      <Link href="/dashboardAdmin/ManagerUser">Quản lý người dùng</Link>,
      "/dashboardAdmin/ManagerUser",
      <UserOutlined />
    ),
    getItem(
      <Link href="/dashboardAdmin/ManagerLocation">Quản lý vị trí</Link>,
      "/dashboardAdmin/ManagerLocation",
      <AimOutlined />
    ),
    getItem(
      <Link href="/dashboardAdmin/ManagerRoom">Quản lý phòng</Link>,
      "/dashboardAdmin/ManagerRoom",
      <HomeOutlined />
    ),
    getItem(
      <Link href="/dashboardAdmin/ManagerBooking">Quản lý booking</Link>,
      "/dashboardAdmin/ManagerBooking",
      <CalendarOutlined />
    ),
    getItem(
      <Link href="/dashboardAdmin/ManagerChart">Biểu đồ</Link>,
      "/dashboardAdmin/ManagerChart",
      <ChartArea />
    ),
  ];
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUserId(null);
    toast.success("Đăng xuất thành công!");
    setTimeout(() => {
      setShowDropdown(false);
      window.location.href = "/login";
    }, 1000);
  };

  const bgAdmin = {
    backgroundColor: "rgb(61, 39, 39)",
  };

  if (!user) {
    return <div className="p-4 text-gray-500 text-sm">Bạn chưa đăng nhập.</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} trigger={null} style={bgAdmin}>
        <div className="flex flex-col">
          <div className="flex items-center p-5">
            <Image
              src={airbnbLogo}
              alt="Airbnb logo"
              className="object-contain mr-2 transition-all duration-300"
              width={50}
              height={50}
            />
            {!collapsed && (
              <span className="text-3xl text-primary-nav transition-all duration-300">
                airbnb
              </span>
            )}
          </div>
          <Menu
            selectedKeys={[pathname]}
            mode="inline"
            theme="dark"
            items={items}
            style={bgAdmin}
            className="[&_.ant-menu-item-selected]:!bg-[#FE6B6E] [&_.ant-menu-item-selected]:!text-white"
          />
        </div>
      </Sider>
      {/* <div className="bg-[#3D2727]">
       
      </div> */}

      <Layout>
        {/* Header */}
        <div className="flex items-center justify-between p-2" style={bgAdmin}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-primary"
            style={{
              fontSize: "20px",
              width: 50,
              height: 64,
              backgroundColor: "#3D2727",
            }}
          />
          {/* User Section */}
          <div className="items-center flex-shrink-0 flex px-8 relative">
            <div
              ref={userIconRef}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer bg-gray-800 text-white transition-all duration-300 ${
                showDropdown ? "ring-4 ring-red-400" : "ring-2 ring-gray-300"
              } hover:ring-4 hover:ring-red-400`}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={user?.avatar ? `${user?.avatar}` : undefined}
                  alt="User avatar"
                />
                <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                  {user?.name?.trim()?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="ml-3 text-primary text-lg uppercase">{user.name}</p>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 bg-white shadow-md rounded-lg overflow-hidden divide-y-2 space-y-2"
                style={{
                  zIndex: 1000,
                  width: "250px",
                  top: "calc(100% + 8px)",
                }}
              >
                <ul className="border-b border-gray-400">
                  <li className="px-4 py-2">{user.name}</li>
                  <li className="px-4 text-gray-500">{user.email}</li>
                </ul>
                <ul>
                  <li>
                    <Link
                      href="/dashboard/edit"
                      className="block px-4 py-2 custom-text-gray hover:bg-gray-100 hover:text-black"
                    >
                      To Page User
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="block px-4 py-2 custom-text-gray hover:bg-gray-100 hover:text-black"
                    >
                      To Page Home
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <Content className="bg-white">
          <div>{content}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
