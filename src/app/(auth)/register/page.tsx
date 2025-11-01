"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { DatePicker, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "sonner";
import { userApi } from "@/shared/services/userServices";

const { Option } = Select;

// 🧩 Schema validation theo yêu cầu BE
const schema = z.object({
  name: z.string().min(1, "Tên không được bỏ trống"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
  birth_day: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh phải đúng định dạng YYYY-MM-DD"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(15, "Số điện thoại không hợp lệ"),
  gender: z.enum(["male", "female"], {
    message: "Giới tính không hợp lệ",
  }),
});

type Gender = "male" | "female" | "";

interface FormData {
  name: string;
  email: string;
  password: string;
  birth_day: string; // stored as "YYYY-MM-DD"
  phone: string;
  gender: Gender;
}

export default function RegisterPage() {
  const router = useRouter();

  // 🧠 State cho form (có kiểu rõ ràng, không dùng any)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    birth_day: "",
    phone: "",
    gender: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Thông tin không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      const res = await userApi.createUser({
        ...parsed.data,
        role: "user",
      });
      const message = res.message;

      if (res.statusCode === 200) {
        toast.success(message || "Đăng ký thành công");
        router.replace("/login");
      } else {
        toast.error(message || "Đăng ký thất bại");
        setError(message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Đăng ký thất bại");
      setError("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-2xl font-semibold mb-6">Đăng ký tài khoản</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Nguyễn Minh Huy"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="example@gmail.com"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* Birth Day (Antd DatePicker) */}
        <div className="space-y-2">
          <Label
            htmlFor="birth_day"
            className="text-sm font-medium text-gray-600 uppercase tracking-wide"
          >
            Ngày sinh
          </Label>
          <DatePicker
            id="birth_day"
            format="DD/MM/YYYY"
            // display Dayjs if present, else null
            value={
              formData.birth_day
                ? dayjs(formData.birth_day, "YYYY-MM-DD")
                : null
            }
            onChange={(date: Dayjs | null) =>
              handleInputChange(
                "birth_day",
                date ? date.format("YYYY-MM-DD") : ""
              )
            }
            className="w-full"
            disabledDate={(current: Dayjs) => !!(current && current > dayjs())}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="0123456789"
          />
        </div>

        {/* Gender (Antd Select) */}
        <div className="space-y-2">
          <Label
            htmlFor="gender"
            className="text-sm font-medium text-gray-600 uppercase tracking-wide"
          >
            Giới tính
          </Label>
          <Select
            id="gender"
            value={formData.gender || undefined}
            onChange={(value: Gender) => handleInputChange("gender", value)}
            placeholder="Chọn giới tính"
            className="w-full"
            filterOption={false}
            // style preserved from your prior example
            style={{
              borderBottom: "1px solid #d1d5db",
              borderRadius: 0,
              backgroundColor: "transparent",
            }}
          >
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
          </Select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </form>

      <div className="flex justify-center mt-4">
        <Link href="/login" className="text-blue-600 hover:underline">
          Đã có tài khoản? Đăng nhập
        </Link>
      </div>
    </div>
  );
}
