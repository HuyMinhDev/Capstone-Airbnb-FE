"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CancelBookingDialogProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm: (reason: string) => void | Promise<void>;
}

export function CancelBookingDialog({
  trigger,
  title = "Xác nhận hủy đặt phòng",
  description = "Vui lòng nhập lý do hủy đặt phòng của bạn trước khi xác nhận.",
  onConfirm,
}: CancelBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleConfirm = async () => {
    if (!reason.trim()) return; // Không cho xác nhận nếu chưa nhập lý do
    await onConfirm(reason);
    setOpen(false);
    setReason("");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-3">
          <Textarea
            placeholder="Nhập lý do hủy (ví dụ: Tôi có việc đột xuất, không thể đến được)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction asChild disabled={!reason.trim()}>
            <Button
              onClick={handleConfirm}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              Xác nhận hủy
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
