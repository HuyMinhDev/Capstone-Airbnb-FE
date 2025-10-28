"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, MoreHorizontal } from "lucide-react";

import { imagesApi } from "@/lib/api/services/images";
import { useAuthStore } from "@/store/auth";
import { fileApi } from "@/lib/api/services/fileImage";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function NewImagePage() {
  const { userId } = useAuthStore();
  const { data } = useUserProfile(userId ?? undefined);
  const userProfile = data?.data;
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { push } = useRouter();
  // mở input khi click
  const handleClick = () => {
    inputRef.current?.click();
  };

  // chọn ảnh từ input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // tạo image
  const handleCreateImage = async () => {
    if (!file) {
      alert("Vui lòng chọn ảnh!");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload ảnh
      const uploadRes = await fileApi.upload(file);

      // 2. Tạo image trong DB
      await imagesApi.create({
        image_name: title,
        description,
        path: uploadRes.fileKey,
        user_id: userId,
      });

      toast.success("Tạo ảnh thành công!");
      setFile(null);
      setTitle("");
      setDescription("");
      push("/");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tạo ảnh!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Upload Area */}
        <div className="space-y-4">
          <Card
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="aspect-[3/4] bg-gray-100 border-2 border-dashed border-gray-300 
                       flex flex-col items-center justify-center p-8 
                       hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden"
          >
            {/* input hidden */}
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <Image
                src={URL.createObjectURL(file)}
                alt="preview"
                fill
                className="absolute inset-0 object-cover"
              />
            ) : (
              <>
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-center text-gray-700 font-medium mb-2">
                  Kéo và thả hoặc nhấp vào để tải lên
                </p>
              </>
            )}
          </Card>

          <p className="text-sm text-gray-600 text-center">
            Bạn nên sử dụng tập tin .jpg chất lượng cao có kích thước dưới 2MB
          </p>

          <Button
            variant="secondary"
            className="w-full bg-gray-200 hover:bg-black hover:text-white cursor-pointer"
            onClick={handleCreateImage}
            disabled={loading || !file}
          >
            {loading ? "Đang tạo..." : "Tạo Image"}
          </Button>
        </div>

        {/* Right Side - Pin Details */}
        <div className="space-y-6">
          <div>
            {/* User Info */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="w-20 h-20 mb-4">
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
              <span className="font-medium text-gray-800">
                {userProfile?.name}
              </span>
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Tạo tiêu đề
            </h1>
            <Input
              type="text"
              placeholder="Nhập tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-gray-700 mb-6"
            />

            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Tạo mô tả
            </h1>
            <Textarea
              placeholder="Nhập mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none pr-12 text-gray-700 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
