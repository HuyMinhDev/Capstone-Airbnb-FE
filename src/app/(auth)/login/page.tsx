"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/services/auth";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { TokenPayload, useAuthStore } from "@/store/auth";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("Huy10012003@");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { setUserId, setRole } = useAuthStore.getState();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError("Thông tin không hợp lệ");
      return;
    }

    try {
      setLoading(true);

      const res = await authApi.login({ email, password });
      const { data, message } = res;

      // 🔹 Lưu token vào localStorage
      localStorage.setItem("token", data.accessToken);

      localStorage.setItem("refreshToken", data.refreshToken);

      const decoded = jwtDecode<TokenPayload>(data.accessToken);
      setUserId(decoded.userId);
      setRole(decoded.role);

      toast.success(message);
      router.replace("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error?.response?.data?.message || "Đăng nhập thất bại";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-2xl font-semibold mb-6">Đăng nhập</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      {/* Thanh điều hướng */}
      <p className="mt-4 text-sm text-center text-gray-600">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
