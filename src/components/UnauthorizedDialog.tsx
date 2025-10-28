"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (
      !token &&
      pathname !== "/" &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/register") &&
      !pathname.startsWith("/rooms") &&
      !pathname.startsWith("/contact") &&
      !pathname.startsWith("/blog")
    ) {
      setAllowed(false);
      setOpen(true);
    } else {
      setAllowed(true);
    }
  }, [pathname]);

  return (
    <>
      {allowed ? (
        children
      ) : (
        // 🟢 Placeholder để giữ chiều cao tối thiểu khi không render children
        <div className="min-h-[400px]" />
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chưa đăng nhập</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn cần đăng nhập để truy cập trang này. Bạn có muốn chuyển sang
              trang đăng nhập không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen(false);
                router.replace("/");
              }}
              className="cursor-pointer"
            >
              Quay về trang chủ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpen(false);
                router.replace("/login");
              }}
              className="cursor-pointer"
            >
              Đi đến đăng nhập
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
