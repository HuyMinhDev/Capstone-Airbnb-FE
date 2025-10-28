"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import AvatarUpload from "@/shared/component/AvatarUpload";
import ImageLoader from "@/shared/component/ImageLoader";
import { toast } from "sonner";
import { fileApi } from "@/lib/api/services/fileImage";
import { usersApi } from "@/lib/api/services/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Select } from "antd";
export default function ProfilePage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const userIdParam = params?.id;
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
  const [file, setFile] = useState<File | null>(null);
  const { data } = useUserProfile(userId);
  const userProfile = data?.data;
  const { Option } = Select;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birth_day: null as dayjs.Dayjs | null,
    gender: "",
    avatar: "",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        birth_day: userProfile.birth_day ? dayjs(userProfile.birth_day) : null,
        gender: userProfile.gender || "",
        avatar: userProfile.avatar || "",
      });
    }
  }, [userProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const updateProfileMutation = useMutation({
    mutationFn: (payload: {
      name: string;
      phone?: string;
      birth_day?: string;
      gender?: string;
      avatar?: string;
    }) => usersApi.updateProfile(userId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Cập nhật profile thành công!");
    },
    onError: () => {
      toast.error("Cập nhật thất bại!");
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({
      name: formData.name,
      phone: formData.phone,
      birth_day: formData.birth_day
        ? formData.birth_day.format("YYYY-MM-DD")
        : "",
      gender: formData.gender,
      avatar: formData.avatar,
    });
  };

  const handleUpdateAvatar = async (fileKey: string) => {
    if (!formData) return;
    try {
      if (formData.avatar) {
        const fileKeyOld = formData.avatar.split("/").pop();
        console.log("fileKeyOld", fileKeyOld);
        await fileApi.remove(fileKeyOld || "");
      }
      await updateProfileMutation.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        birth_day: formData.birth_day
          ? formData.birth_day.format("YYYY-MM-DD")
          : "",
        gender: formData.gender,
        avatar: fileKey,
      });
    } catch (err) {
      console.error("Unable to update avatar:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-6xl font-bold text-black mb-16 tracking-tight">
          Profile
        </h1>

        <div className="flex gap-16 items-start">
          {/* Left side - Form fields */}
          <div className="flex-1 space-y-8">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-600 uppercase tracking-wide"
              >
                E-Mail
              </Label>
              <Input
                disabled
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-500 focus:ring-0"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-600 uppercase tracking-wide"
              >
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 py-2"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-600 uppercase tracking-wide"
              >
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-500 focus:ring-0"
              />
            </div>

            {/* Birth Day */}
            <div className="space-y-2">
              <Label
                htmlFor="birth_day"
                className="text-sm font-medium text-gray-600 uppercase tracking-wide"
              >
                Birth Day
              </Label>
              <DatePicker
                id="birth_day"
                format="DD/MM/YYYY"
                value={formData.birth_day}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, birth_day: date }))
                }
                className="w-full"
                disabledDate={(current) => current && current > dayjs()}
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label
                htmlFor="gender"
                className="text-sm font-medium text-gray-600 uppercase tracking-wide"
              >
                Gender
              </Label>
              <Select
                id="gender"
                value={formData.gender || undefined}
                onChange={(value) => handleInputChange("gender", value)}
                placeholder="Select gender"
                className="w-full"
                variant="borderless"
                style={{
                  borderBottom: "1px solid #d1d5db", // gray-300
                  borderRadius: 0,
                  backgroundColor: "transparent",
                }}
                // dropdownStyle={{ borderRadius: 8 }}
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                {/* <Option value="other">Other</Option> */}
              </Select>
            </div>

            {/* Save Button */}
            <div className="space-y-2">
              <Button
                onClick={handleSave}
                className="bg-gray-400 hover:bg-black text-white px-8 py-2 rounded-sm font-medium tracking-wide cursor-pointer"
              >
                SAVE
              </Button>
            </div>
          </div>

          {/* Right side - Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div>
              <Avatar className="w-32 h-32">
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
              <AvatarUpload onFileSelect={handleFileSelect} />
            </div>
          </div>
        </div>
      </div>

      {/* Image Loader Modal */}
      {file && (
        <ImageLoader
          file={file}
          size={400}
          onDone={(newImage) => {
            handleUpdateAvatar(newImage);
            setFile(null);
          }}
          onCancel={() => setFile(null)}
          uploadImage={true}
        />
      )}
    </div>
  );
}
