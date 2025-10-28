"use client";

import Slider from "@/components/Sider/Slider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Slider content={children} />;
}
