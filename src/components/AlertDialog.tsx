import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function DemoAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Xóa dữ liệu</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Hủy</AlertDialogCancel>
        <AlertDialogAction>Xóa</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
