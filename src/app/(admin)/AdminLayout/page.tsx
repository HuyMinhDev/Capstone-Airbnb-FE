"use client";
import type { ReactNode } from "react";
import { Modal } from "antd";
import { useAuthStore } from "@/store/auth";
import Slider from "../../../components/Sider/Slider";

interface AdminLayoutProps {
  content: ReactNode;
}

export default function AdminLayout({ content }: AdminLayoutProps) {
  const { role } = useAuthStore();

  const renderLayout = () => {
    if (role !== "admin") {
      return (
        <Modal open={true} maskClosable={false} footer={null} closable={false}>
          <div className="space-y-5">
            <p className="text-center text-2xl">Bạn không phải admin</p>
            <div className="flex justify-center">
              <button
                className="button-primary"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Trở về trang chủ
              </button>
            </div>
          </div>
        </Modal>
      );
    } else {
      return <Slider content={content} />;
    }
  };

  return <div>{renderLayout()}</div>;
}
